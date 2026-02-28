"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export function ScreenerFilters() {
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
      router.push(`/screener?${sp.toString()}`);
    },
    [params, router],
  );

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={t("screener.search_placeholder")}
          defaultValue={params.get("search") ?? ""}
          className="pl-9"
          onChange={(e) => push("search", e.target.value)}
        />
      </div>

      {/* Sort */}
      <Select
        defaultValue={params.get("sort") ?? "marketCap"}
        onValueChange={(v) => push("sort", v)}
      >
        <SelectTrigger className="w-full sm:w-48">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="marketCap">
            {t("screener.table.market_cap")}
          </SelectItem>
          <SelectItem value="dividendYield">
            {t("screener.table.dividend_yield")}
          </SelectItem>
          <SelectItem value="pe">{t("screener.table.p_l")}</SelectItem>
          <SelectItem value="pb">{t("screener.table.p_vp")}</SelectItem>
          <SelectItem value="roe">{t("screener.table.roe")}</SelectItem>
          <SelectItem value="change">{t("screener.table.change")}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
