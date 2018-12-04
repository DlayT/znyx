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
 * Class Group
 * @package app\api\controller
 *
 */
class Group extends Api
{

    var $cfg_mode = "admin";//模块名称

    public function index()
    {
        return json_msg(0, '五方教育！');
    }
	
   /**
     * 用户组列表

	 * @param  int $getsql 是否显示调试SQL，，1为总记录SQL调试；2为新增SQL调试   
     * @param  需要传入$accesstoken进行验证；
 
     * @return json
     *
     */
    public function GroupList()
    {


    			
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
		$modelCount = Db::table('sys_group');//总记录			
		$modelList = Db::table('sys_group');//列表	
			
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
        //用户组列表
    	if ($list) {
    		foreach($list as $key=>$value) {
    			$result[$key]['id'] = $value['id']; //
				$result[$key]['type']  = $value['type']; //
    			$result[$key]['group_name']  = $value['group_name']; //
				$result[$key]['service_info']  = $value['service_info']; //
				$result[$key]['module_info']  = $value['module_info']; //
				$result[$key]['function_info']  = $value['function_info']; //
                $result[$key]['status']  = $value['status']; //
                
                $service_info  = $value['service_info']; 
                $module_info  = $value['module_info']; 
                $function_info  = $value['function_info'];

                //系统服务列表                  
                $serviceSql = "select *,FIND_IN_SET(service_code,'$service_info') as ablestatus from sys_service where status<>0 order by sort asc";
                $servicelist = Db::query($serviceSql);
                $result[$key]['servicelist'] = $servicelist; //

                    if ($servicelist) {
                        foreach($servicelist as $keyM=>$value) {
                            $service_code = $value['service_code']; //
                            
                            //系统下一级菜单列表
                            // $modulelist = Db::table('sys_module')
                            // ->field("*,FIND_IN_SET(module_code,'".$module_info."') as ablestatus")
                            // ->where('service_code',$service_code)
                            // ->where('status','<>',0)
                            // ->order('sort asc')
                            // ->fetchSql(true)
                            // ->select();
                            $moduleSql = "select *,FIND_IN_SET(module_code,'$module_info') as ablestatus from sys_module where service_code='$service_code' and status<>0 order by sort asc";
                            $modulelist = Db::query($moduleSql);                            
                            $result[$key]['servicelist'][$keyM]['modulelist'] = $modulelist; //

                            if ($modulelist) {
                                foreach($modulelist as $keyF=>$value) {
                                    $module_code = $value['module_code']; //
                                    
                                    //二级菜单列表
                                    // $functionlist = Db::table('sys_function')
                                    // ->field('*,FIND_IN_SET(function_code,"'.$function_info.'") as ablestatus')
                                    // ->where('module_code',$module_code)
                                    // ->where('status','<>',0)
                                    // ->order('sort asc')
                                    // ->fetchSql(true)
                                    // ->select();
                                    $functionSql = "select *,FIND_IN_SET(function_code,'$function_info') as ablestatus from sys_function where module_code='$module_code' and status<>0 order by sort asc";
                                    $functionlist = Db::query($functionSql);                                       
                                    $result[$key]['servicelist'][$keyM]['modulelist'][$keyF]['functionlist'] = $functionlist; //
                                    
                                    
                                }                
                            }                               
                            
                        }                
                    }       
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
     * 用户组列表（简单版）

	 * @param  int $getsql 是否显示调试SQL，，1为总记录SQL调试；2为新增SQL调试   
     * @param  需要传入$accesstoken进行验证；
 
     * @return json
     *
     */
    public function GroupSimpleList()
    {


    			
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
		$modelCount = Db::table('sys_group')->where('status',1);//总记录			
		$modelList = Db::table('sys_group')->where('status',1);//列表	
			
		$modelList->order('id asc'); 			
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
        //用户组列表
    	if ($list) {
    		foreach($list as $key=>$value) {
    			$result[$key]['id'] = $value['id']; //
				$result[$key]['type']  = $value['type']; //
    			$result[$key]['group_name']  = $value['group_name']; //
				$result[$key]['service_info']  = $value['service_info']; //
				$result[$key]['module_info']  = $value['module_info']; //
				$result[$key]['function_info']  = $value['function_info']; //
                $result[$key]['status']  = $value['status']; //
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
	public function UserGroupStatus(){

		$id = input('id');
		$data = "";
		if (! $id) {
			exit(json_msg(0, '参数不能为空!'));
		}

		$condition = [			
			'id' => $id,
		];

		$list = Db::table('sys_group')->where($condition)->find();

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
            
            $update = Db::table('sys_group')->where($condition)->update($udata);
            if ($update)
            {
                //操作日志记录（用户名，姓名，操作类型：1增2删3改4查，操作状态：0失败1成功，操作信息，操作SQL）
                op_Log($this->yhm,$this->name,3,1,'用户组表','Update-From-SysGroup-Set-state='.$now_status.'-Where-Id='.$id,$this->cfg_mode);			
                return json_msg(1, '用户组状态更新成功!', $data);
            }
            else
            {
                //操作日志记录（用户名，姓名，操作类型：1增2删3改4查，操作状态：0失败1成功，操作信息，操作SQL）
                op_Log($this->yhm,$this->name,3,0,'用户组表','Update-From-SysGroup-Set-state='.$now_status.'-Where-Id='.$id,$this->cfg_mode);				
                return json_msg(0, '用户组状态更新失败!', $data);			
            }					
		}

	}	

	/**
	 * 用户组-菜单更新
	 * 
	 * @param  int    $id   记录id
	 * @return json
	 */
	public function UserGroupMenuUpdate(){

        $id = input('id');
        $service = input('service');
        $module = input('module');
        $function = input('function_s');
        $data = "";
    	//参数异常验证///////////////////////
		$validateparameter = //原始数据 
		[
		    'id'  => $id,
		    'service'   => $service,
            'module'   => $module,
            'function'   => $function,
		];	    	
		$validaterule = //验证规则
		[
		    'id'  => 'require',
		    'service'  => 'require',
            'module'  => 'require',
            'function'  => 'require',
		];
		$validatemsg =  //返回信息
		[
			'id.require' => '序号不能为空',
		    'service.require' => '服务列表不能为空',
            'module.require' => '主菜单不能为空',
            'function.require' => '子菜单不能为空',
        ];
		$validate = new Validate($validaterule,$validatemsg);
		$validateresult   = $validate->check($validateparameter);
		if(!$validateresult){
			$backmsg = $validate->getError();
			return json_msg(0,$backmsg);
		}   
        //参数异常验证///////////////////////	  
              
        $condition = ['id' => $id];//
		$list = Db::table('sys_group')->where($condition)->find();

		if ($list) {
            $udata = ['service_info' => $service,'module_info' => $module,'function_info' => $function,];//
            $update = Db::table('sys_group')->where($condition)->update($udata);
            //echo $update;
            if ($update)
            {
                //操作日志记录（用户名，姓名，操作类型：1增2删3改4查，操作状态：0失败1成功，操作信息，操作SQL）
                op_Log($this->yhm,$this->name,3,1,'用户组表','Update-From-SysGroup-Set-service_info='.$service.'-module_info='.$module.'-function_info='.$function.'-Where-Id='.$id,$this->cfg_mode);			
                return json_msg(1, '用户组菜单更新成功!', $data);
            }
            else
            {
                //操作日志记录（用户名，姓名，操作类型：1增2删3改4查，操作状态：0失败1成功，操作信息，操作SQL）
                op_Log($this->yhm,$this->name,3,0,'用户组表','Update-From-SysGroup-Set-service_info='.$service.'-module_info='.$module.'-function_info='.$function.'-Where-Id='.$id,$this->cfg_mode);				
                return json_msg(0, '用户组菜单更新失败!', $data);			
            }					
		}

	}	

	/**
	 * 用户组-新增
	 * 
	 * @param  int    $id   记录id
	 * @return json
	 */
	public function UserGroupMenuAdd(){

        $type = input('type');
        $groupname = input('groupname');
        $service = input('service');
        $module = input('module');
        $function = input('function_s');
        $data = "";
    	//参数异常验证///////////////////////
		$validateparameter = //原始数据 
		[
            'type'  => $type,
		    'groupname'  => $groupname,
		    'service'   => $service,
            'module'   => $module,
            'function'   => $function,
		];	    	
		$validaterule = //验证规则
		[
            'type'  => 'require',
            'groupname'  => 'require',
		    'service'  => 'require',
            'module'  => 'require',
            'function'  => 'require',
		];
		$validatemsg =  //返回信息
		[
            'type.require' => '组号不能为空',
            'groupname.require' => '组名不能为空',
		    'service.require' => '服务列表不能为空',
            'module.require' => '主菜单不能为空',
            'function.require' => '子菜单不能为空',
        ];
		$validate = new Validate($validaterule,$validatemsg);
		$validateresult   = $validate->check($validateparameter);
		if(!$validateresult){
			$backmsg = $validate->getError();
			return json_msg(0,$backmsg);
		}   
        //参数异常验证///////////////////////	  
              
        $condition = ['type' => $type];//
		$list = Db::table('sys_group')->where($condition)->find();

		if (!$list) {

            $modelInsert = Db::table('sys_group');//详情  
            //组合Sql新增字段///////////////////////		
            $map = array(
                'type' => $type,
                'group_name' => $groupname,
                'service_info' => $service,
                'module_info' => $module,
                'function_info' => $function,
                'status' => 1,
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
                op_Log($this->yhm,$this->name,1,1,'用户组列表','Insert-Into-SysGroup-Values-type-'.$type.'-groupname='.$groupname,$this->cfg_mode);				
                return json_msg(1, '新增成功!', $data);
            }
            else
            {
                //操作日志记录（用户名，姓名，操作类型：1增2删3改4查，操作状态：0失败1成功，操作信息，操作SQL）
                op_Log($this->yhm,$this->name,1,0,'用户组列表','Insert-Into-SysGroup-Values-type-'.$type.'-groupname='.$groupname,$this->cfg_mode);				
                return json_msg(0, '新增失败!', $data);			
            }					
        }
        else
        {
            return json_msg(0, '用户组号已存在!', $data); 
        }

	}	    

}
