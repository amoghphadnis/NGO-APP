import { payanaHouseVisitApprovalApi } from '@/api/houseVisitApprovalApi';
import HouseVisitApprovalListScreen from '@/screens/approval/HouseVisitApprovalListScreen';

export default function PayanaHouseVisitApprovalScreen() {
  return (
    <HouseVisitApprovalListScreen
      title="Payana House Visit Approval"
      api={payanaHouseVisitApprovalApi}
    />
  );
}
