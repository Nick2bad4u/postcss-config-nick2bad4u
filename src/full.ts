import type { Except } from "type-fest";

import {
    createPostcssConfig,
    type PostcssConfigOptions,
    type PostcssLoaderContext,
    type SharedPostcssConfig,
} from "./config.js";

/** Feature-rich Tailwind, compatibility, normalization, and asset profile. */
export function fullPostcssConfig(
    options: Except<PostcssConfigOptions, "profile"> = {},
    context: PostcssLoaderContext = {}
): SharedPostcssConfig {
    return createPostcssConfig({ ...options, profile: "full" }, context);
}

export default fullPostcssConfig;
