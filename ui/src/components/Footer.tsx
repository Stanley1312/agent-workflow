export default function Footer() {
  return (
    <footer className="px-8 py-12 bg-[#0D0D0D] border-t border-[#1A1A1A]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="mb-4 text-lg font-serif font-semibold text-[#FFD041]">Luxury Watches</h4>
            <p className="text-sm text-gray-400 leading-relaxed">
              Crafting exceptional timepieces since 1892. Each watch is a testament to our commitment to excellence.
            </p>
          </div>
          <div>
            <h5 className="mb-4 text-xs font-bold tracking-widest text-white uppercase">Collections</h5>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><span className="hover:text-[#FFD041] cursor-pointer">Signature Series</span></li>
              <li><span className="hover:text-[#FFD041] cursor-pointer">Heritage Collection</span></li>
              <li><span className="hover:text-[#FFD041] cursor-pointer">Limited Editions</span></li>
            </ul>
          </div>
          <div>
            <h5 className="mb-4 text-xs font-bold tracking-widest text-white uppercase">Service</h5>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><span className="hover:text-[#FFD041] cursor-pointer">Care & Maintenance</span></li>
              <li><span className="hover:text-[#FFD041] cursor-pointer">Authentication</span></li>
              <li><span className="hover:text-[#FFD041] cursor-pointer">Global Service Centers</span></li>
            </ul>
          </div>
          <div>
            <h5 className="mb-4 text-xs font-bold tracking-widest text-white uppercase">Contact</h5>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><span className="hover:text-[#FFD041] cursor-pointer">Concierge</span></li>
              <li><span className="hover:text-[#FFD041] cursor-pointer">Boutiques</span></li>
              <li><span className="hover:text-[#FFD041] cursor-pointer">Press Inquiries</span></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-[#1A1A1A] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            &copy; 2026 Luxury Watches. All rights reserved.
          </p>
          <div className="flex gap-4">
            <span className="text-xs text-gray-500 hover:text-[#FFD041] cursor-pointer">Privacy</span>
            <span className="text-xs text-gray-500 hover:text-[#FFD041] cursor-pointer">Terms</span>
            <span className="text-xs text-gray-500 hover:text-[#FFD041] cursor-pointer">Cookies</span>
          </div>
        </div>
      </div>
    </footer>
  );
}