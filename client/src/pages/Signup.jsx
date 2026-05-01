import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiShield, FiEye, FiEyeOff } from 'react-icons/fi';
import API from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Logo } from '../components/ui/logo';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'member' });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Confirm password validation
    if (formData.password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    try {
      const { data } = await API.post('/auth/signup', formData);
      login(data.user, data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4">
      {/* Background gradients */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-accent/20 via-primary/10 to-transparent blur-3xl" />
      </div>

      <div className="z-10 flex w-full flex-col items-center gap-8 py-10">
        <Logo iconClassName="h-12 w-12" textClassName="text-3xl" />
        
        <motion.div 
          className="w-full max-w-md overflow-hidden rounded-2xl border border-border/50 bg-background/50 p-8 shadow-2xl backdrop-blur-xl"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">Create Account</h1>
            <p className="mt-2 text-sm text-muted-foreground">Join Team Task Manager today</p>
          </div>

          {error && (
            <motion.div 
              className="mb-6 rounded-lg bg-destructive/15 p-3 text-sm text-destructive border border-destructive/20 text-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none text-foreground">
                Full Name
              </label>
              <div className="relative">
                <FiUser className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  placeholder="John Doe"
                  className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 pl-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none text-foreground">
                Email Address
              </label>
              <div className="relative">
                <FiMail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  placeholder="you@example.com"
                  className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 pl-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none text-foreground">
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  name="password" 
                  value={formData.password} 
                  onChange={handleChange} 
                  placeholder="••••••••"
                  minLength="6"
                  className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 pl-10 pr-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none text-foreground">
                Confirm Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  placeholder="••••••••"
                  minLength="6"
                  className={`flex h-10 w-full rounded-md border bg-background/50 px-3 py-2 pl-10 pr-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                    confirmPassword && confirmPassword !== formData.password
                      ? 'border-destructive focus-visible:ring-destructive'
                      : 'border-input'
                  }`}
                  required 
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
                </button>
              </div>
              {confirmPassword && confirmPassword !== formData.password && (
                <p className="text-xs text-destructive">Passwords do not match</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none text-foreground">
                Account Role
              </label>
              <div className="relative">
                <FiShield className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <select 
                  name="role" 
                  value={formData.role} 
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 pl-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none cursor-pointer"
                >
                  <option value="member" className="bg-background">Team Member</option>
                  <option value="admin" className="bg-background">Project Admin</option>
                </select>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full mt-2 bg-gradient-to-r from-primary to-accent hover:opacity-90"
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-primary hover:text-primary/80 transition-colors">
              Sign in instead
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;
