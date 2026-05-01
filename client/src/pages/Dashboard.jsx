import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheckCircle, FiClock, FiAlertCircle, FiList, FiFolder, FiUsers, FiTrendingUp, FiX, FiMail, FiShield, FiTrash2 } from 'react-icons/fi';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import API from '../api/axios';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMembersModal, setShowMembersModal] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const fetchTasks = user?.role === 'admin' ? API.get('/tasks/admin-all') : API.get('/tasks/my-tasks');
        
        const promises = [
          fetchTasks,
          API.get('/projects')
        ];
        
        if (user?.role === 'admin') {
          promises.push(API.get('/users'));
        }
        
        const results = await Promise.all(promises);
        setTasks(results[0].data);
        setProjects(results[1].data);
        
        if (user?.role === 'admin') {
          setAllUsers(results[2].data);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  // Calculate generic stats
  const totalTasks = tasks.length;
  const pendingTasks = tasks.filter(t => t.status === 'pending' || t.status === 'todo').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;
  const doneTasks = tasks.filter(t => t.status === 'done').length;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const overdueTasks = tasks.filter(t => {
    if (!t.dueDate || t.status === 'done') return false;
    return new Date(t.dueDate) < today;
  });

  const upcomingTasks = tasks.filter(t => {
    if (!t.dueDate || t.status === 'done') return false;
    const due = new Date(t.dueDate);
    const diffTime = Math.abs(due - today);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays <= 3 && due >= today; // Due in next 3 days
  });

  // Chart Data
  const pieData = [
    { name: 'Pending', value: pendingTasks, color: '#ef4444' },
    { name: 'In Progress', value: inProgressTasks, color: '#eab308' },
    { name: 'Done', value: doneTasks, color: '#22c55e' }
  ];

  const barData = projects.map(p => {
    const pTasks = tasks.filter(t => t.project?._id === p._id || t.project === p._id);
    const completed = pTasks.filter(t => t.status === 'done').length;
    const progress = pTasks.length > 0 ? Math.round((completed / pTasks.length) * 100) : 0;
    return { name: p.title.substring(0, 10) + '...', progress };
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="mx-auto max-w-7xl px-6 pb-12">
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, x: -20 }} 
        animate={{ opacity: 1, x: 0 }}
      >
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Welcome back, {user?.name.split(' ')[0]} 👋</h1>
        <p className="text-muted-foreground">
          {user?.role === 'admin' ? "Here is your team's overview today." : "Here is your personal productivity overview."}
        </p>
      </motion.div>

      {/* STATS GRID */}
      <motion.div 
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8" 
        variants={containerVariants} 
        initial="hidden" 
        animate="visible"
      >
        {user?.role === 'admin' && (
          <motion.div variants={itemVariants} className="rounded-xl border border-border bg-card text-card-foreground shadow overflow-hidden relative cursor-pointer transition-all hover:shadow-lg hover:border-primary/50" onClick={() => navigate('/projects')}>
            <div className="absolute left-0 top-0 h-full w-1 bg-primary"></div>
            <div className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Total Projects</p>
                <h2 className="text-3xl font-bold">{projects.length}</h2>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <FiFolder className="h-6 w-6" />
              </div>
            </div>
            <div className="px-6 pb-3 text-xs text-primary font-medium">View all projects →</div>
          </motion.div>
        )}
        
        {user?.role === 'admin' && (
          <motion.div variants={itemVariants} className="rounded-xl border border-border bg-card text-card-foreground shadow overflow-hidden relative cursor-pointer transition-all hover:shadow-lg hover:border-blue-500/50" onClick={() => setShowMembersModal(true)}>
            <div className="absolute left-0 top-0 h-full w-1 bg-blue-500"></div>
            <div className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Total Members</p>
                <h2 className="text-3xl font-bold">{allUsers.length}</h2>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                <FiUsers className="h-6 w-6" />
              </div>
            </div>
            <div className="px-6 pb-3 text-xs text-blue-400 font-medium">Click to view all →</div>
          </motion.div>
        )}

        <motion.div variants={itemVariants} className="rounded-xl border border-border bg-card text-card-foreground shadow overflow-hidden relative cursor-pointer transition-all hover:shadow-lg hover:border-accent/50" onClick={() => navigate('/tasks')}>
          <div className="absolute left-0 top-0 h-full w-1 bg-accent"></div>
          <div className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Total Tasks</p>
              <h2 className="text-3xl font-bold">{totalTasks}</h2>
            </div>
            <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center text-accent">
              <FiList className="h-6 w-6" />
            </div>
          </div>
          <div className="px-6 pb-3 text-xs text-accent font-medium">View all tasks →</div>
        </motion.div>
        
        <motion.div variants={itemVariants} className="rounded-xl border border-border bg-card text-card-foreground shadow overflow-hidden relative cursor-pointer transition-all hover:shadow-lg hover:border-red-500/50" onClick={() => navigate('/tasks')}>
          <div className="absolute left-0 top-0 h-full w-1 bg-red-500"></div>
          <div className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Pending</p>
              <h2 className="text-3xl font-bold">{pendingTasks}</h2>
            </div>
            <div className="h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
              <FiAlertCircle className="h-6 w-6" />
            </div>
          </div>
          <div className="px-6 pb-3 text-xs text-red-400 font-medium">View pending tasks →</div>
        </motion.div>

        <motion.div variants={itemVariants} className="rounded-xl border border-border bg-card text-card-foreground shadow overflow-hidden relative cursor-pointer transition-all hover:shadow-lg hover:border-green-500/50" onClick={() => navigate('/tasks')}>
          <div className="absolute left-0 top-0 h-full w-1 bg-green-500"></div>
          <div className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Completed</p>
              <h2 className="text-3xl font-bold">{doneTasks}</h2>
            </div>
            <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
              <FiCheckCircle className="h-6 w-6" />
            </div>
          </div>
          <div className="px-6 pb-3 text-xs text-green-400 font-medium">View completed tasks →</div>
        </motion.div>
      </motion.div>

      {/* ADMIN CHARTS */}
      {user?.role === 'admin' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <motion.div 
            className="rounded-xl border border-border bg-card text-card-foreground shadow p-6" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <FiAlertCircle className="text-muted-foreground" /> Task Status Distribution
            </h3>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-4">
              {pieData.map(d => (
                <div key={d.name} className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full" style={{ background: d.color }}></div> {d.name}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            className="rounded-xl border border-border bg-card text-card-foreground shadow p-6" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <FiTrendingUp className="text-muted-foreground" /> Project Progress %
            </h3>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 20, right: 30, left: -20, bottom: 5 }}>
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[0, 100]} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
                  <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', color: 'hsl(var(--foreground))' }} cursor={{ fill: 'hsl(var(--muted))' }} />
                  <Bar dataKey="progress" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      )}

      {/* MEMBER PRODUCTIVITY */}
      {user?.role === 'member' && (
        <motion.div 
          className="rounded-xl border border-border bg-card text-card-foreground shadow p-6 mb-8" 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 text-primary">
            <FiTrendingUp /> Productivity Overview
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-background/50 rounded-lg p-6 border border-border/50">
              <p className="text-muted-foreground text-sm mb-2">Completion Rate</p>
              <div className="text-4xl font-bold text-green-500">
                {totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0}%
              </div>
            </div>
            <div className="bg-background/50 rounded-lg p-6 border border-border/50">
              <p className="text-muted-foreground text-sm mb-2">Upcoming Deadlines (Next 3 days)</p>
              <div className={`text-4xl font-bold ${upcomingTasks.length > 0 ? 'text-yellow-500' : 'text-muted-foreground'}`}>
                {upcomingTasks.length}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* OVERDUE & UPCOMING ALERTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <motion.div 
          className="rounded-xl border border-border bg-card text-card-foreground shadow flex flex-col overflow-hidden" 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.5 }}
        >
          <div className="p-6 border-b border-border flex justify-between items-center bg-muted/20">
            <h2 className={`text-lg font-semibold flex items-center gap-2 ${overdueTasks.length > 0 ? 'text-red-500' : 'text-foreground'}`}>
              <FiAlertCircle /> Overdue Alerts
            </h2>
            <Link to="/tasks" className="text-sm text-primary hover:underline font-medium">View All</Link>
          </div>
          <div className="p-0 flex-1">
            {overdueTasks.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-sm">🎉 No overdue tasks. You're on track!</div>
            ) : (
              <div className="divide-y divide-border">
                {overdueTasks.slice(0, 5).map(task => (
                  <div key={task._id} className="p-4 flex items-center justify-between hover:bg-muted/10 transition-colors border-l-4 border-l-red-500">
                    <div>
                      <h4 className="font-medium text-foreground">{task.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{task.project?.title}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-medium text-red-500 bg-red-500/10 px-2 py-1 rounded-full">
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        <motion.div 
          className="rounded-xl border border-border bg-card text-card-foreground shadow flex flex-col overflow-hidden" 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.55 }}
        >
          <div className="p-6 border-b border-border flex justify-between items-center bg-muted/20">
            <h2 className={`text-lg font-semibold flex items-center gap-2 ${upcomingTasks.length > 0 ? 'text-yellow-500' : 'text-foreground'}`}>
              <FiClock /> Upcoming Deadlines
            </h2>
            <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-full">Next 3 days</span>
          </div>
          <div className="p-0 flex-1">
            {upcomingTasks.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-sm">No tasks due in the next 3 days.</div>
            ) : (
              <div className="divide-y divide-border">
                {upcomingTasks.slice(0, 5).map(task => (
                  <div key={task._id} className="p-4 flex items-center justify-between hover:bg-muted/10 transition-colors border-l-4 border-l-yellow-500">
                    <div>
                      <h4 className="font-medium text-foreground">{task.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{task.project?.title}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-medium text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded-full">
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* ACTIVITY INSIGHTS & PROJECTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div 
          className="rounded-xl border border-border bg-card text-card-foreground shadow flex flex-col overflow-hidden" 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.6 }}
        >
          <div className="p-6 border-b border-border bg-muted/20">
            <h2 className="text-lg font-semibold flex items-center gap-2"><FiList className="text-muted-foreground" /> Activity Insights</h2>
          </div>
          <div className="p-0 flex-1">
            {tasks.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-sm">No recent activity.</div>
            ) : (
              <div className="divide-y divide-border">
                {tasks.slice(0, 6).map(task => (
                  <div key={task._id} className="p-4 flex items-center justify-between hover:bg-muted/10 transition-colors">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-foreground truncate">{task.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {task.assignedTo?.name ? `Assigned to ${task.assignedTo.name}` : 'Unassigned'} 
                        {' · '}
                        {task.project?.title || 'No project'}
                      </p>
                    </div>
                    <div className="ml-4 shrink-0">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${
                        task.status === 'done' ? 'bg-green-500/10 text-green-500' :
                        task.status === 'in-progress' ? 'bg-yellow-500/10 text-yellow-500' :
                        'bg-red-500/10 text-red-500'
                      }`}>
                        {task.status.replace('-', ' ')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        <motion.div 
          className="rounded-xl border border-border bg-card text-card-foreground shadow flex flex-col overflow-hidden" 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.65 }}
        >
          <div className="p-6 border-b border-border flex justify-between items-center bg-muted/20">
            <h2 className="text-lg font-semibold flex items-center gap-2"><FiFolder className="text-muted-foreground" /> My Projects</h2>
            <Link to="/projects" className="text-sm text-primary hover:underline font-medium">View All</Link>
          </div>
          <div className="p-0 flex-1">
            {projects.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-sm">No projects yet.</div>
            ) : (
              <div className="divide-y divide-border">
                {projects.slice(0, 5).map(project => (
                  <Link to={`/projects/${project._id}`} key={project._id} className="p-4 flex items-center justify-between hover:bg-muted/10 transition-colors block">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-foreground truncate">{project.title}</div>
                      <p className="text-xs text-muted-foreground mt-1">{project.members?.length || 0} members</p>
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full capitalize ml-4 shrink-0 ${
                      project.status === 'completed' ? 'bg-green-500/10 text-green-500' :
                      project.status === 'active' ? 'bg-blue-500/10 text-blue-500' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {project.status}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Members Modal */}
      <AnimatePresence>
        {showMembersModal && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMembersModal(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg max-h-[80vh] overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
            >
              <div className="flex items-center justify-between p-6 border-b border-border bg-muted/20">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <FiUsers className="text-blue-500" /> All Team Members
                  <span className="text-sm font-normal text-muted-foreground">({allUsers.length})</span>
                </h2>
                <button
                  onClick={() => setShowMembersModal(false)}
                  className="rounded-sm opacity-70 hover:opacity-100 transition-opacity"
                >
                  <FiX className="h-5 w-5 text-muted-foreground" />
                </button>
              </div>
              <div className="overflow-y-auto max-h-[60vh] divide-y divide-border">
                {allUsers.map((member) => (
                  <div key={member._id} className="p-4 flex items-center gap-4 hover:bg-muted/10 transition-colors">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {member.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-foreground truncate">{member.name}</h4>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 truncate">
                        <FiMail className="h-3 w-3 shrink-0" /> {member.email}
                      </p>
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize shrink-0 flex items-center gap-1 ${
                      member.role === 'admin' ? 'bg-primary/15 text-primary' : 'bg-blue-500/10 text-blue-500'
                    }`}>
                      <FiShield className="h-3 w-3" /> {member.role}
                    </span>
                    {member._id !== user?.id && member.role !== 'admin' && (
                      <button
                        onClick={async () => {
                          if (!window.confirm(`Are you sure you want to remove "${member.name}" from the system? This will:\n\n• Remove them from ALL projects\n• Unassign them from ALL tasks\n• Permanently delete their account\n\nThis action cannot be undone.`)) return;
                          try {
                            await API.delete(`/users/${member._id}`);
                            setAllUsers(prev => prev.filter(u => u._id !== member._id));
                          } catch (err) {
                            alert(err.response?.data?.message || 'Failed to remove member');
                          }
                        }}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-destructive/15 hover:text-destructive transition-colors shrink-0"
                        title="Remove member from system"
                      >
                        <FiTrash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
