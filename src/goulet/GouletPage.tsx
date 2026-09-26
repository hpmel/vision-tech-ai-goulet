import { useEffect, useRef, useState, type ReactElement } from 'react';
import { ArrowDown, ArrowRight, ArrowUpRight, Check, ChevronDown, Clock3, MapPin, Menu, Moon, Pause, Phone, Play, Star, Sun, X } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { InquiryForm } from './InquiryForm';

gsap.registerPlugin(ScrollTrigger);
const maps: string = 'https://www.google.com/maps/dir/?api=1&destination=7600+Boulevard+Bourque+Sherbrooke+QC+J1N+3K1';
const google: string = 'https://share.google/uv38N5IKDEuYJVXVR';
interface Service { title: string; subtitle: string; description: string; image: string; className: string }
const services: Service[] = [
  { title: 'Du neuf. Du solide.', subtitle: 'PNEUS NEUFS & USAGÉS', description: 'Le bon pneu pour votre véhicule et votre budget. Les grandes marques sont disponibles sur demande.', image: 'pneus.webp', className: 'service-main' },
  { title: 'On vous remet en route.', subtitle: 'POSE DE PNEUS', description: 'Passez au garage pour la pose. Pas de rendez-vous à prendre, juste vos pneus à apporter.', image: 'pose.webp', className: 'service-pose' },
  { title: 'Votre garage respire.', subtitle: 'ENTREPOSAGE SAISONNIER', description: 'Vos pneus prennent de la place ? Renseignez-vous sur notre service d’entreposage.', image: 'entreposage.webp', className: 'service-storage' },
];

const HeroVideo = (): ReactElement => {
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState<boolean>(false);
  const [failed, setFailed] = useState<boolean>(false);
  useEffect((): (() => void) => {
    const element: HTMLVideoElement | null = video.current;
    const preference: MediaQueryList = window.matchMedia('(prefers-reduced-motion: reduce)');
    let disposed: boolean = false;
    const followPreference = async (): Promise<void> => {
      if (!element) return;
      if (preference.matches) { element.pause(); return; }
      try { await element.play(); if (disposed) element.pause(); }
      catch (error: unknown) { console.info('Lecture automatique indisponible : affiche fixe conservée.', error); }
    };
    void followPreference();
    const onChange = (): void => { void followPreference(); };
    preference.addEventListener('change', onChange);
    return (): void => { disposed = true; preference.removeEventListener('change', onChange); element?.pause(); };
  }, []);
  const toggle = async (): Promise<void> => {
    if (!video.current) return;
    try { if (video.current.paused) await video.current.play(); else video.current.pause(); }
    catch (error: unknown) { console.error('Impossible de lire la vidéo du garage.', error); setFailed(true); }
  };
  return <><video ref={video} className="hero-video" loop muted playsInline preload="none" poster="/goulet/hero-poster.jpg" onPlay={(): void => setPlaying(true)} onPause={(): void => setPlaying(false)} onError={(): void => setFailed(true)} aria-hidden="true"><source src="/goulet/hero-web.mp4" type="video/mp4"/></video><button className="video-control" onClick={(): void => { void toggle(); }} disabled={failed} aria-label={playing ? 'Mettre la vidéo en pause' : 'Lire la vidéo'}>{playing ? <Pause size={14}/> : <Play size={14}/>}<span>{failed ? 'Image fixe' : playing ? 'Pause' : 'Lire'}</span></button></>;
};

