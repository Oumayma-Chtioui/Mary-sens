# Mary'sens — site & catalogue digital

Next.js 14 (App Router, TypeScript, Tailwind) + Supabase (Postgres, Auth, Storage).

## Ce qui est livré

- **Site public** : accueil, catalogue filtrable, fiche produit éditoriale, page marque,
  points de vente, contact (formulaire → Supabase), commande WhatsApp partout.
- **Administration** (`/admin`) : tableau de bord, produits (CRUD + images + dupliquer +
  publier/dépublier), catégories, points de vente, messages de contact, paramètres du
  site (hero, à propos, réseaux sociaux, SEO), **import CSV en masse**.
- **Base de données** : schéma complet + Row Level Security dans `supabase/schema.sql`.
- **SEO** : sitemap, robots, métadonnées par page/produit.

Design : palette et typographie dérivées de vos assets réels (logo, packaging) —
voir `DESIGN.md` pour le détail des choix.

## Ce qui n'est pas fait pour vous

Je n'ai pas pu créer ni connecter de projet Supabase réel depuis cet environnement
(pas d'accès réseau à supabase.com, pas d'identifiants). Le code est prêt à s'y
connecter dès que vous branchez votre propre projet — voir ci-dessous.

## Mise en route

### 1. Installer les dépendances

```bash
npm install
```

### 2. Créer un projet Supabase

1. Allez sur [supabase.com](https://supabase.com) → New Project.
2. Dans **Project Settings → API**, récupérez :
   - `Project URL`
   - `anon public` key
   - `service_role` key (⚠️ à garder secrète, jamais côté client)
3. Copiez `.env.example` vers `.env.local` et renseignez ces valeurs, plus votre
   numéro WhatsApp professionnel (format international, sans `+` ni espaces, ex.
   `21612345678`).

### 3. Charger le schéma de base de données

Dans le **SQL Editor** de Supabase, collez et exécutez le contenu de
`supabase/schema.sql`. Cela crée toutes les tables, les policies RLS, les triggers,
et le bucket de stockage `marysens-media` pour les images.

### 4. Créer votre compte administrateur

1. Dans **Authentication → Users**, cliquez *Add user* et créez votre compte
   (email + mot de passe).
2. Copiez l'`UUID` généré pour cet utilisateur.
3. Dans le **SQL Editor**, exécutez :
   ```sql
   insert into admin_users (id, full_name) values ('COLLEZ-L-UUID-ICI', 'Votre nom');
   ```
4. Vous pouvez maintenant vous connecter sur `/admin/login` avec cet email/mot de passe.

### 5. Lancer le site en local

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) pour le site public, et
[http://localhost:3000/admin](http://localhost:3000/admin) pour l'administration.

### 6. Ajouter votre contenu

- **Paramètres** (`/admin/parametres`) : nom, description, WhatsApp, textes de
  l'accueil et de la page "La marque", réseaux sociaux, SEO. Tant que ces champs
  sont vides, le site affiche un texte de substitution clairement indiqué —
  aucune information n'a été inventée.
- **Catégories** puis **Produits** : créez vos catégories d'abord, puis vos
  produits (ou utilisez l'import CSV — un exemple est fourni dans
  `samples/produits-exemple.csv`, avec les vrais produits visibles sur vos visuels :
  Roll-on Anti-Âge, Sérum Hydratant, Huile d'Amande Douce, Déodorant Menthe & Coco,
  Moustisens).
- **Points de vente** : vos adresses réelles, horaires, lien Google Maps.
- Les images de logo et produits que vous m'avez fournies sont déjà dans
  `public/images/` et utilisées pour le hero de l'accueil ; téléversez vos photos
  produit définitives depuis la fiche de chaque produit dans l'admin (elles partent
  dans Supabase Storage).

### 7. Déployer

Le projet est prêt pour [Vercel](https://vercel.com) (ou tout hébergeur Next.js) :
poussez le code sur un repo Git, importez-le sur Vercel, renseignez les mêmes
variables d'environnement que `.env.local`, et déployez.

## Roadmap technique déjà prévue dans l'architecture

- Un vrai panier multi-produits avant l'envoi WhatsApp (la fonction
  `cartOrderMessage` dans `src/lib/whatsapp.ts` est déjà prête, il ne manque que
  l'état de panier côté client).
- Paiement en ligne / commandes / comptes clients : le schéma actuel (produits,
  catégories) n'a pas besoin d'être repensé pour ajouter une table `orders` plus
  tard.
- i18n (arabe/anglais) : les pages sont volontairement en français simple, sans
  librairie i18n, pour rester légères — une librairie comme `next-intl` peut être
  ajoutée sans réécrire les pages existantes.

## Structure du projet

```
src/
  app/                  routes publiques + /admin (App Router)
  components/site/      composants du site public
  components/admin/     composants de l'administration
  lib/actions/          Server Actions (CRUD Supabase)
  lib/supabase/         clients Supabase (browser, server, middleware)
  lib/queries.ts         lectures publiques (catalogue, fiche produit, points de vente)
  lib/settings.ts        chargement des paramètres du site avec valeurs par défaut
  lib/whatsapp.ts         génération des liens wa.me
supabase/schema.sql      schéma complet + RLS + bucket de stockage
samples/produits-exemple.csv   exemple pour l'import CSV
```
