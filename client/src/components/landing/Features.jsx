import { motion } from "framer-motion";
import {
  Shield,
  FolderKanban,
  UserCheck,
  LineChart,
  Bell,
  Sparkles,
} from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Role-Based Access",
    description:
      "Granular permissions for admins and members. Control who can view, edit, or manage projects and tasks.",
  },
  {
    icon: FolderKanban,
    title: "Project & Team Management",
    description:
      "Create projects, organize teams, and collaborate seamlessly across your organization.",
  },
  {
    icon: UserCheck,
    title: "Task Assignment",
    description:
      "Assign tasks to team members with due dates, priorities, and automatic notifications.",
  },
  {
    icon: LineChart,
    title: "Progress Tracking Dashboard",
    description:
      "Visual dashboards showing task progress, bottlenecks, and team performance metrics.",
  },
  {
    icon: Bell,
    title: "Overdue Alerts",
    description:
      "Never miss a deadline. Get instant notifications for approaching and overdue tasks.",
  },
  {
    icon: Sparkles,
    title: "Activity Insights",
    description:
      "Track team activity, identify trends, and monitor workflow efficiency across projects.",
  },
];

export function Features() {
  return (
    <section id="features" className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <span className="mb-4 inline-block rounded-full border border-border bg-secondary/50 px-4 py-1.5 text-sm text-muted-foreground">
            Features
          </span>
          <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
            Everything you need to{" "}
            <span className="gradient-text">manage your team</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Powerful features designed to streamline your workflow and boost productivity across your organization.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 transition-opacity group-hover:opacity-100" />

              <div className="relative">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/20">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>

                <h3 className="mb-2 text-xl font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
