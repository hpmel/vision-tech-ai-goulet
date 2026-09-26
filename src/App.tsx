import { useMemo, useState, type CSSProperties, type FormEvent, type ReactElement } from 'react';
import { ArrowRight, Check, ChevronRight, Download, ExternalLink, FileImage, Globe2, Image, LoaderCircle, Palette, Search, Sparkles, Upload, WandSparkles } from 'lucide-react';
import type { AnalyzeRequest, CompanyAnalysis } from './types';

const starter: AnalyzeRequest = { name: '', sector: '', location: '', address: '', phone: '', website: '', socialLinks: '' };
const fallbackColors = [{ name: 'Encre', hex: '#111315', role: 'Fond' }, { name: 'Ivoire', hex: '#f2eee6', role: 'Texte' }, { name: 'Ambre', hex: '#e7ae38', role: 'Accent' }];
const isAnalysis = (value: unknown): value is CompanyAnalysis => typeof value === 'object' && value !== null && 'company' in value && 'brand' in value;
type StylePreset = 'industrial' | 'editorial' | 'minimal' | 'luxury';
interface LocalMedia { id: string; name: string; url: string; kind: 'logo' | 'image' | 'video' }

export const App = (): ReactElement => {
  const [form, setForm] = useState<AnalyzeRequest>(starter);
  const [analysis, setAnalysis] = useState<CompanyAnalysis | null>(null);
  const [tab, setTab] = useState<'brief' | 'content'>('brief');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [themeColors, setThemeColors] = useState<string[]>(fallbackColors.map((color) => color.hex));
  const [stylePreset, setStylePreset] = useState<StylePreset>('industrial');
  const [localMedia, setLocalMedia] = useState<LocalMedia[]>([]);
  const colors = themeColors.map((hex, index) => ({ ...fallbackColors[index], hex }));
  const previewName = analysis?.company.name || form.name || 'Votre entreprise';
  const localLogo = localMedia.find((media) => media.kind === 'logo');
  const heroMedia = localMedia.find((media) => media.kind === 'image' || media.kind === 'video');
  const completeness = useMemo(() => Math.max(10, Math.round(([form.name, form.sector, form.location, form.address, form.phone, form.website, form.socialLinks].filter(Boolean).length / 7) * 100)), [form]);
  const update = (key: keyof AnalyzeRequest, value: string): void => setForm((current) => ({ ...current, [key]: value }));

  const analyze = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault(); setLoading(true); setError('');
    try {
      const response = await fetch('/api/analyze', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const responseText = await response.text();
      if (!responseText) throw new Error('Le serveur d’analyse n’a retourné aucune réponse. Recharge la page et réessaie.');
      let payload: unknown;
      try { payload = JSON.parse(responseText) as unknown; }
      catch { throw new Error('La réponse du serveur d’analyse est invalide. Vérifie que le serveur local est démarré avec npm run dev.'); }
      if (!response.ok) throw new Error(typeof payload === 'object' && payload !== null && 'error' in payload ? String(payload.error) : 'L’analyse a échoué.');
      if (!isAnalysis(payload)) throw new Error('Le format de l’analyse reçue est incomplet.');
      setAnalysis(payload);
      setThemeColors((payload.brand.colors.length ? payload.brand.colors : fallbackColors).slice(0, 3).map((color) => color.hex));
    } catch (caught: unknown) { setError(caught instanceof Error ? caught.message : 'Une erreur inattendue est survenue.'); }
    finally { setLoading(false); }
  };

  const download = (): void => {
    if (!analysis) return;
    const exportData = { ...analysis, customization: { colors: themeColors, stylePreset, uploadedFiles: localMedia.map((media) => ({ name: media.name, kind: media.kind })) } };
    const url = URL.createObjectURL(new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' }));
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = `${analysis.company.name.toLowerCase().replace(/[^a-z0-9]+/gi, '-')}-site-config.json`; anchor.click(); URL.revokeObjectURL(url);
  };

  const previewStyle = { '--preview-bg': colors[0]?.hex, '--preview-text': colors[1]?.hex, '--preview-accent': colors[2]?.hex } as CSSProperties;
  const addFiles = (files: FileList | null, kind: 'logo' | 'media'): void => {
    if (!files) return;
    const additions = Array.from(files).map((file, index): LocalMedia => ({ id: `${file.name}-${file.lastModified}-${index}`, name: file.name, url: URL.createObjectURL(file), kind: kind === 'logo' ? 'logo' : file.type.startsWith('video/') ? 'video' : 'image' }));
    setLocalMedia((current) => kind === 'logo' ? [...current.filter((media) => media.kind !== 'logo'), ...additions.slice(0, 1)] : [...current, ...additions]);
  };
  const removeMedia = (id: string): void => setLocalMedia((current) => { const target = current.find((media) => media.id === id); if (target) URL.revokeObjectURL(target.url); return current.filter((media) => media.id !== id); });
  const changeColor = (index: number, value: string): void => setThemeColors((current) => current.map((color, colorIndex) => colorIndex === index ? value : color));

  return <div className="studio-shell">
    <header className="studio-header"><a className="studio-brand" href="#top"><span className="brand-glyph">V</span><span><b>ATELIER</b><small>VISION TECH Ai</small></span></a><nav aria-label="Navigation"><a href="#analyzer">Analyseur</a><a href="#direction">Direction</a><a href="#preview">Aperçu</a></nav><span className="system-status"><i/> Recherche connectée</span></header>
    <main id="top">
      <section className="intro-panel"><div><p className="kicker"><Sparkles size={14}/> Atelier de création web</p><h1>De l’entreprise au site<br/><em>en un seul dossier.</em></h1></div><p>Recherche approfondie, direction de marque, contenus et aperçu premium. Chaque recommandation reste reliée à ses sources.</p></section>
      <section id="analyzer" className="workspace-grid">
        <aside className="research-card"><div className="panel-title"><span>01</span><div><p>Recherche</p><h2>Analyser une compagnie</h2></div></div><form onSubmit={(event) => void analyze(event)}>
          <label>Nom de l’entreprise *<input value={form.name} onChange={(event) => update('name', event.target.value)} placeholder="Ex. Garage Vision-Tech" required/></label>
          <div className="field-row"><label>Secteur<input value={form.sector} onChange={(event) => update('sector', event.target.value)} placeholder="Ex. Mécanique"/></label><label>Ville / région<input value={form.location} onChange={(event) => update('location', event.target.value)} placeholder="Ex. Saint-Jérôme"/></label></div>
          <label>Adresse<input value={form.address} onChange={(event) => update('address', event.target.value)} placeholder="Ex. 123, rue Principale, Saint-Jérôme" autoComplete="street-address"/></label>
          <label>Numéro de téléphone<input type="tel" value={form.phone} onChange={(event) => update('phone', event.target.value)} placeholder="Ex. 450 555-0100" autoComplete="tel"/></label>
          <label>Site web<input type="url" value={form.website} onChange={(event) => update('website', event.target.value)} placeholder="https://..."/></label>
          <label>Réseaux sociaux<textarea value={form.socialLinks} onChange={(event) => update('socialLinks', event.target.value)} placeholder="Facebook, Instagram, LinkedIn… une URL par ligne"/></label>
          <div className="depth"><span>Qualité du point de départ</span><b>{completeness}%</b><i><span style={{ width: `${completeness}%` }}/></i></div>
          <button className="analyze-button" disabled={loading}>{loading ? <LoaderCircle className="spin"/> : <Search/>}{loading ? 'Recherche en cours…' : 'Lancer l’analyse approfondie'}<ArrowRight/></button>{error && <p className="inline-error" role="alert">{error}</p>}
        </form></aside>
        <section className="results-card" aria-live="polite">{!analysis ? <div className="empty-research"><span><WandSparkles/></span><p>Dossier de création</p><h2>La recherche révélera<br/>l’identité du futur site.</h2><div className="analysis-steps"><div><Check/>Présence web et sociale</div><div><Check/>Positionnement et clientèle</div><div><Check/>Palette, ton et contenus</div><div><Check/>Assets et sources</div></div><small>Ajoute le nom de l’entreprise pour commencer.</small></div> : <>
          <div className="result-heading"><div><p className="kicker">Dossier complété</p><h2>{analysis.company.name}</h2><p>{analysis.company.summary}</p></div><button onClick={download} aria-label="Télécharger la configuration"><Download/></button></div>
          <div className="result-tabs"><button className={tab === 'brief' ? 'active' : ''} onClick={() => setTab('brief')}>Direction créative</button><button className={tab === 'content' ? 'active' : ''} onClick={() => setTab('content')}>Contenus</button></div>
          {tab === 'brief' ? <div className="brief-grid" id="direction"><article className="brief-block wide"><p><Palette/> Direction visuelle</p><h3>{analysis.brand.visualDirection}</h3><div className="palette">{colors.map((color) => <span key={`${color.hex}-${color.name}`} style={{ backgroundColor: color.hex }} title={`${color.name} — ${color.role}`}><i>{color.hex}</i></span>)}</div></article><article className="brief-block"><p>Personnalité</p><div className="chips">{analysis.brand.personality.map((item) => <span key={item}>{item}</span>)}</div></article><article className="brief-block"><p>Clientèle</p><h3>{analysis.company.audience}</h3></article><article className="brief-block wide"><p><Image/> Médias repérés</p><h3>{analysis.assets.length} élément{analysis.assets.length === 1 ? '' : 's'} à vérifier à l’étape suivante.</h3></article><article className="brief-block wide sources"><p><Globe2/> Sources consultées</p>{analysis.sources.map((source) => <a href={source.url} target="_blank" rel="noreferrer" key={source.url}><span>{source.title}</span><small>{source.kind}</small><ExternalLink/></a>)}</article></div> : <div className="copy-list">{analysis.content.services.map((service, index) => <article key={service.title}><span>{String(index + 1).padStart(2, '0')}</span><div><h3>{service.title}</h3><p>{service.description}</p></div></article>)}</div>}
        </>}</section>
      </section>
      {analysis && <section id="assets" className="asset-review-section">
        <div className="review-heading"><div><span>02</span><div><p>Validation et personnalisation</p><h2>Vérifier les éléments trouvés</h2></div></div><p>Consulte tous les résultats, complète ce qui manque, puis ajuste la direction visuelle avant de produire le site.</p></div>
        <div className="review-grid">
          <article className="review-panel sources-panel"><header><Globe2/><div><h3>Toutes les sources</h3><p>{analysis.sources.length} source{analysis.sources.length === 1 ? '' : 's'} consultée{analysis.sources.length === 1 ? '' : 's'}</p></div></header><div className="full-source-list">{analysis.sources.map((source, index) => <a href={source.url} target="_blank" rel="noreferrer" key={`${source.url}-${index}`}><b>{String(index + 1).padStart(2, '0')}</b><span>{source.title}<small>{source.url}</small></span><em>{source.kind}</em><ExternalLink/></a>)}</div></article>
          <article className="review-panel media-panel"><header><FileImage/><div><h3>Logo, images et vidéos</h3><p>{analysis.assets.length} média{analysis.assets.length === 1 ? '' : 's'} trouvé{analysis.assets.length === 1 ? '' : 's'}</p></div></header>{analysis.assets.length ? <div className="found-media-grid">{analysis.assets.map((asset, index) => <a href={asset.url} target="_blank" rel="noreferrer" className={`found-media ${asset.kind}`} key={`${asset.url}-${index}`}>{asset.kind === 'video' ? <video src={asset.url} controls preload="metadata"/> : asset.kind === 'image' || asset.kind === 'logo' ? <img src={asset.url} alt={asset.label}/> : <Image/>}<span>{asset.label}<small>{asset.usage}</small></span><em>{asset.kind}</em></a>)}</div> : <div className="media-empty"><Image/><h3>Aucun média fiable trouvé</h3><p>Ajoute les fichiers officiels de l’entreprise ci-dessous.</p></div>}
            <div className="upload-grid"><label className="upload-drop"><Upload/><span>Ajouter le logo<small>PNG, JPG, WEBP ou SVG</small></span><input type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" onChange={(event) => addFiles(event.target.files, 'logo')}/></label><label className="upload-drop"><Upload/><span>Ajouter photos ou vidéos<small>Plusieurs fichiers acceptés</small></span><input type="file" accept="image/*,video/*" multiple onChange={(event) => addFiles(event.target.files, 'media')}/></label></div>
            {localMedia.length > 0 && <div className="local-media-grid">{localMedia.map((media) => <div className="local-media" key={media.id}>{media.kind === 'video' ? <video src={media.url} controls preload="metadata"/> : <img src={media.url} alt={media.name}/>}<span>{media.name}<small>{media.kind}</small></span><button type="button" onClick={() => removeMedia(media.id)}>Retirer</button></div>)}</div>}
          </article>
          <article className="review-panel style-panel"><header><Palette/><div><h3>Style et couleurs</h3><p>Modifie les choix proposés par l’analyseur</p></div></header><div className="style-presets" role="group" aria-label="Style visuel">{(['industrial', 'editorial', 'minimal', 'luxury'] as StylePreset[]).map((preset) => <button type="button" className={stylePreset === preset ? 'active' : ''} aria-pressed={stylePreset === preset} onClick={() => setStylePreset(preset)} key={preset}>{preset === 'industrial' ? 'Industriel' : preset === 'editorial' ? 'Éditorial' : preset === 'minimal' ? 'Minimal' : 'Luxueux'}</button>)}</div><div className="color-editor">{themeColors.map((color, index) => <label key={`${index}-${color}`}><span>{index === 0 ? 'Fond' : index === 1 ? 'Texte' : 'Accent'}</span><div><input type="color" value={color} onChange={(event) => changeColor(index, event.target.value)}/><input defaultValue={color} pattern="#[0-9A-Fa-f]{6}" aria-label={`${index === 0 ? 'Fond' : index === 1 ? 'Texte' : 'Accent'} en hexadécimal`} onBlur={(event) => /^#[0-9A-Fa-f]{6}$/.test(event.currentTarget.value) ? changeColor(index, event.currentTarget.value) : event.currentTarget.value = color}/></div></label>)}</div></article>
        </div>
      </section>}
      <section id="preview" className="preview-section" style={previewStyle}><div className="preview-bar"><div><span>03</span><div><p>Template premium</p><h2>Aperçu du futur site</h2></div></div><span className="desktop-pill">1440 px · Accueil</span></div><div className={`site-preview preview-${stylePreset}`}>
        <div className="preview-nav"><strong>{localLogo ? <img src={localLogo.url} alt={`Logo ${previewName}`}/> : previewName.toUpperCase()}</strong><span>Services&nbsp;&nbsp;&nbsp; À propos&nbsp;&nbsp;&nbsp; Contact</span><button>{analysis?.content.primaryCta || 'Prendre rendez-vous'}</button></div>
        <div className="preview-hero"><div><p>{analysis?.content.eyebrow || 'SERVICE LOCAL · EXPERTISE ÉPROUVÉE'}</p><h2>{analysis?.content.headline || 'UN SERVICE QUI INSPIRE CONFIANCE.'}</h2><span>{analysis?.content.introduction || 'L’analyse transformera ici les forces de l’entreprise en une promesse claire et mémorable.'}</span><button>{analysis?.content.primaryCta || 'Parler à un expert'} <ChevronRight/></button></div><div className={`preview-art ${heroMedia ? 'has-media' : ''}`}>{heroMedia?.kind === 'video' ? <video src={heroMedia.url} autoPlay muted loop playsInline/> : heroMedia ? <img src={heroMedia.url} alt="Aperçu du média principal"/> : <><i/><i/><i/><strong>{previewName.slice(0, 1).toUpperCase()}</strong></>}</div></div>
        <div className="preview-services">{(analysis?.content.services ?? [{ title: 'Expertise', description: 'Un service précis.' }, { title: 'Proximité', description: 'Une équipe accessible.' }, { title: 'Résultats', description: 'Une promesse claire.' }]).slice(0,3).map((service, index) => <article key={service.title}><span>0{index + 1}</span><h3>{service.title}</h3><p>{service.description}</p></article>)}</div>
        <div className="preview-form"><div><p>UNE CONVERSATION SUFFIT</p><h2>{analysis?.form.title || 'PARLONS DE VOTRE BESOIN.'}</h2></div><form><input placeholder="Nom complet" disabled/><input placeholder="Courriel" disabled/><textarea placeholder="Décrivez votre besoin" disabled/><button type="button">{analysis?.form.submitLabel || 'Envoyer la demande'}</button></form></div>
      </div></section>
    </main>
  </div>;
};
