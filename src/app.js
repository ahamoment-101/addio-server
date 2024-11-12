const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
// const static = require('koa-static');
const cors = require('@koa/cors');
const app = new Koa();

// 加载中间件
require('dotenv').config();
app.use(bodyParser());
// app.use(static(__dirname + '/../public'));
app.use(cors({origin: 'http://localhost:5173'}))


// 加载路由
const userInput = require('../src/routes/userInput');
const todoList = require('../src/routes/todoList');
app.use(userInput.routes()).use(userInput.allowedMethods());
app.use(todoList.routes()).use(todoList.allowedMethods());

// 启动服务器
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`服务器正在运行在 http://localhost:${PORT}`);
});
