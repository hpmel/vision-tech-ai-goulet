import { lazy, Suspense, useEffect, useRef, useState, type FormEvent, type ReactElement } from 'react';
import { ArrowRight, ArrowUpRight, LockKeyhole, MoveDownRight, ShieldCheck } from 'lucide-react';
import { clearDemoConsent, hasDemoConsent, saveDemoConsent } from '../services/demoAccess';
import './demo-access.css';

const DemoSite = lazy(async () => {
  try {
    const module = await import('../goulet/GouletPage');
    return { default: module.GouletPage };
  } catch (error: unknown) {
    console.error('Impossible de charger la démonstration Goulet.', error);
    return { default: DemoLoadError };
  }
});

const DemoLoadError = (): ReactElement => <main className="demo-load"><h1>La démonstration n’a pas pu se charger.</h1><p>Vérifiez votre connexion et réessayez.</p><button type="button" onClick={(): void => window.location.reload()}>Réessayer</button></main>;

export const DemoAccess = (): ReactElement => {
  const [accepted, setAccepted] = useState<boolean>(hasDemoConsent);
  const [checked, setChecked] = useState<boolean>(false);
  const title = useRef<HTMLHeadingElement>(null);

  useEffect((): void => {
    document.title = accepted ? 'Pneus Goulet | Démonstration par Vision-Tech-Ai' : 'Votre futur site web | Vision-Tech-Ai';
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (accepted) document.querySelector<HTMLElement>('.goulet-site h1')?.focus();
    else title.current?.focus();
  }, [accepted]);

  const enterDemo = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (!checked) return;
    saveDemoConsent();
    setAccepted(true);
  };

  const returnToAccess = (): void => {
    clearDemoConsent();
    setChecked(false);
    setAccepted(false);
  };

  if (accepted) return <>
    <aside className="demo-notice" aria-label="Avis de démonstration"><span><ShieldCheck size={15} aria-hidden="true"/> Démonstration · Création Vision-Tech-Ai</span><button type="button" onClick={returnToAccess}>Conditions d’accès <ArrowUpRight size={14} aria-hidden="true"/></button></aside>
    <Suspense fallback={<main className="demo-load" role="status">Chargement de votre démonstration…</main>}><DemoSite/></Suspense>
  </>;

  return <div className="demo-access">
    <a className="demo-skip" href="#demo-conditions">Aller aux conditions d’accès</a>
    <header className="demo-header"><a href="https://vision-tech-ai.com/" aria-label="Vision-Tech-Ai, site officiel"><img src="/logo-vision-tech-ai.png" alt="Vision-Tech-Ai" width="318" height="159"/></a><span>Présentation exclusive <span className="demo-header-client">/ Pneus Goulet</span></span></header>
    <main className="demo-layout">
      <section className="demo-presentation" aria-labelledby="demo-title">
        <p className="demo-eyebrow">Un aperçu de ce qui vous attend</p>
        <h1 id="demo-title" ref={title} tabIndex={-1}>Votre futur site.<br/><span>Votre signature.</span></h1>
        <p className="demo-lead">Découvrez une création pensée pour Pneus Goulet. Une première vision, à façonner à votre image.</p>
        <div className="demo-offer"><div><span>Offre spéciale de lancement</span><strong>499 <span>$</span></strong></div><p>Pour le site web présenté<br/>en prévisualisation seulement.</p></div>
        <div className="demo-customization"><h2>Tout commence par votre vision.</h2><p>Design, textes, images et services : cette démonstration est personnalisable. Le formulaire de rendez-vous peut aussi être adapté à vos besoins.</p><ul aria-label="Éléments personnalisables"><li>Design & couleurs</li><li>Textes & images</li><li>Services</li><li>Formulaire sur mesure</li></ul><p className="demo-small">Personnalisations et développements sur mesure moyennant des frais supplémentaires, selon vos demandes.</p></div>
        <aside className="demo-calendar-pricing" aria-labelledby="demo-calendar-title"><h2 id="demo-calendar-title">Prise de rendez-vous automatisée en option</h2><p>Le prix de <strong>499 $ couvre le site web présenté en prévisualisation seulement</strong>. Le formulaire de prise de rendez-vous avec réservation automatique est offert en supplément : <strong>300 $ par porte, dès la première</strong>, chacune avec son propre calendrier. Aucune porte ni aucun calendrier de réservation n’est inclus dans le prix de départ.</p><p className="demo-tax-note">Des taxes peuvent s’appliquer.</p></aside>
      </section>
      <section className="demo-entry" id="demo-conditions" aria-labelledby="demo-entry-title">
        <div className="demo-entry-top"><LockKeyhole size={22} aria-hidden="true"/><span>Accès à la démonstration</span></div>
        <h2 id="demo-entry-title">Avant de découvrir<br/>votre site.</h2>
        <p className="demo-entry-intro">Cette création vous est présentée exclusivement à titre de démonstration et d’évaluation.</p>
        <div className="demo-rights"><ShieldCheck size={22} aria-hidden="true"/><div><h3>Une création de Vision-Tech-Ai</h3><p>La conception du site et les éléments originaux créés par Vision-Tech-Ai demeurent sa propriété. Cet accès ne vous accorde aucun droit de copie, de reproduction ou de réutilisation sans autorisation.</p><p>Les marques et contenus de tiers demeurent la propriété de leurs titulaires respectifs.</p></div></div>
        <form onSubmit={enterDemo}>
          <label className="demo-consent">{!checked && <MoveDownRight className="demo-consent-arrow" size={96} strokeWidth={3} aria-hidden="true"/>}<input type="checkbox" required checked={checked} onChange={(event): void => setChecked(event.currentTarget.checked)} aria-describedby="demo-consent-help"/><span>Je comprends que ce site est présenté uniquement à titre de démonstration et je m’engage à ne pas copier ni réutiliser la création de Vision-Tech-Ai sans autorisation.</span></label>
          <button className="demo-enter" type="submit" disabled={!checked}>Accéder à la démonstration <ArrowRight size={19} aria-hidden="true"/></button>
          <p id="demo-consent-help" className="demo-access-help">{checked ? 'Vous pouvez maintenant découvrir la démonstration.' : 'Cochez la case pour accéder à la démonstration.'}</p>
        </form>
      </section>
    </main>
    <footer className="demo-footer"><span>© {new Date().getFullYear()} Vision-Tech-Ai · Création originale</span><a href="https://vision-tech-ai.runable.site/">Parlons de votre projet <ArrowUpRight size={15} aria-hidden="true"/></a></footer>
  </div>;
};
