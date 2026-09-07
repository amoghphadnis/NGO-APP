import { z } from 'zod';
import { VOLUNTEER_ASSIGNMENT_SOURCES } from '@/types/volunteerAssignment';

/**
 * Mirrors backend validation for assign/reassign/cancel:
 * - identifiers must be > 0
 * - Source must be "New Student" or "Google Sheet"
 */
export const volunteerAssignmentSourceSchema = z.enum(VOLUNTEER_ASSIGNMENT_SOURCES);

export const assignVolunteerRequestSchema = z.object({
  studentId: z.number().int().positive({ message: 'Invalid Student ID.' }),
  volunteerId: z.number().int().positive({ message: 'Invalid Volunteer ID.' }),
  source: volunteerAssignmentSourceSchema,
});

export const cancelVolunteerAssignmentRequestSchema = z.object({
  studentId: z.number().int().positive({ message: 'Invalid Student ID.' }),
  source: volunteerAssignmentSourceSchema,
});

export const districtIdQuerySchema = z.number().int().positive({ message: 'Invalid District ID.' });

export type AssignVolunteerRequestValues = z.infer<typeof assignVolunteerRequestSchema>;
export type CancelVolunteerAssignmentRequestValues = z.infer<typeof cancelVolunteerAssignmentRequestSchema>;
