/**
 * Contract Tests for House Visit Approval APIs (3D-G)
 *
 * Verifies the route pattern differences across the four programs:
 *   - PUC:               /{id}/approve, /{id}/reject, POST /{id}/delete
 *   - Professional:      /{id}/approve, /{id}/reject, DELETE /{id}
 *   - Payana:            /approve/{id}, /reject/{id}, POST /delete/{id}  ← inverted
 *   - Semi-Professional: /{id}/approve, /{id}/reject, DELETE /{id}
 *
 * Also verifies:
 *   - Correct list endpoint URLs
 *   - Request body { Remark } for approve/reject (all four programs)
 *   - Response mapping to shared HouseVisitApprovalItem
 *   - ApproveStatus and VolunteerApprovalStatus are mapped independently
 *   - Query key shapes
 */

import {
  pucHouseVisitApprovalApi,
  professionalHouseVisitApprovalApi,
  payanaHouseVisitApprovalApi,
  semiProfessionalHouseVisitApprovalApi,
} from '@/api/houseVisitApprovalApi';

jest.mock('@/api/client', () => {
  const mockGet = jest.fn();
  const mockPost = jest.fn();
  const mockDelete = jest.fn();
  return {
    __esModule: true,
    default: {
      get: mockGet,
      post: mockPost,
      put: jest.fn(),
      delete: mockDelete,
      patch: jest.fn(),
    },
  };
});

import api from '@/api/client';

const mockGet = api.get as jest.MockedFunction<typeof api.get>;
const mockPost = api.post as jest.MockedFunction<typeof api.post>;
const mockDelete = api.delete as jest.MockedFunction<typeof api.delete>;

// ── Shared raw row factory (common fields across all four programs) ──────

function makeRawRow(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    HouseVisitID: 101,
    StudentID: 5001,
    StudentName: 'Example Student',
    CourseInstitution: 'Example Institution',
    Address: 'Example Address',
    VisitDate: '2026-08-31T00:00:00',
    FieldSupervisorName: 'Example Supervisor',
    PersonsInteracted: 'Parent',
    HouseType: 'Owned',
    Ownership: 'Self',
    Rooms: '3',
    Floor: 'Ground',
    RationCardType: 'BPL',
    DigitalAccess: 'Yes',
    LivingCondition: 'Good',
    LatestElecBill: '1000',
    ElecUnitsCons: '150',
    InternetBillCharges: '800',
    RemarkGeneralLivingCondition: 'Example',
    Totalfamily: '4',
    PrimaryIncomeSource: 'Employment',
    NatureofIncome: 'Regular',
    AverageIncome: 25000,
    PrimaryEarning: 'Employment',
    IncomeShocks: 'No',
    AgriculturalLand: 'No',
    WaterSource: 'Cauvery',
    CropPattern: 'None',
    OtherLandHoldings: 'None',
    TotalChildrenStudying: '2',
    AnnualEducationExpense: '30000',
    ScholarshipSupport: 'Yes',
    GovernmentSchemes: 'Scheme A',
    EducationalLoanAmount: '0',
    AnyOutstandingLoans: 'No',
    OutstandingLoanAmount: '0',
    MonthlyEMI: '0',
    HealthVulnerability: 'No',
    HealthVulnerabilityRemarks: null,
    Assets: 'House',
    Extracurricular: 'Sports',
    ConsentParticipation: 'Yes',
    StudentAspiration: 'Engineer',
    StudentMotivation: 'High',
    HouseholdVulnerabilityLevel: 'Low',
    Recommendation: 'Recommended',
    SupervisorJustification: 'Justified',
    DeclarationConfirmation: 'Yes',
    DeclarationDate: '2026-08-31T00:00:00',
    Upload: 'example.pdf',
    ApproveStatus: 'Pending',
    RejectionRemark: '',
    VolunteerApprovalStatus: 'Selected',
    FamilyMembers: [],
    ...overrides,
  };
}

// ── PUC House Visit Approval API ─────────────────────────────────────────

