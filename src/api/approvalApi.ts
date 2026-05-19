/**
 * Approval Workflow API
 * Handles student approval and rejection workflows
 * Scalable structure for future approval features
 */

import api from './client';
import { normalizeApiResponse, normalizeApiError, NormalizedApiResponse } from './transformers/normalizeApiResponse';

/**
 * Gets approval status for a student application
 * GET /api/students/approval/status/:applicationId
 */
export async function getApprovalStatus(
  applicationId: string
): Promise<NormalizedApiResponse<any>> {
  try {
    const response = await api.get(`/students/approval/status/${applicationId}`);
    return normalizeApiResponse(response.data);
  } catch (error: any) {
    return normalizeApiError(error);
  }
}

/**
 * Approves a student application
 * POST /api/students/approval/approve
 */
export async function approveStudent(
  applicationId: string,
  comments?: string
): Promise<NormalizedApiResponse<any>> {
  try {
    const response = await api.post('/students/approval/approve', {
      applicationId,
      comments,
    });
    return normalizeApiResponse(response.data);
  } catch (error: any) {
    return normalizeApiError(error);
  }
}

/**
 * Rejects a student application
 * POST /api/students/approval/reject
 */
export async function rejectStudent(
  applicationId: string,
  reason: string
): Promise<NormalizedApiResponse<any>> {
  try {
    const response = await api.post('/students/approval/reject', {
      applicationId,
      reason,
    });
    return normalizeApiResponse(response.data);
  } catch (error: any) {
    return normalizeApiError(error);
  }
}

/**
 * Submits house visit link for approval workflow
 * POST /api/students/approval/house-visit
 */
export async function submitHouseVisitLink(
  applicationId: string,
  houseVisitLink: string
): Promise<NormalizedApiResponse<any>> {
  try {
    const response = await api.post('/students/approval/house-visit', {
      applicationId,
      houseVisitLink,
    });
    return normalizeApiResponse(response.data);
  } catch (error: any) {
    return normalizeApiError(error);
  }
}
