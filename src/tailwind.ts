import type { Except } from "type-fest";

import {
    createPostcssConfig,
    type PostcssConfigOptions,
    type PostcssLoaderContext,
    type SharedPostcssConfig,
} from "./config.js";

/** Modern CSS baseline with Tailwind CSS 4 processing. */
export function tailwindPostcssConfig(
    options: Except<PostcssConfigOptions, "profile"> = {},
    context: PostcssLoaderContext = {}
): SharedPostcssConfig {
    return createPostcssConfig({ ...options, profile: "tailwind" }, context);
}

export default tailwindPostcssConfig;
