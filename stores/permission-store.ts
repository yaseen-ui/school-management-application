import { create } from 'zustand';
import { apiClient } from '@/lib/api/client';
import type { ApiResponse } from '@/lib/api/types';

// ─────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────

interface RoleInfo {
  id: string;
  name: string;
}

interface AuthContextResponse {
  user: {
    userId: string;
    email: string;
    fullName: string | null;
    tenantId: string;
    userType: string;
  };
  roles: RoleInfo[];
  groups: string[];
  permissions: string[];
  scopes: {
    sections: string[] | null;
    students: string[] | null;
    subjects: string[] | null;
    enrollments: string[] | null;
    transport: string[] | null;
  };
}

interface PermissionState {
  roles: RoleInfo[];
  groups: string[];
  permissions: Set<string>;
  scopes: AuthContextResponse['scopes'] | null;
  isLoaded: boolean;
  isLoading: boolean;
  error: string | null;

  // Check methods
  hasPermission: (code: string) => boolean;
  hasAnyPermission: (codes: string[]) => boolean;
  hasAllPermissions: (codes: string[]) => boolean;

  // Scope checks
  canAccessSection: (sectionId: string) => boolean;
  canAccessStudent: (studentId: string) => boolean;
  canAccessSubject: (subjectId: string) => boolean;
  canAccessEnrollment: (enrollmentId: string) => boolean;
  canAccessTransport: (transportId: string) => boolean;

  // Lifecycle
  load: () => Promise<void>;
  reset: () => void;
}

// ─────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────

function hasPermissionImpl(permissions: Set<string>, code: string): boolean {
  if (!permissions || permissions.size === 0) return false;
  if (!code) return false;

  // Super admin bypass
  if (permissions.has('admin:super')) return true;

  // Exact match
  if (permissions.has(code)) return true;

  // Module wildcard: "students:*"
  const parts = code.split(':');
  const module = parts[0];
  if (permissions.has(`${module}:*`)) return true;

  // Scoped permission grants base: "attendance:mark:section" → "attendance:mark"
  const action = parts.length >= 2 ? parts[1] : null;
  if (action) {
    const basePrefix = `${module}:${action}:`;
    for (const perm of permissions) {
      if (perm.startsWith(basePrefix)) return true;
    }
  }

  return false;
}

function canAccessImpl(resourceSet: string[] | null | undefined, id: string): boolean {
  if (resourceSet === null || resourceSet === undefined) return true; // unrestricted
  if (!Array.isArray(resourceSet)) return true;
  return resourceSet.includes(id);
}

// ─────────────────────────────────────────────────────────────────────
// Store
// ─────────────────────────────────────────────────────────────────────

export const usePermissionStore = create<PermissionState>()((set, get) => ({
  roles: [],
  groups: [],
  permissions: new Set(),
  scopes: null,
  isLoaded: false,
  isLoading: false,
  error: null,

  hasPermission: (code: string) => {
    return hasPermissionImpl(get().permissions, code);
  },

  hasAnyPermission: (codes: string[]) => {
    return codes.some((code) => hasPermissionImpl(get().permissions, code));
  },

  hasAllPermissions: (codes: string[]) => {
    return codes.every((code) => hasPermissionImpl(get().permissions, code));
  },

  canAccessSection: (sectionId: string) => {
    const scopes = get().scopes;
    return canAccessImpl(scopes?.sections, sectionId);
  },

  canAccessStudent: (studentId: string) => {
    const scopes = get().scopes;
    return canAccessImpl(scopes?.students, studentId);
  },

  canAccessSubject: (subjectId: string) => {
    const scopes = get().scopes;
    return canAccessImpl(scopes?.subjects, subjectId);
  },

  canAccessEnrollment: (enrollmentId: string) => {
    const scopes = get().scopes;
    return canAccessImpl(scopes?.enrollments, enrollmentId);
  },

  canAccessTransport: (transportId: string) => {
    const scopes = get().scopes;
    return canAccessImpl(scopes?.transport, transportId);
  },

  load: async () => {
    if (get().isLoading) return;
    set({ isLoading: true, error: null });

    try {
      const response = await apiClient.get<ApiResponse<AuthContextResponse>>('/auth/permissions');

      if (response.status === 'success' && response.data) {
        set({
          roles: response.data.roles ?? [],
          groups: response.data.groups ?? [],
          permissions: new Set(response.data.permissions ?? []),
          scopes: response.data.scopes ?? null,
          isLoaded: true,
          isLoading: false,
          error: null,
        });
      } else {
        throw new Error(response.message || 'Failed to load permissions');
      }
    } catch (error) {
      console.error('[PermissionStore] Failed to load permissions:', error);
      set({
        isLoaded: true, // Mark as loaded so UI can render with defaults
        isLoading: false,
        error: (error as Error).message ?? 'Failed to load permissions',
      });
    }
  },

  reset: () => {
    set({
      roles: [],
      groups: [],
      permissions: new Set(),
      scopes: null,
      isLoaded: false,
      isLoading: false,
      error: null,
    });
  },
}));