/**
 * Volunteer Assignment — PUC
 * Route: /volunteer-assignment/puc
 */

import { pucVolunteerAssignmentApi } from '@/api/volunteerAssignmentApi';
import VolunteerAssignmentScreen from '@/screens/volunteer/VolunteerAssignmentScreen';

export default function VolunteerAssignmentPUCScreen() {
  return (
    <VolunteerAssignmentScreen
      program="puc"
      api={pucVolunteerAssignmentApi}
    />
  );
}
