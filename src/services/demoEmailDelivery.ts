import { createHash } from 'node:crypto';
import nodemailer, { type Transporter } from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';
import { buildDemoEmails } from './demoEmailTemplates.js';
import type { DemoDelivery, DemoGarage, DemoInquiry, DemoMessage } from './demoInquiryTypes.js';

export type DemoSender = (message: DemoMessage) => Promise<void>;
interface DeliveryRecord { fingerprint: string; expires: number; delivery: DemoDelivery; pending?: Promise<DemoDelivery> }
interface RateRecord { count: number; expires: number }
const deliveries: Map<string, DeliveryRecord> = new Map();
const limits: Map<string, RateRecord> = new Map();
let transport: Transporter<SMTPTransport.SentMessageInfo> | undefined;
export class DemoRateError extends Error {}
export class DemoConfigurationError extends Error {}

export const configuredDemoGarage = (): DemoGarage => {
  const garage: string | undefined = process.env.DEMO_GARAGE;
  if (garage !== 'str' && garage !== 'goulet') throw new DemoConfigurationError('Demo garage is not configured.');
  return garage;
};

export const allowedDemoOrigin = (origin: string, garage: DemoGarage): boolean => {
  const domain: string = garage === 'str' ? 'https://garagestr.vision-tech-ai.com' : 'https://goulet.vision-tech-ai.com';
  const configured: string[] = (process.env.DEMO_ALLOWED_ORIGINS || '').split(',').map((value: string): string => value.trim()).filter(Boolean);
  return origin === domain || configured.includes(origin) || (process.env.NODE_ENV !== 'production' && /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin));
};

const smtpTransport = (): Transporter<SMTPTransport.SentMessageInfo> => {
  const user: string = process.env.SMTP_USER?.trim() || '';
  const pass: string = process.env.SMTP_PASS?.replace(/\s/g, '') || '';
  if (!user || !pass) throw new DemoConfigurationError('SMTP is not configured.');
  transport ??= nodemailer.createTransport({ host: process.env.SMTP_HOST || 'smtp.gmail.com', port: 465, secure: true, auth: { user, pass }, connectionTimeout: 10000, greetingTimeout: 10000, socketTimeout: 15000 });
  return transport;
};

export const verifyDemoTransport = async (): Promise<void> => { await smtpTransport().verify(); };

const smtpSender: DemoSender = async (message: DemoMessage): Promise<void> => {
  const user: string = process.env.SMTP_USER?.trim() || '';
  const result: SMTPTransport.SentMessageInfo = await smtpTransport().sendMail({ ...message, from: { name: 'Vision-Tech AI — Démonstration', address: user }, replyTo: { name: 'Vision-Tech AI — Démonstration', address: user }, disableFileAccess: true, disableUrlAccess: true });
  if (!result.accepted.length || result.rejected.length) throw new Error('SMTP did not accept the message.');
};

export const deliverDemoEmails = async (inquiry: DemoInquiry, garage: DemoGarage, clientIp: string, send: DemoSender = smtpSender): Promise<DemoDelivery> => {
  const now: number = Date.now();
  for (const [key, record] of deliveries) if (record.expires < now) deliveries.delete(key);
  for (const [key, record] of limits) if (record.expires < now) limits.delete(key);
  const fingerprint: string = createHash('sha256').update(JSON.stringify({ garage, inquiry })).digest('hex');
  let record: DeliveryRecord | undefined = deliveries.get(inquiry.requestId);
  if (record && record.fingerprint !== fingerprint) throw new DemoRateError('Cette demande a changé. Actualisez le formulaire.');
  if (record?.pending) return record.pending;
  if (record?.delivery.success) return record.delivery;
  const keys: string[] = [`ip:${clientIp}`, `email:${inquiry.email.toLowerCase()}`];
  if (keys.some((key: string): boolean => (limits.get(key)?.count ?? 0) >= 3)) throw new DemoRateError('Trop d’essais rapprochés. Réessayez dans 15 minutes.');
  for (const key of keys) {
    const limit: RateRecord = limits.get(key) ?? { count: 0, expires: now + 15 * 60 * 1000 };
    limit.count += 1;
    limits.set(key, limit);
  }
  if (!record) {
    record = { fingerprint, expires: now + 15 * 60 * 1000, delivery: { success: false, reference: `${garage === 'str' ? 'STR' : 'GOULET'}-DEMO-${inquiry.requestId.slice(0, 8).toUpperCase()}`, confirmationSent: false, ownerCopySent: false } };
    deliveries.set(inquiry.requestId, record);
  }
  const current: DeliveryRecord = record;
  const messages: [DemoMessage, DemoMessage] = buildDemoEmails(inquiry, garage, current.delivery.reference);
  const deliver = async (): Promise<DemoDelivery> => {
    for (const [index, flag] of ['confirmationSent', 'ownerCopySent'].entries()) {
      const key: 'confirmationSent' | 'ownerCopySent' = flag === 'confirmationSent' ? 'confirmationSent' : 'ownerCopySent';
      if (current.delivery[key]) continue;
      try {
        await send(messages[index]);
        current.delivery[key] = true;
      } catch (error: unknown) {
        console.error('Demo email send failed.', { garage, reference: current.delivery.reference, message: key, error: error instanceof Error ? error.name : 'UnknownError' });
      }
    }
    current.delivery.success = current.delivery.confirmationSent && current.delivery.ownerCopySent;
    return { ...current.delivery };
  };
  current.pending = deliver();
  try { return await current.pending; } finally { delete current.pending; }
};
