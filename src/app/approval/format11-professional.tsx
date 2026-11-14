import { professionalFormat11ApprovalApi } from '@/api/professionalFormat11ApprovalApi';
import GenericApprovalListScreen from '@/screens/approval/GenericApprovalListScreen';

export default function ApprovalFormat11ProfessionalScreen() {
  return (
    <GenericApprovalListScreen
      title="Format 1.1 Professional Approval"
      api={{
        getList: professionalFormat11ApprovalApi.getList,
        approve: professionalFormat11ApprovalApi.approve,
        reject: professionalFormat11ApprovalApi.reject,
        queryKey: professionalFormat11ApprovalApi.queryKey,
        invalidatePrefix: 'professionalFormat11Approval',
      }}
    />
  );
}
