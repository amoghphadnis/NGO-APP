import RequireAuthentication from '@/components/auth/RequireAuthentication';
import { useConfirmExitOnBack } from '@/hooks/useConfirmExitOnBack';
import RenewalPayanaForm from '@/screens/form-sections/renewal/RenewalPayanaForm';
import { useRouter } from 'expo-router';

export default function RenewalPayanaScreen() {
  const router = useRouter();
  useConfirmExitOnBack(() => router.back());

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
