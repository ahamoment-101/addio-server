// models/Todo.js
const mongoose = require('../db/index');

const todoSchema = new mongoose.Schema({
  // 任务状态
  status: {
    type: String,
    enum: ['pending', 'completed'],
    default: 'pending'
  },
  // 任务内容
  taskContent: {
    type: {
      // 任务概括
      taskSummary: {
        type: String,
        required: true,
      },
      // 用户输入完整记录
      userInput: {
        type: String,
        required: true,
      },
      // 任务拆解
      taskResolve: {
        type:Map, 
        of:{
          description: String,
          status: {
            type: String,
            enum:['pending','completed'],
            default:'pending'
          },
        },
        required: true,
      },
    },
    required: true,
  },

  // 富文本内容
  richTextContent: {
    type: mongoose.Schema.Types.Mixed,
    required: false,
  },

  // 创建时间
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


module.exports = mongoose.model('Todo', todoSchema);
