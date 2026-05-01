import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheckSquare, FiClock, FiAlertCircle, FiSearch, FiFilter } from 'react-icons/fi';
import API from '../api/axios';
import { AuthContext } from '../context/AuthContext';

const Tasks = () => {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const fetchMyTasks = async () => {
    try {
      const { data } = await API.get('/tasks/my-tasks');
      setTasks(data);
    } catch (error) {
      console.error('Error fetching my tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyTasks();
  }, []);

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      await API.patch(`/tasks/${taskId}/status`, { status: newStatus });
      setTasks(tasks.map(t => t._id === taskId ? { ...t, status: newStatus } : t));
    } catch (error) {
      console.error('Failed to update status', error);
      alert('You do not have permission to update this task');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  // Filter tasks based on search and priority
  const filteredTasks = tasks.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = priorityFilter === 'all' || t.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  // Group filtered tasks by status
  const pendingTasks = filteredTasks.filter(t => t.status === 'pending' || t.status === 'todo');
  const inProgressTasks = filteredTasks.filter(t => t.status === 'in-progress');
  const doneTasks = filteredTasks.filter(t => t.status === 'done');

  const TaskColumn = ({ title, tasks, statusColorClass, borderClass, icon }) => (
    <div className="flex flex-col gap-4">
      <div className={`flex items-center gap-2 font-semibold text-lg ${statusColorClass}`}>
        {icon} {title} ({tasks.length})
      </div>
      
      <div className="flex flex-col gap-4">
        <AnimatePresence>
          {tasks.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-card/30 p-8 text-center text-sm text-muted-foreground">
              No tasks
            </div>
          ) : (
            tasks.map(task => (
              <motion.div 
                key={task._id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`rounded-xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md border-t-4 ${borderClass}`}
              >
                <h4 className="mb-1 font-semibold text-foreground">{task.title}</h4>
                <p className="mb-4 text-xs font-medium text-muted-foreground">{task.project?.title}</p>
                
                <div className="flex items-center justify-between">
                  <span className={`flex items-center gap-1.5 text-xs font-medium ${task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done' ? 'text-red-500' : 'text-muted-foreground'}`}>
                    <FiClock className="h-3.5 w-3.5"/> 
                    {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}
                  </span>
                  
                  <select 
                    value={task.status === 'todo' ? 'pending' : task.status} 
                    onChange={(e) => updateTaskStatus(task._id, e.target.value)}
                    className="cursor-pointer rounded-md border border-input bg-background/50 px-2 py-1 text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="pending" className="bg-background">Pending</option>
                    <option value="in-progress" className="bg-background">In Progress</option>
                    <option value="done" className="bg-background">Done</option>
                  </select>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-6 pb-12">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-1">My Tasks</h1>
          <p className="text-muted-foreground">All tasks assigned directly to you across all projects.</p>
        </div>
        
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search tasks..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex h-10 w-full sm:w-64 rounded-md border border-input bg-background/50 px-3 py-2 pl-9 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <div className="relative">
            <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <select 
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="flex h-10 w-full sm:w-48 cursor-pointer appearance-none rounded-md border border-input bg-background/50 px-3 py-2 pl-9 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="all" className="bg-background">All Priorities</option>
              <option value="high" className="bg-background">High Priority</option>
              <option value="medium" className="bg-background">Medium Priority</option>
              <option value="low" className="bg-background">Low Priority</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:items-start">
        <TaskColumn 
          title="Pending" 
          tasks={pendingTasks} 
          statusColorClass="text-red-500" 
          borderClass="border-t-red-500"
          icon={<FiAlertCircle />} 
        />
        <TaskColumn 
          title="In Progress" 
          tasks={inProgressTasks} 
          statusColorClass="text-yellow-500" 
          borderClass="border-t-yellow-500"
          icon={<FiClock />} 
        />
        <TaskColumn 
          title="Done" 
          tasks={doneTasks} 
          statusColorClass="text-green-500" 
          borderClass="border-t-green-500"
          icon={<FiCheckSquare />} 
        />
      </div>
    </div>
  );
};

export default Tasks;
