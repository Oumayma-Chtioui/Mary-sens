# Direction design — Mary'sens

Tout ce qui suit est dérivé de vos assets réels (logo, photos produit), pas de
choix par défaut.

## Typographie

| Rôle | Police | Pourquoi |
|---|---|---|
| Titres / display | **Bodoni Moda** | Vos visuels produit utilisent déjà un serif à fort contraste en capitales pour les gros titres ("ROLL-ON ANTI-ÂGE") — c'est un style Didone/Bodoni. Plutôt que d'imposer un serif "premium" générique (Playfair, Fraunces...), on reprend le même registre que vous utilisez déjà sur vos packagings. |
| Accent / tagline | **Petit Formal Script** | Vos visuels utilisent une véritable écriture cursive fine pour les accroches ("L'élixir de jeunesse"). Réservée aux taglines courtes, jamais au corps de texte. |
| Corps / interface | **Libre Franklin** | Grotesque chaleureux, très lisible, bon support des accents français. Volontairement différent d'Inter/Jost pour éviter la signature "site généré". |

## Couleurs

Extraites du logo et des photos produit (bouteilles noires à texte doré, sérum
blanc à logo doré, packaging vert/menthe pour le déodorant) :

- `noir` `#141210` — fond des sections fortes, texte sur fond clair
- `or` `#C9A24B` / `or-deep` `#A9803F` / `or-clair` `#E7CE97` — dégradé doré du
  logo, boutons, accents
- `ivoire` `#F8F4EC` — fond principal (proche du fond des photos produit)
- `sauge` `#707C5E` — touche botanique (feuilles, menthe), utilisé avec parcimonie
  pour les états "disponible"
- `argile` `#A9432E` — touche organique (figue de barbarie), réservée aux états
  d'erreur/alerte pour rester rare et intentionnelle

## Élément signature

Le motif goutte + feuille du logo est redessiné en trait fin (`DropMark.tsx`) et
réutilisé comme séparateur de section plutôt que comme icône générique — c'est la
seule "décoration" récurrente du site.

## Ce qu'on a évité volontairement

Dégradés violets/bleus SaaS, cards à coins très arrondis, glassmorphism, hero
centré générique bouton+image stock, Inter par défaut — voir le brief initial
pour la liste complète des écueils identifiés en amont.
