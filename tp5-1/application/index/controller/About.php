<?php
/*
 * @Author: your name
 * @Date: 2021-06-21 14:25:00
 * @LastEditTime: 2021-06-23 17:25:19
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \erqiqt\tp5-1\application\index\controller\About.php
 */

namespace app\index\controller;

use think\Controller;
use think\DB;
use think\Request;

class About extends Controller
{
    // 设置中间件  查看是否登录
    // protected $middleware = ['Check'];
    public function getIndex(Request $request)
    {
        $row = Db::table('post_type')->select();


        echo json_encode($row);
    }



    // // 添加方法
    // public function getAdd()
    // {
    //     // 加载添加页面
    //     return view('Index/add');
    // }
    // // 执行添加操作
    // public function postAdddo(Request $request)
    // {
    //     // 查看一下所有的值
    //     $post = $request->except(["/index/adddo", "action"]);
    //     // dump($post);
    //     $res = DB::table('stu')->insert($post);
    //     if ($res) {
    //         // 成功跳回首页
    //         $this->success('添加成功', '/index/index');
    //     } else {
    //         // 添加失败
    //         $this->error('添加失败');
    //     }
    // }

    // // 删除方法
    // public function getDel(Request $request)
    // {
    //     $id = $request->param('id');
    //     // dump($id);
    //     $res = DB::table('stu')->delete($id);
    //     if ($res) {
    //         // 成功跳回首页
    //         $this->success('删除成功', '/index/index');
    //     } else {
    //         // 添加失败
    //         $this->error('删除失败');
    //     }
    // }

    // // 修改方法
    // public function getEdit(Request $request)
    // {
    //     $id = $request->param('id');
    //     // dump($id);
    //     // 查一下这个id的所有数据
    //     $res = DB::table('stu')->find($id);
    //     // dump($res);
    //     return view('index/edit', ['row' => $res]);
    // }
    // // 执行修改
    // public function postEditdo(Request $request)
    // {
    //     $post = $request->except(["/index/editdo", "action"]);
    //     // dump($post);
    //     // die();
    //     $res = DB::table('stu')->update($post);
    //     if ($res) {
    //         // 成功跳回首页
    //         $this->success('修改成功', '/index/index');
    //     } else {
    //         // 添加失败
    //         $this->error('修改失败');
    //     }
    // }
}
