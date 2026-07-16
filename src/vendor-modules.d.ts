declare module "postcss-assets" {
    interface PostcssAssetsOptions {
        readonly basePath?: string;
        readonly cachebuster?: boolean;
        readonly loadPaths?: readonly string[];
        readonly relative?: boolean;
    }

    const postcssAssets: import("postcss").PluginCreator<PostcssAssetsOptions>;
    export default postcssAssets;
}

declare module "postcss-normalize" {
    interface PostcssNormalizeOptions {
        readonly allowDuplicates?: boolean;
        readonly forceImport?: boolean | string;
    }

    const postcssNormalize: import("postcss").PluginCreator<PostcssNormalizeOptions>;
    export default postcssNormalize;
}

declare module "postcss-round-subpixels" {
    const roundSubpixels: import("postcss").PluginCreator<Record<never, never>>;
    export default roundSubpixels;
}
