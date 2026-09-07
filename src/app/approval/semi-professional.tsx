import { semiProfessionalApprovalApi } from '@/api/semiProfessionalApprovalApi';
import GenericApprovalListScreen from '@/screens/approval/GenericApprovalListScreen';

export default function ApprovalSemiProfessionalScreen() {
  return (
    <GenericApprovalListScreen
      title="Semi Professional Approval"
      api={{
        getList: semiProfessionalApprovalApi.getList,
        approve: semiProfessionalApprovalApi.approve,
        reject: semiProfessionalApprovalApi.reject,
        queryKey: semiProfessionalApprovalApi.queryKeys.list,
        invalidatePrefix: 'semiProfessionalApproval',
      }}
    />
  );
}
