import Link from 'next/link';

export default function Navigation() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 bg-[#0D0D0D] border-b border-[#1A1A1A]">
      <Link href="/" className="text-2xl font-serif text-white hover:text-[#FFD041] transition-colors">
        luxury Watches
      </Link>
      <div className="flex items-center gap-8">
        <Link href="/" className="text-xs font-bold tracking-widest text-white uppercase hover:text-[#FFD041] transition-colors">
          Collections
        </Link>
        <span className="text-xs font-bold tracking-widest text-white uppercase opacity-50 cursor-not-allowed">
          Heritage
        </span>
        <span className="text-xs font-bold tracking-widest text-white uppercase opacity-50 cursor-not-allowed">
          Boutiques
        </span>
      </div>
      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Search collection..."
          className="px-3 py-1.5 text-sm text-white placeholder-gray-500 bg-transparent border border-[#1A1A1A] rounded focus:outline-none focus:border-[#FFD041] transition-colors"
        />
        <button className="p-2 text-white hover:text-[#FFD041] transition-colors" aria-label="Shopping bag">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
        </button>
        <button className="p-2 text-white hover:text-[#FFD041] transition-colors" aria-label="Wishlist">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>
        <button className="p-2 text-white hover:text-[#FFD041] transition-colors" aria-label="Account">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </button>
      </div>
    </nav>
  );
}