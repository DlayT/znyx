<?php
/**
 * 网站接口相关
 *
 * @copyright 2017-2018 The Wufang Edu
 * @author    Cityfox <29151335@qq.com> 
 * @version   1.0.1
 *
 */
namespace app\api\controller;

use think\Controller;
use think\Request;
use think\Db;
use think\Validate;
/**
 * Class Api
 * @package app\api\controller
 *
 */
class Api extends Controller
{
	// public $request;
	//定义公共变量
	public $yhm;
	public $name;
	
    public function _initialize()
    {
    	header('Access-Control-Allow-Origin:*');//跨域设置

    	//接口权限统一认证		
   		$request = Request::instance();
        $action  = $request->action(); //获取方法名
        $allowAction = ['articlelist', 'articleinfo', 'accessadd'];//开放的接口,全部小写
        //articlelist 文章信息列表
        //articleinfo 文章详情列表
        //accessadd 访问详情新增
        $rs = in_array(strtolower($action), $allowAction);
        //权限控制
        if ($rs==false)
		{
	   		//条件参数
	    	$accesstoken = input('accesstoken');       //用户Token
	    	$effective = input('effective');     //有效期，单位分钟
	    	
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
				echo json_msg(0,$backmsg);
				exit;
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
			
			//总数
	    	$recordCount = $modelCount->count(); //记录总数
	    	//记录为空
	    	if (!$recordCount) {
	    		echo json_msg(0, 'Token失效!');
	    	}	
			
			//明细    	    	
	    	$list = $modelList->find();
	
	    	if ($list) 
	    		{
	    			$this->yhm  = $list['yhm']; //
	    			$this->name  = $list['name']; //
	    		}			
										
        }
	  	    	
    }

    //空操作
	public function _empty()
    {
        return json_msg(0, '访问地址有误！');
    }

}
