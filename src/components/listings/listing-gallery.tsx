import type { ListingImageSource } from '../../lib/assets';

type ListingGalleryProps = {
  title: string;
  images: ListingImageSource[];
  selectedIndex: number;
  onSelectIndex?: (index: number) => void;
};

export function ListingGallery({ title, images, selectedIndex, onSelectIndex }: ListingGalleryProps) {
  const selectedImage = images[selectedIndex] ?? images[0];

  return (
    <section aria-label="Listing gallery" className="space-y-4">
      <div className="overflow-hidden rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] shadow-[0_22px_70px_rgba(37,24,74,0.08)]">
        <div className="aspect-[4/3] bg-[color:var(--surface-alt)]">
          {selectedImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={selectedImage.src} alt={selectedImage.alt || title} className="h-full w-full object-cover" />
          ) : null}
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        {images.map((image, index) => (
          <button
            key={`${image.src}-${index}`}
            type="button"
            onClick={() => onSelectIndex?.(index)}
            aria-label={`View image ${index + 1} for ${title}`}
            className={[
              'h-20 w-20 overflow-hidden rounded-2xl border bg-white transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-light)] focus-visible:ring-offset-2',
              index === selectedIndex ? 'border-[color:var(--accent)] shadow-[0_10px_24px_rgba(111,60,195,0.18)]' : 'border-[color:var(--border)]',
            ].join(' ')}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image.src} alt={image.alt || title} className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </section>
  );
}
