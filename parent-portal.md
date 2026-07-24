Absolutely. These parent pages need to be the crown jewel of the application — mobile-first, emotionally engaging, with rich animations and thoughtful micro-interactions that make parents feel connected to their children's education. Here's the full plan:

---

## Complete Implementation Plan

### Phase 1: Navigation Foundation

**`hooks/use-nav-groups.ts`** — Clean mapping hook with three nav profiles (`company`, `staff`, `parent`)

**`components/layout/sidebar-nav.tsx`** — Simplified to `const navGroups = useNavGroups()`, remove all inline arrays and misplaced "Parent Portal" from company nav

---

### Phase 2: Parent Dashboard (`/parent-portal`)

A visually stunning landing page that's the first thing parents see:

**Design Elements:**
- Hero banner with animated gradient wave background and greeting ("Good morning, Mrs. Sharma")
- Swipeable child selector pills (Framer Motion drag carousel) with child avatars
- Ring-shaped attendance donut chart per child with animated draw
- "Today at a Glance" — 3 animated stat cards (Attendance status, Next exam, Fee due)
- Recent announcements feed with staggered reveal + unread badge bounce
- Pull-to-refresh pattern (touch-friendly)

**Key Components:**
| Component | Description |
|---|---|
| `parent/child-selector.tsx` | Horizontal scrollable pill tabs for child switching |
| `parent/daily-overview.tsx` | Animated stat cards with gradient icons |
| `parent/announcement-feed.tsx` | Staggered list with badge animations |
| `parent/attendance-ring.tsx` | SVG donut chart with animated stroke-dashoffset |

---

### Phase 3: Child Attendance (`/parent-portal/attendance`)

**Design Elements:**
- Calendar heatmap (like GitHub contributions grid) showing attendance over the month — green for present, red for absent, amber for late
- Month selector with smooth fade transitions
- Day detail sheet (bottom sheet on mobile) showing time in/out
- Monthly summary card with percentage and trend arrow animation

**Key Components:**
| Component | Description |
|---|---|
| `parent/attendance-heatmap.tsx` | Color-coded month grid calendar |
| `parent/attendance-day-detail.tsx` | Slide-up bottom sheet with day info |
| `parent/attendance-summary-card.tsx` | Animated percentage with pulse ring |

---

### Phase 4: Results (`/parent-portal/results`)

**Design Elements:**
- Per-child report card with subject-wise grade pills
- Spider/radar chart for subject performance comparison (animated on mount)
- Grade badges with gradient fills (A+ = emerald glow, B = amber, etc.)
- Term selector tabs with sliding indicator
- "Download Report" FAB button with press animation
- Cumulative progress line chart (term-over-term)

**Key Components:**
| Component | Description |
|---|---|
| `parent/radar-chart.tsx` | Animated SVG radar for subject scores |
| `parent/grade-badge.tsx` | Gradient pill with grade letter |
| `parent/term-selector.tsx` | Animated tab bar |
| `parent/result-card.tsx` | Subject result row with progress bar |

---

### Phase 5: Fees (`/parent-portal/fees`)

**Design Elements:**
- Wallet-style card with total outstanding balance (gradient background, large number)
- Fee breakdown accordion per child with staggered expand animation
- Payment history timeline (vertical stepper with connected dots)
- "Pay Now" CTA button with shimmer/glow animation
- Due date countdown with urgency color shift (green → amber → red)
- Receipt download with confetti celebration animation

**Key Components:**
| Component | Description |
|---|---|
| `parent/fee-wallet-card.tsx` | Gradient hero card with balance |
| `parent/payment-timeline.tsx` | Vertical stepper with animations |
| `parent/due-countdown.tsx` | Color-shifting urgency indicator |
| `parent/shimmer-button.tsx` | Animated CTA button |

---

### Phase 6: Leave (`/parent-portal/leave`)

**Design Elements:**
- Leave status dashboard with status pill badges (Approved/Pending/Rejected with color)
- Apply leave form as modal/sheet with date range picker and reason
- Leave history list with status transitions animated
- Child selector at top to pick which child the leave is for

---

### Phase 7: Store & Communications

- **Store** — Order history cards, order status tracker (ordered → packed → delivered), re-order button
- **Communications** — Inbox with read/unread states, notification cards with sender avatar, pull-to-refresh

---

### Design System Consistency

All parent pages share:
```
- bg-ambient-glow background
- gradient-primary for CTAs
- gradient-text for hero headings
- glass + backdrop-blur for cards
- Framer Motion staggerChildren for lists
- 16px/14px typography scale (readable on mobile)
- Touch-friendly tap targets (min 44px)
- Smooth page transitions (AnimatePresence)
- Pull-to-refresh where applicable
```

### File Structure Summary

```
hooks/
└── use-nav-groups.ts                          # [NEW]

components/parent/
├── child-selector.tsx                         # [NEW]
├── daily-overview.tsx                         # [NEW]
├── announcement-feed.tsx                      # [NEW]
├── attendance-ring.tsx                        # [NEW]
├── attendance-heatmap.tsx                     # [NEW]
├── attendance-summary-card.tsx                # [NEW]
├── radar-chart.tsx                            # [NEW]
├── grade-badge.tsx                            # [NEW]
├── term-selector.tsx                          # [NEW]
├── result-card.tsx                            # [NEW]
├── fee-wallet-card.tsx                        # [NEW]
├── payment-timeline.tsx                       # [NEW]
├── due-countdown.tsx                          # [NEW]
├── shimmer-button.tsx                         # [NEW]
├── leave-status-badge.tsx                     # [NEW]
├── leave-child-selector.tsx                   # [NEW]
├── store-order-card.tsx                       # [NEW]
└── order-status-tracker.tsx                   # [NEW]

app/(dashboard)/parent-portal/
├── page.tsx                                   # [REWRITE] Enhanced dashboard
├── attendance/
│   └── page.tsx                               # [NEW]
├── results/
│   └── page.tsx                               # [NEW]
├── fees/
│   └── page.tsx                               # [NEW]
├── store/
│   └── page.tsx                               # [NEW]
├── leave/
│   ├── page.tsx                               # [NEW]
│   └── apply/
│       └── page.tsx                           # [NEW]
└── communications/
    └── page.tsx                               # [NEW]

app/api/parent/
├── children/route.ts                          # [NEW] Get linked children
├── attendance/route.ts                        # [NEW]
├── results/route.ts                           # [NEW]
├── fees/route.ts                              # [NEW]
├── store/orders/route.ts                      # [NEW]
├── leave/
│   ├── route.ts                               # [NEW] GET + POST
│   └── [id]/route.ts                          # [NEW]
└── communications/route.ts                    # [NEW]

lib/api/parent.ts                              # [NEW] Parent API client
hooks/use-parent-portal.ts                     # [NEW] Parent-specific hooks
```

---

This is a significant build. Want me to start implementing? I'd suggest we work in this order:

1. **Phase 1** — Nav hook + sidebar cleanup
2. **Phase 2** — Parent dashboard (hero page)
3. **Phase 3** — Attendance
4. **Phase 4** — Results  
5. **Phase 5** — Fees
6. **Phase 6 & 7** — Leave + Store + Communications

Shall I switch to Act mode and begin with Phase 1?