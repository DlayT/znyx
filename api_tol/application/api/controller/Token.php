<?php
/**
 * 网站接口相关-----鉴权接口
 *
 * @copyright 2017-2018 The Wufang Edu
 * @author    Cityfox <29151335@qq.com> 
 * @version   1.0.1
 *
 */
namespace app\api\controller;

use think\Db;
use think\Validate;
/**
 * Class Token
 * @package app\api\controller
 *
 */
class Token extends Api
{
	
    /**
     * 登录记录列表
     * @param  需要传入$accesstoken进行验证；
	 *     
	 * @param  string $yhm 用户账户
	 * @param  string $yhlb 用户类别
	 * @param  string $name 用户姓名
	 * @param  string $updatetimes 登录开始时间（可选）
	 * @param  string $updatetimee 登录结束时间（可选）
	 * @param  int $getsql 是否显示调试SQL，1为调试   
     * @param  int    $page       页码
     * @param  int    $pageSize   每页记录数
     * @return json
     *
     */
    public function TokenList()
    {
    	//条件参数
    	$yhm = input('yhm');       //用户账户
    	$yhlb = input('yhlb');     //用户类别
    	$name = input('name');     //用户姓名
		$issort = input('issort');   //是否按sort排序，1为真，不传默认按ID排序（可选）
    	$updatetimes = input('updatetimes');     //登录开始时间（可选）
    	$updatetimee = input('updatetimee');     //登录结束时间（可选）
		$getsql = input('getsql');     //是否显示调试SQL，1为调试   
		
    	//参数异常验证///////////////////////
		$validateparameter = //原始数据 
		[
		    //'articleid'  => $articleid,
		];	    	
		$validaterule = //验证规则
		[
		    //'articleid'  => 'require',
		];
		$validatemsg =  //返回信息
		[
			//'articleid.require' => '文章ID不能为空',
		    //'code.number' => '文章类别应为整型',
		];
	
		$validate = new Validate($validaterule,$validatemsg);
		$validateresult   = $validate->check($validateparameter);
		if(!$validateresult){
			$backmsg = $validate->getError();
			return json_msg(0,$backmsg);
		}   
    	//参数异常验证///////////////////////
    				    	
		//组合Sql查询条件///////////////////////
		$modelCount = Db::table('tsh_token');//总记录
		$modelList = Db::table('tsh_token');//列表
			
		if($yhm)
		{
			$modelCount->where('yhm','like','%'.$yhm.'%');
			$modelList->where('yhm','like','%'.$yhm.'%');	
		}	

		if($yhlb==99)
		{
			$modelCount->where('yhlb','in','2,3');
			$modelList->where('yhlb','in','2,3');
		} 
		elseif($yhlb=='')
		{
			$modelCount->where('yhlb','in','2,3');
			$modelList->where('yhlb','in','2,3');		
		}
		else
		{
			$modelCount->where('yhlb',$yhlb);
			$modelList->where('yhlb',$yhlb);				
		}
			
		if($name)
		{
			$modelCount->where('name','like','%'.$name.'%');
			$modelList->where('name','like','%'.$name.'%');	
		} 
				
		if($updatetimes)
		{
			$modelCount->where('updatetime','>=',$updatetimes);
			$modelList->where('updatetime','>=',$updatetimes);
		} 

		if($updatetimee)
		{
			$modelCount->where('updatetime','<=',$updatetimee);
			$modelList->where('updatetime','<=',$updatetimee);
		} 

		//排序规则
		if($issort==1)
		{
		$modelList->order('updatetime desc,id desc'); 	
		}
		else
		{
		$modelList->order('id desc,updatetime desc');	
		}								
		//组合Sql查询条件///////////////////////	

    	//获取调试Sql//////////////////
		if($getsql==1)
		{
			$msg = $modelCount->fetchSql(true)->count();
			return json_msg(0,"总数SQL",$msg); 
		}	
		//获取调试Sql//////////////////
								
		//记录总数		
    	$recordCount = $modelCount->count();
    	//记录为空
    	if (!$recordCount) {
    		return json_msg(0, '列表为空!');
    	}
		

    	//获取分页参数	
    	$page 		= intval(input('page'));     //页码
    	$pageSize   = intval(input('pageSize')); //每页记录数    
    	
		//分页处理
		$compute = page_compute($recordCount, $page, $pageSize);
		//返回处理后的对应数组page，pageSize，pageCount，recordCount
		
		//返回查询结果
		$modelList->limit($compute["pageSize"])->page($compute["page"]);
		
    	//获取调试Sql
		if($getsql==2)
		{
			$msg = $modelList->fetchSql(true)->select();
			return json_msg(0,"列表SQL",$msg); 
		}
		//获取调试Sql			
				
    	$list = $modelList->select(); //分页记录集

    	$result = array();
    	if ($list) {
    		foreach($list as $key=>$value) {
    			$result[$key]['id'] = $value['id']; //
    			$result[$key]['accesstoken']  = $value['accesstoken']; //
    			$result[$key]['yonghuid']  = $value['yonghuid']; //
    			$result[$key]['yhm']  = $value['yhm']; //
				$result[$key]['yhlb']  = $value['yhlb']; //
				$result[$key]['yhtx']  = $value['yhtx']; //
    			$result[$key]['name']  = $value['name']; //
    			$result[$key]['creattime']  = $value['creattime']; //
    			$result[$key]['updatetime']  = $value['updatetime']; //
    		}
    	}

    	$data = array(
    		'page'        => $compute["page"],        //页码
    		'pageSize'    => $compute["pageSize"],    //每页记录数
    		'pageCount'   => $compute["pageCount"],   //页码总数
    		'recordCount' => $compute["recordCount"], //记录总数
    		'list'        => $result,      //记录集
    	);
		
		//返回最终数据		
    	return json_msg(1, '取值成功!', $data);
    }


