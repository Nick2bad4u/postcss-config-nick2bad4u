# Repository Instructions

This repository publishes `postcss-config-nick2bad4u`.
Treat profiles, plugin order, context handling, path resolution, and factory option types as public package surfaces.

## Priorities

- Keep plugin execution order semantic and covered by tests.
- Resolve imports/assets from the consumer root, never the installed package directory.
- Use postcss-load-config context rather than import-time environment snapshots.
- Keep potentially destructive selector/media-query optimizers opt-in.
- Validate packed exports through postcss-load-config and real CSS processing before release.

## Commands

```sh
npm run build:runtime
npm run typecheck
npm test
npm run release:verify
```
