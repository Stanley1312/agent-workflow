export type ProductAsset = {
  id: string;
  fileName: string;
  title: string;
  category: string;
};

export const productAssets: ProductAsset[] = [
  {
    id: "product-iphone-12-pro",
    fileName: "iphone-12-pro.jpg",
    title: "iPhone 12 Pro",
    category: "electronics",
  },
  {
    id: "product-iphone-13-pro",
    fileName: "iphone-13-pro.jpg",
    title: "iPhone 13 Pro",
    category: "electronics",
  },
  {
    id: "product-iphone-13-pro-close",
    fileName: "iphone-13-pro-close.jpg",
    title: "iPhone 13 Pro Close-up",
    category: "electronics",
  },
  {
    id: "product-iphone-13-pro-desk",
    fileName: "iphone-13-pro-desk.jpg",
    title: "iPhone 13 Pro on Desk",
    category: "electronics",
  },
  {
    id: "product-iphone-13-pro-front",
    fileName: "iphone-13-pro-front.jpg",
    title: "iPhone 13 Pro Front",
    category: "electronics",
  },
  {
    id: "product-iphone-13-pro-hand",
    fileName: "iphone-13-pro-hand.jpg",
    title: "iPhone 13 Pro in Hand",
    category: "electronics",
  },
  {
    id: "product-iphone-13-pro-plus",
    fileName: "iphone-13-pro-plus.jpg",
    title: "iPhone 13 Pro Plus",
    category: "electronics",
  },
  {
    id: "product-iphone-14-pro",
    fileName: "iphone-14-pro.jpg",
    title: "iPhone 14 Pro",
    category: "electronics",
  },
  {
    id: "product-macbook-air-m2",
    fileName: "macbook-air-m2.jpg",
    title: "MacBook Air M2",
    category: "electronics",
  },
  {
    id: "product-monitor-4k",
    fileName: "monitor-4k.jpg",
    title: "4K Monitor",
    category: "electronics",
  },
  {
    id: "product-sony-wh1000xm5",
    fileName: "sony-wh1000xm5.jpg",
    title: "Sony WH-1000XM5",
    category: "electronics",
  },
  {
    id: "product-standing-desk",
    fileName: "standing-desk.jpg",
    title: "Standing Desk",
    category: "home",
  },
  {
    id: "product-ikea-markus-chair",
    fileName: "ikea-markus-chair.jpg",
    title: "IKEA Markus Chair",
    category: "home",
  },
  {
    id: "product-trek-bike",
    fileName: "trek-bike.jpg",
    title: "Trek Bike",
    category: "sports",
  },
];

export const productAssetIds = productAssets.map((asset) => asset.id);
