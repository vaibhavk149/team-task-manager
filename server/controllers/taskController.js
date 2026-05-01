const Task = require('../models/Task');
const Project = require('../models/Project');

exports.create = async (req, res) => {
  try {
    const { title, description, project, assignedTo, priority, dueDate } = req.body;
    
    // Verify project exists
    const projectExists = await Project.findById(project);
    if (!projectExists) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    const task = new Task({
      title,
      description,
      project,
      assignedTo: assignedTo || null,
      priority,
      dueDate,
      createdBy: req.user.userId
    });
    
    await task.save();
    
    const populatedTask = await Task.findById(task._id)
      .populate('assignedTo', 'name email')
      .populate('project', 'title');
      
    res.status(201).json(populatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getByProject = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    
    // Check if user has access to project
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    const isMember = project.members.includes(req.user.userId) || 
                     project.createdBy.toString() === req.user.userId;
                     
    if (!isMember && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const tasks = await Task.find({ project: projectId })
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
      
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user.userId })
      .populate('project', 'title')
      .populate('createdBy', 'name email')
      .sort({ dueDate: 1 });
      
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getAllAdminTasks = async (req, res) => {
  try {
    // Find projects where admin is creator
    const projects = await Project.find({ createdBy: req.user.userId }).select('_id');
    const projectIds = projects.map(p => p._id);
    
    // Find all tasks in those projects
    const tasks = await Task.find({ project: { $in: projectIds } })
      .populate('project', 'title')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });
      
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('project', 'title members')
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');
      
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Only allow if user is assigned, or is admin, or is a project member
    const isAssigned = task.assignedTo && task.assignedTo._id.toString() === req.user.userId;
    const isProjectMember = task.project.members.some(id => id.toString() === req.user.userId);
    
    if (!isAssigned && !isProjectMember && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { title, description, assignedTo, status, priority, dueDate } = req.body;
    
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, assignedTo, status, priority, dueDate },
      { new: true, runValidators: true }
    ).populate('assignedTo', 'name email').populate('project', 'title');
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Only assignee or admin can update status
    const isAssigned = task.assignedTo && task.assignedTo.toString() === req.user.userId;
    if (!isAssigned && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied: Only assignee or admin can update status' });
    }
    
    task.status = status;
    await task.save();
    
    const updatedTask = await Task.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('project', 'title');
      
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
