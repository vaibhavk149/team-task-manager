const Project = require('../models/Project');
const Task = require('../models/Task');
const User = require('../models/User');

exports.create = async (req, res) => {
  try {
    const { title, description, deadline } = req.body;
    
    const project = new Project({
      title,
      description,
      deadline,
      createdBy: req.user.userId,
      members: [req.user.userId] // Creator is automatically a member
    });
    
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [{ createdBy: req.user.userId }, { members: req.user.userId }]
    }).populate('createdBy', 'name email').populate('members', 'name email');
    
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('members', 'name email');
      
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Check if user is a member or creator
    const isMember = project.members.some(member => member._id.toString() === req.user.userId) || 
                     project.createdBy._id.toString() === req.user.userId;
                     
    if (!isMember && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { title, description, status, deadline } = req.body;
    
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { title, description, status, deadline },
      { new: true, runValidators: true }
    );
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Delete all tasks associated with this project
    await Task.deleteMany({ project: req.params.id });
    
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project and associated tasks deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.addMember = async (req, res) => {
  try {
    const { email } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    if (project.members.includes(user._id)) {
      return res.status(400).json({ message: 'User is already a member of this project' });
    }
    
    project.members.push(user._id);
    await project.save();
    
    const updatedProject = await Project.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('members', 'name email');
      
    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.removeMember = async (req, res) => {
  try {
    const userId = req.params.userId;
    
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    if (project.createdBy.toString() === userId) {
      return res.status(400).json({ message: 'Cannot remove the project creator' });
    }
    
    project.members = project.members.filter(memberId => memberId.toString() !== userId);
    await project.save();
    
    const updatedProject = await Project.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('members', 'name email');
      
    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
