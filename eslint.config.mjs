import nickTwoBadFourU from "eslint-config-nick2bad4u";

/** @type {import("eslint").Linter.Config[]} */
const config = [
    ...nickTwoBadFourU.configs.all,

    // This module intentionally composes the package's full ordered pipeline.
    {
        files: ["src/config.ts"],
        rules: {
            complexity: "off",
            "import-x/max-dependencies": "off",
        },
    },
];

export default config;
