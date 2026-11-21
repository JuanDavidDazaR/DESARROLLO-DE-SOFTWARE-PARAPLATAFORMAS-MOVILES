import type { Gif } from "../types/giphy";
import "./GifGrid.css";

interface Props {
  gifs: Gif[];
}

const GifGrid = ({ gifs }: Props) => (
  <div className="gif-grid">
    {gifs.map((gif) => {
      const img = gif.images.fixed_width;
      return (
        <a
          key={gif.id}
          className="gif-card"
          href={gif.url}
          target="_blank"
          rel="noreferrer"
          title={gif.title}
        >
          <img
            src={img.url}
            width={img.width}
            height={img.height}
            alt={gif.title || "GIF"}
            loading="lazy"
          />
        </a>
      );
    })}
  </div>
);

export default GifGrid;
