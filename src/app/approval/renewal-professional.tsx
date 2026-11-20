import RequireAuthentication from '@/components/auth/RequireAuthentication';
import GenericApprovalListScreen from '@/screens/approval/GenericApprovalListScreen';
import { renewalProfessionalApprovalApi } from '@/api/renewalProfessionalApprovalApi';

export default function RenewalProfessionalApprovalScreen() {
  return (
    <RequireAuthentication>
      <GenericApprovalListScreen
        title="Pending Professional Renewals"
        api={renewalProfessionalApprovalApi}
      />
    </RequireAuthentication>
  );
}
