const express = require('express');
const router = express.Router();
const {
  getAllTodos,
  getTodo,
  createTodo,
  updateTodo,
  deleteTodo
} = require('../controllers/todoController');

// Routes
router.route('/')
  .get(getAllTodos)
  .post(createTodo);

router.route('/:id')
  .get(getTodo)
  .put(updateTodo)
  .delete(deleteTodo);

module.exports = router;
