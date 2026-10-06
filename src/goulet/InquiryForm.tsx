import { useState, type FormEvent, type ReactElement } from 'react';
import { ArrowUpRight, Check, RotateCcw } from 'lucide-react';
import type { GouletInquiry } from '../services/gouletInquiry';
import { VehicleFields } from '../components/VehicleFields';

const services: string[] = [
  'Pneus neufs et usagés',
  'Pose de pneus',
  'Entreposage',
  'Vente et pose de rim (mag)',
  'Vente d’essuie-glace',
  'Démarreur à distance',
  'Pare-brise',
  'Sièges chauffants',
  'Attache-remorques',
  'Accessoires d’autos et camions',
  'Autre demande'
];

const tireSizeGroups: { group: string; sizes: string[] }[] = [
  {
    group: '14 pouces',
    sizes: ['175/65 R14', '185/60 R14', '185/65 R14', '185/70 R14']
  },
  {
    group: '15 pouces',
    sizes: [
      '185/60 R15', '185/65 R15', '195/60 R15', '195/65 R15',
      '205/65 R15', '205/70 R15', '215/70 R15', '235/75 R15'
    ]
  },
  {
    group: '16 pouces',
    sizes: [
      '195/55 R16', '205/55 R16', '205/60 R16', '205/65 R16',
      '215/55 R16', '215/60 R16', '215/65 R16', '215/70 R16',
      '225/60 R16', '225/65 R16', '225/70 R16', '235/60 R16',
      '245/70 R16', '245/75 R16', '265/70 R16', '265/75 R16'
    ]
  },
  {
    group: '17 pouces',
    sizes: [
      '205/50 R17', '215/45 R17', '215/50 R17', '215/55 R17',
      '215/60 R17', '215/65 R17', '225/45 R17', '225/50 R17',
      '225/55 R17', '225/60 R17', '225/65 R17', '235/55 R17',
      '235/60 R17', '235/65 R17', '245/65 R17', '245/70 R17',
      '265/70 R17'
    ]
  },
  {
    group: '18 pouces',
    sizes: [
      '225/40 R18', '225/45 R18', '225/50 R18', '225/55 R18',
      '225/60 R18', '235/40 R18', '235/45 R18', '235/50 R18',
      '235/55 R18', '235/60 R18', '235/65 R18', '245/40 R18',
      '245/45 R18', '245/60 R18', '255/55 R18', '255/60 R18',
      '265/60 R18', '265/65 R18', '275/65 R18'
    ]
  },
  {
    group: '19 pouces',
    sizes: [
      '225/45 R19', '235/35 R19', '235/40 R19', '235/45 R19',
      '235/50 R19', '235/55 R19', '245/40 R19', '245/45 R19',
      '255/40 R19', '255/45 R19', '255/50 R19', '255/55 R19'
    ]
  },
  {
    group: '20 pouces',
    sizes: [
      '245/45 R20', '245/50 R20', '255/45 R20', '255/50 R20',
      '255/55 R20', '265/50 R20', '275/40 R20', '275/45 R20',
      '275/55 R20', '275/60 R20', '285/50 R20'
    ]
  },
  {
    group: '21 et 22 pouces',
    sizes: ['275/40 R21', '275/45 R21', '285/40 R22', '285/45 R22']
  }
];

const timeSlots: { value: string; label: string }[] = [
  { value: '08:00', label: '08:00 (8 h 00)' },
  { value: '09:00', label: '09:00 (9 h 00)' },
  { value: '10:00', label: '10:00 (10 h 00)' },
  { value: '11:00', label: '11:00 (11 h 00)' },
  { value: '13:00', label: '13:00 (13 h 00)' },
  { value: '14:00', label: '14:00 (14 h 00)' },
  { value: '15:00', label: '15:00 (15 h 00)' },
  { value: '16:00', label: '16:00 (16 h 00)' }
];

const isWeekend = (dateStr: string): boolean => {
  if (!dateStr) return false;
  const parts: number[] = dateStr.split('-').map(Number);
  if (parts.length !== 3) return false;
  const day: number = new Date(parts[0], parts[1] - 1, parts[2]).getDay();
  return day === 0 || day === 6;
};

