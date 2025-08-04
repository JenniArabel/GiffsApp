import { GiphyItem } from '../interfaces/giphy.interfaces';
import { Gif } from '../interfaces/gif.interface';

export class GifMapper {
  static mapGiphyItemToGif(item: GiphyItem): Gif {
    return {
      id: item.id,
      title: item.title,
      url: item.images.original.url, // Aquí usamos la URL del gif original. Si el dia de mañana queremos cambiar la URL, solo debemos cambiarlo aquí.
    };
  }

  static mapGiphyItemsToGifsArray(items: GiphyItem[]): Gif[] {
    return items.map(this.mapGiphyItemToGif);
  }
}
