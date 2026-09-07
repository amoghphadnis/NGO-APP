import { semiProfessionalHouseVisitApprovalApi } from '@/api/houseVisitApprovalApi';
import HouseVisitApprovalListScreen from '@/screens/approval/HouseVisitApprovalListScreen';

export default function SemiProfessionalHouseVisitApprovalScreen() {
  return (
    <HouseVisitApprovalListScreen
      title="Semi-Professional House Visit Approval"
      api={semiProfessionalHouseVisitApprovalApi}
    />
  );
}
