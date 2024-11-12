const Todo = require('../models/todoList')

// 获取所有 todo
getTodoList = async(ctx)=>{
    try{
        const page = parseInt(ctx.query.page) || 1;  // 页码，默认为第1页
        const limit = parseInt(ctx.query.limit) || 10; // 每页数量，默认为10条
        // 查询数据库并分页
        const tasks = await Todo.find()
            .skip((page - 1) * limit) // 跳过前 (page - 1) * limit 条数据
            .limit(limit); // 限制查询条数
        // 获取任务总数以计算总页数
        const totalTasks = await Todo.countDocuments();
        const totalPages = Math.ceil(totalTasks / limit);
        // 返回数据和分页信息
        ctx.status = 200
        ctx.body = {
            tasks,
            page,
            totalPages
        };

    }catch(error){
        console.error('Error',error)
        ctx.status = 500;
        ctx.body = {message:error.message}
    }
}

// 进入 todo 详情页获取整个 todo 数据
getTodoDetail = async (ctx)=>{
    try{
        const todoId = ctx.params.id //加上.id 解析出来的是字符串，不然是 id 这个对象
        const data = await Todo.findOne({_id:todoId})
        console.log('查出来的数据',data)
        if(data){
            ctx.status = 200,
            ctx.body = {
                success: true,
                data: data,
            }
        }else{
            ctx.status = 404
            ctx.body = {
                success: false,
                message:"To-do list not found"
            }
        }
    }catch(error){
        ctx.status = 500
        console.error('Error is :',error)
    }
}

// 保存富文本对象接口，保存到某个 todo 上
const saveRichTextContent = async (ctx) => {
    try {
      const todoId = ctx.params.id;
      const { richTextContent } = ctx.request.body; // 获取请求体中的 richTextContent
  
      if (!richTextContent) {
        ctx.status = 400;
        ctx.body = { message: 'richTextContent is required' };
        return;
      }
  
      // 更新 Todo 数据
      const updatedTodo = await Todo.findByIdAndUpdate(
        todoId,
        { richTextContent },
        { new: true } // 返回更新后的文档
      );
  
      if (!updatedTodo) {
        ctx.status = 404;
        ctx.body = { message: 'Todo not found' };
        return;
      }
  
      ctx.status = 200;
      ctx.body = updatedTodo; // 返回更新后的 todo
    } catch (error) {
      ctx.status = 500;
      console.error('Error', error);
      ctx.body = { message: 'Internal server error' };
    }
  };

// 更新任务状态接口
const updateTaskStatus = async (ctx) => {
    try {
        const todoId = ctx.params.id;
        const { taskId, status } = ctx.request.body;
        
        // 打印接收到的数据
        console.log('接收到的请求数据：', {
            todoId,
            taskId,
            status,
            requestBody: ctx.request.body
        });

        // 参数验证
        if (!taskId || !status) {
            console.log('参数验证失败：', { taskId, status });
            ctx.status = 400;
            ctx.body = { 
                success: false,
                message: 'taskId and status are required',
                received: { taskId, status }
            };
            return;
        }

        // 验证状态值是否有效
        const validStatuses = ['pending', 'completed'];
        if (!validStatuses.includes(status)) {
            console.log('状态值无效：', { status, validStatuses });
            ctx.status = 400;
            ctx.body = {
                success: false,
                message: `Invalid status value. Must be one of: ${validStatuses.join(', ')}`,
                received: { status }
            };
            return;
        }

        // 转换状态值以匹配数据库中的值
        let normalizedStatus = status;
        if (status === 'pending') normalizedStatus = 'pending';
        if (status === 'completed') normalizedStatus = 'completed';
        
        console.log('规范化后的状态值：', { original: status, normalized: normalizedStatus });

        // 构建更新路径
        const updatePath = `taskContent.taskResolve.${taskId}.status`;
        
        console.log('准备进行数据库更新：', {
            todoId,
            updatePath,
            normalizedStatus
        });

        // 更新特定任务的状态
        const updatedTodo = await Todo.findOneAndUpdate(
            { _id: todoId },
            { $set: { [updatePath]: normalizedStatus } },
            { 
                new: true,
                runValidators: true
            }
        );

        if (!updatedTodo) {
            console.log('未找到对应的 Todo：', { todoId });
            ctx.status = 404;
            ctx.body = {
                success: false,
                message: 'Todo not found'
            };
            return;
        }

        // 检查特定的任务是否存在
        const taskExists = updatedTodo.taskContent.taskResolve.has(taskId);
        console.log('任务存在检查：', { taskExists, taskId });
        
        if (!taskExists) {
            ctx.status = 404;
            ctx.body = {
                success: false,
                message: 'Task not found in the todo'
            };
            return;
        }

        console.log('更新成功');
        ctx.status = 200;
        ctx.body = {
            success: true,
            data: updatedTodo
        };

    } catch (error) {
        console.error('更新任务状态时出错：', {
            error: error.message,
            stack: error.stack,
            details: error
        });
        ctx.status = 500;
        ctx.body = {
            success: false,
            message: 'Internal server error',
            error: error.message
        };
    }
};

