import type { CSSProperties } from 'react';

export interface SiteTheme {
  background: string;
  surface: string;
  accent: string;
  text: string;
  muted: string;
  border: string;
}

export interface SiteAssets {
  logoMark: string;
  heroVideo: string;
  heroPoster: string;
  teamPhoto: string;
  sculpture: string;
}

export interface SiteConfig {
  brand: { name: string; firstLine: string; secondLine: string; accent: string };
  locale: { defaultLanguage: 'fr' | 'en'; frenchTitle: string; englishTitle: string };
  contact: { phoneLabel: string; phoneHref: string; email: string; regionFr: string; regionEn: string; bookingUrl: string };
  theme: SiteTheme;
  assets: SiteAssets;
}

export const siteConfig: SiteConfig = {
  brand: {
    name: 'Vision Tech Ai',
    firstLine: 'VISION',
    secondLine: 'TECH',
    accent: 'Ai',
  },
  locale: {
    defaultLanguage: 'fr',
    frenchTitle: 'Vision Tech Ai | Plus de temps. Plus de possibilités.',
    englishTitle: 'Vision Tech Ai | More time. More possibilities.',
  },
  contact: {
    phoneLabel: '514-838-4995',
    phoneHref: '+15148384995',
    email: 'vision.tech.ai7@gmail.com',
    regionFr: 'Partout au Canada',
    regionEn: 'Across Canada',
    bookingUrl: 'https://vision-tech-ai.runable.site/#contact',
  },
  theme: {
    background: '#080809',
    surface: '#0e0e10',
    accent: '#ed252a',
    text: '#f3f1ef',
    muted: '#a3a1a5',
    border: '#29292c',
  },
  assets: {
    logoMark: '/logo-mark.svg',
    heroVideo: '/hero-data-motion.mp4',
    heroPoster: '/hero-data-poster.jpg',
    teamPhoto: '/team-meeting.webp',
    sculpture: '/vision-sculpture.jpg',
  },
};

export type ThemeStyle = CSSProperties & Record<`--${string}`, string>;

export const themeStyle: ThemeStyle = {
  '--color-background': siteConfig.theme.background,
  '--color-surface': siteConfig.theme.surface,
  '--red': siteConfig.theme.accent,
  '--color-text': siteConfig.theme.text,
  '--muted': siteConfig.theme.muted,
  '--border': siteConfig.theme.border,
};