describe('PUC House Visit Approval API — Contract Tests', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('getList', () => {
    test('calls GET /puc-housevisits-grid/list and maps response', async () => {
      mockGet.mockResolvedValue({
        data: {
          success: true,
          count: 1,
          data: [makeRawRow({
            Place: 'Example Place',
            District: 'Example District',
            DistrictName: 'Dharwad',
            Taluka: 'Example Taluka',
            PinCode: '560001',
            HouseVisitLink: 'http://example.link',
          })],
        },
        status: 200,
        ok: true,
      });

      const result = await pucHouseVisitApprovalApi.getList();
      expect(mockGet).toHaveBeenCalledWith('/puc-housevisits-grid/list');
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(101);
      expect(result[0].studentId).toBe(5001);
      expect(result[0].studentName).toBe('Example Student');
      expect(result[0].approveStatus).toBe('Pending');
      expect(result[0].volunteerApprovalStatus).toBe('Selected');
      expect(result[0].district).toBe('Dharwad');
    });

    test('handles empty data array', async () => {
      mockGet.mockResolvedValue({
        data: { success: true, count: 0, data: [] },
        status: 200,
        ok: true,
      });
      const result = await pucHouseVisitApprovalApi.getList();
      expect(result).toEqual([]);
    });
  });

  describe('approve — route pattern /{id}/approve', () => {
    test('calls POST /puc-housevisits-grid/{id}/approve with body { Remark }', async () => {
      mockPost.mockResolvedValue({
        data: { success: true, message: 'PUC House Visit approved successfully.' },
        status: 200,
        ok: true,
      });
      await pucHouseVisitApprovalApi.approve(101, 'Verified');
      expect(mockPost).toHaveBeenCalledWith('/puc-housevisits-grid/101/approve', {
        Remark: 'Verified',
      });
    });

    test('sends empty string remark when not provided', async () => {
      mockPost.mockResolvedValue({
        data: { success: true, message: 'ok' },
        status: 200,
        ok: true,
      });
      await pucHouseVisitApprovalApi.approve(101);
      expect(mockPost).toHaveBeenCalledWith('/puc-housevisits-grid/101/approve', {
        Remark: '',
      });
    });
  });

  describe('reject — route pattern /{id}/reject', () => {
    test('calls POST /puc-housevisits-grid/{id}/reject with body { Remark }', async () => {
      mockPost.mockResolvedValue({
        data: { success: true, message: 'PUC House Visit rejected successfully.' },
        status: 200,
        ok: true,
      });
      await pucHouseVisitApprovalApi.reject(101, 'Insufficient');
      expect(mockPost).toHaveBeenCalledWith('/puc-housevisits-grid/101/reject', {
        Remark: 'Insufficient',
      });
    });
  });

  describe('delete — route pattern POST /{id}/delete (NOT DELETE)', () => {
    test('calls POST /puc-housevisits-grid/{id}/delete (soft delete via POST)', async () => {
      mockPost.mockResolvedValue({
        data: { success: true, message: 'PUC House Visit deleted successfully.' },
        status: 200,
        ok: true,
      });
      await pucHouseVisitApprovalApi.delete(101);
      expect(mockPost).toHaveBeenCalledWith('/puc-housevisits-grid/101/delete');
      // CRITICAL: PUC uses POST for delete, not DELETE
      expect(mockDelete).not.toHaveBeenCalled();
    });
  });

  test('queryKeys.list is correct shape', () => {
    expect(pucHouseVisitApprovalApi.queryKeys.list).toEqual([
      'houseVisitApproval',
      'list',
      'puc',
    ]);
  });
});

// ── Professional House Visit Approval API ────────────────────────────────

