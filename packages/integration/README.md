# @gouvfr-lasuite/integration npm package

The `@gouvfr-lasuite/integration` npm package helps services of [La Suite numérique](https://lasuite.numerique.gouv.fr/) with already-made React and HTML templates of common _La Suite_ UIs.

For now, it helps developers integrate:

- a _La Suite_ branded homepage
- the _Gaufre_ ("waffle") button that lets users of a service easily switch between _La Suite_ services.

## Usage

```
npm install @gouvfr-lasuite/integration
```

If you use React, you can directly consume the exposed React components.

If you use anything else, you can copy and paste content from the HTML templates in the `dist/html` folder.

CSS is also available. Depending on whether or not you use the [DSFR](https://www.systeme-de-design.gouv.fr/), you can use different CSS files from `dist/css`.

Precise documentation on usage is available on [integration.lasuite.numerique.gouv.fr](https://integration.lasuite.numerique.gouv.fr).

## Development

This folder is meant to generate the `@gouvfr-lasuite/integration` npm package.

It's a vite app.

To start, `npm install` a first time and copy the example env file: `cp .env.example .env`. Make sure the API env var targets a running API. If you don't want to use the production one, you can run one locally easily: the API is exposed via the `/website` server, go check the README there.

Then, run the local dev server with `npm run dev`.

The main dev file is `src/dev/dev.tsx` where a small testing React router is used to render the different React components while developing.

### Building

Run `npm run build` to build all the `dist/` files which are: React components, CSS files and HTML templates.

Internally, building all of this is a bit different than your usual vite app. We actually use 3 vite configs, and running `npm run build` runs them all:

#### React components

The default build generates the React components in es6 and commonjs files with the vite "lib" mode. Everything in `src/index.ts` is exposed in the generated file.

#### CSS

The `css-config` build generates the CSS files. They all go through purgecss. The list of CSS files to generate is in the css vite config.

CSS is rendered like that, and not through the main vite config, because CSS rendering in lib mode doesn't allow us to easily generate multiple CSS files while using the postcss-config.

#### HTML files

The `html-config` generates the HTML files.

**HTML files are not written by hand**: they are generated from the React components. The html vite config checks the `src/html.tsx` file and renders HTML files for every template listed.
