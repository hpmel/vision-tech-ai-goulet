import { useState, type FormEvent, type ReactElement } from 'react';
import { ArrowUpRight, Check, Mail, RotateCcw } from 'lucide-react';
import type { GouletInquiry } from '../services/gouletInquiry';
import { VehicleFields } from '../components/VehicleFields';

const services: string[] = ['Pneus neufs', 'Pneus usagés', 'Pose de pneus', 'Entreposage', 'Jantes et mags', 'Autre demande'];

export const InquiryForm = (): ReactElement => {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [feedback, setFeedback] = useState<string>('');
  const [requestId, setRequestId] = useState<string>(() => crypto.randomUUID());
  const [service, setService] = useState<string>('');
  const prepare = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    if (status === 'sending') return;
    const data: FormData = new FormData(event.currentTarget);
    const read = (key: keyof GouletInquiry): string => String(data.get(key) ?? '').trim();
    const inquiry: GouletInquiry = { make: read('make'), year: read('year'), model: read('model'), trim: read('trim'), service: read('service'), name: read('name'), phone: read('phone'), email: read('email'), size: read('size'), notes: read('notes') };
    setStatus('sending');
    setFeedback('');
    try {
      const response: Response = await fetch('/api/demo-inquiry', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...inquiry, requestId, website: String(data.get('website') ?? '') }) });
      const result: { success?: boolean; error?: string } = await response.json() as { success?: boolean; error?: string };
      if (!response.ok || !result.success) throw new Error(result.error || 'Les courriels n’ont pas pu être envoyés.');
      setFeedback(`Deux courriels de démonstration ont été envoyés à ${inquiry.email} : votre confirmation et la copie propriétaire. Vérifiez aussi vos indésirables.`);
      setStatus('success');
    } catch (error: unknown) {
      console.error('Échec de la demande de démonstration Goulet.', { error: error instanceof Error ? error.name : 'UnknownError' });
      setFeedback(error instanceof Error ? error.message : 'L’envoi a échoué. Veuillez réessayer.');
      setStatus('error');
    }
  };
  return <div className="inquiry-panel">
    <div className="form-topline"><span>LE COMPTOIR EN LIGNE</span><span>ON VOUS ÉCOUTE <Mail size={15}/></span></div>
    <h3>Parlons pneus.</h3>
    <p>Essayez le formulaire : recevez la confirmation client et la copie propriétaire à votre adresse.</p>
    <form onSubmit={prepare} onChange={(): void => { if (status === 'sending') return; setStatus('idle'); setFeedback(''); setRequestId(crypto.randomUUID()); }}>
      <div className="demo-honeypot" aria-hidden="true"><label>Site web<input name="website" tabIndex={-1} autoComplete="off"/></label></div>
      <fieldset className="demo-form-fields" disabled={status === 'sending'}>
      <VehicleFields/>
      <fieldset><legend>Ce qu’on peut faire pour vous</legend><div className="form-grid">
        <label>Service *<select name="service" required value={service} onChange={(event): void => setService(event.target.value)}><option value="" disabled>Choisir un service</option>{services.map((item: string) => <option key={item}>{item}</option>)}</select></label>
        <label>Dimension des pneus<input name="size" placeholder="Ex. 205/55 R16" maxLength={40}/></label>
      </div>{service === 'Pose de pneus' && <p className="field-hint">La pose se fait sans rendez-vous. Appelez-nous pour connaître l’affluence avant de passer.</p>}</fieldset>
      <fieldset><legend>Vos coordonnées</legend><div className="form-grid">
        <label>Nom complet *<input name="name" autoComplete="name" placeholder="Votre nom" required maxLength={100}/></label>
        <label>Téléphone<input name="phone" type="tel" autoComplete="tel" placeholder="819 000-0000" maxLength={30}/></label>
        <label className="full-field">Courriel *<input name="email" type="email" autoComplete="email" placeholder="vous@exemple.ca" required maxLength={150}/></label>
        <label className="full-field">Un petit mot de plus ?<textarea name="notes" placeholder="Votre besoin, votre budget, vos questions…" rows={3} maxLength={1500}/></label>
      </div></fieldset>
      </fieldset>
      <p className="form-note">MODE DÉMONSTRATION — Deux courriels sont envoyés uniquement à votre adresse. Aucune réservation réelle ni transmission au garage.</p>
      {status === 'success' ? <div className="form-ready" role="status"><div><Check size={20}/><strong>Votre essai a été envoyé.</strong></div><p>{feedback}</p><button type="button" className="edit-form" onClick={(): void => { setStatus('idle'); setFeedback(''); setRequestId(crypto.randomUUID()); }}><RotateCcw size={14}/> Faire un autre essai</button></div> : <>
        {status === 'error' && <p className="field-hint" role="alert">{feedback}</p>}
        <button type="submit" className="button button-red form-submit" disabled={status === 'sending'}>{status === 'sending' ? 'Envoi des deux courriels…' : 'Essayer la démonstration'} <ArrowUpRight size={20}/></button>
      </>}
    </form>
    <div className="form-bottomline"><span>DU BON MONDE. DES BONS PNEUS.</span><span>PNEUS GOULET</span></div>
  </div>;
};
