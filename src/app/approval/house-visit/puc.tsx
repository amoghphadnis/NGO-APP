import { pucHouseVisitApprovalApi } from '@/api/houseVisitApprovalApi';
import HouseVisitApprovalListScreen from '@/screens/approval/HouseVisitApprovalListScreen';

export default function PucHouseVisitApprovalScreen() {
  return (
    <HouseVisitApprovalListScreen
      title="PUC House Visit Approval"
      api={pucHouseVisitApprovalApi}
    />
  );
}
