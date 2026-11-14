import RequireAuthentication from '@/components/auth/RequireAuthentication';
import UserManagementScreen from '@/screens/admin/UserManagementScreen';

export default function AdminUsersRoute() {
  return (
    <RequireAuthentication>
      <UserManagementScreen />
    </RequireAuthentication>
  );
}
