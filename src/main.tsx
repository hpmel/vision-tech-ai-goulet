import React from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/space-grotesk';
import '@fontsource/barlow-condensed/latin-600.css';
import '@fontsource/chakra-petch/latin-600.css';
import { App } from './App';
import './studio.css';
import './review.css';

const root: HTMLElement | null = document.getElementById('root');
if (!root) throw new Error('Le conteneur de l’application est introuvable.');
createRoot(root).render(<React.StrictMode><App /></React.StrictMode>);
