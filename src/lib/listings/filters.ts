export type ListingSortOption = "relevance" | "newest" | "price-asc" | "price-desc" | "distance-asc";

export type ListingFilters = {
  search: string;
  category: string;
  minPrice: string;
  maxPrice: string;
  maxDistance: string;
  condition: string;
  sort: ListingSortOption;
};

export type ListingFilterState = {
  search: string;
  category: string | null;
  minPrice: number | null;
  maxPrice: number | null;
  maxDistanceMiles: number | null;
  condition: string | null;
  sort: ListingSortOption;
};

const DEFAULT_SORT_OPTION: ListingSortOption = "relevance";

export function createDefaultListingFilters(): ListingFilters {
  return {
    search: "",
    category: "",
    minPrice: "",
    maxPrice: "",
    maxDistance: "",
    condition: "",
    sort: DEFAULT_SORT_OPTION,
  };
}

export function createListingFilterState(filters: Partial<ListingFilters>): ListingFilterState {
  return {
    search: normalizeText(filters.search),
    category: normalizeOptionalText(filters.category),
    minPrice: parseOptionalInteger(filters.minPrice),
    maxPrice: parseOptionalInteger(filters.maxPrice),
    maxDistanceMiles: parseOptionalInteger(filters.maxDistance),
    condition: normalizeOptionalText(filters.condition),
    sort: normalizeSortOption(filters.sort),
  };
}

export function isListingFilterEmpty(filters: ListingFilters): boolean {
  return filters.search.trim() === ""
    && filters.category.trim() === ""
    && filters.minPrice.trim() === ""
    && filters.maxPrice.trim() === ""
    && filters.maxDistance.trim() === ""
    && filters.condition.trim() === ""
    && filters.sort === DEFAULT_SORT_OPTION;
}

export function resetListingFilters(): ListingFilters {
  return createDefaultListingFilters();
}

export function clearBrowseFilters(filters: Partial<ListingFilters>): Partial<ListingFilters> {
  return isListingFilterEmpty({
    ...createDefaultListingFilters(),
    ...filters,
  })
    ? {}
    : createDefaultListingFilters();
}

export function applyBrowseFilters<T extends { title: string; description: string; category: string; condition: string; priceCents: number; distanceMiles?: number | null; createdAt: Date }>(
  listings: T[],
  filters: Partial<ListingFilters>,
): T[] {
  const state = createListingFilterState({ ...createDefaultListingFilters(), ...filters });
  return listings
    .filter((listing) => {
      const searchableText = `${listing.title} ${listing.description} ${listing.category}`.toLowerCase();
      return state.search === "" || searchableText.includes(state.search.toLowerCase());
    })
    .filter((listing) => state.category === null || listing.category.toLowerCase() === state.category.toLowerCase())
    .filter((listing) => state.condition === null || listing.condition.toLowerCase() === state.condition.toLowerCase())
    .sort((firstListing, secondListing) => firstListing.title.localeCompare(secondListing.title));
}

function normalizeText(value: string | null | undefined): string {
  return value?.trim() ?? "";
}

function normalizeOptionalText(value: string | undefined): string | null {
  const normalized = normalizeText(value);
  return normalized === "" ? null : normalized;
}

function parseOptionalInteger(value: string | undefined): number | null {
  const normalized = normalizeText(value);
  if (normalized === "") {
    return null;
  }

  const parsedValue = Number.parseInt(normalized, 10);
  return Number.isNaN(parsedValue) ? null : parsedValue;
}

function normalizeSortOption(value: ListingSortOption | undefined): ListingSortOption {
  const allowedSortOptions: ListingSortOption[] = ["relevance", "newest", "price-asc", "price-desc", "distance-asc"];
  return allowedSortOptions.includes(value ?? DEFAULT_SORT_OPTION) ? (value ?? DEFAULT_SORT_OPTION) : DEFAULT_SORT_OPTION;
}
