import { describe, expect, it } from 'vitest';
import { canEdit, isManager } from '../src/config/permissions.js';
import { translate } from '../src/i18n.js';
describe('Ruoli e lingua', () => {
  it('consente le modifiche da Senior Architect in su', () => {
    expect(canEdit({ appRole: 'architect' })).toBe(false);
    expect(canEdit({ appRole: 'property' })).toBe(false);
    expect(canEdit({ appRole: 'senior_architect' })).toBe(true);
    expect(canEdit({ appRole: 'partner_architect' })).toBe(true);
    expect(isManager({ appRole: 'partner_architect' })).toBe(true);
  });
  it('traduce le sezioni principali', () => {
    expect(translate('it', 'site')).toBe('Cantiere');
    expect(translate('en', 'site')).toBe('Site');
    expect(translate('en', 'bookings')).toBe('Book');
  });
});
