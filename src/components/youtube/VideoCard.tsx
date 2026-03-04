"use client";

import { Video } from "../../types/youtube";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Star, CheckCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { useLanguage } from "@/context/LanguageContext";

interface Props {
  video: Video;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function VideoCard({ video }: Props) {
  const { t } = useLanguage();

  const [isImportant, setIsImportant] = useState(false);
  const [isWatched, setIsWatched] = useState(false);

  // Carregar dados do localStorage ao montar
  useEffect(() => {
    const importantKey = `video_important_${video.id}`;
    const watchedKey = `video_watched_${video.id}`;

    if (typeof window !== "undefined") {
      setIsImportant(localStorage.getItem(importantKey) === "true");
      setIsWatched(localStorage.getItem(watchedKey) === "true");
    }
  }, [video.id]);

  // Salvar/remover do localStorage
  const toggleImportant = (e: React.MouseEvent) => {
    e.preventDefault();
    const importantKey = `video_important_${video.id}`;
    const newValue = !isImportant;
    setIsImportant(newValue);
    if (typeof window !== "undefined") {
      if (newValue) {
        localStorage.setItem(importantKey, "true");
      } else {
        localStorage.removeItem(importantKey);
      }
    }
  };

  const toggleWatched = (e: React.MouseEvent) => {
    e.preventDefault();
    const watchedKey = `video_watched_${video.id}`;
    const newValue = !isWatched;
    setIsWatched(newValue);
    if (typeof window !== "undefined") {
      if (newValue) {
        localStorage.setItem(watchedKey, "true");
      } else {
        localStorage.removeItem(watchedKey);
      }
    }
  };

  const youtubeUrl = `https://www.youtube.com/watch?v=${video.id}`;

  return (
    <article className="bg-card rounded-xl overflow-hidden flex flex-col group hover:ring-1 hover:ring-primary transition-all duration-200 border border-border dark:border-none">
      <a
        href={youtubeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative block"
      >
        <div className="aspect-video bg-black overflow-hidden">
          <Image
            src={video.thumbnail}
            alt={video.title}
            width={320}
            height={180}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            priority
          />
        </div>
        <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs font-mono px-1.5 py-0.5 rounded">
          {video.duration}
        </span>
      </a>

      <div className="flex-1">
        <div className="p-4 flex flex-col">
          <span className="text-xs text-primary font-semibold uppercase tracking-wider mb-1">
            {video.channelName}
          </span>

          <a href={youtubeUrl} target="_blank" rel="noopener noreferrer">
            <h2 className="font-semibold text-sm leading-snug mb-1 line-clamp-2">
              {video.title}
            </h2>
          </a>

          <span className="text-gray-500 text-xs">
            {formatDate(video.publishedAt)}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 py-3 border-t border-border">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Star
                  onClick={toggleImportant}
                  size={16}
                  className={`transition mx-auto cursor-pointer hover:brightness-125 ${
                    isImportant ? "text-secondary" : "text-gray-400"
                  }`}
                />
              </TooltipTrigger>
              <TooltipContent side="top">
                {isImportant
                  ? t("video.remove_important")
                  : t("video.save_important")}
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <CheckCircle
                  onClick={toggleWatched}
                  size={16}
                  className={`transition mx-auto cursor-pointer hover:brightness-125 ${
                    isWatched ? "text-primary" : "text-gray-400"
                  }`}
                />
              </TooltipTrigger>
              <TooltipContent side="top">
                {isWatched
                  ? t("video.mark_as_unwatched")
                  : t("video.mark_as_watched")}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </article>
  );
}
