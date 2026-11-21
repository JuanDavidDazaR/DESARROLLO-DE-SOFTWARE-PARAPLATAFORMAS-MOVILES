import { giphyApi } from "./api";
import type { GiphySearchResponse } from "../types/giphy";

interface SearchOptions {
  limit?: number;
  offset?: number;
  signal?: AbortSignal;
}

export const searchGifs = async (
  q: string,
  { limit = 25, offset = 0, signal }: SearchOptions = {},
): Promise<GiphySearchResponse> => {
  const { data } = await giphyApi.get<GiphySearchResponse>("/gifs/search", {
    params: { q, limit, offset, rating: "g", lang: "es" },
    signal,
  });
  return data;
};