describe('Professional House Visit Approval API — Contract Tests', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('getList', () => {
    test('calls GET /professional-house-visits/list and maps response', async () => {
      mockGet.mockResolvedValue({
        data: {
          success: true,
          count: 1,
          data: [makeRawRow({
            Name: 'Example Member',
            Relation: 'Parent',
            Age: '45',
            Education: 'Graduate',
            Occupation: 'Employee',
            MonthlyIncome: '20000',
            Remarks: 'Example remarks',
          })],
        },
        status: 200,
        ok: true,
      });

      const result = await professionalHouseVisitApprovalApi.getList();
      expect(mockGet).toHaveBeenCalledWith('/professional-house-visits/list');
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(101);
      expect(result[0].approveStatus).toBe('Pending');
      expect(result[0].volunteerApprovalStatus).toBe('Selected');
    });
  });

  describe('approve — route pattern /{id}/approve', () => {
    test('calls POST /professional-house-visits/{id}/approve with body { Remark }', async () => {
      mockPost.mockResolvedValue({
        data: { success: true, message: 'Professional House Visit approved successfully.' },
        status: 200,
        ok: true,
      });
      await professionalHouseVisitApprovalApi.approve(101, 'Approved');
      expect(mockPost).toHaveBeenCalledWith('/professional-house-visits/101/approve', {
        Remark: 'Approved',
      });
    });
  });

  describe('reject — route pattern /{id}/reject', () => {
    test('calls POST /professional-house-visits/{id}/reject with body { Remark }', async () => {
      mockPost.mockResolvedValue({
        data: { success: true, message: 'Professional House Visit rejected successfully.' },
        status: 200,
        ok: true,
      });
      await professionalHouseVisitApprovalApi.reject(101, 'Rejected');
      expect(mockPost).toHaveBeenCalledWith('/professional-house-visits/101/reject', {
        Remark: 'Rejected',
      });
    });
  });

  describe('delete — route pattern DELETE /{id} (NOT POST)', () => {
    test('calls DELETE /professional-house-visits/{id} (soft delete via DELETE)', async () => {
      mockDelete.mockResolvedValue({
        data: { success: true, message: 'Professional House Visit deleted successfully.' },
        status: 200,
        ok: true,
      });
      await professionalHouseVisitApprovalApi.delete(101);
      expect(mockDelete).toHaveBeenCalledWith('/professional-house-visits/101');
      // CRITICAL: Professional uses DELETE method, not POST
      expect(mockPost).not.toHaveBeenCalledWith('/professional-house-visits/101');
    });
  });

  test('queryKeys.list is correct shape', () => {
    expect(professionalHouseVisitApprovalApi.queryKeys.list).toEqual([
      'houseVisitApproval',
      'list',
      'professional',
    ]);
  });
});

// ── Payana House Visit Approval API ──────────────────────────────────────

describe('Payana House Visit Approval API — Contract Tests', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('getList', () => {
    test('calls GET /payana-house-visit-grid/list and maps response', async () => {
      mockGet.mockResolvedValue({
        data: {
          success: true,
          count: 1,
          data: [makeRawRow({
            Name: 'Example Member',
            Relation: 'Parent',
            Age: '45',
            Education: 'Graduate',
            Occupation: 'Employee',
            MonthlyIncome: '20000',
            PrimaryEarning: 'Example',
          })],
        },
        status: 200,
        ok: true,
      });

      const result = await payanaHouseVisitApprovalApi.getList();
      expect(mockGet).toHaveBeenCalledWith('/payana-house-visit-grid/list');
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(101);
      expect(result[0].approveStatus).toBe('Pending');
      expect(result[0].volunteerApprovalStatus).toBe('Selected');
    });
  });

  describe('approve — INVERTED route pattern /approve/{id}', () => {
    test('calls POST /payana-house-visit-grid/approve/{id} with body { Remark }', async () => {
      mockPost.mockResolvedValue({
        data: { success: true, message: 'Payana House Visit approved successfully.' },
        status: 200,
        ok: true,
      });
      await payanaHouseVisitApprovalApi.approve(101, 'Approved');
      // CRITICAL: Payana uses INVERTED path order — /approve/{id}, NOT /{id}/approve
      expect(mockPost).toHaveBeenCalledWith('/payana-house-visit-grid/approve/101', {
        Remark: 'Approved',
      });
      expect(mockPost).not.toHaveBeenCalledWith('/payana-house-visit-grid/101/approve', {
        Remark: 'Approved',
      });
    });
  });

  describe('reject — INVERTED route pattern /reject/{id}', () => {
    test('calls POST /payana-house-visit-grid/reject/{id} with body { Remark }', async () => {
      mockPost.mockResolvedValue({
        data: { success: true, message: 'Payana House Visit rejected successfully.' },
        status: 200,
        ok: true,
      });
      await payanaHouseVisitApprovalApi.reject(101, 'Rejected');
      // CRITICAL: Payana uses INVERTED path order — /reject/{id}, NOT /{id}/reject
      expect(mockPost).toHaveBeenCalledWith('/payana-house-visit-grid/reject/101', {
        Remark: 'Rejected',
      });
    });
  });

  describe('delete — INVERTED route pattern POST /delete/{id}', () => {
    test('calls POST /payana-house-visit-grid/delete/{id} (soft delete via POST)', async () => {
      mockPost.mockResolvedValue({
        data: { success: true, message: 'Payana House Visit deleted successfully.' },
        status: 200,
        ok: true,
      });
      await payanaHouseVisitApprovalApi.delete(101);
      // CRITICAL: Payana uses INVERTED path order AND POST method
      expect(mockPost).toHaveBeenCalledWith('/payana-house-visit-grid/delete/101');
      expect(mockDelete).not.toHaveBeenCalled();
    });
  });

  test('queryKeys.list is correct shape', () => {
    expect(payanaHouseVisitApprovalApi.queryKeys.list).toEqual([
      'houseVisitApproval',
      'list',
      'payana',
    ]);
  });
});