   /**
     * 登录记录新增

	 * @param  int $getsql 是否显示调试SQL，1为调试  
     * @param  无需传入$accesstoken进行验证；
     * @param  记录用户操作日志；

     * @param  int $accesstoken 教育+登录后验证串码
     * @param  string $yonghuid 教育+用户表对应ID	
     * @param  string $yhm 教育+用户名
     * @param  string $yhlb 教育+用户类别
     * @param  string $name 教育+用户姓名
 
     * @return json
     *
     */
    public function TokenAdd()
    {
    	//条件参数
		$getsql = input('getsql');     //是否显示调试SQL，1为调试   

		//新增参数
		$accesstoken = input('accesstoken');	//教育+登录后验证串码	
    	$yonghuid = input('yonghuid');			//教育+用户表对应ID	
    	$yhm = input('yhm');					//教育+用户名
    	$yhlb = input('yhlb');					//教育+用户类别
		$name = input('name');					//教育+用户姓名
		$yhtx = input('yhtx');					//教育+用户头像
    			
    	//参数异常验证///////////////////////
		$validateparameter = //原始数据 
		[
		    'accesstoken'  => $accesstoken,
		    'yonghuid'  => $yonghuid,
		    'yhm'  => $yhm,
		    'yhlb'  => $yhlb,
		    'name'  => $name,
		];	    	
		$validaterule = //验证规则
		[
		    'accesstoken'  => 'require',
		    'yonghuid'  => 'require|number',
		    'yhm'  => 'require',
		    'yhlb'  => 'require|number',
		    'name'  => 'require',
		];
		$validatemsg =  //返回信息
		[
			'accesstoken.require' => '验证串码不能为空',		
			'yonghuid.require' => '用户ID不能为空',
		    'yonghuid.number' => '用户ID应为整型', 
		    'yhm.require' => '用户名不能为空', 
			'yhlb.require' => '用户类别不能为空',
		    'yhlb.number' => '用户类别应为整型', 
		    'name.require' => '用户姓名不能为空',		      
		];

		$validate = new Validate($validaterule,$validatemsg);
		$validateresult   = $validate->check($validateparameter);
		if(!$validateresult){
			$backmsg = $validate->getError();
			return json_msg(0,$backmsg);
		}   
    	//参数异常验证///////////////////////	
		
		//组合Sql查询条件///////////////////////
		$modelCount = Db::table('tsh_token');//总记录
		$modelInsert = Db::table('tsh_token');//详情
		$modelUpdate = Db::table('tsh_token');//详情

		if($yonghuid)
		{
			$modelCount->where('yonghuid','=',$yonghuid);
			$modelUpdate->where('yonghuid','=',$yonghuid);
		}	

		if($yhm)
		{
			$modelCount->where('yhm','=',$yhm);
			$modelUpdate->where('yhm','=',$yhm);
		}	
					
   		//获取调试Sql//////////////////
		if($getsql==1)
		{
			$msg = $modelCount->fetchSql(true)->count();
			return json_msg(0,"总数SQL",$msg); 
		}	
		//获取调试Sql//////////////////
								
		//记录总数		
    	$recordCount = $modelCount->count();
		
		
    	//记录为空
    	if (!$recordCount) {
    		
			//组合Sql新增字段///////////////////////		
	    	$map = array(
	    		'accesstoken' => $accesstoken,
	    		'yonghuid' => $yonghuid,
	    		'yhm' => $yhm,
	    		'yhlb' => $yhlb,
				'name' => $name,
				'yhtx' => $yhtx,
	    		'creattime' => date('Y-m-d H:i:s'),
	    		'updatetime' => date('Y-m-d H:i:s'),
	    	);	
			//组合Sql新增字段///////////////////////	
	
	    	//获取调试Sql//////////////////
			if($getsql==1)
			{
				$msg = $modelInsert->fetchSql(true)->insertGetId($map);
				return json_msg(0,"新增SQL",$msg); 
			}	
			//获取调试Sql//////////////////		
					
			//新增 	    	
	    	$insert = $modelInsert->insertGetId($map); //
			
	    	$data = array(
	    		'recordId' => $insert, //
	    	);
					
	    	if ($insert)
			{
		    	//操作日志记录（用户名，姓名，操作类型：1增2删3改4查，操作状态：0失败1成功，操作信息，操作SQL）
				op_Log($yhm,$name,1,1,'登录记录','Insert-Into-TshToken-Values-Yhm-'.$yhm.'-Name='.$name);							
	    		return json_msg(1, '新增成功!', $data);
	    	}
			else
			{
		    	//操作日志记录（用户名，姓名，操作类型：1增2删3改4查，操作状态：0失败1成功，操作信息，操作SQL）
				op_Log($yhm,$name,1,0,'登录记录','Insert-Into-TshToken-Values-Yhm-'.$yhm.'-Name='.$name);				
	    		return json_msg(0, '新增失败!', $data);			
			}	
			
    	}
		else{

			//组合Sql更新字段///////////////////////		
	    	$map = array(
	    		'accesstoken' => $accesstoken,
	    		'yhlb' => $yhlb,
				'name' => $name,
				'yhtx' => $yhtx,
	    		'updatetime' => date('Y-m-d H:i:s'),
	    	);	
			//组合Sql更新字段///////////////////////	
	
	    	//获取调试Sql//////////////////
			if($getsql==1)
			{
				$msg = $modelUpdate->fetchSql(true)->update($map);
				return json_msg(0,"更新SQL",$msg); 
			}	
			//获取调试Sql//////////////////			
					
			//更新 	    	
	    	$update = $modelUpdate->update($map); //
	
	    	$data = array(
	    		'recordCount' => $recordCount, //记录总数
	    	);
			
	    	if ($update)
			{
		    	//操作日志记录（用户名，姓名，操作类型：1增2删3改4查，操作状态：0失败1成功，操作信息，操作SQL）
				op_Log($yhm,$name,3,1,'登录记录','Update-From-TshToken-Set-Updatetime=Now-Where-Yhm='.$yhm);				
	    		return json_msg(1, '更新成功!', $data);
	    	}
			else
			{
		    	//操作日志记录（用户名，姓名，操作类型：1增2删3改4查，操作状态：0失败1成功，操作信息，操作SQL）
				op_Log($yhm,$name,3,0,'登录记录','Update-From-TshToken-Set-Updatetime=Now-Where-Yhm='.$yhm);					
	    		return json_msg(0, '更新失败!', $data);			
			}	


		}	

	}

	
    /**
     * 登录Token核查-----------暂未使用
     
	 * @param  string $accesstoken 用户Token
	 * @param  string $effective 有效期，单位分钟
	 * @param  int $getsql 是否显示调试SQL，1为调试   
     * @param  int    $page       页码
     * @param  int    $pageSize   每页记录数
     * @return json
     *
     */
    public function TokenCheck()
    {
    	//条件参数
    	$accesstoken = input('accesstoken');       //用户Token
    	$effective = input('effective');     //有效期，单位分钟
		$getsql = input('getsql');     //是否显示调试SQL，1为调试   
		
    	//参数异常验证///////////////////////
		$validateparameter = //原始数据 
		[
		    'accesstoken'  => $accesstoken,
		];	    	
		$validaterule = //验证规则
		[
		    'accesstoken'  => 'require|alphaNum',
		];
		$validatemsg =  //返回信息
		[
			'accesstoken.require' => 'Token不能为空',
		    'accesstoken.alphaNum' => 'Token包含非法字符',
		];
	
		$validate = new Validate($validaterule,$validatemsg);
		$validateresult   = $validate->check($validateparameter);
		if(!$validateresult){
			$backmsg = $validate->getError();
			return json_msg(0,$backmsg);
		}   
    	//参数异常验证///////////////////////
    				    	
		//组合Sql查询条件///////////////////////
		$modelCount = Db::table('tsh_token');//总记录
		$modelList = Db::table('tsh_token');//列表
			
		if($accesstoken)
		{
			$modelCount->where('accesstoken',$accesstoken);
			$modelList->where('accesstoken',$accesstoken);				
		}	

		if($effective)
		{
			$effective_str = '-'.$effective.' min';
			$modelCount->whereTime('updatetime',$effective_str);
			$modelList->whereTime('updatetime',$effective_str);				
		}									
		//组合Sql查询条件///////////////////////	

    	//获取调试Sql//////////////////
		if($getsql==1)
		{
			$msg = $modelCount->fetchSql(true)->count();
			return json_msg(0,"总数SQL",$msg); 
		}	
		//获取调试Sql//////////////////		
				
		//总数
    	$recordCount = $modelCount->count(); //记录总数
    	//记录为空
    	if (!$recordCount) {
    		return json_msg(0, '列表为空!');
    	}

    	//获取调试Sql//////////////////
		if($getsql==2)
		{
			$msg = $modelList->fetchSql(true)->select();
			return json_msg(0,"详情SQL",$msg); 
		}	
		//获取调试Sql//////////////////
				
		//明细    	    	
    	$list = $modelList->select();

    	$result = array();
    	if ($list) {
    		foreach($list as $key=>$value) {
    			$result[$key]['id'] = $value['id']; //
    			$result[$key]['accesstoken']  = $value['accesstoken']; //
    			$result[$key]['yonghuid']  = $value['yonghuid']; //
    			$result[$key]['yhm']  = $value['yhm']; //
    			$result[$key]['yhlb']  = $value['yhlb']; //
    			$result[$key]['name']  = $value['name']; //
    			$result[$key]['creattime']  = $value['creattime']; //
    			$result[$key]['updatetime']  = $value['updatetime']; //
    		}
    	}

    	$data = array(
    		'recordCount' => $recordCount, //记录总数
    		'list'        => $result,      //记录集
    	);

		
		//返回最终数据		
    	return json_msg(1, '取值成功!', $data);
    }

}
