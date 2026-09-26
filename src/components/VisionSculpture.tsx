import type { ReactElement } from 'react';
import type { Language } from '../content';
import { siteConfig } from '../site.config';

/** Saved from the original hero for reuse in a future section. */
export const VisionSculpture = ({ lang = 'fr' }: { lang?: Language }): ReactElement => (
  <div className="hero-art vision-sculpture" aria-hidden="true">
    <div className="art-halo" />
    <img className="sculpture" src={siteConfig.assets.sculpture} width="1536" height="1024" alt="" loading="lazy" />
    <div className="light-trace trace-one" />
    <div className="light-trace trace-two" />
    <div className="art-caption"><span>{siteConfig.brand.name.toUpperCase()}</span><span>{lang === 'fr' ? 'L’HUMAIN + LA TECHNOLOGIE' : 'PEOPLE + TECHNOLOGY'}</span></div>
  </div>
);
