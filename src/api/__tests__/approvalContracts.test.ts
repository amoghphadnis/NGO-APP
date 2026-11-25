/**
 * Contract Tests for Professional, Semi Professional, and Payana Approval APIs
 *
 * Verifies:
 * - Correct URL construction for list, approve, reject endpoints
 * - Correct request body / query param patterns per contract
 * - Response mapping to common ApprovalStudent shape
 * - Query key shapes for React Query
 */

import { professionalApprovalApi } from '@/api/professionalApprovalApi';
import { semiProfessionalApprovalApi } from '@/api/semiProfessionalApprovalApi';
import { payanaApprovalApi } from '@/api/payanaApprovalApi';
import { format11PucApprovalApi } from '@/api/format11PucApprovalApi';

jest.mock('@/api/client', () => {
  const mockGet = jest.fn();
  const mockPost = jest.fn();
  return {
    __esModule: true,
    default: {
      get: mockGet,
      post: mockPost,
      put: jest.fn(),
      delete: jest.fn(),
      patch: jest.fn(),
    },
  };
});

import api from '@/api/client';

const mockGet = api.get as jest.MockedFunction<typeof api.get>;
const mockPost = api.post as jest.MockedFunction<typeof api.post>;

// ── Professional Approval API ──────────────────────────────────────────────

describe('Professional Approval API (New) — Contract Tests', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('getList', () => {
    test('calls GET /new-professional-approval/list and maps response', async () => {
      mockGet.mockResolvedValue({
        data: {
          success: true,
          count: 1,
          data: [
            {
              ApplicationID: 101,
              StudentName: 'John Doe',
              Email: 'john@example.com',
              ContactNumber: '9876543210',
              DistrictName: 'Dharwad',
              OtherDistrict: null,
              CourseApplying: 'Engineering',
              CourseStream: 'Science',
              PUPercentage: 85.5,
              CETRank: '12345',
              NEETRank: null,
              FamilyIncome: 150000,
              ApproveStatus: 'Pending',
              Remark: null,
            },
          ],
        },
        status: 200,
        ok: true,
      });

      const result = await professionalApprovalApi.getList();
      expect(mockGet).toHaveBeenCalledWith('/new-professional-approval/list');
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(101);
      expect(result[0].studentName).toBe('John Doe');
      expect(result[0].approvalStatus).toBe('Pending');
      expect(result[0].district).toBe('Dharwad');
      expect(result[0].infoRows.length).toBeGreaterThan(0);
    });

    test('handles empty data array', async () => {
      mockGet.mockResolvedValue({
        data: { success: true, count: 0, data: [] },
        status: 200,
        ok: true,
      });
      const result = await professionalApprovalApi.getList();
      expect(result).toEqual([]);
    });
  });

  describe('approve', () => {
    test('calls POST /new-professional-approval/approve/{id} with body { Remark }', async () => {
      mockPost.mockResolvedValue({
        data: { success: true, message: 'Professional student approved successfully.' },
        status: 200,
        ok: true,
      });
      await professionalApprovalApi.approve(101, 'Verified');
      expect(mockPost).toHaveBeenCalledWith('/new-professional-approval/approve/101', {
        Remark: 'Verified',
      });
    });

    test('sends empty string remark when not provided', async () => {
      mockPost.mockResolvedValue({
        data: { success: true, message: 'ok' },
        status: 200,
        ok: true,
      });
      await professionalApprovalApi.approve(101);
      expect(mockPost).toHaveBeenCalledWith('/new-professional-approval/approve/101', {
        Remark: '',
      });
    });
  });

  describe('reject', () => {
    test('calls POST /new-professional-approval/reject/{id} with body { Remark }', async () => {
      mockPost.mockResolvedValue({
        data: { success: true, message: 'Professional student rejected successfully.' },
        status: 200,
        ok: true,
      });
      await professionalApprovalApi.reject(101, 'Insufficient docs');
      expect(mockPost).toHaveBeenCalledWith('/new-professional-approval/reject/101', {
        Remark: 'Insufficient docs',
      });
    });
  });

  test('queryKeys.list is correct shape', () => {
    expect(professionalApprovalApi.queryKeys.list).toEqual([
      'professionalApproval',
      'list',
    ]);
  });
});

// ── Semi Professional Approval API ─────────────────────────────────────────

