# postcss-config-nick2bad4u

[![CI](https://github.com/Nick2bad4u/postcss-config-nick2bad4u/actions/workflows/ci.yml/badge.svg)](https://github.com/Nick2bad4u/postcss-config-nick2bad4u/actions/workflows/ci.yml)

Context-aware PostCSS presets for modern CSS, Tailwind CSS, assets, and
production optimization. Every path is resolved from the consuming project;
the package never assumes that its own installation directory is the project
root.

## Install

```sh
npm install --save-dev postcss postcss-config-nick2bad4u
```

Install Tailwind CSS when using the Tailwind or full profile:

```sh
npm install --save-dev tailwindcss
```

## Basic configuration

Use the base preset as a `postcss.config.mjs` function so
`postcss-load-config` can supply its current environment and working directory:

```js
import createPostcssConfig from "postcss-config-nick2bad4u";

export default (context) => createPostcssConfig({}, context);
```

The root export and `postcss-config-nick2bad4u/base` both provide the base
profile. It includes imports, logical properties, flexbug fixes, and
Autoprefixer in a stable semantic order.

## Profiles

Each subpath supplies a focused default factory:

- `postcss-config-nick2bad4u/base` — portable modern-CSS defaults.
- `postcss-config-nick2bad4u/tailwind` — base plus the Tailwind PostCSS plugin.
- `postcss-config-nick2bad4u/assets` — base plus asset URL and inline-SVG
  handling.
- `postcss-config-nick2bad4u/production` — base plus safe cssnano defaults.
- `postcss-config-nick2bad4u/full` — Tailwind, assets, normalization, and
  environment-aware reporting or minification.

For example:

```js
import createFullConfig from "postcss-config-nick2bad4u/full";

export default (context) =>
 createFullConfig(
  {
   projectRoot: import.meta.dirname,
   assetLoadPaths: ["public", "src/assets"],
   browsers: ["defaults and fully supports es6-module"],
  },
  context
 );
```

The full profile uses cssnano only when `context.env` or `options.env` is
`production`. In other environments it appends `postcss-reporter` instead.

## Production safety

The production preset intentionally uses cssnano's default preset. Selector
combining, media-query sorting, and the advanced cssnano preset can alter CSS
semantics, so each requires an explicit option:

```js
import createProductionConfig from "postcss-config-nick2bad4u/production";

export default createProductionConfig({
 advancedMinification: true,
 combineDuplicateSelectors: true,
 sortMediaQueries: true,
});
```

Review the generated CSS before enabling these optimizations in an existing
application.

## Extending the pipeline

Use named insertion points instead of rebuilding the preset's ordering:

```js
import createPostcssConfig from "postcss-config-nick2bad4u";
import customProperties from "postcss-custom-properties";

export default createPostcssConfig({
 additionalPlugins: {
  beforeOptimization: [customProperties()],
 },
 profile: "production",
});
```

Plugins in `before` run before imports. `beforeOptimization` runs after normal
transforms and assets but before optional optimizers. `after` runs last,
including after cssnano, and should be reserved for plugins that explicitly
need that position.

## Validation

```sh
npm run release:verify
```

This builds the ESM package, runs both TypeScript generations, exercises the
configuration through PostCSS, checks coverage and formatting, and validates
the packed public surface with publint and Are the Types Wrong.

## License

[MIT](LICENSE)
