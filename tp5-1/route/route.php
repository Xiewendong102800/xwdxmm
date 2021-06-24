<?php
/*
 * @Author: your name
 * @Date: 2021-06-21 14:25:01
 * @LastEditTime: 2021-06-23 19:26:41
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \erqiqt\tp5-1\route\route.php
 */

// 首页分类路由
Route::Controller('index', 'index/About');

// 首页城市路由
Route::Controller('city', 'index/City');

// 全职工作福利路由
Route::Controller('full', 'index/Full');

// 企业行业路由
Route::Controller('firm', 'index/Firm');

// 注册路由
Route::Controller('zc', 'index/Zc');
