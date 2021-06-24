/*
 * @Author: your name
 * @Date: 2021-06-16 09:39:37
 * @LastEditTime: 2021-06-23 18:42:58
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \erqiqt\erqiqt\src\router\index.js
 */
import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)

const routes = [
  {
    path:"/login",
    component:()=>import("../views/login.vue"),
  },
  {
    path:"/userinfo",
    component:()=>import("../views/userinfo.vue"),
  },
  {
    path:"/",
    component:()=>import("../views/About.vue"),
  },
  {
    path:"/about",
    component:()=>import("../views/About.vue"),
  },
  {
    path:"/full-time",
    component:()=>import("../views/full-time.vue"),
  },
  {
    path:"/firm",
    component:()=>import("../views/firm.vue"),
  },
  {
    path:"/btrain",
    component:()=>import("../views/btrain.vue"),
  },
  {
    path:"/jianzhi",
    component:()=>import("../views/jianzhi.vue"),
  },
  {
    path:"/xiaoyuan",
    component:()=>import("../views/xiaoyuan.vue"),
  },
  {
    path:"/zph",
    component:()=>import("../views/zph.vue"),
  },
  {
    path:"/daily",
    component:()=>import("../views/daily.vue"),
  },
  {
    path:"/zhuce",
    component:()=>import("../views/zhuce.vue"),
  },
  
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
