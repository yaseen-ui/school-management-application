"use client";

import { motion } from "framer-motion";
import {
  GraduationCap,
  FileText,
  DollarSign,
  ClipboardCheck,
  Users,
  Bus,
  Calendar,
  BookOpen,
  ArrowRight,
  Sparkles,
} from "lucide-react";

interface ZaiWelcomeProps {
  onQuestionClick: (question: string) => void;
}

const SUGGESTED_PROMPTS = [
  {
    icon: GraduationCap,
    label: "Students",
    question: "Show me students from section A with 90% in quarterly exams",
    color: "text-blue-500 bg-blue-500/10",
  },
  {
    icon: FileText,
    label: "Exams",
    question: "List all quarterly exams and their scheduled dates",
    color: "text-amber-500 bg-amber-500/10",
  },
  {
    icon: DollarSign,
    label: "Fees",
    question: "Show fee payments above 5000 collected this month",
    color: "text-green-500 bg-green-500/10",
  },
  {
    icon: ClipboardCheck,
    label: "Attendance",
    question: "Count how many students are present today",
    color: "text-purple-500 bg-purple-500/10",
  },
  {
    icon: Users,
    label: "Teachers",
    question: "Show teachers assigned to class 10 section B",
    color: "text-rose-500 bg-rose-500/10",
  },
  {
    icon: BookOpen,
    label: "Courses",
    question: "How many students are enrolled in each grade?",
    color: "text-cyan-500 bg-cyan-500/10",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function ZaiWelcome({ onQuestionClick }: ZaiWelcomeProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-full px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center mb-10"
      >
        {/* Animated gradient orb */}
        <div className="relative mb-6">
          <div
            className="absolute -inset-8 rounded-full opacity-20 animate-pulse"
            style={{
              background:
                "radial-gradient(circle, var(--primary), var(--gradient-mid), transparent 70%)",
              animationDuration: "4s",
            }}
          />
          <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-[0_8px_32px_-8px_var(--primary)]">
            <Sparkles className="h-8 w-8 text-primary-foreground" />
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold mb-2 gradient-text">
          Hi, I'm ZAI
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base text-center max-w-md">
          Your AI-powered school assistant. Ask me anything about your data —
          students, exams, fees, attendance, and more.
        </p>
      </motion.div>

      {/* Suggested prompts */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="w-full max-w-2xl"
      >
        <p className="text-xs font-medium text-muted-foreground/60 uppercase tracking-wider mb-4 text-center">
          Try asking
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SUGGESTED_PROMPTS.map((prompt, i) => (
            <motion.button
              key={i}
              variants={item}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onQuestionClick(prompt.question)}
              className="flex items-start gap-3 p-4 rounded-xl border border-border/50 
                bg-card/50 backdrop-blur-sm hover:bg-card hover:border-border 
                hover:shadow-md transition-all duration-200 text-left group"
            >
              <div className={`p-2 rounded-lg ${prompt.color} flex-shrink-0`}>
                <prompt.icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium mb-1 text-foreground/80">
                  {prompt.label}
                </p>
                <p className="text-sm text-muted-foreground line-clamp-2 group-hover:text-foreground/70 transition-colors">
                  {prompt.question}
                </p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Footer tips */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-10 flex flex-wrap justify-center gap-3"
      >
        {[
          "Ask in plain English",
          "No need to know table names",
          "Get real-time data from your DB",
        ].map((tip) => (
          <span
            key={tip}
            className="px-3 py-1.5 rounded-full bg-muted/50 text-xs text-muted-foreground 
              border border-border/30"
          >
            {tip}
          </span>
        ))}
      </motion.div>
    </div>
  );
}