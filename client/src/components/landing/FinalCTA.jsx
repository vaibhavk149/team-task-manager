import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { FiGithub } from "react-icons/fi";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";

export function FinalCTA() {
  return (
    <section className="relative py-24">
      {/* Background gradient */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-primary/20 via-accent/10 to-transparent blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="mb-6 text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
            Ready to{" "}
            <span className="gradient-text">Get Started?</span>
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
            Explore the dashboard, manage your tasks, and collaborate with your team using Team Task Manager.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/signup" style={{width: '100%', maxWidth: '200px'}}>
              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-primary to-accent text-white hover:opacity-90"
              >
                Launch App
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" style={{width: '100%', maxWidth: '200px'}}>
              <Button
                size="lg"
                variant="outline"
                className="w-full border-border bg-transparent hover:bg-secondary"
              >
                <FiGithub className="mr-2 h-4 w-4" />
                GitHub Repo
              </Button>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