describe('Semi Professional Approval API — Contract Tests', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('getList', () => {
    test('calls GET /semi-professional-student-approval/list and maps response', async () => {
      mockGet.mockResolvedValue({
        data: {
          success: true,
          count: 1,
          data: [
            {
              ApplicationID: 25,
              StudentName: 'Rahul Kumar',
              Email: 'rahul@example.com',
              ContactNumber: '9876543210',
              DistrictName: 'Dharwad',
              OtherDistrict: null,
              CourseApplying: 'B.E.',
              CourseStream: 'Computer Science',
              PUPercentage: 82.5,
              CETRank: '12500',
              PTRank: '250',
              FamilyIncome: 150000,
              ApproveStatus: 'Pending',
              Remark: null,
            },
          ],
        },
        status: 200,
        ok: true,
      });

      const result = await semiProfessionalApprovalApi.getList();
      expect(mockGet).toHaveBeenCalledWith('/semi-professional-student-approval/list');
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(25);
      expect(result[0].studentName).toBe('Rahul Kumar');
      expect(result[0].approvalStatus).toBe('Pending');
    });
  });

  describe('approve', () => {
    test('calls POST /semi-professional-student-approval/approve/{id} with ?remarks= query param, no body', async () => {
      mockPost.mockResolvedValue({
        data: { success: true, message: 'Student approved successfully.' },
        status: 200,
        ok: true,
      });
      await semiProfessionalApprovalApi.approve(25, 'Documents verified');
      expect(mockPost).toHaveBeenCalledWith(
        '/semi-professional-student-approval/approve/25?remarks=Documents+verified'
      );
    });

    test('omits remarks query param when not provided', async () => {
      mockPost.mockResolvedValue({
        data: { success: true, message: 'ok' },
        status: 200,
        ok: true,
      });
      await semiProfessionalApprovalApi.approve(25);
      expect(mockPost).toHaveBeenCalledWith(
        '/semi-professional-student-approval/approve/25'
      );
    });
  });

  describe('reject', () => {
    test('calls POST /semi-professional-student-approval/reject/{id} with ?remarks= query param', async () => {
      mockPost.mockResolvedValue({
        data: { success: true, message: 'Student rejected successfully.' },
        status: 200,
        ok: true,
      });
      await semiProfessionalApprovalApi.reject(25, 'Incomplete');
      expect(mockPost).toHaveBeenCalledWith(
        '/semi-professional-student-approval/reject/25?remarks=Incomplete'
      );
    });
  });

  test('queryKeys.list is correct shape', () => {
    expect(semiProfessionalApprovalApi.queryKeys.list).toEqual([
      'semiProfessionalApproval',
      'list',
    ]);
  });
});

// ── Payana Approval API ────────────────────────────────────────────────────

describe('Payana Approval API — Contract Tests', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('getList', () => {
    test('calls GET /payana-student-grid/list and maps response', async () => {
      mockGet.mockResolvedValue({
        data: {
          success: true,
          count: 1,
          data: [
            {
              StudentID: 101,
              StudentName: 'John Doe',
              Email: 'john@example.com',
              ContactNumber: '9876543210',
              DistrictName: 'Dharwad',
              OtherDistrict: '',
              CollegeName: 'Example College',
              CourseSA: 'B.Com',
              CourseStream: 'Commerce',
              SecuredPercentage: 82.5,
              AnnualFees: 25000,
              FamilyIncome: 120000,
              ApproveStatus: 'Pending',
              Remark: null,
            },
          ],
        },
        status: 200,
        ok: true,
      });

      const result = await payanaApprovalApi.getList();
      expect(mockGet).toHaveBeenCalledWith('/payana-student-grid/list');
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(101);
      expect(result[0].studentName).toBe('John Doe');
      expect(result[0].approvalStatus).toBe('Pending');
    });
  });

  describe('approve', () => {
    test('calls POST /payana-student-grid/approve/{id} with body { Remark }', async () => {
      mockPost.mockResolvedValue({
        data: { success: true, message: 'Student approved successfully.' },
        status: 200,
        ok: true,
      });
      await payanaApprovalApi.approve(101, 'Approved after verification');
      expect(mockPost).toHaveBeenCalledWith('/payana-student-grid/approve/101', {
        Remark: 'Approved after verification',
      });
    });
  });

  describe('reject', () => {
    test('calls POST /payana-student-grid/reject/{id} with body { Remark }', async () => {
      mockPost.mockResolvedValue({
        data: { success: true, message: 'Student rejected successfully.' },
        status: 200,
        ok: true,
      });
      await payanaApprovalApi.reject(101, 'Rejected');
      expect(mockPost).toHaveBeenCalledWith('/payana-student-grid/reject/101', {
        Remark: 'Rejected',
      });
    });
  });

  test('queryKeys.list is correct shape', () => {
    expect(payanaApprovalApi.queryKeys.list).toEqual(['payanaApproval', 'list']);
  });
});

