const Router = require('koa-router');
const userInput = require('../controllers/userInput')
// const { quickcepTranslate } = require('../controllers/quickcep');

const router = new Router();

// router.prefix('/content')
router.post('/userInput', userInput.postOpenAI)
router.post('/saveTodo',userInput.saveTodo)

// 给 quickcep 翻译封装一个接口
// router.post('/quickcepTranslate', quickcepTranslate);

module.exports = router