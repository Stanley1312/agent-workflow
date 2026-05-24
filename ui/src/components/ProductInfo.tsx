'use client';

import { useState } from 'react';
import { Product } from '@/data/products';

interface ProductInfoProps {
  product: Product;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const [cartState, setCartState] = useState<'idle' | 'added'>('idle');
  const [inquireState, setInquireState] = useState<'idle' | 'sent'>('idle');

  const handleAddToCart = () => {
    setCartState('added');
    setTimeout(() => setCartState('idle'), 2000);
  };

  const handleInquire = () => {
    setInquireState('sent');
    setTimeout(() => setInquireState('idle'), 2000);
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="mb-2 text-xs font-bold tracking-widest text-[#a38c62] uppercase">
          {product.edition}
        </p>
        <h1
          className="mb-4 text-4xl font-serif font-semibold text-[#e8e3d3]"
          data-testid="product-name"
        >
          {product.name}
        </h1>
        <p className="text-sm text-[#a38c62]">{product.tagline}</p>
      </div>

      <div className="flex items-baseline gap-2">
        <span
          className="text-3xl font-serif font-bold text-[#f2c335]"
          data-testid="product-price"
        >
          ${parseInt(product.price).toLocaleString()}
        </span>
        <span className="text-sm text-[#a38c62]">{product.currency}</span>
      </div>

      <div className="h-px bg-[#362c1c]"></div>

      <p className="text-[#e8e3d3] leading-relaxed">{product.description}</p>

      <div
        className="grid grid-cols-2 gap-4 py-4"
        data-testid="product-specs"
      >
        {product.specs.filter(spec => spec.value).map((spec, index) => (
          <div key={index}>
            <p className="text-xs font-bold tracking-widest text-[#a38c62] uppercase mb-1">
              {spec.label}
            </p>
            <p className="text-sm text-[#e8e3d3]">{spec.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 pt-4">
        {cartState === 'added' ? (
          <button
            disabled
            className="w-full py-4 text-sm font-bold tracking-widest text-black bg-[#f2c335] uppercase cursor-not-allowed opacity-70"
          >
            Added
          </button>
        ) : (
          <button
            onClick={handleAddToCart}
            className="w-full py-4 text-sm font-bold tracking-widest text-black bg-[#f2c335] uppercase hover:bg-[#e1b12c] transition-colors"
          >
            Add to Cart
          </button>
        )}

        {inquireState === 'sent' ? (
          <button
            disabled
            className="w-full py-4 text-sm font-bold tracking-widest text-[#f2c335] uppercase border border-[#f2c335] cursor-not-allowed opacity-70"
          >
            Inquiry Sent
          </button>
        ) : (
          <button
            onClick={handleInquire}
            className="w-full py-4 text-sm font-bold tracking-widest text-[#f2c335] uppercase border border-[#f2c335] hover:bg-[#f2c335] hover:text-black transition-colors"
          >
            Inquire Now
          </button>
        )}
      </div>
    </div>
  );
}