import { Suspense } from "react";
import { getScreenerData } from "@/lib/api/brapi";
import { ScreenerTable } from "@/components/screener/ScreenerTable";
import { ScreenerFilters } from "@/components/screener/ScreenerFilters";
import { Skeleton } from "@/components/ui/skeleton";
import type { Quote, AssetType, SortField } from "@/types";

interface PageProps {
  searchParams: {
    type?: string;
    search?: string;
    sort?: string;
  };
}

function filterAndSort(
  data: Quote[],
  { type, search, sort }: PageProps["searchParams"],
): Quote[] {
  let result = [...data];

  // Filter by type
  if (type && type !== "all") {
    result = result.filter((q) => q.type === (type as AssetType));
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

async function ScreenerContent({ searchParams }: PageProps) {
  const data = await getScreenerData();
  const filtered = filterAndSort(data, searchParams);

  return <ScreenerTable data={filtered} />;
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

export default function ScreenerPage({ searchParams }: PageProps) {
  const total =
    searchParams.type === "fii"
      ? "20 FIIs"
      : searchParams.type === "acao"
        ? "32 Ações"
        : "52 ativos";

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Screener B3</h1>
        <p className="text-sm text-muted-foreground">
          {total} · Dados atualizados a cada 10 minutos via brapi.dev
        </p>
      </div>

      {/* Filters — client component */}
      <div className="mb-5">
        <ScreenerFilters />
      </div>

      {/* Table — streamed */}
      <Suspense fallback={<ScreenerSkeleton />}>
        <ScreenerContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

export const revalidate = 600; // ISR: regenerate every 10 min
