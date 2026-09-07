/**
 * Volunteer Assignment — Payana
 * Route: /volunteer-assignment/payana
 */

import { payanaVolunteerAssignmentApi } from '@/api/volunteerAssignmentApi';
import VolunteerAssignmentScreen from '@/screens/volunteer/VolunteerAssignmentScreen';

export default function VolunteerAssignmentPayanaScreen() {
  return (
    <VolunteerAssignmentScreen
      program="payana"
      api={payanaVolunteerAssignmentApi}
    />
  );
}
