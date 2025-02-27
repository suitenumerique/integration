# lasuite-integration docs website and API

This folder is the source of the La Suite technical center website. It has two purposes:

- documenting how to use the @gouvfr-lasuite/integration npm package
- serving a couple of API endpoints that help developers of _La Suite_ services integrate common
  things

This is a classic Astro app with a Starlight template. Besides the static documentation, generated
through astro content collections, there are a couple notable things:

- the API is in `pages/api`. We also serve static images under the `public/api` folder that are
  called by La Suite services,
- we have scripts to generate the rolling homepage backgrounds in `bin/`. Every two week the website
  is generated again with new backgrounds located in `src/assets/backgrounds`. Doing that allows
  every service to just call a static endpoint for the background.

## Development

This is a starlight-based Astro app. Follow the official docs if more info is needed.

```sh
npm install
cp .env.example .env
npm run dev
```

### Background photos of homepages

The background image of the service homepages are served through an API exposed by the website.

Source images are not tracked in the repo. To build images, you must:

- put images in `src/assets/backgrounds/sources`
- run `node ./bin/transform-source-backgrounds.mjs`: this takes every image in the sources dir and
  for every image: it applies a linear gradient, resizes the image to 1920x1200 and saves the result
  in both avif and jpeg formats in `src/assets/backgrounds`
- then you can run `node ./bin/build-services-backgrounds.mjs`: it regenerates the service-related
  backgrounds in `public/api/backgrounds`. Depending on the offset passed, or the current week of
  the month, the service gets a different background. This is meant to be run in a cronjob to
  generate different backgrounds a few times a month.

### La Gaufre font

For the Gaufre content, we use a subset of Marianne font because we know we use just a few
characters for our list. This shrinks the font file size noticeably!

When you change the Gaufre content (the services shown), use the `npm run gaufre-glyphhanger-cmd`
helper. It will show you the [glyphhanger](https://github.com/zachleat/glyphhanger) command you need
to run locally to generate the new font file before pushing your changes.

:warning: It will also tell you what to do to update the code accordingly, don't miss it :)

If for any reason, you want the Gaufre to use a non-subsetted font, set the env var
`PUBLIC_USE_GAUFRE_SUBSETTED_FONT` to `0` on the machine building the website.

_This is not really streamlined and a bit error-prone, because Astro kinda gets in a way in that
specific case. Any contribution on this is welcome._
