# Courriels de démonstration

Les formulaires transmettent une demande à POST /api/demo-inquiry. Le serveur envoie deux messages à la seule adresse saisie par le visiteur : une confirmation client et une copie marquée « DÉMO — COPIE PROPRIÉTAIRE ». Aucune réservation, sauvegarde de rendez-vous ou transmission au garage.

Variables Vercel de production : SMTP_HOST, SMTP_USER, SMTP_PASS (sensible), DEMO_GARAGE (goulet ou str), DEMO_DIAGNOSTIC_TOKEN (sensible). Aucun identifiant SMTP dans le navigateur ou le dépôt. Après un changement de configuration, redéployer.

GET /api/demo-health, protégé par Authorization: Bearer DEMO_DIAGNOSTIC_TOKEN, vérifie la connexion et l’authentification SMTP sans envoyer de courriel. Cela ne confirme pas la réception dans une boîte ; un essai autorisé avec une adresse réelle reste nécessaire.

Le serveur annonce la réussite uniquement si les deux messages ont été acceptés par SMTP. Un envoi partiel permet une reprise. La limitation (3 essais en 15 minutes par IP et adresse) et la prévention des doublons sont en mémoire par instance Vercel ; elles ne constituent pas une garantie globale durable. Le formulaire possède aussi un champ piège et des contrôles d’origine et de contenu.

Dépendances ajoutées : nodemailer (envoi SMTP), @types/nodemailer (types). Pour le site STR auparavant statique : TypeScript, @types/node et @vercel/node pour ses fonctions serveur. Les fichiers de verrouillage sont générés par npm.

Validation : npm run test, npm run lint, npm run type-check, npm run build. Les tests SMTP utilisent un expéditeur simulé et n’envoient aucun message.

Dans le dépôt Goulet, node scripts/export-demo-api.mjs synchronise les fonctions avec la copie indépendante du dépôt STR.
