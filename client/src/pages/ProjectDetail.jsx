import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowLeft, FiPlus, FiX, FiCalendar, FiUser, FiClock, FiTrash2 } from 'react-icons/fi';
import API from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { Button } from '../components/ui/button';

const ProjectDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  
  // Task Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskData, setTaskData] = useState({ title: '', description: '', priority: 'medium', dueDate: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      const [projectRes, tasksRes] = await Promise.all([
        API.get(`/projects/${id}`),
        API.get(`/tasks/project/${id}`)
      ]);
      setProject(projectRes.data);
      setTasks(tasksRes.data);
      
      // If admin, fetch all users for the "Add Member" dropdown
      if (user?.role === 'admin') {
        const usersRes = await API.get('/users');
        setAllUsers(usersRes.data);
      }
    } catch (error) {
      console.error('Error fetching project details:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleTaskChange = (e) => {
    setTaskData({ ...taskData, [e.target.name]: e.target.value });
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await API.post('/tasks', { ...taskData, project: id });
      setTaskData({ title: '', description: '', priority: 'medium', dueDate: '' });
      setIsModalOpen(false);
      fetchData(); // Refresh tasks
    } catch (err) {
      console.error('Failed to create task:', err);
      alert('Failed to create task');
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      await API.patch(`/tasks/${taskId}/status`, { status: newStatus });
      setTasks(tasks.map(t => t._id === taskId ? { ...t, status: newStatus } : t));
    } catch (error) {
      console.error('Failed to update status', error);
      alert('You do not have permission to update this task');
    }
  };

  const handleAddMember = async () => {
    if (!newMemberEmail) return;
    try {
      const res = await API.post(`/projects/${id}/members`, { email: newMemberEmail });
      setProject(res.data);
      setNewMemberEmail('');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to add member');
    }
  };

  const handleRemoveMember = async (userId) => {
    if (!window.confirm('Remove this member from the project?')) return;
    try {
      const res = await API.delete(`/projects/${id}/members/${userId}`);
      setProject(res.data);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to remove member');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Delete this task completely?')) return;
    try {
      await API.delete(`/tasks/${taskId}`);
      setTasks(tasks.filter(t => t._id !== taskId));
    } catch (error) {
      alert('Failed to delete task');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }
  
  if (!project) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-muted-foreground">Project not found</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 pb-12">
      <Link 
        to="/projects" 
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <FiArrowLeft className="h-4 w-4" /> Back to Projects
      </Link>

      <div className="mb-8 rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <div className="mb-4 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{project.title}</h1>
          <span className={`inline-flex shrink-0 items-center rounded-full px-3 py-1 text-sm font-semibold capitalize ${
            project.status === 'completed' ? 'bg-green-500/15 text-green-500' :
            project.status === 'active' ? 'bg-blue-500/15 text-blue-500' :
            'bg-muted text-muted-foreground'
          }`}>
            {project.status}
          </span>
        </div>
        
        <p className="mb-8 max-w-3xl text-base text-muted-foreground leading-relaxed">
          {project.description}
        </p>
        
        <div className="flex flex-wrap gap-6 text-sm font-medium text-muted-foreground">
          <span className="flex items-center gap-2 rounded-lg bg-background/50 px-3 py-1.5 border border-border/50">
            <FiUser className="h-4 w-4 text-primary" /> 
            Created by: {project.createdBy?.name || 'Unknown'}
          </span>
          <span className="flex items-center gap-2 rounded-lg bg-background/50 px-3 py-1.5 border border-border/50">
            <FiCalendar className="h-4 w-4 text-primary" /> 
            {project.deadline ? `Due: ${new Date(project.deadline).toLocaleDateString()}` : `Created on: ${new Date(project.createdAt).toLocaleDateString()}`}
          </span>
        </div>
      </div>

      {/* Team Management Section */}
      <div className="mb-8 rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <h2 className="flex items-center gap-2 text-xl font-semibold text-foreground">
            <FiUser className="text-muted-foreground" /> Team Members
          </h2>
          {user?.role === 'admin' && (
            <div className="flex w-full sm:w-auto items-center gap-3">
              <select 
                value={newMemberEmail} 
                onChange={(e) => setNewMemberEmail(e.target.value)}
                className="flex h-10 w-full sm:w-64 cursor-pointer appearance-none rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="" className="bg-background">Select user to add...</option>
                {allUsers.filter(u => !project.members.some(m => m._id === u._id)).map(u => (
                  <option key={u._id} value={u.email} className="bg-background">{u.name} ({u.email})</option>
                ))}
              </select>
              <Button onClick={handleAddMember} disabled={!newMemberEmail} variant="secondary">
                Add
              </Button>
            </div>
          )}
        </div>
        
        <div className="flex flex-wrap gap-3">
          {project.members.map(member => {
            const assignedTasks = tasks.filter(t => t.assignedTo?._id === member._id).length;
            return (
              <div 
                key={member._id} 
                className="flex items-center gap-3 rounded-full border border-border/50 bg-background/50 py-1.5 pl-4 pr-2 text-sm transition-colors hover:bg-muted/50"
              >
                <span className="font-medium text-foreground">{member.name}</span>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{assignedTasks} tasks</span>
                {user?.role === 'admin' && project.createdBy?._id !== member._id && (
                  <button 
                    onClick={() => handleRemoveMember(member._id)} 
                    className="ml-1 flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground hover:bg-destructive/15 hover:text-destructive transition-colors"
                    title="Remove member"
                  >
                    <FiX className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h2 className="flex items-center gap-3 text-xl font-semibold text-foreground">
          Tasks 
          <span className="inline-flex items-center justify-center rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
            {tasks.length}
          </span>
        </h2>
        {user?.role === 'admin' && (
          <Button onClick={() => setIsModalOpen(true)} className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
            <FiPlus className="mr-2 h-4 w-4" /> Add Task
          </Button>
        )}
      </div>

      <div className="grid gap-4">
        <AnimatePresence>
          {tasks.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border py-12 text-center text-muted-foreground">
              No tasks yet for this project.
            </div>
          ) : (
            tasks.map((task) => (
              <motion.div 
                key={task._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex flex-col gap-4 rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md sm:flex-row sm:items-center sm:justify-between border-l-4 ${
                  task.status === 'done' ? 'border-l-green-500' : 
                  task.status === 'in-progress' ? 'border-l-yellow-500' : 
                  'border-l-red-500'
                }`}
              >
                <div className="flex-1">
                  <h3 className="mb-2 text-lg font-semibold text-foreground">{task.title}</h3>
                  <p className="mb-4 text-sm text-muted-foreground line-clamp-2">{task.description}</p>
                  
                  <div className="flex flex-wrap items-center gap-4 text-xs font-medium">
                    <span className={`flex items-center gap-1.5 ${task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done' ? 'text-red-500' : 'text-muted-foreground'}`}>
                      <FiClock className="h-3.5 w-3.5" /> 
                      Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}
                    </span>
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      Priority: 
                      <span className={`capitalize ${
                        task.priority === 'high' ? 'text-red-500 font-bold' : 
                        task.priority === 'medium' ? 'text-yellow-500 font-bold' : 
                        'text-blue-500 font-bold'
                      }`}>
                        {task.priority}
                      </span>
                    </span>
                    {task.assignedTo && (
                      <span className="flex items-center gap-1.5 text-muted-foreground">
                        <FiUser className="h-3.5 w-3.5" /> 
                        Assigned: <span className="text-foreground">{task.assignedTo.name}</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-start gap-3 sm:items-end sm:border-l sm:border-border/50 sm:pl-6">
                  <select 
                    value={task.status} 
                    onChange={(e) => updateTaskStatus(task._id, e.target.value)}
                    disabled={user?.role !== 'admin' && task.assignedTo?._id !== user?.id}
                    className="flex h-9 w-full sm:w-36 cursor-pointer appearance-none rounded-md border border-input bg-background/50 px-3 py-1 text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="pending" className="bg-background">Pending</option>
                    <option value="in-progress" className="bg-background">In Progress</option>
                    <option value="done" className="bg-background">Done</option>
                  </select>
                  
                  {user?.role === 'admin' && (
                    <button 
                      onClick={() => handleDeleteTask(task._id)} 
                      className="flex items-center gap-1.5 text-xs font-medium text-destructive transition-colors hover:text-destructive/80 hover:underline"
                    >
                      <FiTrash2 className="h-3.5 w-3.5" /> Delete
                    </button>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Add Task Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-2xl sm:p-8"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <FiX className="h-5 w-5 text-muted-foreground" />
              </button>

              <h2 className="mb-6 text-xl font-semibold tracking-tight text-foreground">Add New Task</h2>

              <form onSubmit={handleCreateTask} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Task Title</label>
                  <input 
                    type="text" 
                    name="title" 
                    value={taskData.title} 
                    onChange={handleTaskChange} 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required 
                    autoFocus
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Description</label>
                  <textarea 
                    name="description" 
                    value={taskData.description} 
                    onChange={handleTaskChange} 
                    rows="3"
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y"
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Assign To</label>
                    <select 
                      name="assignedTo" 
                      value={taskData.assignedTo || ''} 
                      onChange={handleTaskChange}
                      className="flex h-10 w-full cursor-pointer appearance-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="" className="bg-background">Unassigned</option>
                      {project.members.map(m => (
                        <option key={m._id} value={m._id} className="bg-background">{m.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Priority</label>
                    <select 
                      name="priority" 
                      value={taskData.priority} 
                      onChange={handleTaskChange}
                      className="flex h-10 w-full cursor-pointer appearance-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="low" className="bg-background">Low</option>
                      <option value="medium" className="bg-background">Medium</option>
                      <option value="high" className="bg-background">High</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2 sm:col-span-2">
                    <label className="text-sm font-medium text-foreground">Due Date</label>
                    <input 
                      type="date" 
                      name="dueDate" 
                      value={taskData.dueDate} 
                      onChange={handleTaskChange} 
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
                  >
                    {isSubmitting ? 'Creating...' : 'Create Task'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectDetail;
