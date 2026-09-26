# Contexte consolidé

## Discussions Codex

- **Repenser le site Vision Tech AI** (`01a0a754-31ae-7ab3-8aa6-d5bd371c0d08`) : conception de la version premium, animations, identité rouge/noir et corrections responsive.
- **Vérifier accès à la page Runable** (`01a0a1f7-d55f-7003-8ec3-67173c828ed9`) : accès au site Runable, export de l’application et préparation GitHub/Vercel.

Les deux discussions et la tâche actuelle sont rangées dans la section Codex **Vision-Tech Ai**.

## Dépôts GitHub

- [hpmel/vision-tech-ai-site](https://github.com/hpmel/vision-tech-ai-site) : version premium légère; base visuelle du template.
- [hpmel/vision-tech-ai](https://github.com/hpmel/vision-tech-ai) : ancienne application Runable monorepo; référence fonctionnelle seulement.

## Décision d’architecture

Le template reste un troisième dépôt indépendant. Cette séparation évite de mélanger l’historique de la vitrine et celui de l’application Runable. Les deux projets sont reliés ici par sous-modules et peuvent évoluer sans bloquer le template.
