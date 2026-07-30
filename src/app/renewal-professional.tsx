import RequireAuthentication from '@/components/auth/RequireAuthentication';
import RenewalProfessionalForm from '@/screens/form-sections/renewal/RenewalProfessionalForm';
import { useRouter } from 'expo-router';

export default function RenewalProfessionalScreen() {
  const router = useRouter();

  return (
    <RequireAuthentication>
      <RenewalProfessionalForm
        navigation={{
          goBack: () => router.back(),
        }}
      />
    </RequireAuthentication>
  );
}
