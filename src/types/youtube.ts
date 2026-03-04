export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  channelId: string;
  channelName: string;
  publishedAt: string;
  duration: string;
  durationSeconds: number;
}

export interface VideosApiResponse {
  videos: Video[];
  total: number;
  page: number;
  perPage: number;
}
