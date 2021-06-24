
import axi from './inter.js'

// 首页分类
export const getAbout = can=>axi.get("/index/index",{params:can});
// 全职
export const getFull = can=>axi.get("/full/index",{params:can});
// 企业
export const getFirm = can=>axi.get("/firm/index",{params:can});

// //接取商品首页
// export const getGoods = can=>axi.get("/goods/index",{params:can});
// //修改状态
// export const editStatus = can=>axi.get("/goods/status",{params:can});
// //删除
// export const delGoods = can=>axi.get("/goods/del",{params:can});
// //获取商品里面的时候所有类别
// export const getType = can=>axi.get("/goods/type",{params:can});
// //商品添加
// export const addGoods = can=>axi.post("/goods/add",can);
// //查询那一条数据
// export const getOne = can=>axi.get("/goods/One",{params:can});
// //商品修改
// export const editGoods = can=>axi.post("/goods/edit",can);
