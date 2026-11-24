import api from '../client';
import {
  createSemiProfessionalStudent,
  getSemiProfessionalDropdowns,
} from '../semiProfessionalApi';
import { normalizeSemiProfessionalDropdowns } from '../transformers/normalizeSemiProfDropdowns';
import { semiProfessionalMapper } from '@/forms/semiProfessional/mapper';
import { SemiProfessionalFormValues } from '@/validation/semiProfessionalSchemas';

jest.mock('../client', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

describe('Semi-Professional API & Transformers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getSemiProfessionalDropdowns', () => {
    it('calls GET /semi-professional/form-data and normalizes masters payload', async () => {
      const mockBackendResponse = {
        data: {
          Success: true,
          Message: 'Success',
          Data: {
            LastDate: '20 Dec 2026',
            Masters: {
              GenderList: [
                { Id: 1, Name: 'Male' },
                { Id: 2, Name: 'Female' },
              ],
              AreaList: [
                { Id: 1, Name: 'Urban' },
                { Id: 2, Name: 'Rural' },
              ],
              DistrictList: [
                { Id: 1, Name: 'Dharwad' },
                { Id: 2, Name: 'Gadag' },
              ],
              CasteList: [
                { Id: 1, Name: 'GM' },
                { Id: 2, Name: 'OBC' },
              ],
              HouseList: [
                { Id: 1, Name: 'Own' },
                { Id: 2, Name: 'Rent' },
              ],
              CourseList: [
                { Id: 1, Name: 'B.Sc Nursing' },
                { Id: 2, Name: 'Agriculture' },
              ],
              CollegeTypeList: [
                { Id: 1, Name: 'Government' },
                { Id: 2, Name: 'Private' },
              ],
              FatherOccupationList: [
                { Id: 1, Name: 'Farmer' },
              ],
              MotherOccupationList: [
                { Id: 1, Name: 'Homemaker' },
              ],
              ReferenceList: [
                { Id: 1, Name: 'Volunteer' },
              ],
            },
          },
        },
      };

      (api.get as jest.Mock).mockResolvedValueOnce(mockBackendResponse);

      const result = await getSemiProfessionalDropdowns();

      expect(api.get).toHaveBeenCalledWith('/semi-professional/form-data');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.lastDate).toBe('20 Dec 2026');
        expect(result.data.genders).toEqual([
          { value: 1, label: 'Male' },
          { value: 2, label: 'Female' },
        ]);
        expect(result.data.areaTypes).toEqual([
          { value: 1, label: 'Urban' },
          { value: 2, label: 'Rural' },
        ]);
        expect(result.data.districts).toEqual([
          { value: 1, label: 'Dharwad' },
          { value: 2, label: 'Gadag' },
        ]);
        expect(result.data.casteCategories).toEqual([
          { value: 1, label: 'GM' },
          { value: 2, label: 'OBC' },
        ]);
        expect(result.data.houseTypes).toEqual([
          { value: 1, label: 'Own' },
          { value: 2, label: 'Rent' },
        ]);
        expect(result.data.semiProfessionalCourses).toEqual([
          { value: 1, label: 'B.Sc Nursing' },
          { value: 2, label: 'Agriculture' },
        ]);
      }
    });

    it('handles api errors gracefully', async () => {
      (api.get as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const result = await getSemiProfessionalDropdowns();
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe('Network error');
      }
    });
  });

  describe('createSemiProfessionalStudent', () => {
    it('calls POST /semi-professional/create with FormData', async () => {
      const mockResponse = {
        data: {
          Success: true,
          Message: 'Semi Professional Application submitted successfully.',
          Data: null,
        },
      };

      (api.post as jest.Mock).mockResolvedValueOnce(mockResponse);

      const formData = new FormData();
      formData.append('StudentName', 'Test Student');

      const result = await createSemiProfessionalStudent(formData);

      expect(api.post).toHaveBeenCalledWith('/semi-professional/create', formData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.message).toBe('Semi Professional Application submitted successfully.');
      }
    });

    it('returns failure message for duplicate email registration', async () => {
      const duplicateMsg = 'This Email ID is already registered. Student can apply only once.';
      const mockResponse = {
        data: {
          Success: false,
          Message: duplicateMsg,
          Data: null,
        },
      };

      (api.post as jest.Mock).mockResolvedValueOnce(mockResponse);

      const formData = new FormData();
      formData.append('Email', 'duplicate@example.com');

      const result = await createSemiProfessionalStudent(formData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.message).toBe(duplicateMsg);
      }
    });
  });

  describe('semiProfessionalMapper', () => {
    it('maps form state to contract fields including PTRank and 9 file keys', () => {
      const dummyFile = {
        uri: 'file:///data/user/0/test.jpg',
        name: 'test.jpg',
        type: 'image/jpeg',
        size: 1024,
      };

      const testValues: SemiProfessionalFormValues = {
        personal: {
          email: 'student@example.com',
          studentName: 'Rahul Kumar',
          dateOfBirth: '2005-05-15',
          contactNumber: '9876543210',
          alternateNumber: '9876501234',
          genderID: 1,
          casteCategoryID: 2,
          areaTypeID: 1,
          districtID: 3,
          otherDistrict: '',
          residentialAddress: 'Dharwad, Karnataka',
          googleMapLink: 'https://maps.google.com/example',
        },
        family: {
          fatherName: 'Ramesh Kumar',
          motherName: 'Lakshmi Kumar',
          fatherOccupationID: 1,
          motherOccupationID: 2,
          familyMembers: 5,
          houseTypeID: 1,
          monthlyRent: 5000,
          familyIncome: 25000,
        },
        academic: {
          puPercentage: 85.5,
          cetRank: 12000,
          ptRank: 15000,
          semiProfessionalCourseID: 1,
          courseApplying: 'B.Sc Agriculture',
          courseStream: 'Agriculture',
        },
        documents: {
          studentSelfie: { file: dummyFile, uploadedAt: '2026-11-23' },
          cetRankSheet: { file: dummyFile, uploadedAt: '2026-11-23' },
          ptRankSheet: { file: dummyFile, uploadedAt: '2026-11-23' },
          dwellingUnitPhoto: { file: dummyFile, uploadedAt: '2026-11-23' },
          marksSheet12: { file: dummyFile, uploadedAt: '2026-11-23' },
          houseVideo: { file: { ...dummyFile, name: 'video.mp4', type: 'video/mp4' }, uploadedAt: '2026-11-23' },
          electricityBill: { file: dummyFile, uploadedAt: '2026-11-23' },
          incomeCertificate: { file: dummyFile, uploadedAt: '2026-11-23' },
          rationCard: { file: dummyFile, uploadedAt: '2026-11-23' },
        },
      };

      const fd = semiProfessionalMapper(testValues);

      const keys = typeof (fd as any).keys === 'function' ? Array.from((fd as any).keys()) : [];

      expect(keys).toContain('Email');
      expect(keys).toContain('StudentName');
      expect(keys).toContain('DOB');
      expect(keys).toContain('ContactNumber');
      expect(keys).toContain('AlternateNumber');
      expect(keys).toContain('GenderID');
      expect(keys).toContain('CasteCategoryID');
      expect(keys).toContain('AreaTypeID');
      expect(keys).toContain('DistrictID');
      expect(keys).toContain('ResidentialAddress');
      expect(keys).toContain('GoogleMapLink');
      expect(keys).toContain('FatherName');
      expect(keys).toContain('MotherName');
      expect(keys).toContain('FatherOccupationID');
      expect(keys).toContain('MotherOccupationID');
      expect(keys).toContain('FamilyMembers');
      expect(keys).toContain('HouseTypeID');
      expect(keys).toContain('MonthlyRent');
      expect(keys).toContain('FamilyIncome');
      expect(keys).toContain('PUPercentage');
      expect(keys).toContain('CETRank');
      expect(keys).toContain('PTRank');
      expect(keys).toContain('CourseApplying');
      expect(keys).toContain('CourseStream');

      // 9 files
      expect(keys).toContain('StudentSelfie');
      expect(keys).toContain('CETRankSheet');
      expect(keys).toContain('PTRankSheet');
      expect(keys).toContain('DwellingUnitPhoto');
      expect(keys).toContain('MarksSheet12');
      expect(keys).toContain('HouseVideo');
      expect(keys).toContain('ElectricityBill');
      expect(keys).toContain('IncomeCertificate');
      expect(keys).toContain('RationCard');
    });
  });
});

