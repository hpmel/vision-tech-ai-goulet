import { useState, type FormEvent, type ReactElement } from 'react';
import { ArrowUpRight, Check, Mail, RotateCcw } from 'lucide-react';
import { createGouletEmail, type GouletInquiry } from '../services/gouletInquiry';
import { VehicleFields } from '../components/VehicleFields';

const services: string[] = ['Pneus neufs', 'Pneus usagés', 'Pose de pneus', 'Entreposage', 'Jantes et mags', 'Autre demande'];

export const InquiryForm = (): ReactElement => {
  const [emailLink, setEmailLink] = useState<string>('');
  const [service, setService] = useState<string>('');
  const prepare = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const data: FormData = new FormData(event.currentTarget);
    const read = (key: keyof GouletInquiry): string => String(data.get(key) ?? '').trim();
    const inquiry: GouletInquiry = { make: read('make'), year: read('year'), model: read('model'), trim: read('trim'), service: read('service'), name: read('name'), phone: read('phone'), email: read('email'), size: read('size'), notes: read('notes') };
    setEmailLink(createGouletEmail(inquiry));
  };
  return <div className="inquiry-panel">
    <div className="form-topline"><span>LE COMPTOIR EN LIGNE</span><span>ON VOUS ÉCOUTE <Mail size={15}/></span></div>
    <h3>Parlons pneus.</h3>
    <p>Un prix, une dimension, une question ? Donnez-nous les détails.</p>
    <form onSubmit={prepare} onChange={(): void => { if (emailLink) setEmailLink(''); }}>
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
      <p className="form-note">* Champs requis. Vos renseignements servent à préparer votre courriel. Aucune réservation ni transmission automatique.</p>
      {emailLink ? <div className="form-ready" role="status"><div><Check size={20}/><strong>Votre courriel est prêt.</strong></div><p>Ouvrez votre messagerie, vérifiez les détails, puis envoyez-le au garage.</p><a className="button button-red" href={emailLink}>Ouvrir ma messagerie <ArrowUpRight size={19}/></a><button type="button" className="edit-form" onClick={(): void => setEmailLink('')}><RotateCcw size={14}/> Modifier ma demande</button><small>Pas d’application courriel ? Appelez le <a href="tel:+18195640019">819 564-0019</a>.</small></div> : <button type="submit" className="button button-red form-submit">Préparer ma demande <ArrowUpRight size={20}/></button>}
    </form>
    <div className="form-bottomline"><span>DU BON MONDE. DES BONS PNEUS.</span><span>PNEUS GOULET</span></div>
  </div>;
};
