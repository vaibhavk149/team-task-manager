import { motion } from "framer-motion";
import { ArrowRight, Play, CheckCircle2, Clock, Users, BarChart3 } from "lucide-react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";

export function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden pt-32 pb-32 flex items-center">
      {/* Background gradient orb */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="h-[700px] w-[700px] rounded-full bg-gradient-to-br from-primary/30 via-accent/20 to-transparent blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 w-full">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-2 text-sm"
            >
              <span className="flex h-2 w-2 rounded-full bg-green-500" />
              <span className="text-muted-foreground">Team Task Manager</span>
            </motion.div>

            <h1 className="mb-8 text-4xl font-bold leading-tight tracking-tight text-balance sm:text-5xl lg:text-7xl">
              <span className="text-foreground">Manage Projects.</span>
              <br />
              <span className="gradient-text">Track Tasks.</span>
              <br />
              <span className="text-foreground">Empower Teams.</span>
            </h1>

            <p className="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-muted-foreground lg:mx-0">
              An all-in-one workspace to organize projects, assign tasks, monitor deadlines, and boost productivity across your entire team.
            </p>

            <div className="flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
              <Link to="/signup" style={{width: '100%'}}>
                <Button
                  size="lg"
                  className="w-full bg-gradient-to-r from-primary to-accent text-white hover:opacity-90 sm:w-auto"
                >
                  Launch App
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/login" style={{width: '100%'}}>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full border-border bg-transparent hover:bg-secondary sm:w-auto"
                >
                  <Play className="mr-2 h-4 w-4" />
                  View Dashboard
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-16 grid grid-cols-3 gap-8"
            >
              {[
                { value: "Role-Based", label: "Access Control" },
                { value: "Real-Time", label: "Collaboration" },
                { value: "Full", label: "Task Tracking" },
              ].map((stat) => (
                <div key={stat.label} className="text-center lg:text-left">
                  <div className="text-2xl font-bold text-foreground sm:text-3xl">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Content - Dashboard Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative"
          >
            <div className="glass glow relative overflow-hidden rounded-2xl p-6">
              {/* Dashboard Header */}
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Dashboard Overview</h3>
                  <p className="text-sm text-muted-foreground">Welcome back, Alex</p>
                </div>
                <div className="flex gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500" />
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                </div>
              </div>

              {/* Stats Grid */}
              <div className="mb-6 grid grid-cols-2 gap-4">
                {[
                  { icon: CheckCircle2, label: "Completed", value: "128", color: "text-green-400" },
                  { icon: Clock, label: "Pending", value: "24", color: "text-yellow-400" },
                  { icon: Users, label: "Team Members", value: "12", color: "text-blue-400" },
                  { icon: BarChart3, label: "Projects", value: "8", color: "text-purple-400" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-xl bg-secondary/50 p-4"
                  >
                    <item.icon className={`mb-2 h-5 w-5 ${item.color}`} />
                    <div className="text-2xl font-bold text-foreground">{item.value}</div>
                    <div className="text-xs text-muted-foreground">{item.label}</div>
                  </div>
                ))}
              </div>

              {/* Progress Chart Mockup */}
              <div className="rounded-xl bg-secondary/50 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">Weekly Progress</span>
                  <span className="text-xs text-muted-foreground">This Week</span>
                </div>
                <div className="flex items-end gap-2">
                  {[40, 65, 45, 80, 55, 90, 70].map((height, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t bg-gradient-to-t from-primary to-accent"
                      style={{ height: `${height}px` }}
                    />
                  ))}
                </div>
                <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                  <span>Sun</span>
                </div>
              </div>
            </div>

            {/* Floating elements */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              className="glass absolute -right-4 top-8 rounded-xl p-3"
            >
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/20">
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                </div>
                <div>
                  <div className="text-xs font-medium text-foreground">Task completed!</div>
                  <div className="text-xs text-muted-foreground">Just now</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 }}
              className="glass absolute -left-4 bottom-12 rounded-xl p-3"
            >
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-6 w-6 rounded-full border-2 border-card bg-gradient-to-br from-primary to-accent"
                    />
                  ))}
                </div>
                <div className="text-xs text-muted-foreground">+5 team members online</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
