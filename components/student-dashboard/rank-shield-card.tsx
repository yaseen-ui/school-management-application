"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export interface RankShieldCardProps {
  rank: number | null
  cohortSize?: number | null
  className?: string
}

type ShieldTheme = {
  title: string
  subtitle: string
  /** Outer shield gradient */
  shieldFrom: string
  shieldTo: string
  /** Inner plate */
  plateFrom: string
  plateTo: string
  rim: string
  text: string
  glow: string
  ribbon: string
  badge: string
}

/** Ranks 1–10 mapped to shield / appraisal themes */
const RANK_THEMES: Record<number, ShieldTheme> = {
  1: {
    title: "Champion",
    subtitle: "Gold Shield",
    shieldFrom: "#fbbf24",
    shieldTo: "#b45309",
    plateFrom: "#fde68a",
    plateTo: "#f59e0b",
    rim: "#fff7ed",
    text: "#78350f",
    glow: "rgba(245,158,11,0.55)",
    ribbon: "from-amber-400 via-yellow-300 to-amber-500",
    badge: "bg-amber-500/15 text-amber-800 dark:text-amber-200",
  },
  2: {
    title: "Silver Guard",
    subtitle: "Silver Shield",
    shieldFrom: "#e2e8f0",
    shieldTo: "#64748b",
    plateFrom: "#f8fafc",
    plateTo: "#94a3b8",
    rim: "#f1f5f9",
    text: "#334155",
    glow: "rgba(148,163,184,0.5)",
    ribbon: "from-slate-300 via-slate-100 to-slate-400",
    badge: "bg-slate-500/15 text-slate-700 dark:text-slate-200",
  },
  3: {
    title: "Bronze Valor",
    subtitle: "Bronze Shield",
    shieldFrom: "#fdba74",
    shieldTo: "#9a3412",
    plateFrom: "#fed7aa",
    plateTo: "#c2410c",
    rim: "#ffedd5",
    text: "#7c2d12",
    glow: "rgba(234,88,12,0.45)",
    ribbon: "from-orange-400 via-amber-300 to-orange-600",
    badge: "bg-orange-500/15 text-orange-800 dark:text-orange-200",
  },
  4: {
    title: "Elite",
    subtitle: "Sapphire Shield",
    shieldFrom: "#60a5fa",
    shieldTo: "#1d4ed8",
    plateFrom: "#93c5fd",
    plateTo: "#2563eb",
    rim: "#dbeafe",
    text: "#1e3a8a",
    glow: "rgba(37,99,235,0.45)",
    ribbon: "from-blue-400 via-sky-300 to-blue-600",
    badge: "bg-blue-500/15 text-blue-800 dark:text-blue-200",
  },
  5: {
    title: "Vanguard",
    subtitle: "Emerald Shield",
    shieldFrom: "#34d399",
    shieldTo: "#047857",
    plateFrom: "#6ee7b7",
    plateTo: "#059669",
    rim: "#d1fae5",
    text: "#064e3b",
    glow: "rgba(16,185,129,0.45)",
    ribbon: "from-emerald-400 via-teal-300 to-emerald-600",
    badge: "bg-emerald-500/15 text-emerald-800 dark:text-emerald-200",
  },
  6: {
    title: "Rising Star",
    subtitle: "Amethyst Shield",
    shieldFrom: "#c084fc",
    shieldTo: "#6d28d9",
    plateFrom: "#d8b4fe",
    plateTo: "#7c3aed",
    rim: "#ede9fe",
    text: "#4c1d95",
    glow: "rgba(124,58,237,0.45)",
    ribbon: "from-violet-400 via-purple-300 to-violet-600",
    badge: "bg-violet-500/15 text-violet-800 dark:text-violet-200",
  },
  7: {
    title: "Pathfinder",
    subtitle: "Ruby Shield",
    shieldFrom: "#f472b6",
    shieldTo: "#be123c",
    plateFrom: "#f9a8d4",
    plateTo: "#e11d48",
    rim: "#ffe4e6",
    text: "#881337",
    glow: "rgba(225,29,72,0.4)",
    ribbon: "from-rose-400 via-pink-300 to-rose-600",
    badge: "bg-rose-500/15 text-rose-800 dark:text-rose-200",
  },
  8: {
    title: "Achiever",
    subtitle: "Teal Shield",
    shieldFrom: "#2dd4bf",
    shieldTo: "#0f766e",
    plateFrom: "#5eead4",
    plateTo: "#0d9488",
    rim: "#ccfbf1",
    text: "#134e4a",
    glow: "rgba(13,148,136,0.4)",
    ribbon: "from-teal-400 via-cyan-300 to-teal-600",
    badge: "bg-teal-500/15 text-teal-800 dark:text-teal-200",
  },
  9: {
    title: "Contender",
    subtitle: "Indigo Shield",
    shieldFrom: "#818cf8",
    shieldTo: "#3730a3",
    plateFrom: "#a5b4fc",
    plateTo: "#4f46e5",
    rim: "#e0e7ff",
    text: "#312e81",
    glow: "rgba(79,70,229,0.4)",
    ribbon: "from-indigo-400 via-indigo-300 to-indigo-600",
    badge: "bg-indigo-500/15 text-indigo-800 dark:text-indigo-200",
  },
  10: {
    title: "Top Ten",
    subtitle: "Crystal Shield",
    shieldFrom: "#22d3ee",
    shieldTo: "#0e7490",
    plateFrom: "#67e8f9",
    plateTo: "#0891b2",
    rim: "#cffafe",
    text: "#164e63",
    glow: "rgba(8,145,178,0.4)",
    ribbon: "from-cyan-400 via-sky-300 to-cyan-600",
    badge: "bg-cyan-500/15 text-cyan-800 dark:text-cyan-200",
  },
}

