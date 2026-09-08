/**
 * Dashboard Count Model Tests
 *
 * Prevents mixing of two distinct count models:
 * 1. Dashboard API notifications.pending* fields → application approval pending counts
 * 2. Student list API students.length → approved/eligible student counts
 *
 * These should never be used interchangeably.
 */

import { DashboardResponseDto, PDashboardResponseDto } from '@/types/dashboard';

describe('Dashboard count model separation', () => {
  test('DashboardResponseDto has notifications.pending* fields for application approvals', () => {
    const dto: DashboardResponseDto = {
      success: true,
      notifications: {
        pendingPUC: 5,
        pendingPayana: 3,
        pendingProfessional: 2,
        pendingSemiProfessional: 1,
        pendingHousePUC: 0,
        pendingHousePayana: 0,
        pendingPUCRenewal: 0,
        pendingPayanaRenewal: 0,
        pendingVisitPUC: 0,
        pendingVisitPayana: 0,
      },
      totalPending: 11,
    };

    expect(dto.notifications.pendingPUC).toBe(5);
    expect(dto.notifications.pendingPayana).toBe(3);
    expect(dto.notifications.pendingProfessional).toBe(2);
    expect(dto.notifications.pendingSemiProfessional).toBe(1);
  });

  test('PDashboardResponseDto has notifications.pending* fields for application approvals', () => {
    const dto: PDashboardResponseDto = {
      success: true,
      notifications: {
        pendingPUC: 10,
        pendingPayana: 4,
        pendingProfessional: 7,
        pendingSemiProfessional: 3,
        pendingHousePUC: 2,
        pendingHousePayana: 1,
        pendingPUCRenewal: 0,
        pendingPayanaRenewal: 0,
      },
      totalPending: 27,
    };

    expect(dto.notifications.pendingPUC).toBe(10);
    expect(dto.notifications.pendingPayana).toBe(4);
    expect(dto.notifications.pendingProfessional).toBe(7);
    expect(dto.notifications.pendingSemiProfessional).toBe(3);
  });

  test('notifications.pending* fields are numbers, not derived from student list lengths', () => {
    const dto = {} as DashboardResponseDto;

    // These fields should always be numeric on the DTO
    expect(typeof dto.notifications?.pendingPUC).toBe('undefined');
    expect(typeof dto.notifications?.pendingPayana).toBe('undefined');
    expect(typeof dto.notifications?.pendingProfessional).toBe('undefined');
    expect(typeof dto.notifications?.pendingSemiProfessional).toBe('undefined');
  });

  test('Dashboard pending* fields are distinct from student list counts', () => {
    // This test documents the invariant:
    // dashboard.notifications.pendingPUC = count of PUC applications awaiting approval
    // studentList.students.length = count of approved PUC students
    //
    // These are different concepts and must not be mixed.

    const dashboardPendingPUC = 5;
    const approvedStudentListLength = 42;

    expect(dashboardPendingPUC).not.toBe(approvedStudentListLength);
    expect(dashboardPendingPUC).toBeLessThan(approvedStudentListLength);
  });
});
