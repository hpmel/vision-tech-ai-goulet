# Atelier de création de sites premium

Cette application analyse la présence web publique d’une entreprise, produit une direction de marque sourcée et alimente un aperçu de site premium. L’analyse utilise l’API Responses d’OpenAI avec recherche web; la clé reste exclusivement dans `.env.local` et dans les variables serveur du déploiement.

## Utiliser l’atelier

1. Créer `.env.local` avec `OPENAI_API_KEY`.
2. Lancer `npm run dev`; le serveur Vite expose aussi la fonction locale `/api/analyze`.
3. Entrer le nom de l’entreprise et, idéalement, sa ville, son site et ses réseaux sociaux.
4. Vérifier les sources et les droits d’utilisation des images avant de les intégrer au site final.
5. Télécharger la configuration JSON générée.

## Créer un nouveau site

1. Dupliquer ce dépôt avec le bouton **Use this template** de GitHub (après sa publication comme dépôt modèle).
2. Modifier `src/site.config.ts` pour le nom, les couleurs, les coordonnées, les liens et les chemins des médias.
3. Modifier `src/content.ts` pour les textes français et anglais.
4. Remplacer les fichiers correspondants dans `public/` en conservant leurs noms, ou modifier leurs chemins dans la configuration.
5. Exécuter les validations, puis relier le nouveau dépôt à Vercel.

Les couleurs principales sont exposées comme variables CSS et alimentées par `site.config.ts`. Les composants n’ont donc pas à être retouchés pour une nouvelle marque.

## Commandes

```sh
npm install
npm run dev
npm run test
npm run lint
npm run type-check
npm run build
```

## Sources reliées

- `upstream/vision-tech-ai-site` : site premium React/Vite, source visuelle du template.
- `upstream/vision-tech-ai` : export Runable historique, conservé comme référence pour les fonctionnalités et intégrations.

Ces dossiers sont des sous-modules Git. Après un clonage, utiliser `git submodule update --init --recursive` pour les récupérer. Le template ne dépend pas d’eux pour fonctionner ou être déployé.

## Architecture

- `src/site.config.ts` : identité, thème, coordonnées et médias.
- `src/content.ts` : contenu bilingue.
- `src/components/` : composants visuels réutilisables.
- `public/` : logos, photos et vidéos du client.
- `docs/PROJECT-CONTEXT.md` : liens vers les discussions et les dépôts d’origine.

## Dépendances

Le template reprend React, React DOM, Vite, TypeScript, GSAP, Lucide et les polices Fontsource. `@vercel/node` fournit les types de la fonction serveur qui protège la clé OpenAI. La recherche web est appelée directement par HTTPS, sans SDK supplémentaire.
