/* eslint-disable @typescript-eslint/no-explicit-any */
import { Video } from "../../types/youtube";

const API_KEY = process.env.YOUTUBE_API_KEY!;
const BASE = "https://www.googleapis.com/youtube/v3";

async function getUploadsPlaylistId(channelId: string): Promise<string | null> {
  const url = `${BASE}/channels?part=contentDetails&id=${channelId}&key=${API_KEY}`;
  const res = await fetch(url, { next: { revalidate: 3600 } });
  const data = await res.json();
  return data.items?.[0]?.contentDetails?.relatedPlaylists?.uploads ?? null;
}

async function getPlaylistItems(
  playlistId: string,
  maxResults: number,
): Promise<any[]> {
  const url = `${BASE}/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=${maxResults}&key=${API_KEY}`;
  const res = await fetch(url, { next: { revalidate: 1800 } });
  const data = await res.json();
  return data.items ?? [];
}

async function getVideoDetails(videoIds: string[]): Promise<any[]> {
  const url = `${BASE}/videos?part=contentDetails,snippet&id=${videoIds.join(",")}&key=${API_KEY}`;
  const res = await fetch(url, { next: { revalidate: 1800 } });
  const data = await res.json();
  return data.items ?? [];
}

function parseDuration(iso: string): { formatted: string; seconds: number } {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  const h = parseInt(match?.[1] ?? "0");
  const m = parseInt(match?.[2] ?? "0");
  const s = parseInt(match?.[3] ?? "0");
  const seconds = h * 3600 + m * 60 + s;
  const parts: string[] = [];
  if (h > 0) parts.push(String(h));
  parts.push(String(m).padStart(h > 0 ? 2 : 1, "0"));
  parts.push(String(s).padStart(2, "0"));
  return { formatted: parts.join(":"), seconds };
}

export async function fetchChannelVideos(
  channelId: string,
  channelName: string,
  maxResults = 30,
): Promise<Video[]> {
  try {
    const playlistId = await getUploadsPlaylistId(channelId);
    if (!playlistId) return [];

    const items = await getPlaylistItems(playlistId, maxResults);
    const videoIds = items
      .map((item: any) => item.snippet?.resourceId?.videoId)
      .filter(Boolean) as string[];

    if (videoIds.length === 0) return [];

    const details = await getVideoDetails(videoIds);

    return details.map((item: any): Video => {
      const { formatted, seconds } = parseDuration(
        item.contentDetails?.duration ?? "PT0S",
      );
      const th = item.snippet?.thumbnails;
      const thumbnail =
        th?.maxres?.url ??
        th?.high?.url ??
        th?.medium?.url ??
        th?.default?.url ??
        "";

      return {
        id: item.id,
        title: item.snippet?.title ?? "",
        description: item.snippet?.description ?? "",
        thumbnail,
        channelId,
        channelName,
        publishedAt: item.snippet?.publishedAt ?? "",
        duration: formatted,
        durationSeconds: seconds,
      };
    });
  } catch (error) {
    console.error(`Erro ao buscar canal ${channelName}:`, error);
    return [];
  }
}
