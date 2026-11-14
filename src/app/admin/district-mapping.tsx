import RequireAuthentication from '@/components/auth/RequireAuthentication';
import DistrictMappingScreen from '@/screens/admin/DistrictMappingScreen';

export default function AdminDistrictMappingRoute() {
  return (
    <RequireAuthentication>
      <DistrictMappingScreen />
    </RequireAuthentication>
  );
}
