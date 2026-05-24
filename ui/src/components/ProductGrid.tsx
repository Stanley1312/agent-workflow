import ProductCard from './ProductCard';
import { products } from '@/data/products';

export default function ProductGrid() {
  return (
    <section id="products" className="px-8 py-16 bg-[#0D0D0D]">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="mb-2 text-xs font-bold tracking-widest text-[#FFD041] uppercase">
              Our Collection
            </p>
            <h2 className="text-3xl font-serif font-semibold text-white">
              Signature Series
            </h2>
          </div>
          <p className="max-w-md text-sm text-gray-400 text-right">
            Each timepiece is a testament to generations of horological expertise, combining traditional craftsmanship with modern innovation.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="mt-12 text-center">
          <span className="inline-flex items-center gap-2 px-8 py-4 text-sm font-bold tracking-widest text-[#FFD041] uppercase border border-[#FFD041] hover:bg-[#FFD041] hover:text-black transition-colors cursor-pointer">
            View All Timepieces
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14"></path>
              <path d="m12 5 7 7-7 7"></path>
            </svg>
          </span>
        </div>
      </div>
    </section>
  );
}