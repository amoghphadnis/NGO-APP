/**
 * Form Submission Unit Tests
 * Tests the payload preparation and submission flow
 */

import { preparePayload } from '../preparePayload';
import { validatePayload } from '../validatePayload';
import { submitApplication } from '../submit';
import { PayanaFormValues } from '@/types/forms';
import { SemiProfessionalFormValues } from '@/validation/semiProfessionalSchemas';

// Mock the API modules
jest.mock('@/api/professionalApi');
jest.mock('@/api/pucApi');
jest.mock('@/api/semiProfessionalApi');
jest.mock('@/api/payanaApi');

import { createPayanaStudent } from '@/api/payanaApi';
import { createSemiProfessionalStudent } from '@/api/semiProfessionalApi';

describe('Form Submission', () => {
  describe('preparePayload', () => {
    it('should include all Payana files in FormData', () => {
      const mockFormData: PayanaFormValues = {
        personal: {
          studentName: 'Test Student',
          genderID: 1,
          dateOfBirth: '2000-01-01',
        },
        contact: {
          email: 'test@test.com',
          contactNumber: '9876543210',
          alternateNumber: '',
        },
        address: {
          residentialAddress: 'Test Address',
          currentAddress: 'Test Address',
          place: 'Test Place',
          taluka: 'Test Taluka',
          districtID: 1,
          otherDistrict: '',
          pincode: '560001',
          areaTypeID: 1,
        },
        family: {
          fatherName: 'Test Father',
          motherName: 'Test Mother',
          fatherOccupationID: 1,
          motherOccupationID: 2,
          familyMembers: 4,
          familyIncome: 50000,
          parentBank: 10000,
        },
        category: {
          casteCategoryID: 1,
          houseTypeID: 1,
        },
        academic: {
          courseID: 1,
          collegeName: 'Test College',
          collegeTypeID: 1,
          collegeCNumber: '',
          courseSA: 'Test',
          courseStream: '',
          annualFees: 100000,
          totalExpenses: 150000,
          studentAchievements: '',
          securedPercentage: '85',
        },
        bank: {
          accountHolderName: 'Test Student',
          bankAccountNo: '1234567890',
          ifscCode: 'TEST0001',
          bankName: 'Test Bank',
          branchName: 'Test Branch',
        },
        documents: {
          latestMarksCard: {
            file: { uri: 'file://test1.jpg', name: 'marksheet.jpg', type: 'image/jpeg' },
            uploadedAt: new Date().toISOString(),
          },
          studentPassbookFP: {
            file: { uri: 'file://test2.jpg', name: 'passbook.jpg', type: 'image/jpeg' },
            uploadedAt: new Date().toISOString(),
          },
          studentPhoto: {
            file: { uri: 'file://test3.jpg', name: 'photo.jpg', type: 'image/jpeg' },
            uploadedAt: new Date().toISOString(),
          },
          dwellingUnit: {
            file: { uri: 'file://test4.jpg', name: 'house.jpg', type: 'image/jpeg' },
            uploadedAt: new Date().toISOString(),
          },
          aadhaarCard: {
            file: { uri: 'file://test5.jpg', name: 'aadhaar.jpg', type: 'image/jpeg' },
            uploadedAt: new Date().toISOString(),
          },
          houseVisitLink: 'https://maps.google.com/test',
        },
        agreement: {
          isAgreed: true,
        },
      };

      const payload = preparePayload('payana', mockFormData);
      const keys = Array.from((payload as any).keys());

      // Check that text fields are present
      expect(keys).toContain('StudentName');
      expect(keys).toContain('Email');

      // Check that files are present with correct API field names
      expect(keys).toContain('latestmarkscard');
      expect(keys).toContain('studentpassbookFP');
      expect(keys).toContain('StudentPhoto');
      expect(keys).toContain('dwellingunit');
      expect(keys).toContain('adharcard');
    });

    it('should log missing files for Payana', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      const mockFormData: PayanaFormValues = {
        personal: { studentName: 'Test', genderID: 1 },
        contact: { email: 'test@test.com', contactNumber: '9876543210' },
        address: { 
          residentialAddress: 'Test', currentAddress: 'Test', place: 'Test', 
          taluka: 'Test', districtID: 1, otherDistrict: '', pincode: '560001', areaTypeID: 1 
        },
        family: { 
          fatherName: 'Test', motherName: 'Test', fatherOccupationID: 1, motherOccupationID: 1,
          familyMembers: 4, familyIncome: 50000, parentBank: 10000 
        },
        category: { casteCategoryID: 1, houseTypeID: 1 },
        academic: { 
          courseID: 1, collegeName: 'Test', collegeTypeID: 1, collegeCNumber: '', 
          courseSA: 'Test', courseStream: '', annualFees: 100000, totalExpenses: 150000, 
          studentAchievements: '', securedPercentage: '85' 
        },
        bank: { 
          accountHolderName: 'Test', bankAccountNo: '1234567890', ifscCode: 'TEST0001',
          bankName: 'Test Bank', branchName: 'Test Branch' 
        },
        documents: {}, // No files uploaded
        agreement: { isAgreed: true },
      };

      preparePayload('payana', mockFormData);

      // Check that missing files are logged
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Missing file: latestMarksCard')
      );

      consoleSpy.mockRestore();
    });

    it('should include SemiProfessional required fields', () => {
      const mockFormData: SemiProfessionalFormValues = {
        personal: {
          studentName: 'Test Student',
          email: 'test@test.com',
          dateOfBirth: '2000-01-01',
          contactNumber: '9876543210',
          genderID: 1,
          casteCategoryID: 1,
        },
        address: {
          districtID: 1,
          taluk: 'Test Taluk',
          placeID: 1,
          address: 'Test Address',
        },
        family: {
          fatherOccupationID: 1,
          motherOccupationID: 2,
          familyMembers: 4,
          annualIncome: 50000,
        },
        academic: {
          puPercentage: 85,
          semiProfessionalCourseID: 1,
          collegeName: 'Test College',
          collegeTypeID: 1,
          collegeFees: 50000,
        },
        documents: {
          houseVisitLink: 'https://test.com',
        },
      };

      const payload = preparePayload('semiProfessional', mockFormData);
      const keys = Array.from((payload as any).keys());

      // Check that required family fields are ALWAYS present
      expect(keys).toContain('FatherOccupationID');
      expect(keys).toContain('MotherOccupationID');
    });
  });

  describe('validatePayload', () => {
    it('should validate Payana schema successfully', () => {
      const validPayana: PayanaFormValues = {
        personal: {
          studentName: 'Test Student',
          genderID: 1,
          dateOfBirth: '2000-01-01',
        },
        contact: {
          email: 'test@test.com',
          contactNumber: '9876543210',
        },
        address: {
          residentialAddress: 'Test Address',
          currentAddress: 'Test Address',
          place: 'Test Place',
          taluka: 'Test Taluka',
          districtID: 1,
          pincode: '560001',
          areaTypeID: 1,
        },
        family: {
          fatherName: 'Test Father',
          motherName: 'Test Mother',
          fatherOccupationID: 1,
          motherOccupationID: 2,
          familyMembers: 4,
          familyIncome: 50000,
          parentBank: 10000,
        },
        category: {
          casteCategoryID: 1,
          houseTypeID: 1,
        },
        academic: {
          courseID: 1,
          collegeName: 'Test College',
          collegeTypeID: 1,
          courseSA: 'Test Course',
          annualFees: 100000,
          totalExpenses: 150000,
          securedPercentage: '85',
        },
        bank: {
          accountHolderName: 'Test Student',
          bankAccountNo: '1234567890',
          ifscCode: 'TEST0001',
          bankName: 'Test Bank',
          branchName: 'Test Branch',
        },
        documents: {
          houseVisitLink: 'https://test.com',
        },
        agreement: {
          isAgreed: true,
        },
      };

      const result = validatePayload('payana', validPayana);

      expect(result.success).toBe(true);
      expect(result.errors).toBeUndefined();
    });

    it('should fail Payana validation with missing required fields', () => {
      const invalidPayana = {
        personal: {},
        contact: {},
        address: {},
        family: {},
        category: {},
        academic: {},
        bank: {},
        documents: {},
        agreement: {},
      } as any;

      const result = validatePayload('payana', invalidPayana);

      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors?.length).toBeGreaterThan(0);
    });

    it('should validate SemiProfessional schema', () => {
      const validSemiPro: SemiProfessionalFormValues = {
        personal: {
          studentName: 'Test Student',
          email: 'test@test.com',
          dateOfBirth: '2000-01-01',
          contactNumber: '9876543210',
          genderID: 1,
          casteCategoryID: 1,
        },
        address: {
          districtID: 1,
          taluk: 'Test Taluk',
          placeID: 1,
          address: 'Test Address',
        },
        family: {
          fatherOccupationID: 1,
          motherOccupationID: 2,
          familyMembers: 4,
          annualIncome: 50000,
        },
        academic: {
          puPercentage: 85,
          semiProfessionalCourseID: 1,
          collegeName: 'Test College',
          collegeTypeID: 1,
          collegeFees: 50000,
        },
        documents: {},
      };

      const result = validatePayload('semiProfessional', validSemiPro);

      expect(result.success).toBe(true);
    });

    it('should fail SemiProfessional validation without required occupation IDs', () => {
      const invalidSemiPro: SemiProfessionalFormValues = {
        personal: {
          studentName: 'Test Student',
          email: 'test@test.com',
          dateOfBirth: '2000-01-01',
          contactNumber: '9876543210',
          genderID: 1,
          casteCategoryID: 1,
        },
        address: {
          districtID: 1,
          taluk: 'Test Taluk',
          placeID: 1,
          address: 'Test Address',
        },
        family: {
          // Missing fatherOccupationID and motherOccupationID
          fatherOccupationID: 0,
          motherOccupationID: 0,
          familyMembers: 4,
          annualIncome: 50000,
        },
        academic: {
          puPercentage: 85,
          semiProfessionalCourseID: 1,
          collegeName: 'Test College',
          collegeTypeID: 1,
          collegeFees: 50000,
        },
        documents: {},
      };

      const result = validatePayload('semiProfessional', invalidSemiPro);

      expect(result.success).toBe(false);
    });
  });

  describe('submitApplication', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should route payana form to createPayanaStudent', async () => {
      const mockPayload = new FormData();
      (createPayanaStudent as jest.Mock).mockResolvedValue({
        success: true,
        message: 'Payana student created successfully',
      });

      const result = await submitApplication('payana', mockPayload);

      expect(createPayanaStudent).toHaveBeenCalledWith(mockPayload);
      expect(result.success).toBe(true);
    });

    it('should return error for unsupported form type', async () => {
      const mockPayload = new FormData();
      
      const result = await submitApplication('unknown' as any, mockPayload);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Unsupported form type');
    });

    it('should handle API errors gracefully', async () => {
      const mockPayload = new FormData();
      (createPayanaStudent as jest.Mock).mockRejectedValue(new Error('Network error'));

      const result = await submitApplication('payana', mockPayload);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Network error');
    });
  });
});
