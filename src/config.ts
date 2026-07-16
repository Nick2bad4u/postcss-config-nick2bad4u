import type { AcceptedPlugin } from "postcss";

import tailwindcss from "@tailwindcss/postcss";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import * as path from "node:path";
import postcssAssets from "postcss-assets";
import postcssClamp from "postcss-clamp";
import combineDuplicatedSelectors from "postcss-combine-duplicated-selectors";
import flexbugsFixes from "postcss-flexbugs-fixes";
import postcssImport from "postcss-import";
import inlineSvg from "postcss-inline-svg";
import postcssLogical from "postcss-logical";
import postcssNormalize from "postcss-normalize";
import postcssReporter from "postcss-reporter";
import roundSubpixels from "postcss-round-subpixels";
import sortMediaQueries from "postcss-sort-media-queries";

/** Additional plugin insertion points around the semantic pipeline. */
export interface AdditionalPostcssPlugins {
    readonly after?: readonly AcceptedPlugin[];
    readonly before?: readonly AcceptedPlugin[];
    readonly beforeOptimization?: readonly AcceptedPlugin[];
}

/** Options shared by all profile factories. */
export interface PostcssConfigOptions {
    readonly additionalPlugins?: AdditionalPostcssPlugins;
    readonly advancedMinification?: boolean;
    readonly assetLoadPaths?: readonly string[];
    readonly browsers?: readonly string[];
    readonly combineDuplicateSelectors?: boolean;
    readonly env?: string;
    readonly importPaths?: readonly string[];
    readonly inlineSvgPaths?: readonly string[];
    readonly profile?: PostcssProfile;
    readonly projectRoot?: string;
    readonly sortMediaQueries?: boolean;
}

/** Context fields supplied by postcss-load-config. */
export interface PostcssLoaderContext {
    readonly cwd?: string;
    readonly env?: string;
}

/** Profiles supplied by package root and subpath defaults. */
export type PostcssProfile =
    | "assets"
    | "base"
    | "full"
    | "production"
    | "tailwind";

/** Config shape accepted by PostCSS runners and postcss-load-config. */
export interface SharedPostcssConfig {
    readonly plugins: readonly AcceptedPlugin[];
}

const DEFAULT_BROWSERS = Object.freeze([
    "> 1%",
    "last 2 versions",
    "Firefox ESR",
    "not dead",
]);

const resolvePaths = (root: string, entries: readonly string[]): string[] =>
    entries.map((entry) => path.resolve(root, entry));

const assertProfile: (profile: unknown) => asserts profile is PostcssProfile = (
    profile
) => {
    if (
        profile !== "assets" &&
        profile !== "base" &&
        profile !== "full" &&
        profile !== "production" &&
        profile !== "tailwind"
    ) {
        throw new RangeError(`Unknown PostCSS profile: ${String(profile)}`);
    }
};

/** Build a context-aware, ordered PostCSS plugin pipeline. */
export function createPostcssConfig(
    options: PostcssConfigOptions = {},
    context: PostcssLoaderContext = {}
): SharedPostcssConfig {
    const profile: unknown = options.profile ?? "base";
    assertProfile(profile);
    const environment = options.env ?? context.env;
    const projectRoot = path.resolve(
        options.projectRoot ?? context.cwd ?? process.cwd()
    );
    const browsers = [...(options.browsers ?? DEFAULT_BROWSERS)];
    const includeTailwind = profile === "tailwind" || profile === "full";
    const includeAssets = profile === "assets" || profile === "full";
    const isMinify =
        profile === "production" ||
        (profile === "full" && environment === "production");
    const plugins: AcceptedPlugin[] = [
        ...(options.additionalPlugins?.before ?? []),
        postcssImport({
            path: resolvePaths(projectRoot, options.importPaths ?? ["src"]),
        }),
        ...(includeTailwind ? [tailwindcss()] : []),
        postcssLogical(),
        ...(profile === "full"
            ? [
                  postcssNormalize({ forceImport: false }),
                  postcssClamp(),
                  roundSubpixels(),
              ]
            : []),
        flexbugsFixes(),
        autoprefixer({
            flexbox: "no-2009",
            grid: "autoplace",
            overrideBrowserslist: browsers,
        }),
        ...(includeAssets
            ? [
                  postcssAssets({
                      basePath: projectRoot,
                      cachebuster: true,
                      loadPaths: resolvePaths(
                          projectRoot,
                          options.assetLoadPaths ?? [
                              "assets",
                              "src/assets",
                              "src/components/icons",
                          ]
                      ),
                      relative: true,
                  }),
                  inlineSvg({
                      paths: resolvePaths(
                          projectRoot,
                          options.inlineSvgPaths ?? [
                              "assets",
                              "src/assets",
                              "src/components/icons",
                          ]
                      ),
                      removeFill: true,
                      removeStroke: false,
                  }),
              ]
            : []),
        ...(options.additionalPlugins?.beforeOptimization ?? []),
        ...(isMinify && options.combineDuplicateSelectors === true
            ? [
                  combineDuplicatedSelectors({
                      removeDuplicatedProperties: true,
                  }),
              ]
            : []),
        ...(isMinify && options.sortMediaQueries === true
            ? [sortMediaQueries({ sort: "mobile-first" })]
            : []),
        ...(isMinify
            ? [
                  cssnano({
                      preset:
                          options.advancedMinification === true
                              ? "advanced"
                              : "default",
                  }),
              ]
            : []),
        ...(!isMinify && profile === "full"
            ? [
                  postcssReporter({
                      clearReportedMessages: true,
                      throwError: false,
                  }),
              ]
            : []),
        ...(options.additionalPlugins?.after ?? []),
    ];

    return { plugins };
}

export default createPostcssConfig;
