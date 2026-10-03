import { describe, expect, it } from 'vitest';
import { canEdit, canViewAccounting, isManager, isProperty } from '../src/config/permissions.js';
import { translate } from '../src/i18n.js';
import { HOURLY_COST, paymentStatus } from '../src/ui/screens/Accounting.jsx';
describe('Ruoli e lingua', () => {
  it('consente le modifiche da Senior Architect in su', () => {
    expect(canEdit({ appRole: 'architect' })).toBe(false);
    expect(canEdit({ appRole: 'property' })).toBe(false);
    expect(canEdit({ appRole: 'senior_architect' })).toBe(true);
    expect(canEdit({ appRole: 'partner_architect' })).toBe(true);
    expect(isManager({ appRole: 'partner_architect' })).toBe(true);
  });
  it('rende la contabilità visibile a Senior, Partner e Property', () => {
    expect(canViewAccounting({ appRole:'architect' })).toBe(false);
    expect(canViewAccounting({ appRole:'senior_architect' })).toBe(true);
    expect(canViewAccounting({ appRole:'partner_architect' })).toBe(true);
    expect(canViewAccounting({ appRole:'property' })).toBe(true);
    expect(isProperty({ appRole:'property' })).toBe(true);
  });
  it('traduce le sezioni principali', () => {
    expect(translate('it', 'site')).toBe('Cantiere');
    expect(translate('en', 'site')).toBe('Site');
    expect(translate('en', 'bookings')).toBe('Book');
  });
  it('calcola lo stato dei pagamenti e usa il costo orario concordato', () => {
    expect(HOURLY_COST).toBe(10);
    expect(paymentStatus({ expected: 30000, paid: 30000 })).toBe('complete');
    expect(paymentStatus({ expected: 40000, paid: 20000 })).toBe('partial');
    expect(paymentStatus({ expected: 30000, paid: 0 })).toBe('pending');
  });
});
