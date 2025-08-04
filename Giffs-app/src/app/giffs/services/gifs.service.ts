import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { GiphyResponse } from '../interfaces/giphy.interfaces';
import { GifMapper } from '../mapper/gif.mapper';
import { Gif } from '../interfaces/gif.interface';

@Injectable({
  providedIn: 'root'
}) //Los servicios en Angular cuando son proveidos en el root, se convierten en singleton, es decir, solo se crea una instancia de este servicio durante toda la vida de la aplicacion.
export class GifService { //Este servicio va a ser injectado en el componente trending-page

  private http = inject(HttpClient); //Injectamos y utilizamos el cliente HTTP de Angular

  trendingGifs = signal<Gif[]>([]); //Creamos una señal para almacenar los gifs que vamos a obtener de la API de Giphy

  constructor() {
    this.loadTrendingGifs();
  }

  loadTrendingGifs(): void {
    this.http.get<GiphyResponse>(`${environment.giphyUrl}/gifs/trending`, {
      params: {
        api_key: environment.giphyApiKey,
        limit: '20',
      }, // Para que la peticion HTTP funcione, nos debemos susbcribir a la respuesta
    }).subscribe((response) => {
      // response.data[0].images.original.url; Accedemos a la URL del gif original. Pero en vez de esto vamos a crear un mapper.

      const gifs = GifMapper.mapGiphyItemsToGifsArray(response.data); //Utilizamos el mapper para transformar los datos de la API a nuestro modelo Gif
      this.trendingGifs.set(gifs); //Actualizamos la señal con los gifs obtenidos

      console.log({ gifs }); // Mostramos los gifs en la consola para verificar que se han obtenido correctamente

    });
  }
}
// Este servicio se encarga de obtener los gifs de la API de Giphy
// y transformarlos a nuestro modelo Gif utilizando el
// mapper GifMapper.

// Además, utiliza señales para almacenar los gifs obtenidos
// y poder utilizarlos en los componentes que lo requieran.
// Este servicio es inyectable
// y se puede utilizar en cualquier componente.

// La inyección de dependencias en Angular permite que los servicios
// sean reutilizables y compartidos entre diferentes componentes
// sin necesidad de crear múltiples instancias.
