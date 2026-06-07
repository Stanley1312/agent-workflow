export type ListingOwnerControlsProps = {
  listingId: string;
  ownerId: string;
  viewerId: string | null;
  editHref: string;
  deleteActionHref: string;
};

export type OwnerControlItem =
  | {
      type: "link";
      label: string;
      href: string;
    }
  | {
      type: "delete";
      label: string;
      href: string;
      confirmLabel: string;
    };

export function getListingOwnerControls({
  listingId,
  ownerId,
  viewerId,
}: {
  listingId: string;
  ownerId: string;
  viewerId: string | null;
}): OwnerControlItem[] {
  if (viewerId === null || viewerId !== ownerId) {
    return [];
  }

  return [
    {
      type: "link",
      label: "Edit",
      href: `/listings/${listingId}/edit`,
    },
    {
      type: "delete",
      label: "Delete",
      href: `/listings/${listingId}`,
      confirmLabel: "Delete listing",
    },
  ];
}

export function ListingOwnerControls({
  listingId,
  ownerId,
  viewerId,
  editHref,
  deleteActionHref,
}: ListingOwnerControlsProps) {
  const controls = getListingOwnerControls({ listingId, ownerId, viewerId });

  if (controls.length === 0) {
    return null;
  }

  return (
    <div className="rounded-[28px] border border-[#E7E0D5] bg-white p-5 shadow-[0_20px_60px_rgba(37,24,74,0.08)]">
      <div className="flex flex-wrap gap-3">
        <a
          href={editHref}
          className="inline-flex h-11 items-center justify-center rounded-full bg-[#16151D] px-5 text-sm font-semibold text-white transition hover:bg-[#2B2735]"
        >
          Edit
        </a>
        <form action={deleteActionHref} method="post" className="flex flex-wrap gap-3">
          <input type="hidden" name="listingId" value={listingId} />
          <button
            type="submit"
            className="inline-flex h-11 items-center justify-center rounded-full border border-[#D8CFBF] bg-white px-5 text-sm font-semibold text-[#7A1D2E] transition hover:bg-[#FFF5F7]"
          >
            Delete
          </button>
        </form>
      </div>
    </div>
  );
}
