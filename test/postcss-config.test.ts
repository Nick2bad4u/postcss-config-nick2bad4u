import * as path from "node:path";
import postcss, { type AcceptedPlugin } from "postcss";
import { describe, expect, it } from "vitest";

import createAssetsConfig from "../src/assets.js";
import createBaseConfig from "../src/base.js";
import { createPostcssConfig } from "../src/config.js";
import createFullConfig from "../src/full.js";
import createProductionConfig from "../src/production.js";
import createTailwindConfig from "../src/tailwind.js";

const pluginName = (plugin: AcceptedPlugin): string => {
    if (typeof plugin === "function") {
        return plugin.name;
    }

    if ("postcssPlugin" in plugin) {
        return plugin.postcssPlugin;
    }

    if ("plugins" in plugin && Array.isArray(plugin.plugins)) {
        return "cssnano";
    }

    return "unknown";
};

const pluginNames = (plugins: readonly AcceptedPlugin[]): string[] =>
    plugins.map((plugin) => pluginName(plugin));

const marker = (name: string): AcceptedPlugin => ({
    Once(): void {},
    postcssPlugin: name,
});

describe(createPostcssConfig, () => {
    it("keeps the base pipeline ordered and portable", () => {
        const projectRoot = path.resolve("test/fixtures/example-project");
        const config = createBaseConfig({ projectRoot });

        expect(pluginNames(config.plugins)).toEqual([
            "postcss-import",
            "postcss-logical",
            "postcss-flexbugs-fixes",
            "autoprefixer",
        ]);
    });

    it("adds Tailwind only for Tailwind-aware profiles", () => {
        const baseNames = pluginNames(createBaseConfig().plugins);
        const tailwindNames = pluginNames(createTailwindConfig().plugins);

        expect(baseNames).not.toContain("@tailwindcss/postcss");
        expect(tailwindNames).toContain("@tailwindcss/postcss");
        expect(tailwindNames.indexOf("@tailwindcss/postcss")).toBeLessThan(
            tailwindNames.indexOf("postcss-logical")
        );
    });

    it("adds asset handling without assuming the package working directory", () => {
        const names = pluginNames(
            createAssetsConfig({ projectRoot: "test/fixtures/application" })
                .plugins
        );

        expect(names).toContain("postcss-assets");
        expect(names).toContain("postcss-inline-svg");
    });

    it("keeps risky optimizers opt-in and cssnano at the end", () => {
        const safeNames = pluginNames(createProductionConfig().plugins);
        const aggressiveNames = pluginNames(
            createProductionConfig({
                advancedMinification: true,
                combineDuplicateSelectors: true,
                sortMediaQueries: true,
            }).plugins
        );

        expect(safeNames).not.toContain("postcss-combine-duplicated-selectors");
        expect(safeNames).not.toContain("postcss-sort-media-queries");
        expect(safeNames.at(-1)).toBe("cssnano");
        expect(aggressiveNames).toEqual(
            expect.arrayContaining([
                "postcss-combine-duplicated-selectors",
                "postcss-sort-media-queries",
                "cssnano",
            ])
        );
    });

    it("selects full development and production behavior from context", () => {
        const developmentNames = pluginNames(
            createFullConfig({}, { env: "development" }).plugins
        );
        const productionNames = pluginNames(
            createFullConfig({}, { env: "production" }).plugins
        );

        expect(developmentNames.at(-1)).toBe("postcss-reporter");
        expect(developmentNames).not.toContain("cssnano");
        expect(productionNames).toContain("cssnano");
        expect(productionNames).not.toContain("postcss-reporter");
    });

    it("supports explicit semantic insertion points", () => {
        const names = pluginNames(
            createPostcssConfig({
                additionalPlugins: {
                    after: [marker("after")],
                    before: [marker("before")],
                    beforeOptimization: [marker("before-optimization")],
                },
                profile: "production",
            }).plugins
        );

        expect(names[0]).toBe("before");
        expect(names.indexOf("before-optimization")).toBeLessThan(
            names.indexOf("cssnano")
        );
        expect(names.at(-1)).toBe("after");
    });

    it("runs as a real PostCSS configuration", async () => {
        const result = await postcss(createBaseConfig().plugins).process(
            ".example { user-select: none; }",
            { from: undefined }
        );

        expect(result.css).toContain("-webkit-user-select: none");
        expect(result.css).toContain("user-select: none");
    });

    it("rejects unknown runtime profiles", () => {
        expect(() =>
            createPostcssConfig({
                profile: "unsupported" as never,
            })
        ).toThrow("Unknown PostCSS profile: unsupported");
    });
});
