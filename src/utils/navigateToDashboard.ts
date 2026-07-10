import { router } from 'expo-router';

const PMANAGER_ROLES = ['Program Manager', 'Admin', 'Admin(CEO)'];

/**
 * Navigate an authenticated user to the appropriate dashboard based on role.
 *
 * - Volunteer → /dashboard
 * - Program Manager / Admin / Admin(CEO) → /pdashboard
 * - Fallback → /dashboard
 */
export function navigateToDashboard(role: string): void {
  const route = PMANAGER_ROLES.includes(role) ? '/pdashboard' : '/dashboard';
  router.replace(route as any);
}
