import RequireAuthentication from '@/components/auth/RequireAuthentication';
import GenericApprovalListScreen from '@/screens/approval/GenericApprovalListScreen';
import { renewalPayanaApprovalApi } from '@/api/renewalPayanaApprovalApi';

export default function RenewalPayanaApprovalScreen() {
  return (
    <RequireAuthentication>
      <GenericApprovalListScreen
        title="Pending Payana Renewals"
        api={renewalPayanaApprovalApi}
      />
    </RequireAuthentication>
  );
}
