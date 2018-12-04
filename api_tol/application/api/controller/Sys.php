<?php
/**
 * 网站接口相关-----文章接口
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
class Sys extends Api
{

    public function index()
    {
        return json_msg(0, '官网首页接口！');
    }
	
   /**
     * 图片上传接口
     * @param  需要传入$accesstoken进行验证；
     * @param  记录用户操作日志；
    * 
     * @param  string $media 图片的BASE64模式
	 * @param  string $extension 后缀名
	 * @param  int $width 保存图片尺寸宽（传空默认为最大800）
	 * @param  int $height 保存图片尺寸高（传空默认为最大800）
    
     * @return json
     *
     */
     
    public function  UploadImg()
    {
    	//条件参数
		$media = input('media');     //   
		$extension = input('extension');     //
		$width = input('width');     //
		$height = input('height');     //
		$width = $width!="" ? $width : 800;
		$height = $height!="" ? $height : 800;
		
		//$extension = "jpg";


    	//参数异常验证///////////////////////
		$validateparameter = //原始数据 
		[
		    'media'  => $media,
		    'extension'   => $extension,
		];	    	
		$validaterule = //验证规则
		[
		    'media'  => 'require',
		    'extension'  => 'require',
		];
		$validatemsg =  //返回信息
		[
			'media.require' => '图片不能为空',
		    'extension.require' => '后缀名不能为空',
		];
			
		$validate = new Validate($validaterule,$validatemsg);
		$validateresult   = $validate->check($validateparameter);
		if(!$validateresult){
			$backmsg = $validate->getError();
			return json_msg(0,$backmsg);
		}   
    	//参数异常验证///////////////////////

    	$img_info = file_get_contents($media);
		//echo strlen($img_info);
		$MaxM = 5;
		if(strlen($img_info) > $MaxM * 1024 * 1024)
		{
			return json_msg(0, '上传文件超出'.$MaxM."M");			
		}    	
    	    	
    	//保存路径
    	// $loc_file = "D:www/TSH_WEB/uploads/";
		// $loc_file = "D:www/TSH_WEB/uploads/";
		$loc_file=IMG_PATH;
    	$loc2_file = "uploads/" . date('Ymd') . "/";
        if (!file_exists($loc_file.$loc2_file)) {
			//检查是否有该文件夹，如果没有就创建，并给予最高权限
			// echo $loc_file.$loc2_file;
			// exit;
            mkdir($loc_file.$loc2_file, 0700);
        }
		$ext_file = date('YmdHis').rand(111111111, 999999999).".".$extension;
		$tol_file = $loc_file.$loc2_file.$ext_file;	
		
		
    	//正则匹配放入$result数组
		preg_match('/^(data:\s*image\/(\w+);base64,)/',$media,$result);
		//剔除base64头部
		$mediaS = str_replace($result[1],'',$media);
		$mediaB = base64_decode($mediaS);  
		$SaveFile = file_put_contents($tol_file,$mediaB); 	    			    
		if($SaveFile)
		{
			$image = Image::open($tol_file);
			// 按照原图的比例生成一个最大为$width*$height的缩略图并保存为$tol_file)
			$image->thumb($width,$height)->save($tol_file);	
	    	//操作日志记录（用户名，姓名，操作类型：1增2删3改4查，操作状态：0失败1成功，操作信息，操作SQL）
			op_Log($this->yhm,$this->name,1,1,'图片上传',$loc2_file.$ext_file);								
			return json_msg(1, '上传成功!', $loc2_file.$ext_file);
		}
		else
		{
			op_Log($this->yhm,$this->name,1,0,'图片上传',$loc2_file.$ext_file);	
			return json_msg(0, '上传失败!','');
		}	

    }

	
	        
}
