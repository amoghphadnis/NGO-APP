import { router } from 'expo-router';

const PMANAGER_ROLES = ['Program Manager', 'Admin', 'Admin(CEO)'];

/**
 * Navigate an authenticated user to the appropriate dashboard based on role.
 *
 * - Volunteer → /dashboard
 * - Program Manager / Admin / Admin(CEO) → /pdashboard
 * - Fallback → /dashboard
 */
export function navigateToDashboard(role?: string): void {
  const route = (role && PMANAGER_ROLES.includes(role)) ? '/pdashboard' : '/dashboard';
  router.replace(route as any);
}

/**
 * Safely navigates back if there is a history stack; otherwise replaces with a fallback route.
 * Prevents "The action 'GO_BACK' was not handled by any navigator" error on direct/refreshed visits.
 */
export function safeGoBack(fallbackRoute: string = '/pdashboard'): void {
  if (router.canGoBack()) {
    router.back();
  } else {
    router.replace(fallbackRoute as any);
  }
}