// ── Semi-Professional House Visit Approval API ───────────────────────────

describe('Semi-Professional House Visit Approval API — Contract Tests', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('getList', () => {
    test('calls GET /semi-professional-house-visits/list and maps response', async () => {
      mockGet.mockResolvedValue({
        data: {
          success: true,
          count: 1,
          data: [makeRawRow({
            DistrictName: 'Dharwad',
            Name: 'Example Member',
            Relation: 'Parent',
            Age: '45',
            Education: 'Graduate',
            Occupation: 'Employee',
            MonthlyIncome: '20000',
            Remarks: 'Example remarks',
          })],
        },
        status: 200,
        ok: true,
      });

      const result = await semiProfessionalHouseVisitApprovalApi.getList();
      expect(mockGet).toHaveBeenCalledWith('/semi-professional-house-visits/list');
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(101);
      expect(result[0].district).toBe('Dharwad');
      expect(result[0].approveStatus).toBe('Pending');
      expect(result[0].volunteerApprovalStatus).toBe('Selected');
    });
  });

  describe('approve — route pattern /{id}/approve', () => {
    test('calls POST /semi-professional-house-visits/{id}/approve with body { Remark }', async () => {
      mockPost.mockResolvedValue({
        data: { success: true, message: 'Semi Professional House Visit approved successfully.' },
        status: 200,
        ok: true,
      });
      await semiProfessionalHouseVisitApprovalApi.approve(101, 'Approved');
      expect(mockPost).toHaveBeenCalledWith('/semi-professional-house-visits/101/approve', {
        Remark: 'Approved',
      });
    });
  });

  describe('reject — route pattern /{id}/reject', () => {
    test('calls POST /semi-professional-house-visits/{id}/reject with body { Remark }', async () => {
      mockPost.mockResolvedValue({
        data: { success: true, message: 'Semi Professional House Visit rejected successfully.' },
        status: 200,
        ok: true,
      });
      await semiProfessionalHouseVisitApprovalApi.reject(101, 'Rejected');
      expect(mockPost).toHaveBeenCalledWith('/semi-professional-house-visits/101/reject', {
        Remark: 'Rejected',
      });
    });
  });

  describe('delete — route pattern DELETE /{id} (NOT POST)', () => {
    test('calls DELETE /semi-professional-house-visits/{id} (soft delete via DELETE)', async () => {
      mockDelete.mockResolvedValue({
        data: { success: true, message: 'Semi Professional House Visit deleted successfully.' },
        status: 200,
        ok: true,
      });
      await semiProfessionalHouseVisitApprovalApi.delete(101);
      expect(mockDelete).toHaveBeenCalledWith('/semi-professional-house-visits/101');
      // CRITICAL: Semi-Professional uses DELETE method, not POST
      expect(mockPost).not.toHaveBeenCalledWith('/semi-professional-house-visits/101');
    });
  });

  test('queryKeys.list is correct shape', () => {
    expect(semiProfessionalHouseVisitApprovalApi.queryKeys.list).toEqual([
      'houseVisitApproval',
      'list',
      'semiProfessional',
    ]);
  });
});

// ── Cross-program: ApproveStatus vs VolunteerApprovalStatus independence ─

describe('Cross-program: ApproveStatus and VolunteerApprovalStatus are independent', () => {
  beforeEach(() => jest.clearAllMocks());

  test('both fields are mapped to separate properties on the view model', async () => {
    mockGet.mockResolvedValue({
      data: {
        success: true,
        count: 1,
        data: [makeRawRow({
          ApproveStatus: 'Pending',
          VolunteerApprovalStatus: 'Selected',
          RejectionRemark: '',
          DistrictName: 'Dharwad',
        })],
      },
      status: 200,
      ok: true,
    });

    const result = await pucHouseVisitApprovalApi.getList();
    expect(result[0].approveStatus).toBe('Pending');
    expect(result[0].volunteerApprovalStatus).toBe('Selected');
    expect(result[0].rejectionRemark).toBe('');
    // They must not be the same value (proves they are distinct fields)
    expect(result[0].approveStatus).not.toBe(result[0].volunteerApprovalStatus);
  });
});
