/**
 * Shared route → permission map for frontend authorization (P2).
 *
 * - `view`  — page entry / nav visibility
 * - `create` / `edit` / `delete` — primary list actions
 * - `extra` — domain-specific actions (optional)
 *
 * Backend remains the authority; these codes must match
 * `lib/backend/rbac/permissions.js` and API Guard usage.
 */

export type RoutePermissionActions = {
  view: string
  create?: string
  edit?: string
  delete?: string
  /** Named extra actions for domain UIs */
  extra?: Record<string, string>
}

/**
 * Longest-prefix match wins. Paths without a trailing segment match exactly
 * or as a prefix of the current pathname.
 */
export const ROUTE_PERMISSIONS: Record<string, RoutePermissionActions> = {
  // Overview
  '/dashboard': { view: 'dashboard:view' },
  '/zai': { view: 'query-bot:ask' },

  // Company
  '/tenants': {
    view: 'tenants:read',
    create: 'tenants:write',
    edit: 'tenants:write',
    delete: 'tenants:write',
  },
  '/company-users': {
    view: 'users:read',
    create: 'users:write',
    edit: 'users:edit',
    delete: 'users:delete',
  },

  // Academic setup
  '/academic-years': {
    view: 'academic-years:read',
    create: 'academic-years:write',
    edit: 'academic-years:edit',
  },
  '/courses': {
    view: 'courses:read',
    create: 'courses:write',
    edit: 'courses:edit',
    delete: 'courses:delete',
  },
  '/grades': {
    view: 'grades:read',
    create: 'grades:write',
    edit: 'grades:edit',
    delete: 'grades:delete',
  },
  '/sections': {
    view: 'sections:read',
    create: 'sections:write',
    edit: 'sections:edit',
    delete: 'sections:delete',
  },
  '/subjects': {
    view: 'subjects:read',
    create: 'subjects:write',
    edit: 'subjects:edit',
    delete: 'subjects:delete',
  },
  '/section-subjects': {
    view: 'section-subjects:read',
    create: 'section-subjects:write',
    delete: 'section-subjects:delete',
  },
  '/staff-curriculum': { view: 'teachers:read' },

  // People
  '/students': {
    view: 'students:read',
    create: 'students:write',
    edit: 'students:edit',
    delete: 'students:delete',
  },
  '/parents': {
    view: 'parents:read',
    create: 'parents:write',
    edit: 'parents:edit',
  },
  '/teachers': {
    view: 'teachers:read',
    create: 'teachers:write',
    edit: 'teachers:edit',
    delete: 'teachers:delete',
  },
  '/staff-attendance': {
    view: 'staff-attendance:read',
    create: 'staff-attendance:mark',
    edit: 'staff-attendance:mark',
  },
  '/leave': {
    view: 'leave:read',
    create: 'leave:apply',
    edit: 'leave:apply',
    extra: { approve: 'leave:approve', manage: 'leave:manage' },
  },
  '/payroll': {
    view: 'payroll:read',
    create: 'payroll:process',
    edit: 'payroll:process',
  },

  // Attendance
  '/attendance': {
    view: 'attendance:read',
    create: 'attendance:mark',
    edit: 'attendance:mark',
  },

  // Timetable
  '/timetable': {
    view: 'timetable:read',
    create: 'timetable:write',
    edit: 'timetable:edit',
    delete: 'timetable:delete',
  },
  '/timetable-structures': {
    view: 'timetable-structures:read',
    create: 'timetable-structures:write',
    edit: 'timetable-structures:write',
  },
  '/timetable-periods': {
    view: 'timetable-periods:read',
    create: 'timetable-periods:write',
    edit: 'timetable-periods:write',
  },

  // Exams
  '/exams': {
    view: 'exams:read',
    create: 'exams:write',
    edit: 'exams:edit',
    delete: 'exams:delete',
  },
  '/exam-schedules': {
    view: 'exam-schedules:read',
    create: 'exam-schedules:write',
    edit: 'exam-schedules:edit',
    delete: 'exam-schedules:delete',
  },
  '/marks-entry': {
    view: 'marks:entry',
    create: 'marks:entry',
    edit: 'marks:entry',
  },
  '/results': {
    view: 'results:read',
    extra: { publish: 'results:publish', export: 'results:export' },
  },

  // Finance
  '/fee-heads': {
    view: 'fee-heads:read',
    create: 'fee-heads:write',
    edit: 'fee-heads:edit',
    delete: 'fee-heads:delete',
  },
  '/fee-terms': {
    view: 'fee-terms:read',
    create: 'fee-terms:write',
    edit: 'fee-terms:edit',
    delete: 'fee-terms:delete',
  },
  '/section-fees': {
    view: 'section-fees:read',
    create: 'section-fees:write',
    delete: 'section-fees:delete',
  },
  '/student-fees': {
    view: 'student-fees:read',
    create: 'student-fees:write',
    edit: 'student-fees:write',
  },
  '/fee-payments': {
    view: 'fee-payments:read',
    create: 'fee-payments:collect',
  },
  '/fee-refunds': {
    view: 'fee-refunds:read',
    create: 'fee-refunds:process',
  },
  '/accounts': {
    view: 'accounts:read',
    create: 'accounts:write',
    edit: 'accounts:edit',
  },

  // Store
  '/store': {
    view: 'store:read',
    create: 'store:write',
    edit: 'store:write',
    delete: 'store:write',
    extra: { order: 'store:order', process: 'store:process' },
  },

  // Transport
  '/transportation': {
    view: 'transport:read',
    create: 'transport:write',
    edit: 'transport:write',
    delete: 'transport:write',
    extra: { assign: 'transport:assign' },
  },
  '/transportation/assignments': {
    view: 'transport:assign',
    create: 'transport:assign',
    edit: 'transport:assign',
    delete: 'transport:assign',
  },

  // Hostel
  '/hostel': {
    view: 'hostel:read',
    create: 'hostel:manage',
    edit: 'hostel:manage',
    delete: 'hostel:manage',
  },
  '/hostel/allocations': {
    view: 'hostel:allocate',
    create: 'hostel:allocate',
    edit: 'hostel:allocate',
    delete: 'hostel:allocate',
  },
  '/hostel/staff': {
    view: 'hostel:read',
    create: 'hostel:assign-staff',
    edit: 'hostel:assign-staff',
    delete: 'hostel:assign-staff',
  },

  // Campus
  '/infrastructure': {
    view: 'infrastructure:read',
    create: 'infrastructure:write',
    edit: 'infrastructure:edit',
    delete: 'infrastructure:delete',
  },
  '/visitors': {
    view: 'visitors:read',
    create: 'visitors:write',
    edit: 'visitors:write',
    extra: { approve: 'visitors:approve', checkIn: 'visitors:check-in' },
  },
  '/holidays': {
    view: 'holidays:read',
    create: 'holidays:write',
    edit: 'holidays:edit',
    delete: 'holidays:delete',
  },
  '/holiday-categories': {
    view: 'holidays:read',
    create: 'holidays:write',
    edit: 'holidays:edit',
    delete: 'holidays:delete',
  },

  // Communication
  '/communications/notifications': {
    view: 'communication-notifications:read',
    create: 'communication-notifications:write',
  },
  '/communications/publications': {
    view: 'communication-publications:read',
    create: 'communication-publications:write',
    edit: 'communication-publications:write',
    delete: 'communication-publications:write',
    extra: { approve: 'communication-publications:approve' },
  },
  '/communications/automation': {
    view: 'communication-automation:manage',
    create: 'communication-automation:manage',
    edit: 'communication-automation:manage',
    delete: 'communication-automation:manage',
  },
  '/communications/automation/templates': {
    view: 'communication-templates:manage',
    create: 'communication-templates:manage',
    edit: 'communication-templates:manage',
    delete: 'communication-templates:manage',
  },
  '/communications/automation/channels': {
    view: 'communication-channels:manage',
    edit: 'communication-channels:manage',
  },

  // Identity
  '/users': {
    view: 'users:read',
    create: 'users:write',
    edit: 'users:edit',
    delete: 'users:delete',
  },
  '/roles': {
    view: 'roles:read',
    create: 'roles:write',
    edit: 'roles:edit',
    delete: 'roles:delete',
  },

  // System
  '/settings': {
    view: 'settings:read',
    edit: 'settings:write',
  },
  '/imports': {
    view: 'imports:execute',
    create: 'imports:execute',
  },

  // Parent portal (entire tree)
  '/parent-portal': {
    view: 'parent-portal:access',
  },
}

/**
 * Resolve permission actions for a pathname (longest matching prefix).
 */
export function getRoutePermissions(pathname: string | null | undefined): RoutePermissionActions | null {
  if (!pathname) return null
  // strip query/hash
  const path = pathname.split('?')[0].split('#')[0]
  if (!path || path === '/') return null

  // Exact match first
  if (ROUTE_PERMISSIONS[path]) return ROUTE_PERMISSIONS[path]

  // Longest prefix match
  let best: RoutePermissionActions | null = null
  let bestLen = -1
  for (const [prefix, actions] of Object.entries(ROUTE_PERMISSIONS)) {
    if (path === prefix || path.startsWith(prefix + '/')) {
      if (prefix.length > bestLen) {
        best = actions
        bestLen = prefix.length
      }
    }
  }
  return best
}

export function getViewPermission(pathname: string | null | undefined): string | null {
  return getRoutePermissions(pathname)?.view ?? null
}
