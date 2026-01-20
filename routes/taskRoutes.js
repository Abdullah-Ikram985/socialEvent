const express = require('express');
const authController = require('../controller/authController');
const taskController = require('../controller/taskController');
const router = express.Router();

// TASK CREATION
router.post('/create_task', authController.protect, taskController.createTask);
// GET TASK BASED ON GROUP ID
router.get(
  '/get_tasks/:id',
  authController.protect,
  taskController.get_all_tasks_based_groupId,
);
// UPDATING TASK BASED ON TASK ID
router.patch(
  '/update_task/:id',
  authController.protect,
  taskController.updating_task_based_ID,
);
// TASK COMPLETETION
router.patch(
  '/task_complete/:taskId/:memberId',
  authController.protect,
  taskController.task_completion,
);
module.exports = router;
