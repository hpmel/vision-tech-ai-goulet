const consentKey: string = 'vision-tech-ai:goulet:demo-consent:v1';

export const hasDemoConsent = (): boolean => {
  try { return window.sessionStorage.getItem(consentKey) === 'accepted'; }
  catch (error: unknown) {
    console.error('Impossible de lire le consentement de démonstration.', error);
    return false;
  }
};

export const saveDemoConsent = (): void => {
  try { window.sessionStorage.setItem(consentKey, 'accepted'); }
  catch (error: unknown) { console.error('Impossible de conserver le consentement pour cette session.', error); }
};

export const clearDemoConsent = (): void => {
  try { window.sessionStorage.removeItem(consentKey); }
  catch (error: unknown) { console.error('Impossible de supprimer le consentement de cette session.', error); }
};
