"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Channel } from "../../../channels.config";

interface Props {
  channels: Channel[];
  selected: string;
  onChange: (channelId: string) => void;
}

export default function ChannelFilter({ channels, selected, onChange }: Props) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange("")}
        className={
          "px-4 py-1.5 rounded-full text-sm font-medium transition " +
          (selected === ""
            ? "bg-primary text-white"
            : "bg-muted dark:bg-card dark:text-gray-300 text-foreground hover:brightness-90 dark:hover:text-white")
        }
      >
        {t("video.all_videos")}
      </button>

      {channels.map((channel) => (
        <button
          key={channel.id}
          onClick={() => onChange(channel.id)}
          className={
            "px-4 py-1.5 rounded-full text-sm font-medium transition " +
            (selected === channel.id
              ? "bg-primary text-white"
              : "bg-muted dark:bg-card dark:text-gray-300 text-foreground hover:brightness-90 dark:hover:text-white")
          }
        >
          {channel.name}
        </button>
      ))}
    </div>
  );
}