export const GouletPage = (): ReactElement => {
  const page = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [theme, setTheme] = useState<'light' | 'dark'>((): 'light' | 'dark' => window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  useEffect((): (() => void) => {
    const match: gsap.MatchMedia = gsap.matchMedia();
    match.add('(prefers-reduced-motion: no-preference)', (): (() => void) => {
      const context: gsap.Context = gsap.context((): void => {
        gsap.from('.hero-copy > *', { y: 35, opacity: 0, duration: 0.85, stagger: 0.13, ease: 'power3.out', clearProps: 'all' });
        gsap.from('.hero-stamp', { rotate: -25, scale: 0.65, opacity: 0, delay: 0.45, duration: 1, ease: 'back.out(1.6)', clearProps: 'all' });
        gsap.utils.toArray<HTMLElement>('.reveal').forEach((element: HTMLElement): void => { gsap.from(element, { y: 40, opacity: 0, duration: 0.8, ease: 'power2.out', scrollTrigger: { trigger: element, start: 'top 92%', once: true }, clearProps: 'all' }); });
        gsap.to('.mascot-art', { y: -25, rotation: -4, ease: 'none', scrollTrigger: { trigger: '.about-section', start: 'top bottom', end: 'bottom top', scrub: 1 } });
      }, page);
      return (): void => context.revert();
    });
    return (): void => match.revert();
  }, []);
  useEffect((): (() => void) => {
    const escape = (event: KeyboardEvent): void => { if (event.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('keydown', escape);
    return (): void => window.removeEventListener('keydown', escape);
  }, []);

  return <div ref={page} className="goulet-site" data-theme={theme}>
    <a href="#main" className="skip-link">Aller au contenu</a>
    <div className="announcement"><span>PNEUS NEUFS & USAGÉS</span><span>SANS RENDEZ-VOUS <span aria-hidden="true">✦</span> SHERBROOKE</span><a href={maps} target="_blank" rel="noreferrer">7600, boul. Bourque <ArrowUpRight size={12}/></a></div>
    <header className="goulet-header"><a className="brand" href="#accueil" aria-label="Pneus Goulet, accueil"><img src="/goulet/logo.webp" alt="Pneus Goulet" width="176" height="64"/></a>
      <nav className={menuOpen ? 'main-nav is-open' : 'main-nav'} aria-label="Navigation principale" id="main-nav"><a href="#services" onClick={(): void => setMenuOpen(false)}>Nos services</a><a href="#a-propos" onClick={(): void => setMenuOpen(false)}>L’esprit Goulet</a><a href="#contact" onClick={(): void => setMenuOpen(false)}>Nous trouver</a></nav>
      <div className="header-actions"><button className="theme-toggle" aria-label={theme === 'light' ? 'Activer le thème sombre' : 'Activer le thème clair'} onClick={(): void => setTheme(theme === 'light' ? 'dark' : 'light')}>{theme === 'light' ? <Moon size={18}/> : <Sun size={18}/>}</button><a href="tel:+18195640019" className="header-phone" aria-label="Appeler le 819 564-0019"><Phone size={16}/><span>819 564-0019</span></a><a className="button button-red header-cta" href="#demande">Une question ? <ArrowUpRight size={17}/></a><button className="menu-toggle" aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'} aria-expanded={menuOpen} aria-controls="main-nav" onClick={(): void => setMenuOpen(!menuOpen)}>{menuOpen ? <X/> : <Menu/>}</button></div>
    </header>
    <main id="main">
      <section className="hero" id="accueil" aria-labelledby="hero-title"><HeroVideo/><div className="hero-shade"/><div className="hero-inner"><div className="hero-copy"><p className="eyebrow"><span/> VOTRE ARRÊT PNEUS À SHERBROOKE</p><h1 id="hero-title">DU CARACTÈRE.<br/><span>DE LA TRACTION.</span></h1><p className="hero-intro">Des pneus neufs ou usagés. Du bon monde au comptoir.<br className="desktop-break"/> Et vous, de retour sur la route.</p><div className="hero-actions"><a href="#demande" className="button button-red">Trouver mes pneus <ArrowUpRight size={20}/></a><a href="tel:+18195640019" className="hero-call"><Phone size={17}/> On s’appelle ?</a></div></div><div className="hero-stamp"><span>PASSEZ NOUS VOIR</span><strong>SANS<br/>RENDEZ-VOUS</strong><span>ON S’OCCUPE DE VOS PNEUS</span><Star size={18} fill="currentColor"/></div></div><a href="#services" className="discover"><ArrowDown size={16}/> Faites un tour</a></section>
      <div className="checkered" aria-hidden="true"/>
      <section className="quick-facts" aria-label="Informations pratiques"><a href={google} target="_blank" rel="noreferrer"><strong>4,3<span>/5</span></strong><div><span className="stars" aria-label="Note Google de 4,3 sur 5">★★★★<span>★</span></span><span>275 avis sur Google <ArrowUpRight size={13}/></span></div></a><div><Clock3 size={25}/><p><strong>On vous accueille</strong><span>Lun. au ven. : 8 h à 12 h / 13 h à 16 h</span></p></div><a href={maps} target="_blank" rel="noreferrer"><MapPin size={25}/><p><strong>Au 7600, boul. Bourque</strong><span>Sherbrooke, c’est par ici <ArrowUpRight size={13}/></span></p></a></section>
      <section className="services-section section-wrap" id="services"><div className="section-heading reveal"><p className="eyebrow">ÇA ROULE AVEC GOULET</p><h2>À chaque saison,<br/>son bon pneu.</h2><p>De la première neige aux longues routes d’été, on s’occupe de ce qui vous relie à la route.</p></div><div className="services-grid">{services.map((service: Service) => <article key={service.title} className={`service-card reveal ${service.className}`}><img src={`/goulet/${service.image}`} alt={service.subtitle === 'POSE DE PNEUS' ? 'Des mains gantées tiennent un pneu' : service.subtitle === 'ENTREPOSAGE SAISONNIER' ? 'Pneus rangés en atelier' : 'Sélection de pneus aux différentes sculptures'} loading="lazy" width="720" height="850"/><div className="service-content"><span>{service.subtitle}</span><h3>{service.title}</h3><p>{service.description}</p><a href="#demande">Parlons-en <ArrowUpRight size={20}/></a></div></article>)}</div><div className="extras reveal"><div><strong>Et pour compléter le tout ?</strong><span>Vente et pose de jantes / mags. Essuie-glaces.</span></div><a href="#demande">Demandez à l’équipe <ArrowRight size={20}/></a></div></section>
      <section className="about-section section-wrap" id="a-propos"><div className="mascot-scene reveal"><div className="mascot-circle"/><div className="mascot-caption">La bonne humeur<br/>fait du chemin.</div><img className="mascot-art" src="/goulet/mascotte.webp" alt="La mascotte souriante de Pneus Goulet et ses jantes" loading="lazy" width="897" height="967"/><span className="scene-sign">100 % GOULET</span></div><div className="about-copy reveal"><h2>Les pneus,<br/>c’est notre <br/><span>genre de trip.</span></h2><p>Chez Pneus Goulet, on aime les choses simples : vous accueillir, parler de vos besoins et vous aider à trouver les bons pneus.</p><p>Neufs ou usagés, pour le quotidien ou les changements de saison : passez nous voir au 7600, boulevard Bourque. Notre sourire vient avec le service.</p><div className="about-values"><span><Check size={18}/> Pneus neufs et usagés</span><span><Check size={18}/> Pose sans rendez-vous</span><span><Check size={18}/> Grandes marques sur demande</span></div><a className="text-link" href="https://www.facebook.com/PneusGoulet" target="_blank" rel="noreferrer">Retrouvez l’équipe sur Facebook <ArrowUpRight size={18}/></a></div></section>
      <section className="reputation section-wrap reveal"><div className="review-score"><span className="google-label">LES AVIS GOOGLE</span><strong>4,3<span>/5</span></strong><span className="stars">★★★★<span>★</span></span><span>275 avis de clients</span></div><div className="review-copy"><h2>La confiance,<br/>ça se gagne au garage.</h2><p>Le meilleur aperçu du service ? L’expérience des gens qui sont déjà passés nous voir.</p><a className="text-link" href={google} target="_blank" rel="noreferrer">Lire les avis sur Google <ArrowUpRight size={18}/></a><small>Note et nombre d’avis relevés le 25 septembre 2026.</small></div></section>
      <section className="contact-section section-wrap" id="demande"><div className="contact-intro reveal"><p className="eyebrow">ON MET ÇA EN ROUTE ?</p><h2>Les bons pneus.<br/>Ça commence <br/><span>par un bonjour.</span></h2><p>Vous cherchez un ensemble de pneus ou un renseignement ? Préparez votre demande, et envoyez-la directement à l’équipe.</p><a href="tel:+18195640019" className="contact-phone"><Phone size={26}/><span><small>VOUS PRÉFÉREZ JASER ?</small>819 564-0019</span></a><div className="no-booking"><Clock3 size={23}/><div><strong>Pas de rendez-vous. Pas de casse-tête.</strong><p>Pour la pose, présentez-vous au garage. L’attente peut varier selon l’achalandage, surtout en changement de saison.</p></div></div><img className="contact-photo" src="/goulet/garage.webp" alt="Le garage Pneus Goulet sur le boulevard Bourque" loading="lazy" width="1200" height="675"/></div><InquiryForm/></section>
      <section className="faq-section section-wrap reveal"><h2>Avant de prendre la route.</h2><div className="faq-items"><details><summary>Est-ce que je dois prendre rendez-vous ?<ChevronDown size={20}/></summary><p>La pose de pneus se fait sans rendez-vous. Le temps d’attente dépend de l’affluence. Appelez le 819 564-0019 avant de vous déplacer si vous souhaitez vérifier les conditions du jour.</p></details><details><summary>Vendez-vous des pneus usagés ?<ChevronDown size={20}/></summary><p>Oui, Pneus Goulet propose des pneus neufs et usagés. Communiquez votre dimension et les renseignements de votre véhicule pour vérifier la disponibilité.</p></details><details><summary>Où trouver la dimension de mes pneus ?<ChevronDown size={20}/></summary><p>Elle est inscrite sur le flanc du pneu, sous une forme comme 205/55 R16. Vous pouvez également consulter l’étiquette dans l’ouverture de la portière du conducteur. L’équipe pourra vous guider.</p></details><details><summary>Le formulaire réserve-t-il une place ?<ChevronDown size={20}/></summary><p>Non. Il prépare un courriel dans votre messagerie. Vous devez ensuite l’envoyer. Aucune place n’est réservée et aucun rendez-vous n’est confirmé par ce formulaire.</p></details></div></section>
      <section className="location section-wrap reveal" id="contact"><div><MapPin size={26}/><h2>Le prochain arrêt :<br/>chez Goulet.</h2><address>7600, boulevard Bourque<br/>Sherbrooke (Québec) J1N 3K1</address><a href={maps} className="button button-red" target="_blank" rel="noreferrer">Prendre la direction du garage <ArrowUpRight size={18}/></a></div><div className="hours"><h3>Les heures du garage</h3><dl><div><dt>Lundi au vendredi</dt><dd>8 h à 12 h<br/>13 h à 16 h</dd></div><div><dt>Samedi et dimanche</dt><dd>Fermé</dd></div></dl><p>Horaires publiés sur Google. Les jours fériés et les périodes de pointe peuvent varier.</p><a href="tel:+18198641972">Autre numéro : 819 864-1972 <ArrowUpRight size={14}/></a></div></section>
    </main><div className="checkered" aria-hidden="true"/><footer className="goulet-footer"><div className="footer-top"><a className="footer-brand" href="#accueil">PNEUS GOULET<span>DU BON MONDE. DES BONS PNEUS.</span></a><div><a href="tel:+18195640019">819 564-0019 <ArrowUpRight size={15}/></a><a href="mailto:pneusgoulet@hotmail.com">pneusgoulet@hotmail.com <ArrowUpRight size={15}/></a></div><div><a href="https://www.facebook.com/PneusGoulet" target="_blank" rel="noreferrer">Facebook <ArrowUpRight size={15}/></a><a href={google} target="_blank" rel="noreferrer">Google <ArrowUpRight size={15}/></a></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Pneus Goulet. Tous droits réservés.</span><span>Fait avec du caractère par <a href="https://vision-tech-ai.com/" target="_blank" rel="noreferrer">Vision-Tech AI</a></span></div></footer>
  </div>;
};
