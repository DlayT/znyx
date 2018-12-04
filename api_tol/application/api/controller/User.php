<?php
/**
 * 网站接口相关-----账户接口
 *
 * @copyright 2017-2018 The Wufang Edu
 * @author    Cityfox <29151335@qq.com> 
 * @version   1.0.1
 *
 */
namespace app\api\controller;

use think\Db;
use think\Validate;
use think\Image;
/**
 * Class Sys
 * @package app\api\controller
 *
 */
class User extends Api
{

    var $cfg_mode = "admin";//模块名称

    public function index()
    {
        return json_msg(0, '五方教育！');
    }
	
   /**
     * 用户有效期列表

	 * @param  int $getsql 是否显示调试SQL，，1为总记录SQL调试；2为新增SQL调试   
     * @param  需要传入$accesstoken进行验证；

     * @param  string $yhm 用户名
     * @param  int $status 状态
 
     * @return json
     *
     */
    public function UserdateList()
    {

		//新增参数	
    	$yhm = input('yhm');       //产品名称
    	$status = input('status');       //状态
    			
    	//参数异常验证///////////////////////
		$validateparameter = //原始数据 
		[
		    //'division_id'  => $division_id,
		];	    	
		$validaterule = //验证规则
		[
		    //'division_id'  => 'require|number',
		];
		
		$validatemsg =  //返回信息
		[
			//'division_id.require' => '学校不能为空',
			//'division_id.number' => '学校格式不正确', 	    
		];
			
		$validate = new Validate($validaterule,$validatemsg);
		$validateresult   = $validate->check($validateparameter);
		if(!$validateresult){
			$backmsg = $validate->getError();
			return json_msg(0,$backmsg);
		}   
    	//参数异常验证///////////////////////	
    	  
		//组合Sql查询条件///////////////////////
		$modelCount = Db::table('sys_userdate');//总记录
        $modelCount ->alias('a');
		$modelCount ->join('sys_group b','a.type = b.type');
		
			
		$modelList = Db::table('sys_userdate');//列表
        $modelList ->alias('a');
		$modelList ->join('sys_group b','a.type = b.type');	
		$modelList ->field('a.id,a.type,a.yhm,a.starttime,a.endtime,a.intro,a.status,b.group_name');	
			
		if($yhm)
		{
			$modelCount->where('a.yhm','like','%'.$yhm.'%');
			$modelList->where('a.yhm','like','%'.$yhm.'%');	
		} 
		
		if($status==99)
		{
			$modelCount->where('a.status','in','0,1,2');
			$modelList->where('a.status','in','0,1,2');
		} 
		elseif($status==98)
		{
			$modelCount->where('a.status','in','1,2');
			$modelList->where('a.status','in','1,2');			
		}		
		elseif($status=='')
		{
			$modelCount->where('a.status','1');
			$modelList->where('a.status','1');			
		}
		else
		{
			$modelCount->where('a.status',$status);
			$modelList->where('a.status',$status);				
		}		
		
		$modelList->order('a.id desc'); 			
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
				$result[$key]['type']  = $value['type']; //
    			$result[$key]['starttime']  = $value['starttime']; //
				$result[$key]['endtime']  = $value['endtime']; //
				$result[$key]['intro']  = $value['intro']; //
				$result[$key]['status']  = $value['status']; //
				$result[$key]['group_name']  = $value['group_name']; //
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
	 * 用户禁用-启用开关
	 * 
	 * @param  int    $id   记录id
	 * @return json
	 */
	public function UserdateStatus(){

		$id = input('id');
		$data = "";
		if (! $id) {
			exit(json_msg(0, '参数不能为空!'));
		}

		$condition = [			
			'id' => $id,
		];

		$list = Db::table('sys_userdate')->where($condition)->find();

		if ($list) {
            if($list["status"]==1)//为可用时
            {
                $now_status = 2;
                $udata = ['status' => $now_status];//改为禁用
            }
            else
            {
                $now_status = 1;
                $udata = ['status' => $now_status];//改为可用
            }
            
            $update = Db::table('sys_userdate')->where($condition)->update($udata);
            if ($update)
            {
                //操作日志记录（用户名，姓名，操作类型：1增2删3改4查，操作状态：0失败1成功，操作信息，操作SQL）
                op_Log($this->yhm,$this->name,3,1,'用户有效期表','Update-From-SysUserdate-Set-state='.$now_status.'-Where-Id='.$id,$this->cfg_mode);			
                return json_msg(1, '用户状态更新成功!', $data);
            }
            else
            {
                //操作日志记录（用户名，姓名，操作类型：1增2删3改4查，操作状态：0失败1成功，操作信息，操作SQL）
                op_Log($this->yhm,$this->name,3,0,'用户有效期表','Update-From-SysUserdate-Set-state='.$now_status.'-Where-Id='.$id,$this->cfg_mode);				
                return json_msg(0, '用户状态更新失败!', $data);			
            }					
		}

	}	

/**
	 * 用户有效期区间修改
	 * 
	 * @param  int    $id   记录id
     * @param  string    $starttime   开始时间
     * @param  string    $endtime   结束时间
	 * @return json
	 */
	public function UserdateUpdate(){

		$id = input('id');
		$type = input('type');
        $starttime = input('starttime');
		$endtime = input('endtime');
		$intro = input('intro');
        $data = "";
        
    	//参数异常验证///////////////////////
		$validateparameter = //原始数据 
		[
			'id'  => $id,
			'type'  => $type,
		    'starttime'   => $starttime,
		    'endtime'  => $endtime,

		];	    	
		$validaterule = //验证规则
		[
			'id'  => 'require',
			'type'  => 'require',
		    'starttime'  => 'require',
		    'endtime'  => 'require',
		];
		
		$validatemsg =  //返回信息
		[
			'id.require' => '用户ID不能为空',
			'type.require' => '用户组不能为空',
			'starttime.require' => '开始时间不能为空',
			'endtime.require' => '结束时间不能为空',	    	    
		];
			
		$validate = new Validate($validaterule,$validatemsg);
		$validateresult   = $validate->check($validateparameter);
		if(!$validateresult){
			$backmsg = $validate->getError();
			return json_msg(0,$backmsg);
		}   
    	//参数异常验证///////////////////////	  

		$condition = [			
			'id' => $id,
		];

		$list = Db::table('sys_userdate')->where($condition)->find();

		if ($list) {

            $udata = [
				'type' => $type,
                'starttime' => $starttime,
				'endtime' => $endtime,
				'intro' => $intro,
            ];
           
            $update = Db::table('sys_userdate')->where($condition)->update($udata);
            if ($update)
            {
                //操作日志记录（用户名，姓名，操作类型：1增2删3改4查，操作状态：0失败1成功，操作信息，操作SQL）
                op_Log($this->yhm,$this->name,3,1,'用户有效期表','Update-From-SysUserdate-Set-starttime='.$starttime.'-endtime='.$endtime.'-type='.$type.'-Where-Id='.$id,$this->cfg_mode);			
                return json_msg(1, '用户有效期更新成功!', $data);
            }
            else
            {
                //操作日志记录（用户名，姓名，操作类型：1增2删3改4查，操作状态：0失败1成功，操作信息，操作SQL）
                op_Log($this->yhm,$this->name,3,0,'用户有效期表','Update-From-SysUserdate-Set-starttime='.$starttime.'-endtime='.$endtime.'-type='.$type.'-Where-Id='.$id,$this->cfg_mode);				
                return json_msg(0, '用户有效期更新失败!', $data);			
            }					
		}

    }
    
	/**
	 * 用户删除
	 * 
	 * @param  int    $id   记录id
	 * @return json
	 */
	public function UserdateDelete(){

		$id = input('id');
		$data = "";
		if (! $id) {
			exit(json_msg(0, '参数不能为空!'));
		}

		$condition = [			
			'id' => $id,
		];

		$list = Db::table('sys_userdate')->where($condition)->find();

		if ($list) {
				
            $del = Db::table('sys_userdate')->where($condition)->delete();
            
            if ($del)
            {
                //操作日志记录（用户名，姓名，操作类型：1增2删3改4查，操作状态：0失败1成功，操作信息，操作SQL）
                op_Log($this->yhm,$this->name,2,1,'用户有效期表','Delete-From-SysUserdate-Where-Id='.$id,$this->cfg_mode);			
                return json_msg(1, '用户删除成功!', $data);
            }
            else
            {
                //操作日志记录（用户名，姓名，操作类型：1增2删3改4查，操作状态：0失败1成功，操作信息，操作SQL）
                op_Log($this->yhm,$this->name,2,0,'用户有效期表','Delete-From-SysUserdate-Where-Id='.$id,$this->cfg_mode);				
                return json_msg(0, '用户删除失败!', $data);			
            }					

		}

    }
    
   /**
     * 创建用户

	 * @param  int $getsql 是否显示调试SQL，，1为总记录SQL调试；2为新增SQL调试   
     * @param  需要传入$accesstoken进行验证；

     * @param  string $yhm 用户名
     * @param  string    $starttime   开始时间
     * @param  string    $endtime   结束时间
     * @return json
     *
     */
    public function UserdateAdd()
    {

		//新增参数
		$yhm = input('yhm');       //用户名	
    	$starttime = input('starttime');       //开始时间
		$endtime = input('endtime');     //结束时间	
		$intro = input('intro');     //描述
		$type = input('type');     //管理级别	
		
    			
    	//参数异常验证///////////////////////
		$validateparameter = //原始数据 
		[
			'yhm'  => $yhm,
			'type'  => $type,
		    'starttime'   => $starttime,
		    'endtime'  => $endtime,
		];	    	
		$validaterule = //验证规则
		[
			'yhm'  => 'require',
			'type'  => 'require',
		    'starttime'  => 'require',
		    'endtime'  => 'require',
		];
		
		$validatemsg =  //返回信息
		[
			'yhm.require' => '用户名不能为空',
			'type.require' => '管理级别不能为空',
			'starttime.require' => '开始时间不能为空',
			'endtime.require' => '结束时间不能为空',	 		  	    
		];
			
		$validate = new Validate($validaterule,$validatemsg);
		$validateresult   = $validate->check($validateparameter);
		if(!$validateresult){
			$backmsg = $validate->getError();
			return json_msg(0,$backmsg);
		}   
    	//参数异常验证///////////////////////	
    	  
		$product = Db::table('sys_userdate')->where('yhm', $yhm)->find();
		if ($product) {
			exit(json_msg(0, '用户名已存在'));
		}
		
		$modelInsert = Db::table('sys_userdate');//    			
		//组合Sql查询条件///////////////////////
		 
 		
		//组合Sql新增字段///////////////////////		
    	$map = array(
			'yhm' => $yhm,
			'type' => $type,
    		'starttime' => $starttime,
    		'endtime' => $endtime,
			'status' => 1,
			'intro' => $intro,
    	);	
		//组合Sql新增字段///////////////////////		
			
		//新增 
			    	
    	$insert = $modelInsert->insertGetId($map); //
		
    	$data = array(
    		'recordId' => $insert, //
    	);
					
    	if ($insert)
		{
            //操作日志记录（用户名，姓名，操作类型：1增2删3改4查，操作状态：0失败1成功，操作信息，操作SQL）
            op_Log($this->yhm,$this->name,1,1,'用户有效期表','INsert-Into-SysUserdate-Where-yhm='.$yhm.'-starttime='.$starttime.'-endtime='.$endtime,$this->cfg_mode);	            			
    		return json_msg(1, '用户创建成功!', $data);
    	}
		else
		{
            //操作日志记录（用户名，姓名，操作类型：1增2删3改4查，操作状态：0失败1成功，操作信息，操作SQL）
            op_Log($this->yhm,$this->name,1,0,'用户有效期表','INsert-Into-SysUserdate-Where-yhm='.$yhm.'-starttime='.$starttime.'-endtime='.$endtime,$this->cfg_mode);            			
    		return json_msg(0, '用户创建失败!');			
		}	

	}    

   /**
     * 用户核实

	 * @param  int $getsql 是否显示调试SQL，，1为总记录SQL调试；2为新增SQL调试   
     * @param  需要传入$accesstoken进行验证；

     * @param  string $yhm 用户名
 
     * @return json
     *
     */
    public function UserdateChk()
    {

		//查询参数
		$yhm = input('yhm');       //用户名		

    			
    	//参数异常验证///////////////////////
		$validateparameter = //原始数据 
		[
		    'yhm'  => $yhm,
		];	    	
		$validaterule = //验证规则
		[
		    'yhm'  => 'require',
		];
		
		$validatemsg =  //返回信息
		[
			'yhm.require' => '用户名不能为空', 	    
		];
			
		$validate = new Validate($validaterule,$validatemsg);
		$validateresult   = $validate->check($validateparameter);
		if(!$validateresult){
			$backmsg = $validate->getError();
			return json_msg(0,$backmsg);
		}   
    	//参数异常验证///////////////////////	
    	  
		$user = Db::table('sys_userdate')->where('yhm', $yhm)->find();
		if (!$user) {
			exit(json_msg(1, '普通账户!',""));
		}
			
        $status = $user["status"];
        $starttime = $user["starttime"];
        $endtime = $user["endtime"];
		$nowtime = date('Y-m-d H:i:s');
		$type = $user["type"];

        if($status!=1)
        {
            exit(json_msg(0, '您的账户暂被禁用，请联系管理员')); 
        }	

        if($starttime>$nowtime)
        {
            exit(json_msg(0, '您的账户将于'.$starttime.'启用,请静候')); 
        }	

        if($endtime<$nowtime)
        {
            exit(json_msg(0, '您的账户已于'.$endtime.'过期,请联系管理员')); 
        }	
        		
    	return json_msg(1, '用户账户有效!',$type);
	

	}

   /**
     * 用户管理级别

	 * @param  int $getsql 是否显示调试SQL，，1为总记录SQL调试；2为新增SQL调试   
     * @param  需要传入$accesstoken进行验证；

     * @param  string $yhm 用户名
 
     * @return json
     *
     */
    public function UserMannagerType()
    {

		//查询参数
		$yhm = input('yhm');       //用户名		

    			
    	//参数异常验证///////////////////////
		$validateparameter = //原始数据 
		[
		    'yhm'  => $yhm,
		];	    	
		$validaterule = //验证规则
		[
		    'yhm'  => 'require',
		];
		
		$validatemsg =  //返回信息
		[
			'yhm.require' => '用户名不能为空', 	    
		];
			
		$validate = new Validate($validaterule,$validatemsg);
		$validateresult   = $validate->check($validateparameter);
		if(!$validateresult){
			$backmsg = $validate->getError();
			return json_msg(0,$backmsg);
		}   
    	//参数异常验证///////////////////////	
    	  
		$user = Db::table('sys_userdate')->where('yhm', $yhm)->find();
		if (!$user) {
			exit(json_msg(0, '您的账户不存在！',0));
		}

		$type = $user["type"];
        		
    	return json_msg(1, '用户级别获取成功!',$type);
	

	}

}
