import type { DemoGarage, DemoInquiry } from './demoInquiryTypes.js';

export class DemoValidationError extends Error {}
const emailPattern: RegExp = /^[^\s@,;<>]+@[^\s@,;<>]+\.[^\s@,;<>]+$/;
const requestIdPattern: RegExp = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const validateDemoInquiry = (body: unknown, garage: DemoGarage): DemoInquiry => {
  if (!body || typeof body !== 'object' || Array.isArray(body)) throw new DemoValidationError('Demande invalide.');
  const input: Record<string, unknown> = body as Record<string, unknown>;
  if (input.website) throw new DemoValidationError('Demande invalide.');
  const field = (key: string, limit: number, required: boolean = false): string => {
    const value: unknown = input[key];
    if (value !== undefined && typeof value !== 'string') throw new DemoValidationError('Champ invalide.');
    const text: string = typeof value === 'string' ? value.trim() : '';
    if (text.length > limit || (required && !text)) throw new DemoValidationError('Vérifiez les champs obligatoires et leur longueur.');
    return text;
  };
  const inquiry: DemoInquiry = {
    requestId: field('requestId', 36, true), name: field('name', 100, true), email: field('email', 150, true),
    phone: field('phone', 30, true), make: field('make', 80, true), year: field('year', 4, true),
    model: field('model', 80, true), trim: field('trim', 80), service: field('service', 160, true),
    size: field('size', 40), notes: field('notes', 1500), date: field('date', 10, garage === 'str'), time: field('time', 5, garage === 'str'),
  };
  if (!emailPattern.test(inquiry.email) || !requestIdPattern.test(inquiry.requestId)) throw new DemoValidationError('Courriel ou demande invalide.');
  if (!/^\d{4}$/.test(inquiry.year) || Number(inquiry.year) < 1965 || Number(inquiry.year) > new Date().getFullYear() + 1) throw new DemoValidationError('Année invalide.');
  if (garage === 'str') {
    const date: Date = new Date(`${inquiry.date}T12:00:00Z`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(inquiry.date) || !Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== inquiry.date || !/^(08|09|10|11|13|14|15|16):00$/.test(inquiry.time)) throw new DemoValidationError('Date ou heure invalide.');
  }
  return inquiry;
};
