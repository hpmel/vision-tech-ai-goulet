# Catalogue des véhicules

Les deux formulaires utilisent le catalogue du site de référence `garage.vision-tech-ai.com`, importé depuis `upstream/vision-tech-ai/packages/web/src/web/vehicleData.ts` et `vehicleDataExtra.ts`.

- Données : `src/services/vehicleCatalogData.ts`.
- Filtrage commun : `src/services/vehicleCatalog.ts`.
- Interface Goulet : `src/components/VehicleFields.tsx`.
- Export autonome pour STR : `upstream/vision-tech-ai-garageSTR/js/vehicle-catalog.js`.

Les modèles et finitions sont filtrés par les plages d'années présentes dans le catalogue. Les listes ne constituent pas un catalogue constructeur exhaustif ou certifié pour le marché canadien. Quand une année ou une finition manque, le client peut saisir une valeur via « Autre »; aucune génération voisine n'est proposée automatiquement.

Après une modification des données ou du service, exécuter `node scripts/export-vehicle-catalog.mjs` avec le dépôt STR cloné dans `upstream/vision-tech-ai-garageSTR`, puis valider et publier les deux dépôts séparément. `node scripts/import-vehicle-catalog.mjs` réimporte les données du site de référence et remplace le fichier de données local.

Validation : `npm run test`, `npm run lint`, `npm run type-check`, `npm run build`, puis vérifier les changements de marque/année/modèle et les champs « Autre » dans chaque formulaire.

Aucune nouvelle dépendance. L'import et l'export utilisent TypeScript, déjà présent. Les services, coordonnées, dates et traitements de demande propres à chaque garage restent indépendants du sélecteur de véhicule.
