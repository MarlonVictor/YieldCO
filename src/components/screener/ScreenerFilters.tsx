"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Search, Filter, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/context/LanguageContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ScreenerFiltersProps {
  sectors: string[];
}

export function ScreenerFilters({ sectors }: ScreenerFiltersProps) {
  const router = useRouter();
  const params = useSearchParams();
  const { t } = useLanguage();

  const push = useCallback(
    (key: string, value: string) => {
      const sp = new URLSearchParams(params.toString());
      if (value && value !== "all") {
        sp.set(key, value);
      } else {
        sp.delete(key);
      }
      router.push(`/acoes?${sp.toString()}`);
    },
    [params, router],
  );

  return (
    <div className="space-y-3 rounded-lg border border-border bg-card/50 p-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {/* Search */}
        <div className="space-y-2 sm:col-span-1 lg:col-span-2">
          <label className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            <Search className="h-3.5 w-3.5" />
            {t("stocks.label_search")}
          </label>
          <div className="relative">
            <Input
              placeholder={t("stocks.search_placeholder")}
              defaultValue={params.get("search") ?? ""}
              onChange={(e) => push("search", e.target.value)}
              className="bg-background"
            />
          </div>
        </div>

        {/* Sector */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            <Filter className="h-3.5 w-3.5" />
            {t("stocks.label_sector")}
          </label>
          <Select
            value={params.get("sector") ?? "all"}
            onValueChange={(v) => push("sector", v)}
          >
            <SelectTrigger className="rounded-md border border-input bg-background text-sm">
              <SelectValue placeholder={t("stocks.label_sector")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("stocks.all_sectors")}</SelectItem>
              {sectors.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sort */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            <TrendingUp className="h-3.5 w-3.5" />
            {t("stocks.label_sort")}
          </label>
          <Select
            value={params.get("sort") ?? "marketCap"}
            onValueChange={(v) => push("sort", v)}
          >
            <SelectTrigger className="rounded-md border border-input bg-background text-sm">
              <SelectValue placeholder={t("stocks.label_sort")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="marketCap">
                {t("stocks.sort.marketCap")}
              </SelectItem>
              <SelectItem value="price">{t("stocks.sort.price")}</SelectItem>
              <SelectItem value="change">{t("stocks.sort.change")}</SelectItem>
              <SelectItem value="pe">{t("stocks.sort.pe")}</SelectItem>
              <SelectItem value="lastDividend">
                {t("stocks.sort.lastDividend")}
              </SelectItem>
              <SelectItem value="dailyLiquidity">
                {t("stocks.sort.dailyLiquidity")}
              </SelectItem>
              <SelectItem value="priceHigh52">
                {t("stocks.sort.priceHigh52")}
              </SelectItem>
              <SelectItem value="priceLow52">
                {t("stocks.sort.priceLow52")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
