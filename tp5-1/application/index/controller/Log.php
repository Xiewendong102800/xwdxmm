<?php
namespace app\index\controller;

use think\Controller;
use think\DB;
use think\Request;
use think\captcha\Captcha;
use think\facade\Session;
class Log extends Controller
{
    // 加载登录页面
    public function getLog()
    {
       return view('Log/login');
    }

    // 处理登录的方法
    public function postLogin(Request $request)
    {
        $code = $request->param('code');
        // dump($code);
        $captcha = new Captcha();
        if( !$captcha->check($code))
        {
	        $this->error('验证码错误');
            die();
        }
        // 先验证验证码是否正确  如果验证码正确再去判断用户名和密码是否正确
        // 接收一下用户名
        $user = $request->param('user');
        // 接收一下密码并加密
        $password = md5($request->param('password'));
        // echo $user;
        // echo $password;
        $res = DB::table('denglu')->where('name',$user)->where('pass',$password)->find();
        // dump($res);
        if($res){
            // 存session
            Session::set('user',$res['name']);
            $this->success('欢迎您','/index/index');
        }else{
            $this->error('请重新登录');
        }

        
    }
    // 专门生成验证码的方法
    public function getCode()
    {
        $config =    [
            // 验证码字体大小
            'fontSize'    =>    20,    
            // 验证码位数
            'length'      =>    4,   
            // 关闭验证码杂点
            'useNoise'    =>    true, 
        ];
        $captcha = new Captcha($config);
        return $captcha->entry();

    }

    // 注销的方法
    public function getLogout(){
        // 销毁session  回到登录页面
        Session::delete('user');
        $this->success('退出成功','/log/log');
    }

    // 创建中间件
    
}
