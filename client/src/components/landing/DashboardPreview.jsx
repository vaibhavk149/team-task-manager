import { motion } from "framer-motion";
import {
  Folder,
  Clock,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Users,
  BarChart3,
} from "lucide-react";

export function DashboardPreview() {
  return (
    <section id="dashboard" className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <span className="mb-4 inline-block rounded-full border border-border bg-secondary/50 px-4 py-1.5 text-sm text-muted-foreground">
            Dashboard
          </span>
          <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
            Beautiful analytics{" "}
            <span className="gradient-text">at a glance</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Get a comprehensive view of your team&apos;s productivity with our intuitive dashboard.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass glow relative overflow-hidden rounded-3xl p-8"
        >
          {/* Dashboard Header */}
          <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h3 className="text-2xl font-bold text-foreground">Analytics Dashboard</h3>
              <p className="text-muted-foreground">Overview of all projects and tasks</p>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-secondary/50 px-4 py-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              Last updated: Just now
            </div>
          </div>

          {/* Stats Cards */}
          <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[
              {
                icon: Folder,
                label: "Total Projects",
                value: "24",
                trend: "+12%",
                color: "from-blue-500 to-blue-600",
              },
              {
                icon: Clock,
                label: "Pending Tasks",
                value: "156",
                trend: "-8%",
                color: "from-yellow-500 to-orange-500",
              },
              {
                icon: CheckCircle2,
                label: "Completed",
                value: "1,284",
                trend: "+24%",
                color: "from-green-500 to-emerald-500",
              },
              {
                icon: AlertTriangle,
                label: "Overdue",
                value: "12",
                trend: "-45%",
                color: "from-red-500 to-rose-500",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-border bg-card/50 p-4"
              >
                <div className="mb-3 flex items-center justify-between">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${stat.color}`}
                  >
                    <stat.icon className="h-5 w-5 text-white" />
                  </div>
                  <span className="flex items-center gap-1 text-xs text-green-400">
                    <TrendingUp className="h-3 w-3" />
                    {stat.trend}
                  </span>
                </div>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Bar Chart */}
            <div className="rounded-xl border border-border bg-card/50 p-6">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  <span className="font-semibold text-foreground">Task Completion</span>
                </div>
                <span className="text-sm text-muted-foreground">This month</span>
              </div>
              <div className="flex h-48 items-end justify-between gap-3">
                {[
                  { label: "Week 1", value: 65 },
                  { label: "Week 2", value: 85 },
                  { label: "Week 3", value: 55 },
                  { label: "Week 4", value: 92 },
                ].map((bar) => (
                  <div key={bar.label} className="flex flex-1 flex-col items-center gap-2">
                    <div
                      className="w-full rounded-t-lg bg-gradient-to-t from-primary to-accent transition-all"
                      style={{ height: `${bar.value * 1.5}px` }}
                    />
                    <span className="text-xs text-muted-foreground">{bar.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Team Activity */}
            <div className="rounded-xl border border-border bg-card/50 p-6">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <span className="font-semibold text-foreground">Team Activity</span>
                </div>
                <span className="text-sm text-muted-foreground">Live</span>
              </div>
              <div className="space-y-4">
                {[
                  { name: "Sarah Johnson", tasks: 24, avatar: "S" },
                  { name: "Mike Chen", tasks: 19, avatar: "M" },
                  { name: "Emily Davis", tasks: 16, avatar: "E" },
                  { name: "Alex Rivera", tasks: 14, avatar: "A" },
                ].map((member, index) => (
                  <div key={member.name} className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-sm font-semibold text-white">
                      {member.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">
                          {member.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {member.tasks} tasks
                        </span>
                      </div>
                      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-secondary">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                          style={{ width: `${(member.tasks / 24) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
