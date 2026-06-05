/**
 * Volunteer PUC Student List Route
 * 
 * Route: /volunteer/puc
 * Shows approved PUC students for house visits
 */

import StudentListScreen from '@/screens/volunteer/StudentListScreen';

export default function VolunteerPUCScreen() {
  return (
    <StudentListScreen
      studentType="puc"
      title="PUC Students"
    />
  );
}
