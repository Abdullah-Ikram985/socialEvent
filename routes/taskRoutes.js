const express = require('express');
const authController = require('../controller/authController');
const taskController = require('../controller/taskController');
const router = express.Router();

// TASK CREATION
router.post('/create_task', authController.protect, taskController.createTask);

router.get(
  '/get_tasks/:id',
  authController.protect,
  taskController.get_all_tasks_based_groupId,
);

module.exports = router;
