const DISTRICT_SCOPED_ROLES = ['Volunteer', 'Branch Executives'] as const;

const PAYANA_CREATOR_ROLES = ['Program Manager', 'Branch Executives'] as const;

const VOLUNTEER_ASSIGNMENT_ROLES = ['Program Manager', 'Branch Executives'] as const;

const APPROVER_ROLES = ['Program Manager', 'Branch Executives'] as const;

const USER_MANAGEMENT_ROLES = ['Program Manager', 'Admin', 'Admin(CEO)'] as const;

const ASSIGN_ROLE_ROLES = ['Admin', 'Admin(CEO)'] as const;

const SETTINGS_ROLES = ['Program Manager', 'Admin', 'Admin(CEO)'] as const;

const DONOR_ROLES = ['Program Manager'] as const;

const ADMIN_ROLES = ['Admin', 'Admin(CEO)'] as const;

function hasRole(roles: readonly string[], role?: string): boolean {
  if (!role) return false;
  return roles.some((r) => r.toLowerCase() === role.toLowerCase());
}

export function isDistrictScopedRole(role: string): boolean {
  return (DISTRICT_SCOPED_ROLES as readonly string[]).includes(role);
}

export function canCreatePayana(role?: string): boolean {
  return hasRole(PAYANA_CREATOR_ROLES, role);
}

export function canAssignVolunteers(role?: string): boolean {
  return hasRole(VOLUNTEER_ASSIGNMENT_ROLES, role);
}

/** Roles that can open approval / house-visit / renewal grids. */
export function canViewApprovals(role?: string): boolean {
  return hasRole(APPROVER_ROLES, role);
}

/** Roles that can take Approve / Reject actions inside those grids. */
export function canApproveReject(role?: string): boolean {
  return hasRole(APPROVER_ROLES, role);
}

/** @deprecated Use canApproveReject — kept for existing call sites. */
export function canApprove(role?: string): boolean {
  return canApproveReject(role);
}

/** Manage registered users (activate, edit, delete). */
export function canManageUsers(role?: string): boolean {
  return hasRole(USER_MANAGEMENT_ROLES, role);
}

/** Assign roles to users — Admin-only in the web portal. */
export function canAssignRoles(role?: string): boolean {
  return hasRole(ASSIGN_ROLE_ROLES, role);
}

/** Application settings: Update Last Date, Semi Professional Courses. */
export function canManageSettings(role?: string): boolean {
  return hasRole(SETTINGS_ROLES, role);
}

/** Donor management — Program Manager only in the web portal. */
export function canViewDonors(role?: string): boolean {
  return hasRole(DONOR_ROLES, role);
}

/** Admin-side users whose web menu contains only admin functions. */
export function isAdminRole(role?: string): boolean {
  return hasRole(ADMIN_ROLES, role);
}
