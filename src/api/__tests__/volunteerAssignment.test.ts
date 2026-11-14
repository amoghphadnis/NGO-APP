/**
 * Volunteer normalization tests
 * The professional assignment endpoint returns { VolunteerID, VolunteerName }
 * while payana/semi-professional return { Id, Name, DisplayName } and some
 * endpoints return { Value, Text }. The picker must receive uniform
 * { Value, Text } rows and never surface dummy/blank options.
 */

import { normalizeVolunteers } from '../volunteerAssignmentApi';

describe('normalizeVolunteers', () => {
  it('returns [] for non-array input', () => {
    expect(normalizeVolunteers(undefined)).toEqual([]);
    expect(normalizeVolunteers(null)).toEqual([]);
    expect(normalizeVolunteers({})).toEqual([]);
  });

  it('maps the professional { VolunteerID, VolunteerName } shape', () => {
    const rows = normalizeVolunteers([
      { VolunteerID: 42, VolunteerName: 'Ravi K', Taluk: 'Dharwad' },
      { VolunteerID: 7, VolunteerName: 'Meena S' },
    ]);
    expect(rows).toEqual([
      { Value: '42', Text: 'Ravi K' },
      { Value: '7', Text: 'Meena S' },
    ]);
  });

  it('maps the payana/semi-professional { Id, DisplayName } shape', () => {
    const rows = normalizeVolunteers([
      { Id: 5, Name: 'Asha', DisplayName: 'Asha (Hubballi)' },
      { Id: 9, Name: 'Kiran' },
    ]);
    expect(rows).toEqual([
      { Value: '5', Text: 'Asha (Hubballi)' },
      { Value: '9', Text: 'Kiran' },
    ]);
  });

  it('passes through { Value, Text } rows', () => {
    const rows = normalizeVolunteers([{ Value: 3, Text: 'Naveen' }]);
    expect(rows).toEqual([{ Value: '3', Text: 'Naveen' }]);
  });

  it('drops rows without a valid positive id or a usable name', () => {
    const rows = normalizeVolunteers([
      { VolunteerID: 0, VolunteerName: 'Zero' },
      { VolunteerID: undefined, VolunteerName: 'NoId' },
      { Id: null, Name: 'NullId' },
      { VolunteerID: 12, VolunteerName: '' },
      { Id: 13 },
      { VolunteerID: 21, VolunteerName: 'Kept' },
    ]);
    expect(rows).toEqual([{ Value: '21', Text: 'Kept' }]);
  });
});
