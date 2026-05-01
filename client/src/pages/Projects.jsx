import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiFolder, FiX, FiCalendar, FiSearch } from 'react-icons/fi';
import API from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { Button } from '../components/ui/button';

const Projects = () => {
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', deadline: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchProjects = async () => {
    try {
      const { data } = await API.get('/projects');
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await API.post('/projects', formData);
      setFormData({ title: '', description: '', deadline: '' });
      setIsModalOpen(false);
      fetchProjects(); // Refresh list
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create project');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  const filteredProjects = projects.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="mx-auto max-w-7xl px-6 pb-12">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-1">Projects</h1>
          <p className="text-muted-foreground">Manage and view all your team projects.</p>
        </div>
        
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search projects..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex h-10 w-full sm:w-64 rounded-md border border-input bg-background/50 px-3 py-2 pl-9 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          {user?.role === 'admin' && (
            <Button onClick={() => setIsModalOpen(true)} className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
              <FiPlus className="mr-2 h-4 w-4" /> New Project
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <AnimatePresence>
          {filteredProjects.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="col-span-full flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="mb-4 rounded-full bg-muted/20 p-4 text-muted-foreground">
                <FiFolder className="h-10 w-10" />
              </div>
              <h3 className="text-lg font-medium text-foreground">No projects found</h3>
              <p className="text-muted-foreground">
                {user?.role === 'admin' ? "Create your first project to get started." : "You haven't been added to any projects yet."}
              </p>
            </motion.div>
          ) : (
            filteredProjects.map((project, index) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                layout
                className="group h-full"
              >
                <Link to={`/projects/${project._id}`} className="block h-full">
                  <div className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card p-6 shadow transition-all duration-200 hover:border-primary/50 hover:bg-muted/10 hover:shadow-md">
                    
                    <div className="mb-4 flex items-start justify-between gap-4">
                      <h2 className="text-lg font-semibold text-foreground line-clamp-1">{project.title}</h2>
                      <span className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize transition-colors ${
                        project.status === 'completed' ? 'bg-green-500/15 text-green-600 dark:text-green-400' :
                        project.status === 'active' ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                    
                    <p className="mb-6 flex-1 text-sm text-muted-foreground line-clamp-3">
                      {project.description}
                    </p>
                    
                    <div className="mt-auto flex items-center justify-between border-t border-border pt-4 text-xs font-medium text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <FiFolder className="h-3.5 w-3.5" />
                        {project.members?.length || 0} Members
                      </div>
                      <div className="flex items-center gap-1.5">
                        <FiCalendar className="h-3.5 w-3.5" />
                        {project.deadline ? `Due: ${new Date(project.deadline).toLocaleDateString()}` : `Created: ${new Date(project.createdAt).toLocaleDateString()}`}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Create Project Modal */}
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
                <span className="sr-only">Close</span>
              </button>

              <h2 className="mb-6 text-xl font-semibold tracking-tight text-foreground">Create New Project</h2>

              {error && (
                <div className="mb-6 rounded-lg bg-destructive/15 p-3 text-sm text-destructive border border-destructive/20">
                  {error}
                </div>
              )}

              <form onSubmit={handleCreateProject} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none text-foreground">Project Title</label>
                  <input 
                    type="text" 
                    name="title" 
                    value={formData.title} 
                    onChange={handleChange} 
                    placeholder="e.g. Website Redesign"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required 
                    autoFocus
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none text-foreground">Description</label>
                  <textarea 
                    name="description" 
                    value={formData.description} 
                    onChange={handleChange} 
                    placeholder="What is this project about?"
                    rows="3"
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y"
                  ></textarea>
                </div>

                <div className="space-y-2 mb-6">
                  <label className="text-sm font-medium leading-none text-foreground">Deadline (Optional)</label>
                  <input 
                    type="date" 
                    name="deadline" 
                    value={formData.deadline} 
                    onChange={handleChange} 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
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
                    {isSubmitting ? 'Creating...' : 'Create Project'}
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

export default Projects;
