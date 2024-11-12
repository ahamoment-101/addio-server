const Router = require('koa-router');
const todoList = require('../controllers/todoList')

const router = new Router();

router.get('/gettask',todoList.getTodoList)
router.get('/getdetail/:id',todoList.getTodoDetail)
router.post('/saveRichTextContent/:id',todoList.saveRichTextContent)
router.post('/updateTaskStatus/:id',todoList.updateTaskStatus)
router.post('/updateTaskDescription/:id',todoList.updateTaskDescription)
router.post('/updateTodoStatus/:id',todoList.updateTodoStatus)

module.exports = router