import { Suspense } from "react";
import { getScreenerDataFiis } from "@/lib/api/brapi";
import { ScreenerTable } from "@/components/screener/ScreenerTable";
import { ScreenerFilters } from "@/components/screener/ScreenerFilters";
import { ScreenerHeader } from "@/components/screener/ScreenerHeader";
import { Skeleton } from "@/components/ui/skeleton";
import type { Quote, AssetType, SortField } from "@/types";

interface PageProps {
  searchParams: {
    type?: string;
    search?: string;
    sort?: string;
    sector?: string;
  };
}

function filterAndSort(
  data: Quote[],
  { type, search, sort, sector }: PageProps["searchParams"],
): Quote[] {
  let result = [...data];

  // Filter by type
  if (type && type !== "all") {
    result = result.filter((q) => q.type === (type as AssetType));
  }

  // Filter by sector
  if (sector && sector !== "all") {
    result = result.filter((q) => q.sector === sector);
  }

  // Search
  if (search) {
    const q = search.toLowerCase();
    result = result.filter(
      (a) =>
        a.ticker.toLowerCase().includes(q) || a.name.toLowerCase().includes(q),
    );
  }

  // Sort
  const field = (sort as SortField) ?? "marketCap";
  result.sort((a, b) => {
    const av = (a[field] as number) ?? -Infinity;
    const bv = (b[field] as number) ?? -Infinity;
    return bv - av; // desc
  });

  return result;
}

async function ScreenerContent({
  isReit,
  data,
}: {
  isReit?: boolean;
  data: Quote[];
}) {
  return <ScreenerTable isReit={isReit} data={data} />;
}

function ScreenerSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 12 }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full rounded-lg" />
      ))}
    </div>
  );
}

export default async function FiisPage({ searchParams }: PageProps) {
  const data = await getScreenerDataFiis();

  // Calculate filtered data (force type = "fii")
  const filtered = filterAndSort(data, { ...searchParams, type: "fii" });
  const total = filtered.length;

  return (
    <div>
      {/* Header */}
      <ScreenerHeader isReit={true} total={total} />

      {/* Filters — client component */}
      <div className="mb-5">
        <ScreenerFilters isReit={true} />
      </div>

      {/* Table — streamed */}
      <Suspense fallback={<ScreenerSkeleton />}>
        <ScreenerContent isReit={true} data={filtered} />
      </Suspense>
    </div>
  );
}

export const revalidate = 600; // ISR: regenerate every 10 min
