import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import ProductGrid from '@/components/ProductGrid';
import ValueProposition from '@/components/ValueProposition';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Navigation />
      <main className="pt-16">
        <Hero />
        <ProductGrid />
        <ValueProposition />
      </main>
      <Footer />
    </>
  );
}