// ── Format 1.1 PUC Approval API ──────────────────────────────────────────

describe('Format 1.1 PUC Approval API — Contract Tests', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('getList', () => {
    test('calls GET /format1-1-puc/list and handles wrapped object response { success, data }', async () => {
      mockGet.mockResolvedValue({
        data: {
          success: true,
          count: 1,
          data: [
            {
              StudentFormat1ID: 7,
              StudentName: 'Tarangini K',
              Email: 'tarangini.kudari@vidyaposhak.org.in',
              DateOfBirth: '2026-08-18T00:00:00',
              ContactNumber: '9513322361',
              AlternateNumber: '9513322361',
              GenderName: 'Female',
              CategoryName: 'GM',
              DistrictName: 'Dharwad',
              OtherDistrict: '',
              Taluk: 'Hubballi',
              CourseName: 'PUC I - Science',
              CollegeName: 'KLE',
              CollegeTypeName: 'Private',
              CollegeFees: 5236,
              SSLCPercentage: 60,
              FamilyAnnualIncome: 50000,
              ApproveStatus: 'Pending',
              Remark: null,
            },
          ],
        },
        status: 200,
        ok: true,
      });

      const result = await format11PucApprovalApi.getList();
      expect(mockGet).toHaveBeenCalledWith('/format1-1-puc/list');
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(7);
      expect(result[0].studentName).toBe('Tarangini K');
      expect(result[0].email).toBe('tarangini.kudari@vidyaposhak.org.in');
      expect(result[0].district).toBe('Dharwad');
      expect(result[0].approvalStatus).toBe('Pending');
      expect(result[0].infoRows).toEqual(
        expect.arrayContaining([
          { label: 'District', value: 'Dharwad' },
          { label: 'Taluk', value: 'Hubballi' },
          { label: 'Course', value: 'PUC I - Science' },
          { label: 'College', value: 'KLE' },
          { label: 'SSLC %', value: '60%' },
          { label: 'Family Income', value: '₹50000' },
          { label: 'Contact', value: '9513322361' },
        ])
      );
    });

    test('calls GET /format1-1-puc/list and handles raw array response', async () => {
      mockGet.mockResolvedValue({
        data: [
          {
            StudentFormat1ID: 8,
            StudentName: 'Ramesh P',
            Email: 'ramesh@example.com',
            DistrictName: 'Belagavi',
            OtherDistrict: null,
            ApproveStatus: 'Approved',
            Remark: 'Verified',
          },
        ],
        status: 200,
        ok: true,
      });

      const result = await format11PucApprovalApi.getList();
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(8);
      expect(result[0].studentName).toBe('Ramesh P');
      expect(result[0].district).toBe('Belagavi');
      expect(result[0].approvalStatus).toBe('Approved');
    });

    test('handles empty or malformed data gracefully', async () => {
      mockGet.mockResolvedValue({
        data: null,
        status: 200,
        ok: true,
      });

      const result = await format11PucApprovalApi.getList();
      expect(result).toEqual([]);
    });
  });

  describe('approve', () => {
    test('calls POST /format1-1-puc/approve/{id} with { StudentFormat1ID, Remark }', async () => {
      mockPost.mockResolvedValue({
        data: { success: true, message: 'Student approved successfully.' },
        status: 200,
        ok: true,
      });

      await format11PucApprovalApi.approve(7, 'All documents valid');
      expect(mockPost).toHaveBeenCalledWith('/format1-1-puc/approve/7', {
        StudentFormat1ID: 7,
        Remark: 'All documents valid',
      });
    });
  });

  describe('reject', () => {
    test('calls POST /format1-1-puc/reject/{id} with { StudentFormat1ID, Remark }', async () => {
      mockPost.mockResolvedValue({
        data: { success: true, message: 'Student rejected successfully.' },
        status: 200,
        ok: true,
      });

      await format11PucApprovalApi.reject(7, 'Income exceeds criteria');
      expect(mockPost).toHaveBeenCalledWith('/format1-1-puc/reject/7', {
        StudentFormat1ID: 7,
        Remark: 'Income exceeds criteria',
      });
    });
  });

  test('queryKey and invalidatePrefix have expected values', () => {
    expect(format11PucApprovalApi.queryKey).toEqual(['format11PucApproval', 'list']);
    expect(format11PucApprovalApi.invalidatePrefix).toBe('format11PucApproval');
  });
});
