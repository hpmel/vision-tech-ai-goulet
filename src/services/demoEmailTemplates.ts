import type { DemoGarage, DemoInquiry, DemoMessage } from './demoInquiryTypes.js';

const escapeHtml = (value: string): string => value.replace(/[&<>"']/g, (character: string): string => {
  const entities: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  return entities[character];
});

export const buildDemoEmails = (inquiry: DemoInquiry, garage: DemoGarage, reference: string): [DemoMessage, DemoMessage] => {
  const brand: string = garage === 'str' ? 'Garage STR' : 'Pneus Goulet';
  const vehicle: string = [inquiry.year, inquiry.make, inquiry.model, inquiry.trim].filter(Boolean).join(' ');
  const details: Array<[string, string]> = [
    ['Référence démo', reference], ['Nom', inquiry.name], ['Courriel', inquiry.email], ['Téléphone', inquiry.phone || 'Non précisé'],
    ['Service', inquiry.service], ['Véhicule', vehicle],
    ['Dimension des pneus', inquiry.size || 'À déterminer'],
    ['Date souhaitée', inquiry.date], ['Heure souhaitée', inquiry.time],
    ['Notes', inquiry.notes || 'Aucune note'],
  ];
  const detailText: string = details.map(([label, value]: [string, string]): string => `${label} : ${value}`).join('\n');
  const rows: string = details.map(([label, value]: [string, string]): string => `<tr><td style="padding:10px;border-bottom:1px solid #ddd;font-weight:bold;vertical-align:top">${escapeHtml(label)}</td><td style="padding:10px;border-bottom:1px solid #ddd;white-space:pre-wrap;overflow-wrap:anywhere">${escapeHtml(value)}</td></tr>`).join('');
  const notice: string = 'Démonstration uniquement : aucune réservation réelle n’a été créée et aucune demande n’a été transmise au garage.';
  const create = (ownerCopy: boolean): DemoMessage => {
    const title: string = ownerCopy ? 'Aperçu du courriel propriétaire' : 'Confirmation de votre demande de démonstration';
    const introduction: string = ownerCopy
      ? 'Voici le courriel que le propriétaire recevrait. En mode démonstration, cette copie est envoyée uniquement à votre adresse. Votre confirmation arrive dans un autre courriel.'
      : `Bonjour ${inquiry.name}, voici le récapitulatif de votre essai du formulaire ${brand}. Vous recevrez également un second courriel identifié « Copie propriétaire ».`;
    return {
      to: { name: inquiry.name, address: inquiry.email },
      subject: ownerCopy ? `[DÉMO — COPIE PROPRIÉTAIRE] ${brand} — ${reference}` : `[DÉMO] Confirmation — ${brand} — ${reference}`,
      text: `${brand}\n${title}\n\n${introduction}\n\n${detailText}\n\n${notice}`,
      html: `<!doctype html><html lang="fr"><head><meta charset="utf-8"></head><body style="margin:0;background:#f3f1eb;font-family:Arial,sans-serif;color:#202020"><table role="presentation" width="100%"><tr><td style="padding:24px"><table role="presentation" width="100%" style="max-width:620px;margin:auto;background:#fff;border:1px solid #ddd"><tr><td style="padding:24px;background:#171717;color:#fff"><p style="margin:0 0 10px;color:#efbc44">${ownerCopy ? 'DÉMO — COPIE PROPRIÉTAIRE' : 'DÉMONSTRATION'}</p><h1 style="font-size:24px;margin:0">${brand}</h1></td></tr><tr><td style="padding:24px"><h2 style="font-size:20px">${title}</h2><p style="line-height:1.6">${escapeHtml(introduction)}</p><table width="100%" style="border-collapse:collapse;font-size:14px">${rows}</table><p style="padding:16px;background:#fff3cc;line-height:1.6">${notice}</p></td></tr></table></td></tr></table></body></html>`,
    };
  };
  return [create(false), create(true)];
};
