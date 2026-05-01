import { motion } from "framer-motion";
import { Zap, Target, Settings, Users } from "lucide-react";

const reasons = [
  {
    icon: Zap,
    title: "Faster Collaboration",
    description:
      "Updates and notifications keep your team in sync, reducing communication delays.",
  },
  {
    icon: Target,
    title: "Better Accountability",
    description:
      "Clear task ownership, deadline tracking, and progress visibility ensure everyone stays responsible.",
  },
  {
    icon: Settings,
    title: "Easy Management",
    description:
      "Intuitive interface designed for efficiency. Get your team up and running quickly.",
  },
  {
    icon: Users,
    title: "Admin & Member Workflow",
    description:
      "Different views and permissions for admins and team members to streamline workflows.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="border-y border-border bg-secondary/30 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="mb-4 inline-block rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground">
              Why TaskFlow
            </span>
            <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
              Built for teams who{" "}
              <span className="gradient-text">work together</span>
            </h2>
            <p className="mb-8 text-lg text-muted-foreground">
              We&apos;ve focused on the essentials to create an effective team task management platform.
            </p>

            <div className="grid gap-6 sm:grid-cols-2">
              {reasons.map((reason, index) => (
                <motion.div
                  key={reason.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/20">
                    <reason.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold text-foreground">
                      {reason.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {reason.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Admin/Member Workflow visualization */}
            <div className="glass glow rounded-2xl p-8">
              <div className="mb-6 text-center">
                <h3 className="text-lg font-semibold text-foreground">
                  Role-Based Workflow
                </h3>
                <p className="text-sm text-muted-foreground">
                  Admin and Member capabilities
                </p>
              </div>

              <div className="space-y-6">
                {[
                  { label: "Create & Assign Tasks", value: "Admin", access: 100 },
                  { label: "View All Projects", value: "Admin", access: 100 },
                  { label: "Track Own Tasks", value: "Member", access: 80 },
                  { label: "Update Task Status", value: "Both", access: 100 },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {item.label}
                      </span>
                      <span className="rounded-full bg-primary/20 px-2 py-0.5 text-xs font-medium text-primary">
                        {item.value}
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-secondary">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${item.access}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4 border-t border-border pt-6">
                {[
                  { value: "Admin", label: "Full Control" },
                  { value: "Member", label: "Task Focus" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-xl font-bold text-foreground">
                      {stat.value}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
