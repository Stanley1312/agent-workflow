import { productAssets } from "../data/product-assets";

export type ListingImageSource = {
  src: string;
  alt: string;
};

const PRODUCT_IMAGE_FALLBACK: ListingImageSource = {
  src: "/images/products/fallback.svg",
  alt: "Marketplace listing image unavailable",
};

const PRODUCT_IMAGE_ASSETS: Record<string, string> = Object.fromEntries(
  productAssets.map((asset) => [asset.id, `/requirements/assets/products/${asset.fileName}`]),
);

export function resolveListingImageSource(assetId?: string | null): ListingImageSource {
  if (!assetId) {
    return PRODUCT_IMAGE_FALLBACK;
  }

  const src = PRODUCT_IMAGE_ASSETS[assetId];
  if (!src) {
    return PRODUCT_IMAGE_FALLBACK;
  }

  return {
    src,
    alt: "Marketplace listing image",
  };
}

export function getProductImageAssetIds(): string[] {
  return productAssets.map((asset) => asset.id);
}

export function getProductImageSourceMap(): Record<string, string> {
  return { ...PRODUCT_IMAGE_ASSETS };
}
