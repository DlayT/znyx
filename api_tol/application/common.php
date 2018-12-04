<?php
// +----------------------------------------------------------------------
// | ThinkPHP [ WE CAN DO IT JUST THINK ]
// +----------------------------------------------------------------------
// | Copyright (c) 2006-2016 http://thinkphp.cn All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Author: Cityfox <29151335@qq.com>
// +----------------------------------------------------------------------

// 应用公共文件
use think\Db;

//返回json
function json_msg($code, $msg, $data = ""){

	$info = ["code" => $code, "msg" => $msg, "data" => $data];
    return json_encode($info, JSON_UNESCAPED_UNICODE);
    
}

//分页处理
function page_compute($recordCount, $page, $pageSize){
   		
	$page     = $page > 0 ? $page : 1;//页码
	$pageSize  = $pageSize > 0 ? $pageSize : $recordCount; //每页记录数
	$pageCount = ceil($recordCount / $pageSize); //总页数

	if ($page > $pageCount) {
		$page = $pageCount;
	}
	
	$info = ["page" => $page, "pageSize" => $pageSize, "pageCount" => $pageCount, "recordCount" => $recordCount];
	return $info;
    
}

//记录操作日志
function op_Log($yhm, $name,$optype,$opstate,$opinfo,$opsql){
	
		$modelInsert = Db::table('tsh_log');//详情
		//组合Sql新增字段///////////////////////		
    	$map = array(
    		'yhm' => $yhm,
    		'name' => $name,
    		'optype' => $optype,
    		'opstate' => $opstate,
    		'opinfo' => $opinfo,
    		'opsql' => $opsql,
    		'creattime' => date('Y-m-d H:i:s'),
    	);	
		//组合Sql新增字段///////////////////////	
		//新增 	    	
    	$insert = $modelInsert->insertGetId($map); //	
    
}
