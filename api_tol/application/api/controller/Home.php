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

use think\Db;

/**
 * Class Sys
 * @package app\api\controller
 *
 */
class Home extends Api
{

    public function index()
    {
        return json_msg(0, '官网首页接口！');
    }
	
    public function dbtest()
    {
    	$model       = Db::name('sys_test')->where('id','6'); //总记录集
    	$recordCount = $model->count(); //记录总数
    	$data = array(
    		'recordCount' => $recordCount, //记录总数
    	);

    	return json_msg(1, '取值成功!', $data);    	
    }	

    /**
     * 年级信息列表
     * @param  string $divisionId 单位ID
     * @param  int    $page       页码
     * @param  int    $pageSize   每页记录数
     * @return json
     *
     */
    public function gradeList(){

    	$divisionId = input('divisionId');       //单位ID
    	$page 		= intval(input('page'));     //页码
    	$pageSize   = intval(input('pageSize')); //每页记录数

    	$page     = $page > 1 ? $page : 1;
    	$pageSize = $pageSize > 0 ? $pageSize : 0 ;

    	if (!$divisionId) {
    		return json_msg(0, '单位ID不能为空');
    	}

    	$recordCount       = Db::name('sys_njxx')->where('DWID',$divisionId)->count(); //总记录集
    	$recordCount = $model->count(); //记录总数

    	//空记录
    	if (!$recordCount) {
    		return json_msg(1, '取值成功!', array('page'        => $page,
    											  'pageSize'    => $pageSize,
    											  'pageCount'   => 0,
    											  'recordCount' => 0,
    										      'list'        => '') );
    	}

    	$pageSize  = $pageSize > 0 ? $pageSize : $recordCount; //每页记录数
    	$pageCount = ceil($recordCount / $pageSize); //总页数

    	if ($page > $pageCount) {
    		$page = $pageCount;
    	}

    	$list = Db::name('sys_njxx')->where('DWID',$divisionId)->limit($pageSize)->page($page)->select(); //分页记录集

    	$result = array();
    	if ($list) {
    		foreach($list as $key=>$value) {
    			$result[$key]['divisionId'] = $value['DWID']; //单位ID
    			$result[$key]['gradeName']  = $value['NJMC']; //年级名称
    			$result[$key]['gradeId']    = $value['NJID']; //年级ID
    		}
    	}

    	$data = array(
    		'page'        => $page,        //页码
    		'pageSize'    => $pageSize,    //每页记录数
    		'pageCount'   => $pageCount,   //页码总数
    		'recordCount' => $recordCount, //记录总数
    		'list'        => $result,      //记录集
    	);

    	return json_msg(1, '取值成功!', $data);
    }

}
