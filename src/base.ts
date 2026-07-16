import type { Except } from "type-fest";

import {
    createPostcssConfig,
    type PostcssConfigOptions,
    type PostcssLoaderContext,
    type SharedPostcssConfig,
} from "./config.js";

/** Postcss-load-config compatible modern CSS baseline. */
export function basePostcssConfig(
    options: Except<PostcssConfigOptions, "profile"> = {},
    context: PostcssLoaderContext = {}
): SharedPostcssConfig {
    return createPostcssConfig({ ...options, profile: "base" }, context);
}

export default basePostcssConfig;
