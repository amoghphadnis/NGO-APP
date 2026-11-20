import RequireAuthentication from '@/components/auth/RequireAuthentication';
import SemiProfessionalCoursesScreen from '@/screens/admin/SemiProfessionalCoursesScreen';

export default function AdminSemiProfCoursesRoute() {
  return (
    <RequireAuthentication>
      <SemiProfessionalCoursesScreen />
    </RequireAuthentication>
  );
}
