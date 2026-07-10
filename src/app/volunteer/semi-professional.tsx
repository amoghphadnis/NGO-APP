/**
 * Volunteer Semi Professional Student List Route
 *
 * Route: /volunteer/semi-professional
 * Shows approved Semi Professional students for house visits
 */

import StudentListScreen from '@/screens/volunteer/StudentListScreen';

export default function VolunteerSemiProfessionalScreen() {
  return (
    <StudentListScreen
      studentType="semiProfessional"
      title="Semi Professional Students"
    />
  );
}
