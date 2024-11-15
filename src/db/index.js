// const mongoose = require('mongoose');

// // //localhost
// const url = 'mongodb://localhost:27017' ; 
// const dbName = 'Addio'

// // Serverless
// // const url = 'mongodb+srv://darrenlopezhr:darrenlopez565@cluster0.n3hlo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0' ; 
// // const dbName = 'Addio'

// //开始链接数据库
// mongoose.connect(`${url}/${dbName}`, {
//     // useNewUrlParser: true,
//     // useUnifiedTopology: truea
    
// });

// //获取链接对象
// const conn = mongoose.connection;

// conn.on('error' , err =>{
//     console.log('mongodb 链接出错', err);
// })

// module.exports = mongoose

// vercel版本
// src/db/index.js
const mongoose = require('mongoose');

const url = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = 'Addio';

mongoose.connect(`${url}/${dbName}`)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

module.exports = mongoose;