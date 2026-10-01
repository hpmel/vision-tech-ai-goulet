import type { VercelRequest, VercelResponse } from '@vercel/node';
import { allowedDemoOrigin, configuredDemoGarage, deliverDemoEmails, DemoRateError, DemoConfigurationError } from '../services/demoEmailDelivery.js';
import { validateDemoInquiry, DemoValidationError } from '../services/demoInquiryValidation.js';
import type { DemoDelivery, DemoGarage, DemoInquiry } from '../services/demoInquiryTypes.js';

export const demoInquiryHandler = async (request: VercelRequest, response: VercelResponse): Promise<void> => {
  response.setHeader('Cache-Control', 'no-store');
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    response.status(405).json({ error: 'Méthode non autorisée.' });
    return;
  }
  try {
    const garage: DemoGarage = configuredDemoGarage();
    const origin: string = typeof request.headers.origin === 'string' ? request.headers.origin : '';
    if (!allowedDemoOrigin(origin, garage)) { response.status(403).json({ error: 'Origine non autorisée.' }); return; }
    const body: unknown = request.body;
    if (Buffer.byteLength(JSON.stringify(body) || '') > 12000) { response.status(413).json({ error: 'Demande trop volumineuse.' }); return; }
    const inquiry: DemoInquiry = validateDemoInquiry(body, garage);
    const forwarded: string | string[] | undefined = request.headers['x-forwarded-for'];
    const ip: string = typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : request.socket?.remoteAddress || 'unknown';
    const delivery: DemoDelivery = await deliverDemoEmails(inquiry, garage, ip);
    response.status(delivery.success ? 200 : 502).json({ ...delivery, ...(delivery.success ? {} : { error: delivery.confirmationSent || delivery.ownerCopySent ? 'Un seul courriel a pu être envoyé. Vous pouvez réessayer pour le second.' : 'Les courriels n’ont pas pu être envoyés. Veuillez réessayer.' }) });
  } catch (error: unknown) {
    if (error instanceof DemoValidationError) { response.status(400).json({ error: error.message }); return; }
    if (error instanceof DemoRateError) { response.setHeader('Retry-After', '900'); response.status(429).json({ error: error.message }); return; }
    console.error('Demo inquiry request failed.', { error: error instanceof Error ? error.name : 'UnknownError' });
    response.status(error instanceof DemoConfigurationError ? 503 : 500).json({ error: 'Le service de démonstration est temporairement indisponible.' });
  }
};
