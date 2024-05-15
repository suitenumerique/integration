# Changelog

## 0.1.4

- homepage tagline: hide breaklines on mobile devices

## 0.1.3

Notable thing:

- the embedded DSFR styles required for the La Suite styles to work are now generated behind a specific CSS selector to have somewhat scoped CSS
- there is a new `dist/css/prefixed-dsfr.css` that includes the "scoped" DSFR styles
- the `dist/css/required-dsfr.css` has been renamed to `dist/css/raw-dsfr.css` and still includes the untransformed DSFR styles
- the `dist/css/homepage-full.css` file contains the scoped DSFR styles

Small changes:

- red border styling on top is now applied on header, not on homepage container
- fix tagline outputting an unnecessary trailing br tag
- fix homepage content background photo sizing
- fix spacing issue on the bottom of the ProConnect button

Dev :

- dev components are now all in a `dev` folder to better understand what is generated in the npm package and what is used only while developing
- better test the "full" and "standalone" CSS versions of the homepage

## 0.1.2

- Export more CSS in `dist/css` to enable fine-grained CSS usage. It prevents having to include the Gaufre CSS two times if we consume both homepage and gaufre CSS files.

## 0.1.1

- Add new services icons in public/logos.

## 0.1.0

First release!
