import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiShield, FiLogOut } from 'react-icons/fi';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="mx-auto max-w-2xl px-6 pb-12">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">My Profile</h1>
        <p className="text-muted-foreground">Manage your personal account settings.</p>
      </div>

      <motion.div 
        className="overflow-hidden rounded-2xl border border-border bg-card p-8 shadow-lg" 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-3xl font-bold text-white shadow-md">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <h2 className="mb-1 text-2xl font-semibold text-foreground">{user?.name}</h2>
          <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold capitalize ${
            user?.role === 'admin' ? 'bg-primary/15 text-primary' : 'bg-blue-500/15 text-blue-500'
          }`}>
            {user?.role === 'admin' ? 'Project Admin' : 'Team Member'}
          </span>
        </div>

        <div className="flex flex-col gap-6 border-t border-border pt-8">
          <div className="flex items-center gap-4 rounded-lg bg-background/50 p-4 border border-border/50">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-muted/50 text-muted-foreground">
              <FiUser className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Full Name</p>
              <p className="text-base font-semibold text-foreground">{user?.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-lg bg-background/50 p-4 border border-border/50">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-muted/50 text-muted-foreground">
              <FiMail className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email Address</p>
              <p className="text-base font-semibold text-foreground">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-lg bg-background/50 p-4 border border-border/50">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-muted/50 text-muted-foreground">
              <FiShield className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Account Role</p>
              <p className="text-base font-semibold capitalize text-foreground">{user?.role}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center pt-4 border-t border-border">
          <Button 
            variant="destructive" 
            className="w-full sm:w-auto"
            onClick={handleLogout}
          >
            <FiLogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
