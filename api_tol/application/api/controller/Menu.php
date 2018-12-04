<?php
/**
 * 网站接口相关-----系统接口--菜单
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
 * Class Menu
 * @package app\api\controller
 *
 */
class Menu extends Api
{

    public function index()
    {
        return json_msg(0, '五方教育！');
    }
	
   /**
     * 获取相关菜单--服务系统菜单
     * @param  需要传入$accesstoken进行验证；
     * @param  记录用户操作日志；
    * 
     * @param  string $media 图片的BASE64模式
	 * @param  string $extension 后缀名
     * @param  string $mode 文件夹（文件项目）
	 * @param  int $width 保存图片尺寸宽（传空默认为最大800）
	 * @param  int $height 保存图片尺寸高（传空默认为最大800）
    
     * @return json
     *
     */
     
    public function  ServiceMenuList()
    {

    	//条件参数
		$accesstoken = input('accesstoken');       //用户名

    	//参数异常验证///////////////////////
		$validateparameter = //原始数据 
		[
		    // 'media'  => $media,
		    // 'extension'   => $extension,
		    // 'mode'   => $mode,
		];	    	
		$validaterule = //验证规则
		[
		    // 'media'  => 'require',
		    // 'extension'  => 'require',
		    // 'mode'  => 'require',
		];
		$validatemsg =  //返回信息
		[
			// 'media.require' => '图片不能为空',
		    // 'extension.require' => '后缀名不能为空',
		    // 'mode.require' => '文件项目不能为空',
		];
			
		$validate = new Validate($validaterule,$validatemsg);
		$validateresult   = $validate->check($validateparameter);
		if(!$validateresult){
			$backmsg = $validate->getError();
			return json_msg(0,$backmsg);
		}   
        //参数异常验证///////////////////////
        
        //查询服务系统菜单列表
        $order = Db::table('tsh_token')
        ->alias('a')
        ->join('sys_userdate b','a.yhm = b.yhm')
        //->join('sys_group c','b.type = c.type')
        ->where('a.accesstoken', $accesstoken)
        ->find();
        $usertype =$order["type"];//获取账户用户组

        if($usertype=="")//如果未查询到对应权限的老师，默认为普通权限
        {
            $usertype=90;
        }
        $group = Db::table('sys_group')
        ->where('type', $usertype)
        ->find();
        $service_info =$group["service_info"];
 
        //$service_info_sql =sql_replace($service_info,",");//'A','B','C'

        $ablelist = Db::table('sys_service')
        ->where('service_code','in', $service_info)
        ->where('status','<>', 0)
        ->order('sort asc')
        ->select();

        $unablelist = Db::table('sys_service')
        ->where('service_code','not in', $service_info)
        ->where('service_code','<>', 'A')
        //->where('status','<>', 0)
        ->where('status','=', 9999)
        ->order('sort asc')
        ->select();

    	$result = array();
    	if ($unablelist) {
    		foreach($unablelist as $key=>$value) {
    			$result[$key]['id'] = $value['id']; //
    			$result[$key]['service_code']  = $value['service_code']; //
    			$result[$key]['service_name']  = $value['service_name']; //
    			$result[$key]['service_url']  = '###'; //
    			$result[$key]['icon']  = $value['icon']; //
    			$result[$key]['status']  = 5; //
				$result[$key]['sort']  = $value['sort']; //
    		}
    	}

    	$data = array(
            'ablelist'        => $ablelist,      //可用记录集
            'unablelist'        => $result,      //不可用记录集
    	);		
		//返回最终数据		
    	return json_msg(1, '取值成功!', $data);
    }

	
   /**
     * 获取相关菜单--服务系统菜单
     * @param  需要传入$accesstoken进行验证；
     * @param  记录用户操作日志；
    * 
     * @param  string $media 图片的BASE64模式
	 * @param  string $extension 后缀名
     * @param  string $mode 文件夹（文件项目）
	 * @param  int $width 保存图片尺寸宽（传空默认为最大800）
	 * @param  int $height 保存图片尺寸高（传空默认为最大800）
    
     * @return json
     *
     */
     
