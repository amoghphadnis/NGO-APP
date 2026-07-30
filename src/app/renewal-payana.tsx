import RequireAuthentication from '@/components/auth/RequireAuthentication';
import RenewalPayanaForm from '@/screens/form-sections/renewal/RenewalPayanaForm';
import { useRouter } from 'expo-router';

export default function RenewalPayanaScreen() {
  const router = useRouter();

  return (
    <RequireAuthentication>
      <RenewalPayanaForm
        navigation={{
          goBack: () => router.back(),
        }}
      />
    </RequireAuthentication>
  );
}
