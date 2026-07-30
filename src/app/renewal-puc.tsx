import RequireAuthentication from '@/components/auth/RequireAuthentication';
import RenewalPUCForm from '@/screens/form-sections/renewal/RenewalPUCForm';
import { useRouter } from 'expo-router';

export default function RenewalPUCScreen() {
  const router = useRouter();

  return (
    <RequireAuthentication>
      <RenewalPUCForm
        navigation={{
          goBack: () => router.back(),
        }}
      />
    </RequireAuthentication>
  );
}
