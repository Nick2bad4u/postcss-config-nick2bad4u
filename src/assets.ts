import type { Except } from "type-fest";

import {
    createPostcssConfig,
    type PostcssConfigOptions,
    type PostcssLoaderContext,
    type SharedPostcssConfig,
} from "./config.js";

/** Modern CSS baseline with consumer-root asset and SVG resolution. */
export function assetsPostcssConfig(
    options: Except<PostcssConfigOptions, "profile"> = {},
    context: PostcssLoaderContext = {}
): SharedPostcssConfig {
    return createPostcssConfig({ ...options, profile: "assets" }, context);
}

export default assetsPostcssConfig;
