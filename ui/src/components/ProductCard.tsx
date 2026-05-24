import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/data/products';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/product/${product.id}`}
      data-testid="product-card"
      className="group flex flex-col bg-[#1A1A1A] border border-[#2A2A2A] hover:border-[#FFD041] transition-all duration-300"
    >
      <div className="relative aspect-square overflow-hidden bg-[#0D0D0D]">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, 25vw"
        />
      </div>
      <div className="p-4">
        <p className="mb-1 text-xs font-bold tracking-widest text-[#FFD041] uppercase">
          {product.edition}
        </p>
        <h3 className="mb-2 text-lg font-serif font-semibold text-white truncate">
          {product.name}
        </h3>
        <p className="mb-3 text-sm text-gray-400">
          {product.tagline}
        </p>
        <p className="text-sm font-bold text-[#FFD041]">
          ${parseInt(product.price).toLocaleString()} {product.currency}
        </p>
      </div>
    </Link>
  );
}