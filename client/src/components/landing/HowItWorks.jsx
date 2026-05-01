import { motion } from "framer-motion";
import { Users, ClipboardList, LineChart } from "lucide-react";

const steps = [
  {
    icon: Users,
    step: "01",
    title: "Create Your Team",
    description:
      "Invite team members, set up roles and permissions, and organize your workspace in minutes.",
  },
  {
    icon: ClipboardList,
    step: "02",
    title: "Assign Work",
    description:
      "Create projects, break them into tasks, assign to team members with deadlines and priorities.",
  },
  {
    icon: LineChart,
    step: "03",
    title: "Track Progress",
    description:
      "Monitor real-time updates, view analytics dashboards, and celebrate completed milestones.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <span className="mb-4 inline-block rounded-full border border-border bg-secondary/50 px-4 py-1.5 text-sm text-muted-foreground">
            How It Works
          </span>
          <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
            Get started in{" "}
            <span className="gradient-text">three simple steps</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            From setup to productivity in minutes. No complex onboarding required.
          </p>
        </motion.div>

        <div className="relative">
          {/* Connection line */}
          <div className="absolute left-1/2 top-16 hidden h-0.5 w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-border to-transparent lg:block" />

          <div className="grid gap-8 lg:grid-cols-3">
            {steps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative text-center"
              >
                {/* Step number badge */}
                <div className="relative mx-auto mb-6">
                  <div className="relative z-10 mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/25">
                    <step.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-sm font-bold text-background">
                    {step.step}
                  </div>
                </div>

                <h3 className="mb-3 text-xl font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="text-muted-foreground">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
