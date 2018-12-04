<?php
/**
 * 网站接口相关
 *
 * @copyright 2017-2018 The Wufang Edu
 * @author    Cityfox <29151335@qq.com> 
 * @version   1.0.1
 *
 */
namespace app\index\controller;


use \think\Controller;

/**
 * Class Error
 * @package app\index\controller
 *
 */
class Exception extends Controller
{
    public function index(){

        return json_msg(0, '程序发生异常,请联系管理员');
    }
}