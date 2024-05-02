---
title: Endpoints de l'API web
---

L'API d'intégration de La Suite expose plusieurs endpoints facilitant l'usage des UI communes.

## URL de l'API

```
https://integration.lasuite.numerique.gouv.fr
```

C'est par exemple l'URL à passer comme `lasuiteApiUrl` aux composants React.

## Arrière-plan de page d'accueil

```text "{id}" "{avif,jpg}"
https://integration.lasuite.numerique.gouv.fr/api/backgrounds/v1/{id}.avif
https://integration.lasuite.numerique.gouv.fr/api/backgrounds/v1/{id}.jpg
```

- Méthode : GET
- Retourne : une image en AVIF ou JPG en 1920x1200
- Passer l'[id d'un service](#liste-des-services-de-la-suite) à la place de `{id}`.  
  💡 Si votre service n'est pas (encore) supporté, vous pouvez utiliser l'id `default`.

Les photos d'arrière-plan de chaque page d'accueil de service changent plusieurs fois par mois à
travers tous les services.

Pour que ce changement se fasse sans avoir à mettre à jour le code des pages d'accueil
régulièrement, un service peut requêter une photo d'arrière-plan avec son identifiant. L'image
exposée sur cette URL change régulièrement.

Les photos sont disponibles à la fois en avif et en jpeg.

### Exemple d'usage

Avec le service Resana :

```html
<picture>
  <source
    srcset="https://integration.lasuite.numerique.gouv.fr/api/backgrounds/v1/resana.avif"
    type="image/avif"
  />
  <img
    src="https://integration.lasuite.numerique.gouv.fr/api/backgrounds/v1/resana.jpg"
    alt=""
    width="1920"
    height="1080"
  />
</picture>
```

<picture>
  <source
    srcset="https://integration.lasuite.numerique.gouv.fr/api/backgrounds/v1/resana.avif"
    type="image/avif"
  />
  <img
    src="https://integration.lasuite.numerique.gouv.fr/api/backgrounds/v1/resana.jpg"
    alt=""
    width="1920"
    height="1080"
  />
</picture>

## Widget La Gaufre

```
https://integration.lasuite.numerique.gouv.fr/api/v1/gaufre.js
```

- Méthode : GET
- Retourne : le JavaScript s'occupant d'afficher la popup listant les services de La Suite au clic
  sur le bouton [Gaufre](/guides/gaufre)

## Liste des services de La Suite

`https://integration.lasuite.numerique.gouv.fr/api/v1/services.json`

Retourne un tableau JSON listant les services de La Suite numérique. Chaque service a cette
structure :

- `id` l'identifiant du service, utilisé par d'autres APIs,
- `name` le nom du service,
- `url` l'url de la page d'accueil du service.

Ce endpoint sert principalement à retrouver l'`id` correspondant à un service et est là plutôt à
titre informatif.
