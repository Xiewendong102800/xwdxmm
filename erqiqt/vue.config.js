module.exports = {
    devServer:{
        //设置端口号
        
        //设置代理
        proxy:{

            "/erqiqt":{
                target:"http://localhost"
                // http://localhost/erqiqt
            }
        }
    }
}