    public function  ModuleMenuList()
    {

        //条件参数
        $serviceurl = input('serviceurl');       //服务系统Code
		$accesstoken = input('accesstoken');       //用户名

    	//参数异常验证///////////////////////
		$validateparameter = //原始数据 
		[
		    // 'media'  => $media,
		    // 'extension'   => $extension,
		    // 'mode'   => $mode,
		];	    	
		$validaterule = //验证规则
		[
		    // 'media'  => 'require',
		    // 'extension'  => 'require',
		    // 'mode'  => 'require',
		];
		$validatemsg =  //返回信息
		[
			// 'media.require' => '图片不能为空',
		    // 'extension.require' => '后缀名不能为空',
		    // 'mode.require' => '文件项目不能为空',
		];
			
		$validate = new Validate($validaterule,$validatemsg);
		$validateresult   = $validate->check($validateparameter);
		if(!$validateresult){
			$backmsg = $validate->getError();
			return json_msg(0,$backmsg);
		}   
        //参数异常验证///////////////////////

        $service = Db::table('sys_service')
        ->where('service_url', $serviceurl)
        ->find();        
        $servicecode = $service["service_code"];

        //查询服务系统菜单列表
        $order = Db::table('tsh_token')
        ->alias('a')
        ->join('sys_userdate b','a.yhm = b.yhm')
        //->join('sys_group c','b.type = c.type')
        ->where('a.accesstoken', $accesstoken)
        ->find();

        $usertype =$order["type"];//获取账户用户组

        if($usertype=="")//如果未查询到对应权限的老师，默认为普通权限
        {
            $usertype=90;
        }
        $group = Db::table('sys_group')
        ->where('type', $usertype)
        ->find();

        $module_info =$group["module_info"];
        $function_info =$group["function_info"];

        $list = Db::table('sys_module')
        ->where('service_code', $servicecode)
        ->where('module_code','in', $module_info)
        ->where('status','<>', 0)
        ->order('sort asc')
        ->select();

        $result = array();
    	if ($list) {
    		foreach($list as $key=>$value) {

                $result[$key]['id'] = $value['id']; //
                $result[$key]['service_code'] = $value['service_code']; //
                $result[$key]['module_code'] = $value['module_code']; //
                $result[$key]['module_name'] = $value['module_name']; //
                $result[$key]['icon'] = $value['icon']; //
                $result[$key]['status'] = $value['status']; //
                $result[$key]['sort'] = $value['sort']; //

                $module_code  = $value['module_code'];
                
            
                $functionlist = Db::table('sys_function')
                ->where('module_code', $module_code)
                ->where('function_code','in', $function_info)
                ->where('status','<>', 0)
                ->order('sort asc')
                //->fetchSql(true)
                ->select();
                
                $result[$key]['data'] = $functionlist; //
    		}
        }	     	
		//返回最终数据		
    	return json_msg(1, '取值成功!', $result);
    }


   /**
     * 获取所有菜单树结构

	 * @param  int $getsql 是否显示调试SQL，，1为总记录SQL调试；2为新增SQL调试   
     * @param  需要传入$accesstoken进行验证；
 
     * @return json
     *
     */
    public function TreeList()
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
        
        //系统服务列表                  
        $serviceSql = "select * from sys_service where status<>0 order by sort asc";
        $servicelist = Db::query($serviceSql);
        $result = array();
        
    	if ($servicelist) {
    		foreach($servicelist as $key=>$value) {
    			$result[$key]['service_code'] = $value['service_code']; //
                $result[$key]['service_name']  = $value['service_name']; // 
                
                    $service_code = $value['service_code']; //
                    $moduleSql = "select * from sys_module where service_code='$service_code' and status<>0 order by sort asc";
                    $modulelist = Db::query($moduleSql); 

                    if ($modulelist) {
                        foreach($modulelist as $keyM=>$value) {
                            $result[$key]['modulelist'][$keyM]['module_code'] = $value['module_code']; //
                            $result[$key]['modulelist'][$keyM]['module_name'] = $value['module_name']; //

                            $module_code = $value['module_code']; //
                            $functionSql = "select * from sys_function where module_code='$module_code' and status<>0 order by sort asc";
                            $functionlist = Db::query($functionSql);  
                            
                            if ($functionlist) {
                                foreach($functionlist as $keyF=>$value) {
                                    $result[$key]['modulelist'][$keyM]['functionlist'][$keyF]['function_code'] = $value['function_code']; //
                                    $result[$key]['modulelist'][$keyM]['functionlist'][$keyF]['function_name'] = $value['function_name']; //                                                                      
                                }                
                            }                             
                                                                
                        }                
                    }                 
            
            }          
    	}        

    	$data = array(
    		'servicelist'        => $result,      //记录集
    	);                              
                    
   
		
		//返回最终数据		
    	return json_msg(1, '取值成功!', $data);			

    }    
    

   /**
     * 核实当前访问页面是否包含在权限中

	 * @param  int $getsql 是否显示调试SQL，，1为总记录SQL调试；2为新增SQL调试   
     * @param  需要传入$accesstoken进行验证；
 
     * @return json
     *
     */
    public function CheckMenu()
    {			
        //条件参数
        $locpage = input('locpage');       //当前页面
        $accesstoken = input('accesstoken');       //用户名
                
    	//参数异常验证///////////////////////
		$validateparameter = //原始数据 
		[
		    'locpage'  => $locpage,
		];	    	
		$validaterule = //验证规则
		[
		    'locpage'  => 'require',
		];
		
		$validatemsg =  //返回信息
		[
			'locpage.require' => '请求页面不能为空',    
		];
			
		$validate = new Validate($validaterule,$validatemsg);
		$validateresult   = $validate->check($validateparameter);
		if(!$validateresult){
			$backmsg = $validate->getError();
			return json_msg(0,$backmsg);
		}   
        //参数异常验证///////////////////////	
        
        //系统服务列表  
        $condition = ['function_url' => $locpage];//
        $list = Db::table('sys_function')->where($condition)->find();
        $function_code = $list["function_code"];  
		if(!$function_code){
			return json_msg(0, '页面不存在!','');
        }    
               
        $tollist =  Db::table('tsh_token')
                    ->alias('a')
                    ->join('sys_userdate b','a.yhm=b.yhm')
                    ->join('sys_group c','b.type=c.type')
                    ->where('a.accesstoken',$accesstoken)
                    ->where('c.function_info','like','%'.$function_code.'%')
                    //->fetchSql(true)
                    ->count();
		//返回最终数据		
    	return json_msg(1, '取值成功!', $tollist);			

    }    
        
}
