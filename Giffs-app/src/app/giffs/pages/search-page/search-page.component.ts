import { Component, inject, signal } from '@angular/core';
import { GifListComponent } from '../../components/gif-list/gif-list.component';
import { GifService } from '../../services/gifs.service';
import { Gif } from '../../interfaces/gif.interface';

@Component({
  selector: 'search-page',
  imports: [GifListComponent],
  templateUrl: './search-page.component.html',
})
export default class SearchPageComponent {
  gifService = inject(GifService); // Inject the GifService to access its methods and properties
  gifs = signal<Gif[]>([]); // Signal to hold the gifs for the search results

  onSearch(query: string): void {
    this.gifService.searchGifs(query).subscribe((response) => {
      this.gifs.set(response); // Update the signal with the search results
    });
  }

}
