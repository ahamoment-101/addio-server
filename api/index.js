// api/index.js
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');
const app = new Koa();

// 加载中间件
require('dotenv').config();
app.use(bodyParser());
app.use(cors());

// 加载路由
const userInput = require('../src/routes/userInput');
const todoList = require('../src/routes/todoList');

app.use(userInput.routes()).use(userInput.allowedMethods());
app.use(todoList.routes()).use(todoList.allowedMethods());

// 导出 app 实例
module.exports = app;