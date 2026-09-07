const DISTRICT_SCOPED_ROLES = ['Volunteer', 'Branch Executives'] as const;

const PAYANA_CREATOR_ROLES = ['Program Manager', 'Admin', 'Admin(CEO)', 'Branch Executives'] as const;

const VOLUNTEER_ASSIGNMENT_ROLES = ['Program Manager', 'Admin', 'Admin(CEO)', 'Branch Executives'] as const;

const APPROVAL_ROLES = ['Program Manager', 'Admin', 'Admin(CEO)'] as const;

export function isDistrictScopedRole(role: string): boolean {
  return (DISTRICT_SCOPED_ROLES as readonly string[]).includes(role);
}

export function canCreatePayana(role?: string): boolean {
  return PAYANA_CREATOR_ROLES.includes(role as any);
}

export function canAssignVolunteers(role?: string): boolean {
  return VOLUNTEER_ASSIGNMENT_ROLES.includes(role as any);
}

export function canApprove(role?: string): boolean {
  return APPROVAL_ROLES.includes(role as any);
}
