/**
 * Volunteer Assignment — Professional
 * Route: /volunteer-assignment/professional
 */

import { professionalVolunteerAssignmentApi } from '@/api/volunteerAssignmentApi';
import VolunteerAssignmentScreen from '@/screens/volunteer/VolunteerAssignmentScreen';

export default function VolunteerAssignmentProfessionalScreen() {
  return (
    <VolunteerAssignmentScreen
      program="professional"
      api={professionalVolunteerAssignmentApi}
    />
  );
}
