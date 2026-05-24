export default function Hero() {
  return (
    <section className="relative flex items-center min-h-[60vh] px-8 py-24 bg-[#0D0D0D] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-[#0D0D0D] via-[#0D0D0D] to-transparent z-10"></div>
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=1200&q=80)',
          opacity: 0.4,
        }}
      ></div>
      <div className="relative z-20 max-w-2xl">
        <p className="mb-4 text-xs font-bold tracking-widest text-[#FFD041] uppercase">
          Signature Series
        </p>
        <h1 className="mb-6 text-6xl font-serif font-bold leading-tight text-white">
          Crafting Time,<br />
          <span className="text-[#FFD041]">Defining Legacy</span>
        </h1>
        <p className="mb-8 text-lg text-gray-400 leading-relaxed">
          Discover our curated collection of exceptional timepieces, where precision meets artistry in every tick.
        </p>
        <div className="flex gap-4">
          <a
            href="#products"
            className="inline-flex items-center px-8 py-4 text-sm font-bold tracking-widest text-black bg-[#FFD041] uppercase hover:bg-[#E5B800] transition-colors"
          >
            Explore Collection
          </a>
          <span className="inline-flex items-center px-8 py-4 text-sm font-bold tracking-widest text-white uppercase border border-[#FFD041] cursor-not-allowed opacity-50">
            Our Story
          </span>
        </div>
      </div>
    </section>
  );
}