// 更新 todo 详情中编辑的 todo接口
const updateTaskDescription = async (ctx) => {
    console.log('进入 updateTaskDescription 控制器');
    try {
        const { id } = ctx.params;
        const { taskId, description } = ctx.request.body;
        
        console.log('请求参数：', { id, taskId, description });
        
        if (!taskId || !description) {
            ctx.status = 400;
            ctx.body = {
                code: 400,
                message: '缺少必要参数',
                data: null
            };
            return;
        }

        // 先查询现有文档
        const existingTodo = await Todo.findById(id);
        if (!existingTodo) {
            ctx.status = 404;
            ctx.body = {
                code: 404,
                message: '任务不存在',
                data: null
            };
            return;
        }

        // 找到对应的 key
        const taskResolveMap = existingTodo.taskContent.taskResolve;
        let targetKey = null;
        
        // 遍历 Map 找到匹配 _id 的项的 key
        for (const [key, value] of taskResolveMap.entries()) {
            if (value._id.toString() === taskId) {
                targetKey = key;
                break;
            }
        }

        if (!targetKey) {
            ctx.status = 404;
            ctx.body = {
                code: 404,
                message: '子任务不存在',
                data: null
            };
            return;
        }

        // 使用找到的 key 更新内容
        const updatedTodo = await Todo.findOneAndUpdate(
            { _id: id },
            { 
                $set: {
                    [`taskContent.taskResolve.${targetKey}`]: {
                        description: description,
                        status: existingTodo.taskContent.taskResolve.get(targetKey).status,
                        _id: taskId
                    }
                }
            },
            { new: true }
        );

        ctx.status = 200;
        ctx.body = {
            code: 200,
            message: '更新成功',
            data: updatedTodo
        };
        
    } catch (error) {
        console.error('控制器错误：', error);
        ctx.status = 500;
        ctx.body = {
            code: 500,
            message: error.message || '服务器内部错误',
            data: null
        };
    }
};

// 更新整个 todo 的是否完成状态
const updateTodoStatus = async (ctx) => {
    try {
        const todoId = ctx.params.id;
        const { status } = ctx.request.body;

        // 参数验证
        if (!status) {
            ctx.status = 400;
            ctx.body = {
                success: false,
                message: 'Status is required',
                received: { status }
            };
            return;
        }

        // 验证状态值是否有效
        const validStatuses = ['pending', 'completed'];
        if (!validStatuses.includes(status)) {
            ctx.status = 400;
            ctx.body = {
                success: false,
                message: `Invalid status value. Must be one of: ${validStatuses.join(', ')}`,
                received: { status }
            };
            return;
        }

        // 查找并更新 todo 状态
        const updatedTodo = await Todo.findById(todoId);
        
        if (!updatedTodo) {
            ctx.status = 404;
            ctx.body = {
                success: false,
                message: 'Todo not found'
            };
            return;
        }

        // 更新主状态
        updatedTodo.status = status;

        // 如果设置为已完成，同时更新所有子任务为已完成
        if (status === 'completed') {
            for (const [key, value] of updatedTodo.taskContent.taskResolve.entries()) {
                value.status = 'completed';
            }
        }

        // 保存更新后的 todo
        await updatedTodo.save();

        ctx.status = 200;
        ctx.body = {
            success: true,
            message: `Todo status updated to ${status}`,
            data: updatedTodo
        };

    } catch (error) {
        console.error('更新 Todo 状态时出错：', {
            error: error.message,
            stack: error.stack
        });
        ctx.status = 500;
        ctx.body = {
            success: false,
            message: 'Internal server error',
            error: error.message
        };
    }
};

module.exports = {
    getTodoList,
    getTodoDetail,
    saveRichTextContent,
    updateTaskStatus,
    updateTaskDescription,
    updateTodoStatus
}