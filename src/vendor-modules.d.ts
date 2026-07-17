declare module "postcss-assets" {
    interface PostcssAssetsOptions {
        readonly basePath?: string;
        readonly cachebuster?: boolean;
        readonly loadPaths?: readonly string[];
        readonly relative?: boolean;
    }

    const postcssAssets: PostcssVendorPluginCreator<PostcssAssetsOptions>;
    export default postcssAssets;
}

declare module "postcss-normalize" {
    interface PostcssNormalizeOptions {
        readonly allowDuplicates?: boolean;
        readonly forceImport?: boolean | string;
    }

    const postcssNormalize: PostcssVendorPluginCreator<PostcssNormalizeOptions>;
    export default postcssNormalize;
}

declare module "postcss-round-subpixels" {
    const roundSubpixels: PostcssVendorPluginCreator<Record<never, never>>;
    export default roundSubpixels;
}
