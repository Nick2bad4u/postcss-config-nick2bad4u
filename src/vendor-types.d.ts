import type { PluginCreator } from "postcss";

declare global {
    type PostcssVendorPluginCreator<Options> = PluginCreator<Options>;
}

export {};
