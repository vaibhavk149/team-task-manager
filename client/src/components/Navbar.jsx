import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHome, FiFolder, FiCheckSquare, FiLogOut } from 'react-icons/fi';
import { AuthContext } from '../context/AuthContext';
import { Logo } from './ui/logo';
import { Button } from './ui/button';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: <FiHome className="h-4 w-4" /> },
    { name: 'Projects', path: '/projects', icon: <FiFolder className="h-4 w-4" /> },
    { name: 'My Tasks', path: '/tasks', icon: <FiCheckSquare className="h-4 w-4" /> },
  ];

  if (!user) return null;

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 w-full pt-3 px-4 mb-8"
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between rounded-2xl glass px-6 py-3">
        
        {/* Left Side: Logo */}
        <Logo />

        {/* Center: Nav Links */}
        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => {
            const isActive = location.pathname.startsWith(link.path);
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-foreground ${
                  isActive ? 'text-foreground' : 'text-muted-foreground'
                }`}
              >
                {link.icon}
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Right Side: User Profile & Logout */}
        <div className="flex items-center gap-4">
          <Link to="/profile" className="flex flex-col items-end text-right">
            <span className="text-sm font-medium leading-none text-foreground">{user.name}</span>
            <span className="text-xs text-muted-foreground mt-1 uppercase tracking-wider font-semibold">
              {user.role}
            </span>
          </Link>
          <Button variant="ghost" size="icon" onClick={handleLogout} className="text-destructive hover:bg-destructive/10">
            <FiLogOut className="h-4 w-4" />
          </Button>
        </div>

      </nav>
    </motion.header>
  );
};

export default Navbar;
