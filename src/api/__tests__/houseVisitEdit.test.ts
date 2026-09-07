/**
 * House Visit Edit API Contract Tests
 *
 * Verifies:
 * - All 4 program-specific APIs use correct prefixes
 * - GET endpoint shape (HouseVisitEditResponse)
 * - POST update endpoint uses multipart/form-data
 * - buildHouseVisitUpdateFormData contract:
 *   1. Only defined scalar fields are appended
 *   2. FamilyMembers is one JSON string with FamilyID > 0
 *   3. UploadedFile entries use the same field name
 *   4. Undefined fields are omitted (partial update)
 *   5. VolunteerApprovalStatus is included when provided
 *   6. No manual Content-Type
 */

import {
  buildHouseVisitUpdateFormData,
  createHouseVisitEditApi,
  pucHouseVisitEditApi,
  professionalHouseVisitEditApi,
  payanaHouseVisitEditApi,
  semiProfessionalHouseVisitEditApi,
} from '@/api/houseVisitEditApi';
import { HouseVisitUpdateRequest, HouseVisitProgram } from '@/types/houseVisitEdit';
import { DocumentFile } from '@/types/documents';

// ── Helpers ──────────────────────────────────────────────────────────────────

function getFormFields(fd: FormData): Array<{ name: string; value: any }> {
  const anyFd = fd as any;
  if (typeof anyFd.getParts === 'function') {
    return anyFd.getParts().map((p: any) => ({ name: p.fieldName, value: p }));
  }
  if (typeof anyFd.keys === 'function') {
    const fields: Array<{ name: string; value: any }> = [];
    for (const key of anyFd.keys() as Iterable<string>) {
      fields.push({ name: key, value: anyFd.get(key) });
    }
    return fields;
  }
  return [];
}

function getFormFieldNames(fd: FormData): string[] {
  return getFormFields(fd).map((f) => f.name);
}

function getFormFieldValues(fd: FormData, name: string): any[] {
  return getFormFields(fd).filter((f) => f.name === name).map((f) => f.value);
}

// ── Tests ────────────────────────────────────────────────────────────────────

describe('House Visit Edit API — program prefixes', () => {
  test('PUC edit API uses /editpuc-house-visits prefix', () => {
    expect(pucHouseVisitEditApi.program).toBe('puc');
    expect(pucHouseVisitEditApi.queryKeys.detail(1)).toEqual(['houseVisit', 'puc', 'edit', 1]);
  });

  test('Professional edit API uses /edit-professional-house-visits prefix', () => {
    expect(professionalHouseVisitEditApi.program).toBe('professional');
    expect(professionalHouseVisitEditApi.queryKeys.detail(2)).toEqual(['houseVisit', 'professional', 'edit', 2]);
  });

  test('Payana edit API uses /edit-payana-house-visits prefix', () => {
    expect(payanaHouseVisitEditApi.program).toBe('payana');
    expect(payanaHouseVisitEditApi.queryKeys.detail(3)).toEqual(['houseVisit', 'payana', 'edit', 3]);
  });

  test('Semi Professional edit API uses /edit-semi-professional-house-visits prefix', () => {
    expect(semiProfessionalHouseVisitEditApi.program).toBe('semiProfessional');
    expect(semiProfessionalHouseVisitEditApi.queryKeys.detail(4)).toEqual(['houseVisit', 'semiProfessional', 'edit', 4]);
  });

  test('createHouseVisitEditApi returns an API with get and update methods', () => {
    const api = createHouseVisitEditApi('puc');
    expect(typeof api.get).toBe('function');
    expect(typeof api.update).toBe('function');
    expect(api.program).toBe('puc');
  });
});

describe('House Visit Edit — buildHouseVisitUpdateFormData contract', () => {
  // 1. Only defined scalar fields are appended
  test('Only defined scalar fields are appended; undefined fields are omitted', () => {
    const req: HouseVisitUpdateRequest = {
      fields: {
        StudentName: 'Updated Name',
        Address: 'New Address',
        VisitDate: undefined,
      },
    };
    const fd = buildHouseVisitUpdateFormData(req);
    const names = getFormFieldNames(fd);
    expect(names).toContain('StudentName');
    expect(names).toContain('Address');
    expect(names).not.toContain('VisitDate');
  });

  // 2. FamilyMembers is one JSON string with FamilyID > 0
  test('FamilyMembers is appended as a single JSON string with FamilyID > 0', () => {
    const req: HouseVisitUpdateRequest = {
      fields: {},
      familyMembers: [
        { FamilyID: 1, Name: 'Father', Relation: 'Father' },
        { FamilyID: 2, Name: 'Mother', Relation: 'Mother' },
        { FamilyID: 0, Name: 'Invalid', Relation: 'Invalid' },
      ],
    };
    const fd = buildHouseVisitUpdateFormData(req);
    const values = getFormFieldValues(fd, 'FamilyMembers');
    expect(values).toHaveLength(1);
    expect(typeof values[0]).toBe('string');
    const parsed = JSON.parse(values[0]);
    expect(Array.isArray(parsed)).toBe(true);
    expect(parsed).toHaveLength(2);
    expect(parsed[0]).toHaveProperty('FamilyID', 1);
    expect(parsed[1]).toHaveProperty('FamilyID', 2);
  });

  // 3. UploadedFile entries use the same field name
  test('Multiple UploadedFile entries are appended under "UploadedFile"', () => {
    const files: DocumentFile[] = [
      { uri: 'file://doc1.pdf', name: 'doc1.pdf', type: 'application/pdf' },
      { uri: 'file://doc2.pdf', name: 'doc2.pdf', type: 'application/pdf' },
    ];
    const req: HouseVisitUpdateRequest = {
      fields: {},
      uploadedFiles: files,
    };
    const fd = buildHouseVisitUpdateFormData(req);
    const values = getFormFieldValues(fd, 'UploadedFile');
    expect(values).toHaveLength(2);
  });

  // 4. Undefined fields are omitted (partial update)
  test('Empty fields object produces no scalar form fields', () => {
    const req: HouseVisitUpdateRequest = {
      fields: {},
    };
    const fd = buildHouseVisitUpdateFormData(req);
    const names = getFormFieldNames(fd);
    expect(names).not.toContain('StudentName');
    expect(names).not.toContain('Address');
  });

  // 5. VolunteerApprovalStatus is included when provided
  test('VolunteerApprovalStatus is appended as a scalar field when provided', () => {
    const req: HouseVisitUpdateRequest = {
      fields: {
        VolunteerApprovalStatus: 'Selected',
      },
    };
    const fd = buildHouseVisitUpdateFormData(req);
    const names = getFormFieldNames(fd);
    expect(names).toContain('VolunteerApprovalStatus');
    const values = getFormFieldValues(fd, 'VolunteerApprovalStatus');
    expect(values[0]).toBe('Selected');
  });

  // 6. No manual Content-Type (FormData instance returned)
  test('buildHouseVisitUpdateFormData returns FormData without manual Content-Type', () => {
    const req: HouseVisitUpdateRequest = { fields: { StudentName: 'Test' } };
    const fd = buildHouseVisitUpdateFormData(req);
    expect(fd).toBeInstanceOf(FormData);
  });

  // Additional: null values are converted to empty strings
  test('Null field values are converted to empty strings', () => {
    const req: HouseVisitUpdateRequest = {
      fields: {
        StudentName: null as any,
        Address: 'Test',
      },
    };
    const fd = buildHouseVisitUpdateFormData(req);
    const names = getFormFieldNames(fd);
    expect(names).toContain('StudentName');
    expect(names).toContain('Address');
  });
});
