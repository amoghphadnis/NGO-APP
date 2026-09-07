import { professionalHouseVisitApprovalApi } from '@/api/houseVisitApprovalApi';
import HouseVisitApprovalListScreen from '@/screens/approval/HouseVisitApprovalListScreen';

export default function ProfessionalHouseVisitApprovalScreen() {
  return (
    <HouseVisitApprovalListScreen
      title="Professional House Visit Approval"
      api={professionalHouseVisitApprovalApi}
    />
  );
}
