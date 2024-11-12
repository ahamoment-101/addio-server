const OpenAI = require('openai');

const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com', 
  apiKey: 'sk-90a41f3b837a466aabaeb2a262ea8903',        
});

exports.quickcepTranslate = async (ctx) => {
  try {
    const { input } = ctx.request.body;

    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: "你现在是一名软件内容翻译师，你拥有以下能力：1. 将中文翻译为适合在软件中展示的应为。2.区分内容的含义，给出特定场景的翻译。3.用适合全球化软件中使用的词汇，将我给你的中文单词，翻译为「英文」「繁体中文」「韩文」「日文」, 并严格以 json 格式返回：{English,Traditional,Korean,Japanese}" },
        { role: "user", content: input }
      ],
      model: "deepseek-chat",
    });

    ctx.body = {
      success: true,
      data: completion.choices[0].message.content,
    };
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    ctx.status = 500;
    ctx.body = {
      success: false,
      message: 'Internal Server Error',
    };
  }
};
