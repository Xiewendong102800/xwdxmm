<?php

namespace app\http\middleware;

use think\facade\Session;

class Check
{
    public function handle($request, \Closure $next)
    {
        if(Session::has('user')){
            return $next($request);
        }else{
            return redirect('/log/log');
        }
    }
}
