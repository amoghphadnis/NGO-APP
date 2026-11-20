import RequireAuthentication from '@/components/auth/RequireAuthentication';
import AssignRoleScreen from '@/screens/admin/AssignRoleScreen';

export default function AdminAssignRoleRoute() {
  return (
    <RequireAuthentication>
      <AssignRoleScreen />
    </RequireAuthentication>
  );
}
