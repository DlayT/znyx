<?php
/**
 * 网站接口相关
 *
 * @copyright 2017-2018 The Wufang Edu
 * @author    Cityfox <29151335@qq.com> 
 * @version   1.0.1
 *
 */
namespace app\index\common;

use think\exception\Handle;
use think\exception\HttpException;

/**
 * Class Http
 * @package app\index\common
 *
 */
class Http extends Handle
{
    public function render(\Exception $e)
    {
        if ($e instanceof HttpException) {
            $statusCode = $e->getStatusCode();
        }
        echo json_msg(0, '程序发生异常,请联系管理员'); 
        exit;
        return redirect('index/Exception/index');
    }
}