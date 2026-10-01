import { timingSafeEqual } from 'node:crypto';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { configuredDemoGarage, verifyDemoTransport } from '../services/demoEmailDelivery.js';

export const demoHealthHandler = async (request: VercelRequest, response: VercelResponse): Promise<void> => {
  response.setHeader('Cache-Control', 'no-store');
  const secret: string = process.env.DEMO_DIAGNOSTIC_TOKEN || '';
  const authorization: string = typeof request.headers.authorization === 'string' ? request.headers.authorization : '';
  const expected: string = `Bearer ${secret}`;
  if (!secret || Buffer.byteLength(authorization) !== Buffer.byteLength(expected) || !timingSafeEqual(Buffer.from(authorization), Buffer.from(expected))) { response.status(403).json({ error: 'Accès interdit.' }); return; }
  if (request.method !== 'GET') { response.setHeader('Allow', 'GET'); response.status(405).json({ error: 'Méthode non autorisée.' }); return; }
  try {
    const garage: string = configuredDemoGarage();
    await verifyDemoTransport();
    response.status(200).json({ success: true, garage, smtpAuthenticated: true });
  } catch (error: unknown) {
    console.error('Demo SMTP authentication failed.', { error: error instanceof Error ? error.name : 'UnknownError' });
    response.status(503).json({ success: false, smtpAuthenticated: false });
  }
};
