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
