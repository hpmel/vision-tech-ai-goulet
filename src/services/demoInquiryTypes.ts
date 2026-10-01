export interface DemoInquiry {
  requestId: string;
  name: string;
  email: string;
  phone: string;
  make: string;
  year: string;
  model: string;
  trim: string;
  service: string;
  size: string;
  notes: string;
  date: string;
  time: string;
}

export type DemoGarage = 'goulet' | 'str';
export interface DemoDelivery {
  success: boolean;
  reference: string;
  confirmationSent: boolean;
  ownerCopySent: boolean;
}

export interface DemoMessage {
  to: { name: string; address: string };
  subject: string;
  text: string;
  html: string;
}
