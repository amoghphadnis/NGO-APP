import RequireAuthentication from '@/components/auth/RequireAuthentication';
import { useConfirmExitOnBack } from '@/hooks/useConfirmExitOnBack';
import RenewalProfessionalForm from '@/screens/form-sections/renewal/RenewalProfessionalForm';
import { useRouter } from 'expo-router';

export default function RenewalProfessionalScreen() {
  const router = useRouter();
  useConfirmExitOnBack(() => router.back());

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
