const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// All project routes require authentication
router.use(auth);

// Get all projects for logged-in user
router.get('/', projectController.getAll);

// Get single project by ID
router.get('/:id', projectController.getById);

// Admin only routes below
// Create a new project
router.post('/', roleCheck('admin'), projectController.create);

// Update a project
router.put('/:id', roleCheck('admin'), projectController.update);

// Add member to project (must be before /:id delete to avoid route conflicts)
router.post('/:id/members', roleCheck('admin'), projectController.addMember);

// Remove member from project (must be before generic /:id delete)
router.delete('/:id/members/:userId', roleCheck('admin'), projectController.removeMember);

// Delete a project (generic /:id route last so it doesn't swallow /members/:userId)
router.delete('/:id', roleCheck('admin'), projectController.delete);

module.exports = router;
