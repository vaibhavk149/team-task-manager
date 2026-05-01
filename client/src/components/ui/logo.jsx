import React from 'react';
import { Link } from 'react-router-dom';
import { CheckSquare } from 'lucide-react';
import { cn } from '../../lib/utils';

export function Logo({ className, linkClassName, textClassName, iconClassName }) {
  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Link to="/" onClick={handleClick} className={cn("flex items-center gap-2", linkClassName)}>
      <div className={cn("flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent", iconClassName)}>
        <CheckSquare className="h-5 w-5 text-white" />
      </div>
      <span className={cn("text-xl font-bold tracking-tight text-foreground", textClassName)}>
        Team Task Manager
      </span>
    </Link>
  );
}
