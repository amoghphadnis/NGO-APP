import { z } from 'zod';

export const renewalPucSchema = z.object({
  // Section 2: Applicant Information
  email: z.string().email({ message: 'Valid email is required' }),
  applicantName: z.string().min(1, { message: 'Applicant name is required' }),
  vpid: z.string().optional(),
  whatsApp: z.string().min(10, { message: 'WhatsApp number must be 10 digits' }).max(10),
  alternateNumber: z.string().max(10).optional().or(z.literal('')),
  district: z.number().min(1, { message: 'District is required' }),
  taluk: z.string().min(1, { message: 'Taluk is required' }),
  address: z.string().min(1, { message: 'Address is required' }),
  gender: z.string().min(1, { message: 'Gender is required' }),
  dob: z.string().min(1, { message: 'Date of birth is required' }),

  // Section 3: Academic Details
  latestResult: z.string().min(1, { message: 'Latest result is required' }),
  scholarshipAmount: z.number().positive({ message: 'Scholarship amount must be positive' }),
  donorName: z.string().optional().or(z.literal('')),
  lettersCount: z.number().min(0).optional(),
  course: z.string().min(1, { message: 'Course is required' }),
  courseYear: z.string().min(1, { message: 'Course year is required' }),
  courseStream: z.string().optional().or(z.literal('')),
  collegeName: z.string().min(1, { message: 'College name is required' }),
  collegeContact: z.string().optional().or(z.literal('')),
  collegeType: z.string().min(1, { message: 'College type is required' }),
  collegeFees: z.number().positive({ message: 'College fees must be positive' }),
  totalExpenses: z.number().positive({ message: 'Total expenses must be positive' }),
  achievements: z.string().optional().or(z.literal('')),

  // Section 4: Residential Bridge Camp Details
  invitedToCamp: z.string().min(1, { message: 'This field is required' }),
  attendedCamp: z.string().min(1, { message: 'This field is required' }),
  campCount: z.number().min(0).optional(),
  campPlace: z.string().optional().or(z.literal('')),
  campDate: z.string().optional().or(z.literal('')),
  vdssAttended: z.string().optional().or(z.literal('')),
  vdss_Topics: z.string().optional().or(z.literal('')),

  // Section 5: Account Details
  accountHolderName: z.string().min(1, { message: 'Account holder name is required' }),
  accountNumber: z.string().min(1, { message: 'Account number is required' }),
  ifsc: z.string().min(1, { message: 'IFSC code is required' }),
  bankName: z.string().min(1, { message: 'Bank name is required' }),
  branchName: z.string().min(1, { message: 'Branch name is required' }),
  parentBankBalance: z.number().min(0).optional(),

  // Section 7: Additional Info
  houseVisitLink: z.string().optional().or(z.literal('')),
  renewalPreviousVPID: z.string().optional().or(z.literal('')),
});

export type RenewalPucFormValues = z.infer<typeof renewalPucSchema>;
