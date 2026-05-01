import { useState } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { FiGithub } from "react-icons/fi";
import { Button } from "../ui/button";
import { Logo } from "../ui/logo";
import { Link, useLocation } from "react-router-dom";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Dashboard", href: "#dashboard" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 pt-3 px-4"
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between rounded-2xl glass px-6 py-3">
        {/* Logo */}
        <Logo />

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="hidden items-center gap-3 md:flex">
          <Link to="/login">
            <Button variant="ghost" size="sm">
              Log In
            </Button>
          </Link>
          <Link to="/signup">
            <Button
              size="sm"
              className="bg-gradient-to-r from-primary to-accent text-white hover:opacity-90"
            >
              Get Started
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-foreground md:hidden"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mx-auto max-w-7xl mt-2 rounded-2xl glass border border-border md:hidden overflow-hidden"
        >
          <div className="flex flex-col gap-4 px-6 py-4">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
            <div className="flex flex-col gap-2 pt-4">
              <Link to="/login" onClick={() => setIsOpen(false)} style={{width: '100%'}}>
                <Button variant="ghost" size="sm" className="w-full">
                  Log In
                </Button>
              </Link>
              <Link to="/signup" onClick={() => setIsOpen(false)} style={{width: '100%'}}>
                <Button
                  size="sm"
                  className="w-full bg-gradient-to-r from-primary to-accent text-white"
                >
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
