/**
 * PUC Approval API Contract Tests
 *
 * Verifies:
 * 1. GET /students/getall — correct URL construction with optional query params
 * 2. GET /students/get/{id} — correct URL with path parameter
 * 3. POST /students/approve — correct URL with id + remark query params
 * 4. POST /students/reject — correct URL with id + remark query params
 * 5. Query key shapes for React Query
 * 6. Dropdown endpoints (genders, districts, areas)
 */

import { pucApprovalApi } from '@/api/pucApprovalApi';

// ── Mock the API client ──────────────────────────────────────────────────────

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

describe('PUC Approval API — Contract Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ── 1. GET /students/getall ───────────────────────────────────────────────

  describe('getApprovalList', () => {
    test('calls GET /students/getall with no params', async () => {
      mockGet.mockResolvedValue({
        data: [{ StudentID: 1, StudentName: 'Rahul', ApprovalStatus: 'Pending' }],
        status: 200,
        ok: true,
      });

      const result = await pucApprovalApi.getList();

      expect(mockGet).toHaveBeenCalledWith('/students/getall');
      expect(result).toHaveLength(1);
      expect(result[0].StudentID).toBe(1);
      expect(result[0].ApprovalStatus).toBe('Pending');
    });

    test('calls GET /students/getall with role + userId for Branch Executives', async () => {
      mockGet.mockResolvedValue({ data: [], status: 200, ok: true });

      await pucApprovalApi.getList({ role: 'Branch Executives', userId: 5 });

      expect(mockGet).toHaveBeenCalledWith(
        '/students/getall?role=Branch+Executives&userId=5'
      );
    });

    test('returns array of PucApprovalStudent', async () => {
      const mockData = [
        {
          StudentID: 1,
          StudentName: 'Rahul',
          DateOfBirth: '2003-04-20T00:00:00',
          GenderID: 1,
          GenderName: 'Male',
          ContactNumber: '9876543210',
          AlternateNumber: null,
          Email: 'rahul@test.com',
          Address: 'Bangalore',
          AreaTypeName: 'Urban',
          District: 'Bangalore',
          Taluka: 'North',
          PinCode: '560001',
          FatherName: 'Ramesh',
          MotherName: 'Suma',
          FatherOccupation: 'Farmer',
          MotherOccupation: 'Teacher',
          FamilyIncome: 500000,
          FamilyMembers: 4,
          CategoryName: 'OBC',
          HouseTypeName: 'Owned',
          MonthlyRent: '0',
          SourceName: 'Website',
          CourseName: 'B.Tech',
          CollegeName: 'ABC College',
          CollegeTypeName: 'Private',
          ExpectedFees: 75000,
          SecuredPercentage: 92,
          TotalMarks: 580,
          Status: '1',
          ApprovalStatus: 'Pending',
          StudentPhotoPath: 'photo.jpg',
          SSLCMarksCardPath: 'sslc.pdf',
          ElectricityBillPath: 'bill.pdf',
          RationCardPath: 'ration.pdf',
          IncomeCertificatePath: 'income.pdf',
          FamilyPhotoPath: 'family.jpg',
          HouseVideoPath: 'house.mp4',
          Remark: '',
        },
      ];
      mockGet.mockResolvedValue({ data: mockData, status: 200, ok: true });

      const result = await pucApprovalApi.getList();

      expect(result[0]).toMatchObject({
        StudentID: 1,
        StudentName: 'Rahul',
        ApprovalStatus: 'Pending',
        FamilyIncome: 500000,
        SecuredPercentage: 92,
      });
    });
  });

  // ── 2. GET /students/get/{id} ─────────────────────────────────────────────

  describe('getApprovalStudentById', () => {
    test('calls GET /students/get/{id} with correct path', async () => {
      mockGet.mockResolvedValue({
        data: { StudentID: 1, StudentName: 'Rahul' },
        status: 200,
        ok: true,
      });

      await pucApprovalApi.getById(42);

      expect(mockGet).toHaveBeenCalledWith('/students/get/42');
    });
  });

  // ── 3. POST /students/approve ─────────────────────────────────────────────

  describe('approveStudent', () => {
    test('calls POST /students/approve with id query param', async () => {
      mockPost.mockResolvedValue({
        data: { Success: true, Message: 'Student Approved Successfully', Data: null },
        status: 200,
        ok: true,
      });

      const result = await pucApprovalApi.approve(1);

      expect(mockPost).toHaveBeenCalledWith('/students/approve?id=1');
      expect(result.Success).toBe(true);
      expect(result.Message).toBe('Student Approved Successfully');
    });

    test('calls POST /students/approve with id + remark query params', async () => {
      mockPost.mockResolvedValue({
        data: { Success: true, Message: 'Student Approved Successfully', Data: null },
        status: 200,
        ok: true,
      });

      await pucApprovalApi.approve(1, 'Approved');

      expect(mockPost).toHaveBeenCalledWith('/students/approve?id=1&remark=Approved');
    });
  });

  // ── 4. POST /students/reject ──────────────────────────────────────────────

  describe('rejectStudent', () => {
    test('calls POST /students/reject with id query param', async () => {
      mockPost.mockResolvedValue({
        data: { Success: true, Message: 'Student Rejected Successfully', Data: null },
        status: 200,
        ok: true,
      });

      const result = await pucApprovalApi.reject(1);

      expect(mockPost).toHaveBeenCalledWith('/students/reject?id=1');
      expect(result.Success).toBe(true);
      expect(result.Message).toBe('Student Rejected Successfully');
    });

    test('calls POST /students/reject with id + remark query params', async () => {
      mockPost.mockResolvedValue({
        data: { Success: true, Message: 'Student Rejected Successfully', Data: null },
        status: 200,
        ok: true,
      });

      await pucApprovalApi.reject(1, 'Documents missing');

      expect(mockPost).toHaveBeenCalledWith('/students/reject?id=1&remark=Documents+missing');
    });
  });

  // ── 5. Query keys ─────────────────────────────────────────────────────────

  describe('queryKeys', () => {
    test('list query key without params', () => {
      expect(pucApprovalApi.queryKeys.list()).toEqual(['pucApproval', 'list', undefined]);
    });

    test('list query key with params', () => {
      expect(pucApprovalApi.queryKeys.list({ role: 'Admin' })).toEqual([
        'pucApproval',
        'list',
        { role: 'Admin' },
      ]);
    });

    test('detail query key', () => {
      expect(pucApprovalApi.queryKeys.detail(42)).toEqual(['pucApproval', 'detail', 42]);
    });
  });

  // ── 6. Dropdown endpoints ─────────────────────────────────────────────────

  describe('Dropdown endpoints', () => {
    test('getGenders calls GET /students/genders', async () => {
      mockGet.mockResolvedValue({
        data: [{ Id: 1, Name: 'Male' }],
        status: 200,
        ok: true,
      });

      const result = await pucApprovalApi.getGenders();

      expect(mockGet).toHaveBeenCalledWith('/students/genders');
      expect(result[0].Id).toBe(1);
      expect(result[0].Name).toBe('Male');
    });

    test('getDistricts calls GET /students/districts', async () => {
      mockGet.mockResolvedValue({
        data: [{ Id: 1, Name: 'Bangalore' }],
        status: 200,
        ok: true,
      });

      await pucApprovalApi.getDistricts();

      expect(mockGet).toHaveBeenCalledWith('/students/districts');
    });

    test('getAreas calls GET /students/areas', async () => {
      mockGet.mockResolvedValue({
        data: [{ Id: 1, Name: 'Urban' }],
        status: 200,
        ok: true,
      });

      await pucApprovalApi.getAreas();

      expect(mockGet).toHaveBeenCalledWith('/students/areas');
    });
  });
});

