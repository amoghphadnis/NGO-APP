import { z } from 'zod';

export const semiProfessionalCourseNameSchema = z
  .string()
  .trim()
  .min(1, { message: 'CourseName is required.' });

export const createSemiProfessionalCourseSchema = z.object({
  CourseName: semiProfessionalCourseNameSchema,
});

export const updateSemiProfessionalCourseSchema = z.object({
  CourseId: z.number().int().positive({ message: 'Invalid Course ID.' }),
  CourseName: semiProfessionalCourseNameSchema,
});

export type CreateSemiProfessionalCourseValues = z.infer<typeof createSemiProfessionalCourseSchema>;
export type UpdateSemiProfessionalCourseValues = z.infer<typeof updateSemiProfessionalCourseSchema>;
