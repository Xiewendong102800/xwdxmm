<?php

namespace app\index\controller;

use think\Controller;
use think\DB;
use think\Request;

class Zc extends Controller
{
    public function getIndex()
    {
        $get = $_GET;
        $get['time'] = time();
        $get['password'] = $get['password'];
        $res = DB::table('user')->insert($get);
        if ($res) {
            echo '{"code":"200","msg":"注册成功"}';
        } else {
            echo '{"code":"100","msg":"注册失败"}';
        }
    }
    // 登录
    public function getDl(Request $request)
    {
        $get = $_GET;
        $get['password'] = md5($get['password']);
        $row = DB::table("user")->where("account", $get['account'])->where("password", $get['password'])->find();
        if ($row) {
            if ($row['status']) {
                echo '{"code":"200","msg":"登录成功"}';
            } else {
                echo '{"code":"300","msg":"您已被禁用，请联系管理员"}';
            }
        } else {
            echo '{"code":"100","msg":"用户名或密码不正确，请确认后重试"}';
        }
    }
}
