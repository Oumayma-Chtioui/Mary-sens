# Direction design — Mary'sens (v2)

Cette version remplace la direction éditoriale ivoire/Bodoni Moda précédente par
le design fourni par le client (5 écrans Flowstep), repris à l'identique.

## Typographie

| Rôle | Police |
|---|---|
| Titres / display | **Source Serif 4** |
| Corps / interface | **Inter** |

## Couleurs

- `#000000` / `#0b0b0a` — fond principal du site public (noir)
- `#B08A3E` — or, couleur d'accent principale (boutons, liens actifs, icônes)
- `#E4C98A` — or clair, réservé aux petits libellés sur fond sombre (eyebrow du hero)
- `#171717` / `#0a0a0a` — panneaux et cartes sur fond noir
- Blanc à opacité variable (`white/50`, `white/65`, `white/85`...) pour la hiérarchie du texte

## Icônes

Le design utilise des icônes `lucide-react` (Home, Leaf, Info, Mail, ShoppingCart,
Heart, etc.) au lieu du motif goutte+feuille dessiné à la main de la v1.

## Ce qui reste inchangé

- L'espace d'administration (`/admin`) garde son thème ivoire/clair — aucun écran
  n'a été fourni pour l'admin, donc il n'a pas été retouché.
- Toute la logique métier (Supabase, WhatsApp, CSV, RLS) est identique à la v1 —
  seul l'habillage visuel du site public a changé.

## Écarts assumés par rapport aux écrans fournis

- **Photos** : les écrans utilisaient des photos Unsplash génériques. Sur demande
  du client, elles ont été remplacées par les vraies photos produit Mary'sens
  (`public/images/`), en gardant la mise en page identique.
- **Points de vente** : aucun écran n'était fourni pour cette page. Elle a été
  conçue dans la même langue visuelle (cartes sombres, accents or) sur demande du
  client.
- **Panier / avis clients / réductions** : les écrans montrent un panier
  d'achat classique, des étoiles d'avis et des prix barrés — aucun de ces éléments
  n'existe dans le modèle de données actuel (catalogue + commande WhatsApp). Les
  éléments visuels correspondants (icône panier, cœur favori) sont conservés à
  l'écran pour respecter le design, mais ne sont pas fonctionnels tant que ces
  fonctionnalités ne sont pas développées.
