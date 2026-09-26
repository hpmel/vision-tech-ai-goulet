const fs = require('node:fs');
const path = require('node:path');
const pptxgen = require('pptxgenjs');

const root = __dirname;
const pptx = new pptxgen();
pptx.layout = 'LAYOUT_WIDE';
pptx.author = 'KMD Web';
pptx.company = 'KMD Web';
pptx.subject = 'Présentation des services KMD Web';
pptx.title = 'Sites Web, design sur mesure et automatisation IA | KMD Web';
pptx.lang = 'fr-CA';
pptx.theme = { headFontFace: 'Arial', bodyFontFace: 'Arial', lang: 'fr-CA' };

const W = 13.333;
const H = 7.5;
const C = { bg: '08080B', panel: '111116', panel2: '17171E', line: '302A36', text: 'F7F5FA', muted: 'B6B1BF', pink: 'FB1D91', cyan: '54E1E6', violet: 'A58AFF' };
const slides = [
  { kind: 'cover', kicker: 'SITES WEB · APPLICATIONS · AUTOMATISATION IA', title: 'KMD WEB', sub: 'Des expériences numériques qui font avancer votre entreprise.', desc: 'Conception sur mesure. Design premium. Technologie utile.', notes: 'Ouverture: KMD Web accompagne les entreprises de la première idée au lancement. La fondatrice est Mélanie Desrochers, selon le site officiel kmdweb.ca.' },
  { kind: 'value', kicker: 'UNE EXPÉRIENCE À VOTRE IMAGE', title: 'Un site qui fait plus que bien paraître.', sub: 'Une présence web haut de gamme, conçue pour présenter votre valeur et guider les visiteurs vers la prochaine étape.', cards: [['DESIGN', 'Une direction visuelle distinctive, alignée sur votre identité.'], ['PARCOURS', 'Une structure claire qui met vos services en valeur.'], ['MOUVEMENT', 'Des animations fluides au service de l’expérience.']], notes: 'La page de service communique trois bénéfices lisibles: design, parcours et motion. Les animations sont adaptées à la portée du projet et à l’expérience utilisateur.' },
  { kind: 'offers', kicker: 'TROIS FAÇONS DE COMMENCER', title: 'Votre prochain projet, au bon format.', offers: [['01 · LANDING PAGE', '499 $+', 'Environ 3 à 4 sections pour présenter une offre et encourager les demandes.'], ['02 · SITE WEB COMPLET', '999 $+', 'Plusieurs pages, formulaire de contact complet et conception personnalisée à 100 %.'], ['03 · IA & AUTOMATISATION', '199 $+', 'Chatbots, assistants vocaux et automatisations conçues selon votre besoin.']], notes: 'Les sommes sont des dollars canadiens, prix de départ. La proposition précise le périmètre, les fonctionnalités, les frais récurrents applicables et les taxes.' },
  { kind: 'price', kicker: '01 · PRÉSENCE CIBLÉE', title: 'Landing page', price: 'À partir de 499 $', sub: 'Une page stratégique avec environ 3 à 4 sections.', bullets: ['Design adapté à votre marque', 'Contenu organisé pour guider le visiteur', 'Responsive sur mobile, tablette et ordinateur', 'Animations et appels à l’action intégrés'], extra: 'Section additionnelle : 99 $ à 199 $ selon le contenu et la complexité.', notes: 'Le prix de départ correspond à une landing page d’environ 3 à 4 sections. Chaque bloc supplémentaire se situe de 99 à 199 dollars canadiens. Le coût exact est confirmé avant le démarrage.' },
  { kind: 'price', kicker: '02 · UNE PRÉSENCE COMPLÈTE', title: 'Site web multipage', price: 'À partir de 999 $', sub: 'Un site complet conçu pour représenter votre entreprise avec justesse.', bullets: ['Plusieurs pages distinctes', 'Formulaire de contact complet', 'Personnalisation à 100 % selon votre marque', 'Animations et interactions personnalisées partout sur le site, avec finitions premium'], extra: 'Chaque projet est défini selon le nombre de pages et les fonctionnalités.', notes: 'Le forfait de départ inclut plusieurs pages, un formulaire de contact complet et une personnalisation à 100 %, comme demandé par KMD Web. Le nombre de pages et les fonctions précises doivent être confirmés au devis. Ne pas présenter le domaine, l’hébergement ou l’entretien comme inclus sauf mention explicite dans le devis.' },
  { kind: 'ai', kicker: '03 · TEMPS RÉCUPÉRÉ', title: 'L’IA qui s’intègre à votre façon de travailler.', price: 'Projets dès 199 $', sub: 'Des solutions ciblées pour répondre, organiser ou exécuter des tâches.', cards: [['CHATBOTS', 'Questions fréquentes et orientation des demandes.'], ['ASSISTANTS VOCAUX', 'Une interaction parlée adaptée à votre service.'], ['AUTOMATISATIONS', 'Des tâches répétitives exécutées automatiquement.']], notes: 'Le prix de départ est indicatif et dépend des outils, intégrations, règles métier et niveaux de test. Des frais d’abonnement ou d’usage des plateformes peuvent s’appliquer; ils sont précisés dans la proposition.' },
  { kind: 'experience', kicker: 'QUALITÉ PREMIUM, DU DÉTAIL À L’ENSEMBLE', title: 'Du premier regard au dernier détail.', sub: 'Le design, le contenu et les interactions travaillent ensemble pour créer une expérience claire, fluide et fidèle à votre marque.', metrics: [['SUR MESURE', 'Direction visuelle unique'], ['FLUIDE', 'Mouvement maîtrisé'], ['RESPONSIVE', 'Mobile au bureau'], ['SOIGNÉ', 'Finitions premium']], notes: 'Le motion design est un point fort demandé par KMD Web. Les animations restent adaptées au contexte, à l’accessibilité et aux appareils. Respecter prefers-reduced-motion sur les projets web.' },
  { kind: 'process', kicker: 'DE L’IDÉE À LA MISE EN LIGNE', title: 'Vous savez toujours où le projet s’en va.', steps: [['01', 'Diagnostic', 'On clarifie vos objectifs, vos clients et vos priorités.'], ['02', 'Prototype', 'Vous validez une direction visuelle avant la construction.'], ['03', 'Construction', 'On développe et ajuste la solution avec vous.'], ['04', 'Lancement', 'On prépare la mise en ligne et le transfert.']], notes: 'Reprend la méthode de KMD Web affichée en ligne: diagnostic, prototype, construction et lancement.' },
  { kind: 'portfolio', kicker: 'QUELQUES RÉALISATIONS', title: 'Des secteurs différents. Une même attention.', projects: [['Air Pur Belzile', 'Maison · qualité de l’air', 'https://www.airpurbelzile.ca/'], ['Nexior Construction', 'Construction', 'https://nexiorconstruction.com/fr/'], ['Habitations Tremblay & Tremblay', 'Construction · rénovation', 'https://htremblay.ca/'], ['École de danse Chantal Charette', 'Arts · apprentissage', 'https://chantalcharette.com/'], ['Fleurmidable', 'Paysagement', 'https://www.fleurmidable.com/'], ['Shinebreath', 'Bien-être', 'https://shinebreath.com/'], ['KMD Web', 'Studio numérique', 'https://kmdweb.ca/']], notes: 'Les liens de projets sont les réalisations fournies par KMD Web. Ils restent cliquables dans le PowerPoint et le PDF.' },
  { kind: 'about', kicker: 'DERRIÈRE KMD WEB', title: 'Un seul contact. De la stratégie au code.', sub: 'Mélanie Desrochers, fondatrice de KMD Web. Plus de huit ans à transformer des idées en sites, applications et systèmes numériques concrets.', points: ['Une approche directe et sans jargon inutile', 'Des solutions bâties autour de vos vrais besoins', 'Une interlocutrice du diagnostic au lancement'], notes: 'Nom, rôle et plus de huit ans d’expérience sont déclarés sur kmdweb.ca. Formulation personnelle issue du contenu public du site.' },
  { kind: 'close', kicker: 'VOTRE PROCHAIN PROJET', title: 'Faisons de votre idée une expérience en ligne.', sub: 'Choisissons ensemble le bon point de départ : une landing page, un site complet ou une automatisation utile.', action: 'RÉSERVER UN DIAGNOSTIC', url: 'https://kmdweb.ca/diagnostic', foot: 'Prix de départ en dollars canadiens. Le devis confirme portée, frais applicables et taxes.', notes: 'Appel à l’action dirige vers le diagnostic de KMD Web.' },
];