// ── Role utils tests ─────────────────────────────────────────────────────────

import {
  canApproveReject,
  canAssignRoles,
  canAssignVolunteers,
  canCreatePayana,
  canManageSettings,
  canManageUsers,
  canViewApprovals,
  canViewDonors,
  isAdminRole,
} from '@/utils/roleUtils';

describe('canViewApprovals / canApproveReject role checks', () => {
  test.each([canViewApprovals, canApproveReject])(
    'matches the web Approval/Reject menus',
    (fn) => {
      expect(fn('Program Manager')).toBe(true);
      expect(fn('Branch Executives')).toBe(true);
      expect(fn('Admin')).toBe(false);
      expect(fn('Admin(CEO)')).toBe(false);
      expect(fn('Volunteer')).toBe(false);
      expect(fn(undefined)).toBe(false);
    }
  );
});

describe('canManageUsers role check', () => {
  test('allows PM, Admin, Admin(CEO)', () => {
    expect(canManageUsers('Program Manager')).toBe(true);
    expect(canManageUsers('Admin')).toBe(true);
    expect(canManageUsers('Admin(CEO)')).toBe(true);
  });

  test('rejects field roles', () => {
    expect(canManageUsers('Volunteer')).toBe(false);
    expect(canManageUsers('Branch Executives')).toBe(false);
    expect(canManageUsers(undefined)).toBe(false);
  });
});

describe('canAssignRoles role check', () => {
  test('Admin only per web menu', () => {
    expect(canAssignRoles('Admin')).toBe(true);
    expect(canAssignRoles('Admin(CEO)')).toBe(true);
    expect(canAssignRoles('Program Manager')).toBe(false);
    expect(canAssignRoles('Branch Executives')).toBe(false);
  });
});

describe('canManageSettings role check', () => {
  test('PM + Admin roles', () => {
    expect(canManageSettings('Program Manager')).toBe(true);
    expect(canManageSettings('Admin')).toBe(true);
    expect(canManageSettings('Admin(CEO)')).toBe(true);
    expect(canManageSettings('Branch Executives')).toBe(false);
    expect(canManageSettings('Volunteer')).toBe(false);
  });
});

describe('canViewDonors role check', () => {
  test('Program Manager only', () => {
    expect(canViewDonors('Program Manager')).toBe(true);
    expect(canViewDonors('Admin')).toBe(false);
    expect(canViewDonors('Admin(CEO)')).toBe(false);
    expect(canViewDonors('Branch Executives')).toBe(false);
  });
});

describe('isAdminRole role check', () => {
  test('Admin and Admin(CEO)', () => {
    expect(isAdminRole('Admin')).toBe(true);
    expect(isAdminRole('Admin(CEO)')).toBe(true);
    expect(isAdminRole('Program Manager')).toBe(false);
    expect(isAdminRole('Branch Executives')).toBe(false);
    expect(isAdminRole('Volunteer')).toBe(false);
  });
});

describe('field-work role checks', () => {
  test('canAssignVolunteers: PM + Branch Executives', () => {
    expect(canAssignVolunteers('Program Manager')).toBe(true);
    expect(canAssignVolunteers('Branch Executives')).toBe(true);
    expect(canAssignVolunteers('Admin')).toBe(false);
    expect(canAssignVolunteers('Volunteer')).toBe(false);
  });

  test('canCreatePayana: PM + Branch Executives', () => {
    expect(canCreatePayana('Program Manager')).toBe(true);
    expect(canCreatePayana('Branch Executives')).toBe(true);
    expect(canCreatePayana('Admin')).toBe(false);
    expect(canCreatePayana('Volunteer')).toBe(false);
  });
});
