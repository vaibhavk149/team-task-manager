const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// All task routes require authentication
router.use(auth);

// Get my tasks
router.get('/my-tasks', taskController.getMyTasks);

// Admin: Get all tasks across all owned projects
router.get('/admin-all', roleCheck('admin'), taskController.getAllAdminTasks);

// Get tasks by project
router.get('/project/:projectId', taskController.getByProject);

// Get single task
router.get('/:id', taskController.getById);

// Update status only (assignee or admin)
router.patch('/:id/status', taskController.updateStatus);

// Admin only routes below
// Create task
router.post('/', roleCheck('admin'), taskController.create);

// Update full task
router.put('/:id', roleCheck('admin'), taskController.update);

// Delete task
router.delete('/:id', roleCheck('admin'), taskController.delete);

module.exports = router;
