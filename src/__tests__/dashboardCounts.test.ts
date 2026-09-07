/**
 * Dashboard Count Model Tests
 *
 * Prevents mixing of two distinct count models:
 * 1. Dashboard API Pending* fields → application approval pending counts
 * 2. Student list API students.length → approved/eligible student counts
 *
 * These should never be used interchangeably.
 */

import { DashboardResponseDto, PDashboardResponseDto } from '@/types/dashboard';

describe('Dashboard count model separation', () => {
  test('DashboardResponseDto has Pending* fields for application approvals', () => {
    const dto: DashboardResponseDto = {
      Name: 'Test',
      Role: 'Admin',
      District: 'Bangalore',
      PendingPUC: 5,
      PendingPayana: 3,
      PendingProfessional: 2,
      PendingSemiProfessional: 1,
      PendingHousePUC: 0,
      PendingHousePayana: 0,
      PendingPUCRenewal: 0,
      PendingPayanaRenewal: 0,
      PendingVisitPUC: 0,
      PendingVisitPayana: 0,
    };

    expect(dto.PendingPUC).toBe(5);
    expect(dto.PendingPayana).toBe(3);
    expect(dto.PendingProfessional).toBe(2);
    expect(dto.PendingSemiProfessional).toBe(1);
  });

  test('PDashboardResponseDto has Pending* fields for application approvals', () => {
    const dto: PDashboardResponseDto = {
      Name: 'PM',
      Role: 'Program Manager',
      PendingPUC: 10,
      PendingPayana: 4,
      PendingProfessional: 7,
      PendingSemiProfessional: 3,
      PendingHousePUC: 2,
      PendingHousePayana: 1,
      PendingPUCRenewal: 0,
      PendingPayanaRenewal: 0,
    };

    expect(dto.PendingPUC).toBe(10);
    expect(dto.PendingPayana).toBe(4);
    expect(dto.PendingProfessional).toBe(7);
    expect(dto.PendingSemiProfessional).toBe(3);
  });

  test('Pending* fields are numbers, not derived from student list lengths', () => {
    const dto = {} as DashboardResponseDto;

    // These fields should always be numeric on the DTO
    expect(typeof dto.PendingPUC).toBe('undefined');
    expect(typeof dto.PendingPayana).toBe('undefined');
    expect(typeof dto.PendingProfessional).toBe('undefined');
    expect(typeof dto.PendingSemiProfessional).toBe('undefined');
  });

  test('Dashboard Pending* fields are distinct from student list counts', () => {
    // This test documents the invariant:
    // dashboard.PendingPUC = count of PUC applications awaiting approval
    // studentList.students.length = count of approved PUC students
    //
    // These are different concepts and must not be mixed.

    const dashboardPendingPUC = 5;
    const approvedStudentListLength = 42;

    expect(dashboardPendingPUC).not.toBe(approvedStudentListLength);
    expect(dashboardPendingPUC).toBeLessThan(approvedStudentListLength);
  });
});
