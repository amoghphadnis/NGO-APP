import { professionalApprovalApi } from '@/api/professionalApprovalApi';
import GenericApprovalListScreen from '@/screens/approval/GenericApprovalListScreen';

export default function ApprovalProfessionalScreen() {
  return (
    <GenericApprovalListScreen
      title="Professional Approval"
      api={{
        getList: professionalApprovalApi.getList,
        approve: professionalApprovalApi.approve,
        reject: professionalApprovalApi.reject,
        queryKey: professionalApprovalApi.queryKeys.list,
        invalidatePrefix: 'professionalApproval',
      }}
    />
  );
}
