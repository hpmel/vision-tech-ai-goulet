export interface GouletInquiry {
  make: string;
  year: string;
  model: string;
  trim: string;
  service: string;
  name: string;
  phone: string;
  email: string;
  size: string;
  notes: string;
}

export const createGouletEmail = (inquiry: GouletInquiry): string => {
  const subject: string = `Demande : ${inquiry.service} | ${inquiry.name}`;
  const body: string = [
    'Bonjour Pneus Goulet,', '',
    `Service : ${inquiry.service}`,
    `Véhicule : ${inquiry.make} ${inquiry.model} ${inquiry.year}`,
    `Version : ${inquiry.trim || 'Non précisée'}`,
    `Dimension des pneus : ${inquiry.size || 'À déterminer'}`, '',
    `Nom : ${inquiry.name}`, `Téléphone : ${inquiry.phone || 'Non précisé'}`,
    `Courriel : ${inquiry.email}`, '', inquiry.notes,
    '', 'Je comprends que cette demande ne constitue pas une réservation.',
  ].join('\n');
  return `mailto:pneusgoulet@hotmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};
