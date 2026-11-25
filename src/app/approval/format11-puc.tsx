import RequireAuthentication from '@/components/auth/RequireAuthentication';
import { format11PucApprovalApi } from '@/api/format11PucApprovalApi';
import GenericApprovalListScreen from '@/screens/approval/GenericApprovalListScreen';

export default function ApprovalFormat11PucScreen() {
  return (
    <RequireAuthentication>
      <GenericApprovalListScreen
        title="Format 1.1 PUC Approval"
        api={{
          getList: format11PucApprovalApi.getList,
          approve: format11PucApprovalApi.approve,
          reject: format11PucApprovalApi.reject,
          queryKey: format11PucApprovalApi.queryKey,
          invalidatePrefix: 'format11PucApproval',
        }}
      />
    </RequireAuthentication>
  );
}
