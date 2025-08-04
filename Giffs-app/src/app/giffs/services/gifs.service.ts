import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { GiphyResponse } from '../interfaces/giphy.interfaces';

@Injectable({
  providedIn: 'root'
})
export class GifService {

  private http = inject(HttpClient); //Injectamos y utilizamos el cliente HTTP de Angular

  constructor() {
    this.loadTrendingGifs();
  }

  loadTrendingGifs(): void {
    this.http.get<GiphyResponse>(`${environment.giphyUrl}/gifs/trending`, {
      params: {
        api_key: environment.giphyApiKey,
        limit: '20',
      },
    });
  }
}
