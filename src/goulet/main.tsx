import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/barlow-condensed/latin-600.css';
import '@fontsource-variable/space-grotesk';
import { GouletPage } from './GouletPage';
import './goulet.css';

const root: HTMLElement | null = document.getElementById('root');
if (!root) throw new Error('Le conteneur de Pneus Goulet est introuvable.');
createRoot(root).render(<StrictMode><GouletPage /></StrictMode>);
