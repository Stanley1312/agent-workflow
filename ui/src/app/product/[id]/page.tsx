import Link from 'next/link';
import Navigation from '@/components/Navigation';
import ProductGallery from '@/components/ProductGallery';
import ProductInfo from '@/components/ProductInfo';
import ValueProposition from '@/components/ValueProposition';
import Footer from '@/components/Footer';
import { getProductById } from '@/data/products';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id);
  const product = getProductById(decodedId);

  if (!product) {
    return (
      <>
        <Navigation />
        <main className="pt-16 flex items-center justify-center min-h-screen bg-[#1a160d]">
          <div className="text-center">
            <h1 className="text-2xl font-serif text-[#e8e3d3] mb-4">Product not found</h1>
            <Link
              href="/"
              className="text-sm font-bold tracking-widest text-[#f2c335] uppercase hover:underline"
            >
              Return to Collection
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navigation />
      <main className="pt-20 bg-[#1a160d] min-h-screen">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <ProductGallery images={product.images} productName={product.name} />
            <ProductInfo product={product} />
          </div>
        </div>
        <ValueProposition />
      </main>
      <Footer />
    </>
  );
}