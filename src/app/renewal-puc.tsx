import RequireAuthentication from '@/components/auth/RequireAuthentication';
import { useConfirmExitOnBack } from '@/hooks/useConfirmExitOnBack';
import RenewalPUCForm from '@/screens/form-sections/renewal/RenewalPUCForm';
import { useRouter } from 'expo-router';

export default function RenewalPUCScreen() {
  const router = useRouter();
  useConfirmExitOnBack(() => router.back());

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
