import { z } from 'zod';
import { UploadedDocument } from '@/types/documents';

export const renewalPayanaSchema = z.object({
  // Required fields
  emailId: z.string().email({ message: 'Valid email is required' }),
  studentName: z.string().min(1, { message: 'Student name is required' }),

  // Basic info
  district: z.string().optional().or(z.literal('')),
  taluk: z.string().optional().or(z.literal('')),
  payanaId: z.string().optional().or(z.literal('')),
  dateOfBirth: z.string().optional().or(z.literal('')),
  residentialAddress: z.string().optional().or(z.literal('')),
  currentAddress: z.string().optional().or(z.literal('')),
  primaryNumber: z.string().max(10).optional().or(z.literal('')),
  alternateNumber: z.string().max(10).optional().or(z.literal('')),
  place: z.string().optional().or(z.literal('')),
  caste: z.string().optional().or(z.literal('')),

  // Family
  fatherOccupation: z.string().optional().or(z.literal('')),
  motherOccupation: z.string().optional().or(z.literal('')),
  familyIncome: z.number().min(0).optional(),
  bankBalance: z.number().min(0).optional(),

  // College
  collegeName: z.string().optional().or(z.literal('')),
  collegeType: z.string().optional().or(z.literal('')),
  collegeContact: z.string().max(10).optional().or(z.literal('')),

  // Current year (2025-26)
  courseS: z.string().optional().or(z.literal('')),
  courseStream: z.string().optional().or(z.literal('')),
  annualFees: z.number().min(0).optional(),
  totalExpenses: z.number().min(0).optional(),

  // Previous year (2024-25)
  scholarshipAmount: z.number().min(0).optional(),
  donorName: z.string().optional().or(z.literal('')),
  lettersWritten: z.number().min(0).optional(),
  achievement: z.string().optional().or(z.literal('')),
  percentage: z.string().optional().or(z.literal('')),

  // Bank details
  accountHolder: z.string().min(1, { message: 'Account holder name is required' }),
  accountNumber: z.string().min(1, { message: 'Account number is required' }),
  ifsc: z.string().min(1, { message: 'IFSC code is required' }),
  bankName: z.string().min(1, { message: 'Bank name is required' }),
  branch: z.string().min(1, { message: 'Branch name is required' }),

  // Additional
  houseVisitLink: z.string().optional().or(z.literal('')),

  // Documents
  marksheetFile: z.custom<UploadedDocument>().optional(),
  feesReceiptFile: z.custom<UploadedDocument>().optional(),
  passbookFile: z.custom<UploadedDocument>().optional(),
  selfieFile: z.custom<UploadedDocument>().optional(),
  aadhaarFile: z.custom<UploadedDocument>().optional(),
});

export type RenewalPayanaFormValues = z.infer<typeof renewalPayanaSchema>;
