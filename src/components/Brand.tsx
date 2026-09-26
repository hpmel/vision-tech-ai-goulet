import type { ReactElement } from 'react';
import { siteConfig } from '../site.config';

export const Brand = (): ReactElement => <a href="#top" className="brand" aria-label={siteConfig.brand.name}><img src={siteConfig.assets.logoMark} alt="" width="44" height="44"/><span>{siteConfig.brand.firstLine}<span className="brand-bottom">{siteConfig.brand.secondLine} <b>{siteConfig.brand.accent}</b></span></span></a>;
