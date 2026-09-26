# KMD Web : services

## Livrables

- `index.html` : page de service en français, autonome et responsive. Elle utilise du CSS et un peu de JavaScript intégrés, sans dépendance ni police externe. Les boutons de projet et de contact pointent vers les sites publics.
- `KMD-Web-Services.pptx` : présentation éditable de 11 diapositives. Les noms des projets sont cliquables et les notes des diapositives contiennent le contexte utile.
- `KMD-Web-Services.pdf` : version PDF de la présentation.
- `sources.md` : références de marque, pages de projets et règles utilisées pour les prix.
- `generate.cjs`, `render-primitives.json` et `render_pdf.py` : sources permettant de régénérer le jeu de diapositives et le PDF avec le runtime déjà disponible dans l’environnement.

La page peut être téléversée comme `index.html` dans le dossier d’une route ou d’un site statique. Elle ne contient pas de formulaire qui semble fonctionnel sans service de réception; son appel à l’action mène au diagnostic déjà proposé sur kmdweb.ca.

Les tarifs affichés sont les montants de départ communiqués par KMD Web. Le devis doit confirmer le périmètre, les frais récurrents et les taxes. Les animations, l’intégration IA et les fonctionnalités sont définies selon chaque mandat.

Le PowerPoint a passé le validateur OOXML du skill de présentation : **All validations PASSED!** Le PDF est généré à partir des mêmes objets de mise en page avec ReportLab.

## Régénérer les fichiers de présentation dans l’environnement Codex

Depuis ce dossier, dans PowerShell :

```powershell
$env:NODE_PATH = 'C:\Users\Mel\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\node_modules'
node .\generate.cjs
& 'C:\Users\Mel\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' .\render_pdf.py
```