const HONORABLE: ShieldTheme = {
  title: "Honorable",
  subtitle: "Section rank",
  shieldFrom: "#94a3b8",
  shieldTo: "#475569",
  plateFrom: "#cbd5e1",
  plateTo: "#64748b",
  rim: "#e2e8f0",
  text: "#1e293b",
  glow: "rgba(100,116,139,0.35)",
  ribbon: "from-slate-400 via-slate-200 to-slate-500",
  badge: "bg-muted text-muted-foreground",
}

function ordinal(n: number) {
  const j = n % 10
  const k = n % 100
  if (j === 1 && k !== 11) return `${n}st`
  if (j === 2 && k !== 12) return `${n}nd`
  if (j === 3 && k !== 13) return `${n}rd`
  return `${n}th`
}

function ShieldGraphic({
  rank,
  theme,
  size = 88,
}: {
  rank: number
  theme: ShieldTheme
  size?: number
}) {
  const id = `shield-${rank}-${size}`
  return (
    <svg
      width={size}
      height={size * 1.15}
      viewBox="0 0 100 115"
      className="drop-shadow-lg"
      aria-hidden
    >
      <defs>
        <linearGradient id={`${id}-outer`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={theme.shieldFrom} />
          <stop offset="100%" stopColor={theme.shieldTo} />
        </linearGradient>
        <linearGradient id={`${id}-inner`} x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor={theme.plateFrom} />
          <stop offset="100%" stopColor={theme.plateTo} />
        </linearGradient>
        <filter id={`${id}-glow`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Soft glow */}
      <ellipse cx="50" cy="108" rx="28" ry="5" fill={theme.glow} opacity="0.55" />

      {/* Outer shield body */}
      <path
        d="M50 4
           C68 4 88 12 92 22
           C92 55 82 78 50 110
           C18 78 8 55 8 22
           C12 12 32 4 50 4 Z"
        fill={`url(#${id}-outer)`}
        stroke={theme.rim}
        strokeWidth="2.5"
        filter={`url(#${id}-glow)`}
      />

      {/* Inner plate */}
      <path
        d="M50 14
           C64 14 78 20 81 28
           C81 54 73 72 50 98
           C27 72 19 54 19 28
           C22 20 36 14 50 14 Z"
        fill={`url(#${id}-inner)`}
        opacity="0.95"
      />

      {/* Crest flourish */}
      <path
        d="M50 22 C58 28 62 36 62 46 C62 58 56 66 50 72 C44 66 38 58 38 46 C38 36 42 28 50 22 Z"
        fill={theme.rim}
        opacity="0.22"
      />

      {/* Rank number */}
      <text
        x="50"
        y="58"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={rank >= 10 ? "28" : "34"}
        fontWeight="800"
        fill={theme.text}
        style={{ fontFamily: "system-ui, sans-serif" }}
      >
        {rank}
      </text>
    </svg>
  )
}

export function RankShieldCard({ rank, cohortSize, className }: RankShieldCardProps) {
  if (rank == null || rank < 1) {
    return (
      <div
        className={cn(
          "flex min-w-[140px] flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-muted/20 px-4 py-5 text-center",
          className,
        )}
      >
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Rank
        </p>
        <p className="mt-2 text-sm text-muted-foreground">Not ranked yet</p>
      </div>
    )
  }

  const theme = rank <= 10 ? RANK_THEMES[rank] : HONORABLE
  const displayRank = rank

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
      className={cn(
        "relative flex min-w-[150px] flex-col items-center overflow-hidden rounded-2xl border border-border/50 px-4 py-4 text-center shadow-sm",
        "bg-gradient-to-b from-background via-card to-muted/30",
        className,
      )}
      style={{ boxShadow: `0 12px 40px -18px ${theme.glow}` }}
    >
      {/* Ribbon */}
      <div
        className={cn(
          "absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r",
          theme.ribbon,
        )}
      />

      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        Class rank
      </p>

      <div className="mt-1.5">
        <ShieldGraphic rank={displayRank} theme={theme} size={86} />
      </div>

      <div className="mt-1 space-y-0.5">
        <p className="text-lg font-bold tracking-tight text-foreground">
          {ordinal(displayRank)}
        </p>
        <span
          className={cn(
            "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
            theme.badge,
          )}
        >
          {theme.title}
        </span>
        <p className="text-[10px] text-muted-foreground">{theme.subtitle}</p>
      </div>

      {cohortSize != null && cohortSize > 0 && (
        <p className="mt-2 text-[11px] text-muted-foreground">
          of {cohortSize} student{cohortSize === 1 ? "" : "s"}
        </p>
      )}
    </motion.div>
  )
}
