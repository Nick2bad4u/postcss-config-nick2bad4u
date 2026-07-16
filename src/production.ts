import type { Except } from "type-fest";

import {
    createPostcssConfig,
    type PostcssConfigOptions,
    type PostcssLoaderContext,
    type SharedPostcssConfig,
} from "./config.js";

/** Modern CSS baseline with safe cssnano production optimization. */
export function productionPostcssConfig(
    options: Except<PostcssConfigOptions, "profile"> = {},
    context: PostcssLoaderContext = {}
): SharedPostcssConfig {
    return createPostcssConfig({ ...options, profile: "production" }, context);
}

export default productionPostcssConfig;
