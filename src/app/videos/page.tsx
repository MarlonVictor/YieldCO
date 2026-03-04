"use client";

import { useState, useEffect, useCallback } from "react";
import { Video, VideosApiResponse } from "../../types/youtube";
import { CHANNELS } from "../../../channels.config";
import VideoCard from "../../components/youtube/VideoCard";
import ChannelFilter from "../../components/youtube/ChannelFilter";
import Pagination from "../../components/youtube/Pagination";
import { Star } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const PER_PAGE = 12;

export default function Home() {
  const { t } = useLanguage();

  const [videos, setVideos] = useState<Video[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [selectedChannel, setSelectedChannel] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showOnlyImportant, setShowOnlyImportant] = useState(false);

  const fetchVideos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: String(page) });
      if (selectedChannel) params.set("channelId", selectedChannel);
      const res = await fetch(`/api/videos?${params.toString()}`);
      if (!res.ok)
        throw new Error(
          "Falha ao buscar vídeos. Verifique sua YOUTUBE_API_KEY.",
        );
      const data: VideosApiResponse = await res.json();
      setVideos(data.videos);
      setTotal(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }, [page, selectedChannel]);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const handleChannelChange = (id: string) => {
    setSelectedChannel(id);
    setPage(1);
  };

  const getFilteredVideos = () => {
    if (!showOnlyImportant) return videos;

    if (typeof window === "undefined") return videos;

    return videos.filter((video) => {
      const importantKey = `video_important_${video.id}`;
      return localStorage.getItem(importantKey) === "true";
    });
  };

  const filteredVideos = getFilteredVideos();
  const displayTotal = showOnlyImportant ? filteredVideos.length : total;
  const totalPages = Math.ceil(displayTotal / PER_PAGE);

  return (
    <main className="">
      <div className="flex flex-col gap-4">
        <ChannelFilter
          channels={CHANNELS}
          selected={selectedChannel}
          onChange={handleChannelChange}
        />

        <button
          onClick={() => setShowOnlyImportant(!showOnlyImportant)}
          className={
            "flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition w-fit " +
            (showOnlyImportant
              ? "bg-secondary text-white"
              : "bg-muted dark:bg-card dark:text-gray-300 text-foreground hover:brightness-90 dark:hover:text-white")
          }
        >
          <Star size={16} />
          {t("video.only_important")}
        </button>
      </div>

      <div className="py-8">
        {error && (
          <div className="bg-red-900/30 border border-red-700 rounded-xl p-4 mb-6 text-red-300 text-sm">
            ⚠️ {error}
          </div>
        )}

        {!loading && !error && (
          <p className="text-gray-500 text-sm mb-6">
            {displayTotal} vídeo{displayTotal !== 1 ? "s" : ""}{" "}
            {t("video.found")}
            {displayTotal !== 1 ? "s" : ""}
          </p>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="bg-card rounded-xl overflow-hidden animate-pulse"
              >
                <div className="aspect-video bg-black" />
                <div className="p-4 space-y-3">
                  <div className="h-3 bg-gray-700 rounded w-1/3" />
                  <div className="h-4 bg-gray-700 rounded w-full" />
                  <div className="h-4 bg-gray-700 rounded w-3/4" />
                  <div className="h-3 bg-gray-700 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredVideos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
            {filteredVideos.length === 0 && !error && (
              <div className="text-center text-gray-500 py-20">
                {showOnlyImportant
                  ? t("video.none_important")
                  : t("video.none")}
              </div>
            )}
            {totalPages > 1 && (
              <Pagination
                page={page}
                totalPages={totalPages}
                onChange={setPage}
              />
            )}
          </>
        )}
      </div>
    </main>
  );
}
