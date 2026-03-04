import { NextRequest, NextResponse } from "next/server";
import { CHANNELS } from "../../../../channels.config";
import { fetchChannelVideos } from "../../../lib/api/youtube";

const PER_PAGE = 12;
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const channelId = searchParams.get("channelId") ?? "";
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));

  const channelsToFetch = channelId
    ? CHANNELS.filter((c) => c.id === channelId)
    : CHANNELS;

  if (channelsToFetch.length === 0) {
    return NextResponse.json({ videos: [], total: 0, page, perPage: PER_PAGE });
  }

  const results = await Promise.all(
    channelsToFetch.map((c) => fetchChannelVideos(c.id, c.name, 20)),
  );

  const allVideos = results
    .flat()
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );

  const total = allVideos.length;
  const start = (page - 1) * PER_PAGE;
  const videos = allVideos.slice(start, start + PER_PAGE);

  return NextResponse.json({ videos, total, page, perPage: PER_PAGE });
}
