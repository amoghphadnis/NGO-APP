/**
 * Volunteer Assignment — Semi Professional
 * Route: /volunteer-assignment/semi-professional
 */

import { semiProfessionalVolunteerAssignmentApi } from '@/api/volunteerAssignmentApi';
import VolunteerAssignmentScreen from '@/screens/volunteer/VolunteerAssignmentScreen';

export default function VolunteerAssignmentSemiProfessionalScreen() {
  return (
    <VolunteerAssignmentScreen
      program="semiProfessional"
      api={semiProfessionalVolunteerAssignmentApi}
    />
  );
}
