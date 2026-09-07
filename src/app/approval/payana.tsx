import { payanaApprovalApi } from '@/api/payanaApprovalApi';
import GenericApprovalListScreen from '@/screens/approval/GenericApprovalListScreen';

export default function ApprovalPayanaScreen() {
  return (
    <GenericApprovalListScreen
      title="Payana Approval"
      api={{
        getList: payanaApprovalApi.getList,
        approve: payanaApprovalApi.approve,
        reject: payanaApprovalApi.reject,
        queryKey: payanaApprovalApi.queryKeys.list,
        invalidatePrefix: 'payanaApproval',
      }}
    />
  );
}