const getMinBookingDate = (): string => {
  const d: Date = new Date();
  const year: number = d.getFullYear();
  const month: string = String(d.getMonth() + 1).padStart(2, '0');
  const day: string = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getMaxBookingDate = (): string => {
  const d: Date = new Date();
  d.setMonth(d.getMonth() + 4);
  const year: number = d.getFullYear();
  const month: string = String(d.getMonth() + 1).padStart(2, '0');
  const day: string = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatPhoneNumber = (value: string): string => {
  let digits: string = value.replace(/\D/g, '');
  if (digits.length === 11 && digits.startsWith('1')) {
    digits = digits.slice(1);
  }
  digits = digits.slice(0, 10);
  if (!digits) return '';
  if (digits.length <= 3) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
};

export const InquiryForm = (): ReactElement => {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [feedback, setFeedback] = useState<string>('');
  const [requestId, setRequestId] = useState<string>(() => crypto.randomUUID());
  const [service, setService] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [sizeSelect, setSizeSelect] = useState<string>('');
  const [customSize, setCustomSize] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [dateWarning, setDateWarning] = useState<string>('');
  const [bookedSlots, setBookedSlots] = useState<string[]>((): string[] => {
    try {
      const raw: string | null = localStorage.getItem('goulet_booked_slots');
      if (raw) return JSON.parse(raw) as string[];
    } catch {
      // ignore
    }
    return [];
  });

  const handleDateChange = (val: string): void => {
    setDate(val);
    setTime('');
    if (!val) {
      setDateWarning('');
      return;
    }
    if (isWeekend(val)) {
      setDateWarning('Le garage est fermé les samedis et dimanches. Veuillez choisir une date du lundi au vendredi (8 h à 17 h).');
    } else {
      setDateWarning('');
    }
  };

  const resetForm = (): void => {
    setStatus('idle');
    setFeedback('');
    setRequestId(crypto.randomUUID());
    setService('');
    setPhone('');
    setSizeSelect('');
    setCustomSize('');
    setDate('');
    setTime('');
    setDateWarning('');
  };

  const prepare = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    if (status === 'sending') return;
    const data: FormData = new FormData(event.currentTarget);
    const read = (key: keyof GouletInquiry): string => String(data.get(key) ?? '').trim();
    const resolvedSize: string = sizeSelect === 'autre' ? customSize.trim() : (sizeSelect || read('size'));
    const resolvedDate: string = date.trim() || read('date');
    const resolvedTime: string = time.trim() || read('time');
    if (isWeekend(resolvedDate)) {
      setDateWarning('Le garage est fermé les samedis et dimanches. Veuillez choisir un jour du lundi au vendredi.');
      return;
    }
    const inquiry: GouletInquiry = {
      make: read('make'),
      year: read('year'),
      model: read('model'),
      trim: read('trim'),
      service: read('service'),
      name: read('name'),
      phone: phone.trim() || read('phone'),
      email: read('email'),
      size: resolvedSize,
      notes: read('notes'),
      date: resolvedDate,
      time: resolvedTime
    };
    setStatus('sending');
    setFeedback('');
    try {
      const response: Response = await fetch('/api/demo-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...inquiry, requestId, website: String(data.get('website') ?? '') })
      });
      const result: { success?: boolean; error?: string } = await response.json() as { success?: boolean; error?: string };
      if (!response.ok || !result.success) throw new Error(result.error || 'Les courriels n’ont pas pu être envoyés.');
      if (resolvedDate && resolvedTime) {
        const slotKey: string = `${resolvedDate}_${resolvedTime}`;
        setBookedSlots((prev: string[]): string[] => {
          const next: string[] = [...prev, slotKey];
          try { localStorage.setItem('goulet_booked_slots', JSON.stringify(next)); } catch { /* ignore */ }
          return next;
        });
      }
      setFeedback(`Deux courriels de démonstration ont été envoyés à ${inquiry.email} : votre confirmation (avec votre date et heure) et la copie propriétaire. Vérifiez aussi vos indésirables.`);
      setStatus('success');
    } catch (error: unknown) {
      console.error('Échec de la demande de démonstration Goulet.', { error: error instanceof Error ? error.name : 'UnknownError' });
      setFeedback(error instanceof Error ? error.message : 'L’envoi a échoué. Veuillez réessayer.');
      setStatus('error');
    }
  };

  return <div className="inquiry-panel">
    <div className="form-topline form-topline-centered"><span>Prise de rendez-vous ici</span></div>
    <h3>Parlons pneus.</h3>
    <p>Essayez le formulaire : recevez la confirmation client et la copie propriétaire à votre adresse.</p>
    <form onSubmit={prepare} onChange={(): void => { if (status === 'sending') return; if (status !== 'idle') { setStatus('idle'); setFeedback(''); } }}>
      <div className="demo-honeypot" aria-hidden="true"><label>Site web<input name="website" tabIndex={-1} autoComplete="off"/></label></div>
      <fieldset className="demo-form-fields" disabled={status === 'sending'}>
      <VehicleFields/>
      <fieldset><legend>Ce qu’on peut faire pour vous</legend><div className="form-grid">
        <label>Service *<select name="service" required value={service} onChange={(event): void => setService(event.target.value)}><option value="" disabled>Choisir un service</option>{services.map((item: string) => <option key={item} value={item}>{item}</option>)}</select></label>
        <label>Dimension des pneus
          <select
            name="size"
            value={sizeSelect}
            onChange={(event): void => setSizeSelect(event.target.value)}
          >
            <option value="">Choisir la dimension</option>
            <option value="Je ne connais pas la dimension">Je ne connais pas la dimension</option>
            <option value="autre">Autre dimension (préciser manuellement)…</option>
            {tireSizeGroups.map((group) => (
              <optgroup key={group.group} label={group.group}>
                {group.sizes.map((item: string) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </optgroup>
            ))}
          </select>
        </label>
        {sizeSelect === 'autre' && (
          <label className="full-field">
            Préciser votre dimension de pneus *
            <input
              name="customSize"
              placeholder="Ex. 33x12.50 R15 ou autre grandeur"
              required
              value={customSize}
              onChange={(event): void => setCustomSize(event.target.value)}
              maxLength={40}
              autoFocus
            />
          </label>
        )}
      </div>{service === 'Pose de pneus' && <p className="field-hint">La pose peut se faire avec rendez-vous (ci-dessous) ou sans rendez-vous directement au comptoir.</p>}</fieldset>
      <fieldset><legend>Date et heure souhaitées</legend><div className="form-grid">
        <label>Date souhaitée *
          <input
            type="date"
            name="date"
            required
            min={getMinBookingDate()}
            max={getMaxBookingDate()}
            value={date}
            data-placeholder="Choisir une date"
            className={date ? 'has-date' : 'no-date'}
            onClick={(e): void => {
              try {
                (e.target as HTMLInputElement).showPicker?.();
              } catch {
                // fallback
              }
            }}
            onChange={(event): void => handleDateChange(event.target.value)}
          />
        </label>
        <label>Heure souhaitée *
          <select
            name="time"
            required
            disabled={!date || isWeekend(date)}
            value={time}
            onChange={(event): void => setTime(event.target.value)}
          >
            {!date && <option value="" disabled>Choisir une date d'abord</option>}
            {date && isWeekend(date) && <option value="" disabled>Fermé le week-end (choisir Lun - Ven)</option>}
            {date && !isWeekend(date) && (
              <>
                <option value="" disabled>Choisir une heure</option>
                {timeSlots.map((slot) => {
                  const slotKey: string = `${date}_${slot.value}`;
                  const isBooked: boolean = bookedSlots.includes(slotKey);
                  return (
                    <option key={slot.value} value={slot.value} disabled={isBooked}>
                      {slot.label}{isBooked ? ' — Déjà réservé (1/h)' : ''}
                    </option>
                  );
                })}
              </>
            )}
          </select>
        </label>
        {dateWarning && <p className="full-field field-hint date-warning" role="alert">{dateWarning}</p>}
        <p className="full-field field-hint">Horaire d’atelier : Lundi au vendredi de 8 h à 17 h (dîner 12 h à 13 h). Maximum 1 rendez-vous par heure.</p>
      </div></fieldset>
      <fieldset><legend>Vos coordonnées</legend><div className="form-grid">
        <label>Nom complet *<input name="name" autoComplete="name" placeholder="Votre nom" required maxLength={100}/></label>
        <label>Téléphone *<input name="phone" type="tel" autoComplete="tel" placeholder="(819) 000-0000" required value={phone} onChange={(event): void => setPhone(formatPhoneNumber(event.target.value))} minLength={14} maxLength={14}/></label>
        <label className="full-field">Courriel *<input name="email" type="email" autoComplete="email" placeholder="vous@exemple.ca" required maxLength={150}/></label>
        <label className="full-field">Notes / description du problème<textarea name="notes" placeholder="Votre besoin, vos précisions ou questions…" rows={3} maxLength={1500}/></label>
      </div></fieldset>
      </fieldset>
      <p className="form-note">MODE DÉMONSTRATION — Deux courriels sont envoyés uniquement à votre adresse. Aucune réservation réelle ni transmission au garage.</p>
      {status === 'success' ? <div className="form-ready" role="status"><div><Check size={20}/><strong>Votre essai a été envoyé.</strong></div><p>{feedback}</p><button type="button" className="edit-form" onClick={resetForm}><RotateCcw size={14}/> Faire un autre essai</button></div> : <>
        {status === 'error' && <p className="field-hint" role="alert">{feedback}</p>}
        <button type="submit" className="button button-red form-submit" disabled={status === 'sending'}>{status === 'sending' ? 'Envoi des deux courriels…' : 'Essayer la démonstration'} <ArrowUpRight size={20}/></button>
      </>}
    </form>
    <div className="form-bottomline"><span>DU BON MONDE. DES BONS PNEUS.</span><span>PNEUS GOULET</span></div>
  </div>;
};
