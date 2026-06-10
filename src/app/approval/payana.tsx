// TODO: Create payanaStudentApi.ts - Payana has different API response structure
// For now, this uses PUC student API as placeholder
import StudentListScreen from '@/screens/volunteer/StudentListScreen';

export default function ApprovalPayanaScreen() {
  return (
    <StudentListScreen
      studentType="puc"
      title="Payana Students"
    />
  );
}
