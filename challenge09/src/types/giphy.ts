export interface GifImage {
  url: string;
  width: string;
  height: string;
}

export interface Gif {
  id: string;
  title: string;
  url: string; // enlace a la página del GIF en giphy.com
  images: {
    fixed_width: GifImage; // 200 px de ancho, ideal para la cuadrícula
    original: GifImage;
  };
}

export interface GiphySearchResponse {
  data: Gif[];
  pagination: {
    total_count: number;
    count: number;
    offset: number;
  };
  meta: {
    status: number;
    msg: string;
  };
}