const primitives = [];
function rect(slide, x, y, w, h, fill, radius = 0, line = fill) {
  slide.addShape(radius ? pptx.ShapeType.roundRect : pptx.ShapeType.rect, { x, y, w, h, rectRadius: radius, fill: { color: fill }, line: { color: line, transparency: 100 } });
  primitives.at(-1).push({ type: 'rect', x, y, w, h, fill, r: radius, line });
}
function circle(slide, x, y, d, fill, line = fill) {
  slide.addShape(pptx.ShapeType.ellipse, { x, y, w: d, h: d, fill: { color: fill }, line: { color: line, transparency: 100 } });
  primitives.at(-1).push({ type: 'circle', x, y, w: d, h: d, fill, line });
}
function txt(slide, value, x, y, w, h, size = 18, color = C.text, bold = false, align = 'left', hyperlink) {
  const options = { x, y, w, h, fontFace: 'Arial', fontSize: size, color, bold, margin: 0, breakLine: false, valign: 'mid', fit: 'shrink', align };
  if (hyperlink) options.hyperlink = { url: hyperlink };
  slide.addText(value, options);
  primitives.at(-1).push({ type: 'text', text: value, x, y, w, h, size, color, bold, align, url: hyperlink });
}
function base(d, index) {
  const slide = pptx.addSlide();
  slide.background = { color: C.bg };
  primitives.push([]);
  rect(slide, 0, 0, W, H, C.bg);
  txt(slide, d.kicker, .62, .38, 11, .24, 10, C.cyan, true);
  txt(slide, d.title, .62, .86, 12.05, 1.2, d.kind === 'cover' ? 44 : 35, C.text, true);
  rect(slide, .62, 7.1, 12.05, .012, C.line);
  txt(slide, 'KMD WEB  /  SITES · DESIGN · IA', .62, 7.2, 8, .18, 8, '898392');
  txt(slide, String(index + 1).padStart(2, '0'), 11.98, 7.18, .7, .18, 9, '898392', false, 'right');
  slide.addNotes(`${d.notes}\n\n${d.url || ''}`);
  return slide;
}
slides.forEach((d, i) => {
  const s = base(d, i);
  switch (d.kind) {
    case 'cover':
      txt(s, d.sub, .62, 2.38, 7.6, 1.0, 27, C.text, false);
      txt(s, d.desc, .62, 3.62, 6.8, .6, 16, C.muted);
      circle(s, 9.0, 1.25, 2.55, C.panel, C.line); circle(s, 9.47, 1.72, 1.62, C.panel2, C.line); circle(s, 9.94, 2.19, .68, C.pink);
      rect(s, 10.55, 4.45, 1.7, .06, C.cyan, .02); txt(s, 'WEB + IA', 9.2, 4.7, 2.8, .32, 13, C.cyan, true, 'center');
      break;
    case 'value':
      txt(s, d.sub, .62, 2.15, 10.7, .75, 19, C.muted);
      d.cards.forEach((c, j) => { const x = .62 + j * 4.08; rect(s, x, 3.45, 3.82, 2.4, C.panel, .12, C.line); circle(s, x + .25, 3.73, .12, j === 1 ? C.cyan : C.pink); txt(s, c[0], x + .25, 4.06, 3.3, .25, 11, j === 1 ? C.cyan : C.pink, true); txt(s, c[1], x + .25, 4.48, 3.28, .9, 17, C.text, true); });
      break;
    case 'offers':
      d.offers.forEach((c, j) => { const x = .62 + j * 4.08; rect(s, x, 2.3, 3.82, 3.85, C.panel, .12, j === 1 ? '713252' : C.line); txt(s, c[0], x + .25, 2.62, 3.3, .3, 10, j === 1 ? C.pink : C.cyan, true); txt(s, c[1], x + .25, 3.18, 3.28, .62, 33, C.text, true); rect(s, x + .25, 3.98, .5, .035, C.pink, .01); txt(s, c[2], x + .25, 4.25, 3.25, 1.25, 16, C.muted); });
      break;
    case 'price':
      rect(s, .62, 2.25, 4.3, 3.95, C.panel, .12, C.line); txt(s, d.price, .92, 2.75, 3.7, .7, 27, C.pink, true); txt(s, d.sub, .92, 3.65, 3.55, 1.25, 17, C.muted); txt(s, 'PORTÉE DÉFINIE AVANT LE DÉMARRAGE', .92, 5.55, 3.7, .24, 9, C.cyan, true);
      d.bullets.forEach((b, j) => { circle(s, 5.55, 2.48 + j * .75, .13, j === 2 ? C.cyan : C.pink); txt(s, b, 5.88, 2.37 + j * .75, 6.45, .44, 17, C.text, j === 0); });
      rect(s, 5.55, 5.75, 6.7, .48, C.panel2, .08); txt(s, d.extra, 5.8, 5.83, 6.2, .24, 12, C.cyan, true);
      break;
    case 'ai':
      txt(s, d.sub, .62, 2.05, 8.1, .75, 18, C.muted); rect(s, 9.35, 2.05, 3.05, .68, C.panel2, .1, '59304D'); txt(s, d.price, 9.55, 2.23, 2.7, .28, 15, C.pink, true, 'center');
      d.cards.forEach((c, j) => { const x = .62 + j * 4.08; rect(s, x, 3.32, 3.82, 2.42, C.panel, .12, C.line); txt(s, `0${j + 1}`, x + .25, 3.62, .5, .3, 11, C.pink, true); txt(s, c[0], x + .25, 4.08, 3.3, .3, 12, C.cyan, true); txt(s, c[1], x + .25, 4.58, 3.3, .85, 16, C.text, true); });
      break;
    case 'experience':
      txt(s, d.sub, .62, 2.05, 10.2, .85, 19, C.muted);
      d.metrics.forEach((m, j) => { const col = j % 2, row = Math.floor(j / 2), x = .62 + col * 6.12, y = 3.55 + row * 1.18; rect(s, x, y, 5.8, .88, C.panel, .09, C.line); txt(s, m[0], x + .22, y + .16, 1.55, .25, 10, j % 2 ? C.cyan : C.pink, true); txt(s, m[1], x + 1.85, y + .13, 3.65, .34, 16, C.text, true); });
      break;
    case 'process':
      d.steps.forEach((c, j) => { const x = .62 + j * 3.06; circle(s, x, 2.43, .55, C.pink); txt(s, c[0], x, 2.57, .55, .2, 11, C.text, true, 'center'); txt(s, c[1], x, 3.28, 2.7, .35, 19, C.text, true); txt(s, c[2], x, 3.9, 2.65, 1.15, 14, C.muted); if (j < 3) rect(s, x + 1.8, 2.69, 1.0, .018, C.line); });
      break;
    case 'portfolio':
      d.projects.forEach((c, j) => { const col = j % 4, row = Math.floor(j / 4), x = .62 + col * 3.06, y = 2.15 + row * 1.85; rect(s, x, y, 2.82, 1.55, C.panel, .1, C.line); txt(s, c[1].toUpperCase(), x + .2, y + .2, 2.4, .24, 9, C.cyan, true); txt(s, c[0], x + .2, y + .61, 2.4, .54, 15, C.text, true, 'left', c[2]); txt(s, 'DÉCOUVRIR ↗', x + .2, y + 1.24, 2.3, .18, 9, C.pink, true, 'left', c[2]); });
      break;
    case 'about':
      circle(s, 8.55, 2.05, 2.6, C.panel, C.line); circle(s, 9.02, 2.52, 1.65, C.panel2, C.line); txt(s, 'KMD', 9.16, 3.13, 1.4, .35, 18, C.pink, true, 'center');
      txt(s, d.sub, .62, 2.25, 7.2, 1.2, 19, C.muted);
      d.points.forEach((p, j) => { circle(s, .62, 4.18 + j * .55, .12, j === 1 ? C.cyan : C.pink); txt(s, p, .9, 4.1 + j * .55, 6.9, .28, 14, C.text); });
      break;
    case 'close':
      txt(s, d.sub, .62, 2.3, 8.8, .9, 20, C.muted); rect(s, .62, 4.05, 3.6, .75, C.pink, .12); txt(s, d.action, .83, 4.28, 3.15, .25, 12, C.text, true, 'center', d.url); circle(s, 9.25, 2.35, 2.2, C.panel, C.line); circle(s, 9.76, 2.86, 1.18, C.pink); txt(s, 'K', 10.05, 3.18, .6, .35, 20, C.text, true, 'center'); txt(s, d.foot, .62, 5.52, 9.5, .32, 10, '8F8A98');
      break;
  }
});

fs.writeFileSync(path.join(root, 'render-primitives.json'), JSON.stringify(primitives));
pptx.writeFile({ fileName: path.join(root, 'KMD-Web-Services.pptx') });
