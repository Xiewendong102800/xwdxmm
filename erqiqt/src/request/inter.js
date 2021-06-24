import axios from "axios";

//封装以下准备工作和劫持

const axi = axios.create({
    timeout:2000,
    baseURL:"/erqiqt/tp5-1/public/index.php/"
})

axi.interceptors.request.use(succ=>{
    //统一的公共验证
    return succ;
},err=>{
    return Promise.reject(err);
})



axi.interceptors.response.use(succ=>{
    
    return succ.data;
},err=>{
    return Promise.reject(err);
})

export default axi;