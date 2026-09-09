import RequireAuthentication from '@/components/auth/RequireAuthentication';
import GenericApprovalListScreen from '@/screens/approval/GenericApprovalListScreen';
import { renewalPucApprovalApi } from '@/api/renewalPucApprovalApi';

export default function RenewalPucApprovalScreen() {
  return (
    <RequireAuthentication>
      <GenericApprovalListScreen
        title="Pending PUC Renewals"
        api={renewalPucApprovalApi}
      />
    </RequireAuthentication>
  );
}
