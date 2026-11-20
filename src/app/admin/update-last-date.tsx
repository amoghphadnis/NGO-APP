import RequireAuthentication from '@/components/auth/RequireAuthentication';
import ApplicationSettingsScreen from '@/screens/admin/ApplicationSettingsScreen';

export default function AdminUpdateLastDateRoute() {
  return (
    <RequireAuthentication>
      <ApplicationSettingsScreen />
    </RequireAuthentication>
  );
}
