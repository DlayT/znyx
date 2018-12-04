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
/**
 * Class Article
 * @package app\api\controller
 *
 */
class Article extends Api
{
	
    /**
     * 文章信息列表
	 * @param  无需传入$accesstoken进行验证；
	 * 
     * @param  int $code 文章类别CODE
	 * @param  string $title 标题（模糊）
	 * @param  string $state 状态
	 * @param  int $getsql 是否显示调试SQL，1为总记录SQL调试；2为列表SQL调试   
     * @param  int    $page       页码
     * @param  int    $pageSize   每页记录数
     * @return json
     *
     */
    public function ArticleList()
    {
    	//条件参数
    	$code = input('code');       //文章类别CODE
    	$title = input('title');     //标题（模糊）
    	$state = input('state');     //状态
    	$issort = input('issort');   //是否按sort排序，1为真，不传默认按ID排序（可选）
    	$creattimes = input('creattimes');     //开始时间（可选）
    	$creattimee = input('creattimee');     //开始时间（可选）
		$getsql = input('getsql');     //是否显示调试SQL
		
    	//参数异常验证///////////////////////
		$validateparameter = //原始数据 
		[
		    'code'  => $code,
		];	    	
		$validaterule = //验证规则
		[
		    'code'  => 'require',
		];
		$validatemsg =  //返回信息
		[
			'code.require' => '文章类别不能为空',
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
		$modelCount = Db::table('tsh_article');//总记录
		$modelList = Db::table('tsh_article');//列表
			
		if($code)
		{
			$modelCount->where('code','in',$code);
			$modelList->where('code','in',$code);	
		}	
			
		if($title)
		{
			$modelCount->where('title','like','%'.$title.'%');
			$modelList->where('title','like','%'.$title.'%');	
		} 
		
		if($state==99)
		{
			$modelCount->where('state','in','0,1');
			$modelList->where('state','in','0,1');
		} 
		elseif($state=='')
		{
			$modelCount->where('state','1');
			$modelList->where('state','1');			
		}
		else
		{
			$modelCount->where('state',$state);
			$modelList->where('state',$state);				
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

		//排序规则
		if($issort==1)
		{
		$modelList->order('sort desc,id desc'); 	
		}
		else
		{
		$modelList->order('id desc,sort desc');	
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
    			$result[$key]['code']  = $value['code']; //
    			$result[$key]['title']  = $value['title']; //
    			$result[$key]['description']  = $value['description']; //
    			$result[$key]['cover']  = $value['cover']; //
    			$result[$key]['content']  = $value['content']; //
    			$result[$key]['author']  = $value['author']; //
    			$result[$key]['creattime']  = $value['creattime']; //
    			$result[$key]['state']  = $value['state']; //
    			$result[$key]['sort']  = $value['sort']; //
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
     * 文章详情列表
     * @param  无需传入$accesstoken进行验证；
    * 
     * @param  int $code 文章类别CODE
	 * @param  int $id 文章编号
	 * @param  int $getsql 是否显示调试SQL，，1为总记录SQL调试；2为列表SQL调试；3为文章访问总记录

     * @return json
     *
     */
    public function ArticleInfo()
    {
    	//条件参数
    	$code = input('code');       //文章类别CODE
    	$id = input('id');     //文章编号
		$getsql = input('getsql');     //是否显示调试SQL
		
    	//参数异常验证///////////////////////
		$validateparameter = //原始数据 
		[
		    'code'  => $code,
		    'id'  => $id,
		    //'title'   => $title,
		];	    	
		$validaterule = //验证规则
		[
		    'code'  => 'require|number',
		    'id'  => 'require|number',
		];
		$validatemsg =  //返回信息
		[
			'code.require' => '文章类别不能为空',
		    'code.number' => '文章类别应为整型',
			'id.require' => '文章编号不能为空',
		    'id.number' => '文章编号应为整型',		    
		];
			
		$validate = new Validate($validaterule,$validatemsg);
		$validateresult   = $validate->check($validateparameter);
		if(!$validateresult){
			$backmsg = $validate->getError();
			return json_msg(0,$backmsg);
		}   
    	//参数异常验证///////////////////////	
		
		//组合Sql查询条件///////////////////////
		$modelCount = Db::table('tsh_article');//总记录
		$modelList = Db::table('tsh_article');//详情
		$accessCount = Db::table('tsh_access');//文章访问总记录
			
		if($code)
		{
			$modelCount->where('code',$code);
			$modelList->where('code',$code);
		}		
		if($id)
		{
			$modelCount->where('id',$id);
			$modelList->where('id',$id);
			$accessCount->where('articleid',$id);	
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
    	
    	//获取调试Sql//////////////////
		if($getsql==3)
		{
			$msg = $accessCount->fetchSql(true)->count();
			return json_msg(0,"文章访问总记录 SQL",$msg); 
		}	
		//获取调试Sql////////////////// 
		
		//文章访问总记录   	
    	$accessRCount = $accessCount->count(); 
    	
    	$result = array();
    	if ($list) {
    		foreach($list as $key=>$value) {
    			$result[$key]['id'] = $value['id']; //
    			$result[$key]['code']  = $value['code']; //
    			$result[$key]['title']  = $value['title']; //
    			$result[$key]['description']  = $value['description']; //
    			$result[$key]['cover']  = $value['cover']; //
    			$result[$key]['content']  = $value['content']; //
    			$result[$key]['author']  = $value['author']; //
    			$result[$key]['creattime']  = $value['creattime']; //
    			$result[$key]['state']  = $value['state']; //
    			$result[$key]['accesstol']  = $accessRCount; //
    		}
    	}

    	$data = array(
    		'recordCount' => $recordCount, //记录总数
    		'list'        => $result,      //记录集
    	);

		
		//返回最终数据		
    	return json_msg(1, '取值成功!', $data);
    }

	
   /**
     * 文章详情删除
     * @param  需要传入$accesstoken进行验证；
     * @param  记录用户操作日志；
    * 
     * @param  int $code 文章类别CODE
	 * @param  int $id 文章编号
	 * @param  int $getsql 是否显示调试SQL，1为总记录SQL调试；2为删除SQL调试   

     * @return json
     *
     */
    public function ArticleDel()
    {    	 
    	//条件参数
    	$code = input('code');       //文章类别CODE
    	$id = input('id');     //文章编号
    	
		$getsql = input('getsql');     //是否显示调试SQL
		
    	//参数异常验证///////////////////////
		$validateparameter = //原始数据 
		[
		    'code'  => $code,
		    'id'  => $id,
		];	    	
		$validaterule = //验证规则
		[
		    'code'  => 'require|number',
		    'id'  => 'require|number',
		];
		$validatemsg =  //返回信息
		[
			'code.require' => '文章类别不能为空',
		    'code.number' => '文章类别应为整型',
			'id.require' => '文章编号不能为空',
		    'id.number' => '文章编号应为整型',		    		    
		];
			
		$validate = new Validate($validaterule,$validatemsg);
		$validateresult   = $validate->check($validateparameter);
		if(!$validateresult){
			$backmsg = $validate->getError();
			return json_msg(0,$backmsg);
		}   
    	//参数异常验证///////////////////////		    	
    			
		//组合Sql查询条件///////////////////////
		$modelCount = Db::table('tsh_article');//总记录
		$modelDel = Db::table('tsh_article');//详情
				
		if($code)
		{
			$modelCount->where('code',$code);
			$modelDel->where('code',$code);	
		}		
		if($id)
		{
			$modelCount->where('id',$id);
			$modelDel->where('id',$id);	
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
			$msg = $modelDel->fetchSql(true)->delete();
			return json_msg(0,"删除SQL",$msg); 
		}	
		//获取调试Sql//////////////////	
		
		//删除 	    	
    	$del = $modelDel->delete(); //

    	$data = array(
    		'recordCount' => $recordCount, //记录总数
    	);

		
    	if ($del)
		{
	    	//操作日志记录（用户名，姓名，操作类型：1增2删3改4查，操作状态：0失败1成功，操作信息，操作SQL）
			op_Log($this->yhm,$this->name,2,1,'文章详情','Delete-From-TshArticle-Where-Id='.$id.'-Code='.$code);			
    		return json_msg(1, '删除成功!', $data);
    	}
		else
		{
	    	//操作日志记录（用户名，姓名，操作类型：1增2删3改4查，操作状态：0失败1成功，操作信息，操作SQL）
			op_Log($this->yhm,$this->name,2,0,'文章详情','Delete-From-TshArticle-Where-Id='.$id.'-Code='.$code);				
    		return json_msg(0, '删除失败!', $data);			
		}	

	}

	// 多选删除
	public function MoreArticleDel()
	{
        //条件参数
        $code = input('code');       //文章类别CODE
        $id = input('id');     //文章编号
        $ids = explode(',',rtrim($id,','));

        $getsql = input('getsql');     //是否显示调试SQL

        //参数异常验证///////////////////////
        $validateparameter = //原始数据
            [
                'code'  => $code,
                'id'  => $ids,
            ];
        $validaterule = //验证规则
            [
                'code'  => 'require|number',
                'id'  => 'require|array',
            ];
        $validatemsg =  //返回信息
            [
                'code.require' => '文章类别不能为空',
                'code.number' => '文章类别应为整型',
                'id.require' => '文章编号不能为空',
                'id.array' => '文章编号应为数组',
            ];

        $validate = new Validate($validaterule,$validatemsg);
        $validateresult   = $validate->check($validateparameter);
        if(!$validateresult){
            $backmsg = $validate->getError();
            return json_msg(0,$backmsg);
        }
        //参数异常验证///////////////////////

        //组合Sql查询条件///////////////////////
        $modelCount = Db::table('tsh_article');//总记录
        $modelDel   = Db::table('tsh_article');//详情

        if($code)
        {
            $modelCount->where('code',$code);
            $modelDel->where('code',$code);
        }
        if($ids)
        {
            $modelCount->whereIn('id',$ids);
            $modelDel->whereIn('id',$ids);
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
            $msg = $modelDel->fetchSql(true)->delete();
            return json_msg(0,"删除SQL",$msg);
        }
        //获取调试Sql//////////////////

        //删除
        $del = $modelDel->delete(); //

        $data = array(
            'recordCount' => $recordCount, //记录总数
        );


        if ($del)
        {
            //操作日志记录（用户名，姓名，操作类型：1增2删3改4查，操作状态：0失败1成功，操作信息，操作SQL）
            op_Log($this->yhm,$this->name,2,1,'文章详情','Delete-From-TshArticle-Where-Id='.$id.'-Code='.$code);
            return json_msg(1, '删除成功!', $data);
        }
        else
        {
            //操作日志记录（用户名，姓名，操作类型：1增2删3改4查，操作状态：0失败1成功，操作信息，操作SQL）
            op_Log($this->yhm,$this->name,2,0,'文章详情','Delete-From-TshArticle-Where-Id='.$id.'-Code='.$code);
            return json_msg(0, '删除失败!', $data);
        }

    }


   /**
     * 文章详情更新
     * @param  需要传入$accesstoken进行验证；
     * @param  记录用户操作日志；
    * 
     * @param  int $code 文章类别CODE
	 * @param  int $id 文章编号
	 * @param  int $getsql 是否显示调试SQL，，1为总记录SQL调试；2为更新SQL调试   
     * @param  string $title 标题（更新）
     * @param  string $description 描述（更新）
     * @param  string $cover 封面（更新）
     * @param  string $content 详情（更新）
     * @param  int $state 状态（更新）
 
     * @return json
     *
     */
    public function ArticleUpdate()
    {
    	$accesstoken = input('accesstoken');       //用户Token
    	//条件参数
    	$code = input('code');       //文章类别CODE
    	$id = input('id');     //文章编号
		$getsql = input('getsql');     //是否显示调试SQL，1为调试   

		//更新参数
    	$title = input('title');       //文章标题
    	$description = input('description');     //文章描述
    	$cover = input('cover');       //文章封面
    	$content = input('content');     //文章详情    	
    	$state = input('state');     //文章状态
    	$sort = input('sort');     //是否排序       		
    			
    	//参数异常验证///////////////////////
		$validateparameter = //原始数据 
		[
		    'code'  => $code,
		    'id'  => $id,
		    'accesstoken'   => $accesstoken,
		];	    	
		$validaterule = //验证规则
		[
		    'code'  => 'require|number',
		    'id'  => 'require|number',
		    'accesstoken'  => 'require|alphaNum',
		];
		$validatemsg =  //返回信息
		[
			'code.require' => '文章类别不能为空',
		    'code.number' => '文章类别应为整型',
			'id.require' => '文章编号不能为空',
		    'id.number' => '文章编号应为整型',	
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

    	//Token有效性验证///////////////////////		
		$modelToken = Db::table('tsh_token')->where('accesstoken',$accesstoken); 
    	$recordToken = $modelToken->count(); //记录总数
    	if (!$recordToken) {
    		return json_msg(0, 'Token无效!');
    	}
		//Token有效性验证///////////////////////	    	
    			
		//组合Sql查询条件///////////////////////
		$modelCount = Db::table('tsh_article');//总记录
		$modelUpdate = Db::table('tsh_article');//详情
			
		if($code)
		{
			$modelCount->where('code',$code);
			$modelUpdate->where('code',$code);	
		}		
		if($id)
		{
			$modelCount->where('id',$id);
			$modelUpdate->where('id',$id);	
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
		
		
		//组合Sql更新字段///////////////////////		
    	$map = array(
    		'title' => $title,
    		'description' => $description,
    		'content' => $content,
    		'state' => $state,
    		'sort' => $sort,
    	);
		if($cover!="")
		{
	    	$maps = array(
	    		'cover' => $cover,
			);
		    $map = array_merge($map,$maps);				
		}
			
		//组合Sql更新字段///////////////////////	

    	//获取调试Sql//////////////////
		if($getsql==2)
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
			op_Log($this->yhm,$this->name,3,1,'文章详情','Update-From-TshArticle-Set-State='.$state.'-Where-Id='.$id.'-Code='.$code);				
    		return json_msg(1, '更新成功!', $data);
    	}
		else
		{
	    	//操作日志记录（用户名，姓名，操作类型：1增2删3改4查，操作状态：0失败1成功，操作信息，操作SQL）
			op_Log($this->yhm,$this->name,3,0,'文章详情','Update-From-TshArticle-Set-State='.$state.'-Where-Id='.$id.'-Code='.$code);				
    		return json_msg(0, '更新失败!', $data);			
		}	

	}

   /**
     * 文章详情新增

	 * @param  int $getsql 是否显示调试SQL，，1为总记录SQL调试；2为新增SQL调试   
     * @param  需要传入$accesstoken进行验证；
     * @param  记录用户操作日志；

     * @param  int $code 文章类别CODE
     * @param  string $title 标题（更新）
     * @param  string $description 描述（更新）
     * @param  string $cover 封面（更新）
     * @param  string $content 详情（更新）
     * @param  string $author 作者（更新）
     * @param  int $state 状态（更新）
 
     * @return json
     *
     */
    public function ArticleAdd()
    {
    	$accesstoken = input('accesstoken');       //用户Token
    	//条件参数
		$getsql = input('getsql');     //是否显示调试SQL，1为调试   

		//新增参数
		$code = input('code');       //文章类别CODE		
    	$title = input('title');       //文章标题
    	$description = input('description');     //文章描述
    	$cover = input('cover');       //文章封面
    	$content = input('content');     //文章详情 
    	$author = input('author');     //文章作者       	
    	$state = input('state');     //文章状态   
    	$sort = input('sort');     //排序     		
    			
    	//参数异常验证///////////////////////
		$validateparameter = //原始数据 
		[
		    'code'  => $code,
		    'title'   => $title,
		    'description'  => $description,
		    //'cover'   => $cover,
		    'content'  => $content,
		    'author'   => $author,
		    'state'   => $state,
		    'sort'   => $sort,
			'accesstoken'   => $accesstoken,

		];	    	
		$validaterule = //验证规则
		[
		    'code'  => 'require|number',
		    'title'  => 'require|max:500',//中文占3个字符长度
		    'description'  => 'require|max:900',
		    //'cover'  => 'require',
		    'content'  => 'require',
		    'author'  => 'require|max:60',
		    'state'  => 'require|number',
		    'sort'  => 'number',
		    'accesstoken'  => 'require|alphaNum',
		];
		$validatemsg =  //返回信息
		[
			'code.require' => '文章类别不能为空',
		    'code.number' => '文章类别应为整型',
			'title.require' => '文章标题不能为空',
		    //'title.chsAlphaNum' => '文章标题包含非法字符',
			'title.max' => '文章标题过长',
			'description.require' => '文章描述不能为空',
		    //'description.chsAlphaNum' => '文章描述包含非法字符',
			'description.max' => '文章描述过长',
			//'cover.require' => '文章封面不能为空',
			'content.require' => '文章详情不能为空',
			//'content.max' => '文章详情过长',
			'author.require' => '文章作者不能为空',
			'author.max' => '文章作者过长',
			'state.require' => '文章状态不能为空',
		    'state.number' => '文章状态应为整型',	
		    'sort.number' => '排序应为整型',
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

    	//Token有效性验证///////////////////////		
		$modelToken = Db::table('tsh_token')->where('accesstoken',$accesstoken); 
    	$recordToken = $modelToken->count(); //记录总数
    	if (!$recordToken) {
    		return json_msg(0, 'Token无效!');
    	}
		//Token有效性验证///////////////////////    	
    			
		//组合Sql查询条件///////////////////////
		$modelInsert = Db::table('tsh_article');//详情
	
		//组合Sql新增字段///////////////////////		
    	$map = array(
    		'code' => $code,
    		'title' => $title,
    		'description' => $description,
    		'cover' => $cover,
    		'content' => $content,
    		'creattime' => date('Y-m-d H:i:s'),
    		'author' => $author,
    		'state' => $state,
    		'sort' => $sort,
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
			op_Log($this->yhm,$this->name,1,1,'文章详情','Insert-Into-TshArticle-Values-Title-'.$title.'-Code='.$code);				
    		return json_msg(1, '新增成功!', $data);
    	}
		else
		{
	    	//操作日志记录（用户名，姓名，操作类型：1增2删3改4查，操作状态：0失败1成功，操作信息，操作SQL）
			op_Log($this->yhm,$this->name,1,0,'文章详情','Insert-Into-TshArticle-Values-Title-'.$title.'-Code='.$code);				
    		return json_msg(0, '新增失败!', $data);			
		}	

	}

}
