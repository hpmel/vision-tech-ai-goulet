# Validation de la page Goulet

25 septembre 2026.

- `npm run test` : 5 tests réussis, dont préparation du courriel et encodage empêchant l’ajout de destinataires via les champs.
- `npm run lint` : réussi, aucun avertissement.
- `npm run type-check` : réussi.
- `npm run build` : réussi ; les entrées atelier et Goulet sont générées.
- Vérification visuelle dans le navigateur intégré : ordinateur, mobile 390 px, petit mobile 320 px. Aucun débordement horizontal détecté.
- Thèmes clair et sombre examinés.
- Menu mobile : ouverture et fermeture à la sélection d’une section vérifiées.
- Formulaire vide : champs requis invalides, aucun brouillon généré.
- Formulaire rempli avec des données de test : destinataire, marque, année, modèle et service correctement encodés dans le brouillon. Aucun envoi exécuté.
- Modification après préparation : brouillon précédent supprimé, nouvelle préparation requise.
- FAQ : développement d’une réponse vérifié.
- Préférence de réduction des animations émulée via le navigateur : vidéo en pause, animations de défilement désactivées. Émulation retirée après vérification.
- Aucune image chargée cassée détectée et aucune erreur de console relevée.
- Vidéo H.264 optimisée : 2 026 140 octets contre 20 799 604 pour l’original. Images WebP utilisées : environ 571 Ko au total contre environ 7,1 Mo pour les PNG correspondants.
- Captures : `apercu-desktop.png` et `page-complete.png`.

Un audit Lighthouse n’a pas été exécuté : aucun score Lighthouse ou résultat Core Web Vitals de production n’est revendiqué. Les contrôles ci-dessus portent sur la version locale. La réception réelle des courriels, le déploiement et la validité actuelle du numéro secondaire ne sont pas testés.
