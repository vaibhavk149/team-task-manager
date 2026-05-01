const User = require('../models/User');
const Project = require('../models/Project');
const Task = require('../models/Task');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Prevent admin from deleting themselves
    if (userId === req.user.userId) {
      return res.status(400).json({ message: 'You cannot delete your own account from here' });
    }

    const userToDelete = await User.findById(userId);
    if (!userToDelete) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove user from all project member lists
    await Project.updateMany(
      { members: userId },
      { $pull: { members: userId } }
    );

    // Unassign user from all tasks
    await Task.updateMany(
      { assignedTo: userId },
      { $set: { assignedTo: null } }
    );

    // Delete the user
    await User.findByIdAndDelete(userId);

    res.json({ message: 'User removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
