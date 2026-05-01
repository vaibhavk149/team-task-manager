const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// Admin only route to get all users to add to projects
router.get('/', auth, roleCheck('admin'), userController.getAllUsers);

// Admin only route to delete a user from the system
router.delete('/:id', auth, roleCheck('admin'), userController.deleteUser);

module.exports = router;
