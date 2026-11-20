import RequireAuthentication from '@/components/auth/RequireAuthentication';
import DonorManagementScreen from '@/screens/admin/DonorManagementScreen';

export default function AdminDonorsRoute() {
  return (
    <RequireAuthentication>
      <DonorManagementScreen />
    </RequireAuthentication>
  );
}
