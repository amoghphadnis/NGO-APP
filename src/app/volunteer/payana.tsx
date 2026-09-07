/**
 * Volunteer Payana Student List Route
 *
 * Route: /volunteer/payana
 * Shows approved Payana students for house visits
 */

import StudentListScreen from '@/screens/volunteer/StudentListScreen';

export default function VolunteerPayanaScreen() {
  return (
    <StudentListScreen
      studentType="payana"
      title="Payana Students"
    />
  );
}
