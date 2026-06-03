const DISTRICT_SCOPED_ROLES = ['Volunteer', 'Branch Executives'] as const;

export function isDistrictScopedRole(role: string): boolean {
  return (DISTRICT_SCOPED_ROLES as readonly string[]).includes(role);
}
