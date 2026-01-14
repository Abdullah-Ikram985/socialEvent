const express = require('express');
const authController = require('../controller/authController');
const taskController = require('../controller/taskController');
const router = express.Router();

// TASK CREATION
router.post('/create-task', authController.protect, taskController.createTask);

module.exports = router;

