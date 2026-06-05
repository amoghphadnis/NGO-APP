/**
 * Volunteer Professional Student List Route
 * 
 * Route: /volunteer/professional
 * Shows approved professional students for house visits
 */

import StudentListScreen from '@/screens/volunteer/StudentListScreen';

export default function VolunteerProfessionalScreen() {
  return (
    <StudentListScreen
      studentType="professional"
      title="Professional Students"
    />
  );
}
