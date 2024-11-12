const OpenAI = require('openai');
const mainPrompt = require('../prompts/mainPrompt')
const TodoModels = require('../models/todoList')

const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const openai = new OpenAI({apiKey: OPENAI_API_KEY});

postOpenAI = async(ctx)=>{
try {
    const userInput = ctx.request.body;
    console.log('前端传来的', userInput);
    // const mainPrompt = MainPrompt  //提示词导入
    const messages = [...mainPrompt]  //把数组给到 openai 接口
    messages.push({
        role: "user",
        content: userInput.input
    });
    console.log('发送到 OpenAI 的消息：', messages);  // 调试日志
    
    // 请求 GPT
    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: messages,
        temperature: 0.7,  // 添加温度参数
        max_tokens: 1000,  // 添加最大令牌数
        response_format:{type:"json_object"}
    });

    console.log('OpenAI 返回的完整响应：', completion.choices[0].message.content,); 
    
    // 确保返回正确的响应格式
    ctx.status = 200;
    ctx.body = {
        code:200,
        message: completion.choices[0].message.content,
        // role: completion.choices[0].message.role // 这个 role用来给前端返回，告诉前端这个消息来自 user 还是 assistant 从而帮助前端判断
    };
    
    }catch(error){
        console.error('Error:', error); // 添加错误日志
        ctx.status = 500;
        ctx.body = {message:error.message}
    }
}
    
// 保存一个生成的 todo
saveTodo = async(ctx)=>{
    try{
        const todoData = ctx.request.body
        console.log('这个是从前端发来要储存的数据',todoData);
        
        // 创建一个具体的 todo 实例存储
        const newTodo = new TodoModels({
            taskContent: todoData.taskContent,           // 任务内容
            richTextContent: todoData.richTextContent,   // 富文本内容
        })

        // 将这套数据存储到数据库
        const savedTodo = await newTodo.save();

        ctx.status = 201;
        ctx.body = {
            message: 'Todo 保存成功',
            data: savedTodo,
        }

    }catch(error){
        console.error('Error',error)
        ctx.status = 500;
        ctx.body = {message:error.message}
    }


}


module.exports = {
    postOpenAI,
    saveTodo
}