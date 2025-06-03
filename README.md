# La Suite: integration

Repo containing code of:

- [@gouvfr-lasuite/integration npm package](https://www.npmjs.com/package/@gouvfr-lasuite/integration) in [`packages/integration`](./packages/integration/)
- [La Suite: integration docs and API](https://integration.lasuite.numerique.gouv.fr/) in [`website`](./website/)

# Adapting to your needs

This repository allows you to configure your version of La Gaufre. It contains a github action that will build it as a static website and host it on GitHub Pages, by default under `https://<yourname>.github.io/integration` once you fork it and enable Pages.

You can configure La Gaufre by editing [website/src/data/services.json](website/src/data/services.json) (see file for DINUM default values) and adding the required logos with names `$id.svg` into [website/src/assets/logos/](website/src/assets/logos/).

## Using La Gaufre

In your application, add a `button` with the class `js-lasuite-gaufre-btn`, and include the js `https://<yourname>.github.io/integration/api/v1/gaufre.js` in a script element using id `lasuite-gaufre-script`. If necessary, you'll need to whitelist `https://<yourname>.github.io/` in relevant CORS and/or CSP. 

If you are using the css from DINUM, you may also want to add classes `lasuite-gaufre-btn--vanilla js-lasuite-gaufre-btn` and either `lasuite-gaufre-btn--responsive`(responsive design) or `lasuite-gaufre-btn--small`(small design). In particular, you can do that automatically when using the `<Gaufre/>` element from the npm package `@gouvfr-lasuite/integration`

Clicking the button should then load `https://<yourname>.github.io/integration/api/v1/gaufre/`.

You can also load `<LaGaufre />` element from [@gouvfr-lasuite/ui-kit](https://www.npmjs.com/package/@gouvfr-lasuite/ui-kit) which includes both the script and the button, and can be customized with an optional `src=<link to custom /api/v1/gaufre.js>` parameter.

## Licenses

Source code is released under the [MIT](LICENSES/MIT.txt) and other
contents are released under the [Open Licence 2.0](LICENSES/Etalab-2.0.txt).
