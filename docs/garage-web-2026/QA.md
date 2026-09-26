# Validation des livrables

- 16 diapositives, format 16:9; contenu en français et typographie Arial.
- PowerPoint éditable : textes, cartes, chiffres et illustration automobile sous forme d'objets natifs.
- Notes du présentateur et références conservées. Sources cliquables dans les diapositives chiffrées et les annexes.
- Validation OOXML du skill pptx : **All validations PASSED!**
- PDF de 16 pages contrôlé visuellement via images PNG et montage `apercu.png`. Aucun débordement ni chevauchement visible; caractère de flèche des liens retiré après inspection.
- Note technique : PowerPoint et LibreOffice indisponibles. Le PDF est produit par ReportLab à partir des mêmes primitives géométriques, textes et couleurs que le PPTX; il n'est pas un export rendu par PowerPoint. Les retours de ligne peuvent légèrement varier lors de l'ouverture du PPTX dans un autre logiciel.
- Aucun code applicatif, dépendance du projet ou fichier de verrouillage modifié. Tests applicatifs sans objet pour ces livrables documentaires.

## Reproduction

`generate.cjs` lit `contenu.json`, produit le PPTX et `render-primitives.json`. Il utilise pptxgenjs déjà fourni par le runtime Codex. `render_pdf.py` lit ces primitives et produit le PDF via ReportLab déjà fourni. Les polices sont celles de Windows.

La vérification factuelle et les limites méthodologiques figurent dans les sources et notes. Les scénarios et calculs de rentabilité sont explicitement illustratifs.
