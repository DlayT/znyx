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
 * Class Log
 * @package app\api\controller
 *
 */
class Log extends Api
{
    public function index()
    {
        return json_msg(0, '五方教育！');
	}
		
    /**
     * 操作记录列表
     * @param  需要传入$accesstoken进行验证；
	 *     
	 * @param  string $yhm 用户账户
	 * @param  string $name 用户姓名
	 * @param  string $optype 操作类型
	 * @param  string $opstate 操作结果
	 * @param  string $opinfo 操作项目
	 * @param  string $opsql 操作语句
	 * @param  string $creattimes 登录开始时间（可选）
	 * @param  string $creattimee 登录结束时间（可选）
     * @param  int    $page       页码
     * @param  int    $pageSize   每页记录数
     * @return json
     *
     */
    public function LogList()
    {
    	//条件参数
    	$yhm = input('yhm');       //用户账户
    	$name = input('name');     //用户类别
    	$optype = input('optype');     //操作类型
    	$opstate = input('opstate');     //操作结果
    	$opinfo = input('opinfo');     //操作项目    	
		$opsql = input('opsql');   //操作语句
		$mode = input('mode');   //相关模块
    	$creattimes = input('creattimes');     //登录开始时间（可选）
    	$creattimee = input('creattimee');     //登录结束时间（可选）
		
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
		$modelCount = Db::table('tsh_log');//总记录
		$modelList = Db::table('tsh_log');//列表
			
		if($yhm)
		{
			$modelCount->where('yhm','like','%'.$yhm.'%');
			$modelList->where('yhm','like','%'.$yhm.'%');	
		}

		if($name)
		{
			$modelCount->where('name','like','%'.$name.'%');
			$modelList->where('name','like','%'.$name.'%');	
		}

		if($optype)
		{
			$modelCount->where('optype',$optype);
			$modelList->where('optype',$optype);	
		}
		
		if($opstate!="")
		{
			$modelCount->where('opstate',$opstate);
			$modelList->where('opstate',$opstate);	
		}		
		
		if($opinfo)
		{
			$modelCount->where('opinfo','like','%'.$opinfo.'%');
			$modelList->where('opinfo','like','%'.$opinfo.'%');	
		}

		if($opsql)
		{
			$modelCount->where('opsql','like','%'.$opsql.'%');
			$modelList->where('opsql','like','%'.$opsql.'%');	
		}			

		if($mode)
		{
			$modelCount->where('mode','like','%'.$mode.'%');
			$modelList->where('mode','like','%'.$mode.'%');	
		}		

		if($creattimes)
		{
			$modelCount->where('creattime','>=',$creattimes);
			$modelList->where('creattime','>=',$creattimes);
		} 

		if($creattimee)
		{
			$modelCount->where('creattime','<=',$creattimee);
			$modelList->where('creattime','<=',$creattimee);
		} 

		$modelList->order('id desc');					
		//组合Sql查询条件///////////////////////	
								
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
				
    	$list = $modelList->select(); //分页记录集

    	$result = array();
    	if ($list) {
    		foreach($list as $key=>$value) {
    			$result[$key]['id'] = $value['id']; //
    			$result[$key]['yhm']  = $value['yhm']; //
    			$result[$key]['name']  = $value['name']; //
    			$result[$key]['optype']  = $value['optype']; //
    			$result[$key]['opstate']  = $value['opstate']; //
    			$result[$key]['opinfo']  = $value['opinfo']; //
				$result[$key]['opsql']  = $value['opsql']; //
				$result[$key]['mode']  = $value['mode']; //
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

}
