<?php
/**
 * 网站接口相关-----访问接口
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
 * Class Access
 * @package app\api\controller
 *
 */
class Access extends Api
{
	
    /**
     * 访问信息列表
     
	 * @param  需要传入$accesstoken进行验证；
	 * 
	 * @param  string $info 访问者信息
	 * @param  int $getsql 是否显示调试SQL，1为总记录SQL调试；2为列表SQL调试   
     * @param  int    $page       页码
     * @param  int    $pageSize   每页记录数
     * @return json
     *
     */
    public function AccessList()
    {
    	//条件参数
    	//$articleid = input('articleid');       //文章ID
    	$info = input('info');     //访问者信息（模糊）

    	$creattimes = input('creattimes');     //开始时间（可选）
    	$creattimee = input('creattimee');     //开始时间（可选）
		$getsql = input('getsql');     //是否显示调试SQL
		
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
		$modelCount = Db::table('tsh_access');//总记录
		$modelList = Db::table('tsh_access')->alias('a')->join('tsh_article b','a.articleid = b.id');//列表
			
		if($info)
		{
			$modelCount->where('info','like','%'.$info.'%');
			$modelList->where('a.info','like','%'.$info.'%');	
		} 	
		
		if($creattimes)
		{
			$modelCount->where('creattime','>=',$creattimes);
			$modelList->where('a.creattime','>=',$creattimes);
		} 

		if($creattimee)
		{
			$modelCount->where('creattime','<=',$creattimee);
			$modelList->where('a.creattime','<=',$creattimee);
		} 
		
		//字段重写
		$modelList->field('a.id as id,articleid,info,title,code,a.creattime as creattime');
		//排序规则
		$modelList->order('a.id desc');	
								
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
    			$result[$key]['articleid']  = $value['articleid']; //
    			$result[$key]['info']  = $value['info']; //
      			$result[$key]['code']  = $value['code']; //
      			$result[$key]['title']  = $value['title']; // 
      			$result[$key]['creattime']  = $value['creattime']; //    			
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
     * 访问详情新增
	 * @param  无需传入$accesstoken进行验证；
    * 
	 * @param  int $getsql 是否显示调试SQL，，1为新增SQL调试；

     * @param  int $articleid 文章ID
     * @param  string $info 访问者信息
 
     * @return json
     *
     */
    public function AccessAdd()
    {
    	//条件参数
		$getsql = input('getsql');     //是否显示调试SQL

		//新增参数
		$articleid = input('articleid');       //文章ID	
    	$info = input('info'); 		
    			
    	//参数异常验证///////////////////////
		$validateparameter = //原始数据 
		[
		    'articleid'  => $articleid,
		];	    	
		$validaterule = //验证规则
		[
		    'articleid'  => 'require|number',
		];
		$validatemsg =  //返回信息
		[
			'articleid.require' => '文章ID不能为空',
		    'articleid.number' => '文章ID应为整型',    
		];

		$validate = new Validate($validaterule,$validatemsg);
		$validateresult   = $validate->check($validateparameter);
		if(!$validateresult){
			$backmsg = $validate->getError();
			return json_msg(0,$backmsg);
		}   
    	//参数异常验证///////////////////////	
		
		//组合Sql查询条件///////////////////////
		$modelInsert = Db::table('tsh_access');//详情
		
		//组合Sql新增字段///////////////////////		
    	$map = array(
    		'articleid' => $articleid,
    		'info' => $info,
    		'creattime' => date('Y-m-d H:i:s'),
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
    		return json_msg(1, '新增成功!', $data);
    	}
		else
		{
    		return json_msg(0, '新增失败!', $data);			
		}	

	}

}
