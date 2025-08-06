import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import type { GiphyResponse } from '../interfaces/giphy.interfaces';
import { GifMapper } from '../mapper/gif.mapper';
import { Gif } from '../interfaces/gif.interface';
import { map, Observable, tap } from 'rxjs';

const GIF_KEY = 'gifs'; //Clave para almacenar los gifs en el localStorage

const loadFromLocalStorage = () => {
  const gifsFromLocalStorage = localStorage.getItem(GIF_KEY) ?? '[]'; //Obtenemos los gifs del localStorage, si no existen, devolvemos un array vacio
  const gifs = JSON.parse(gifsFromLocalStorage);
  console.log(gifs); //Mostramos los gifs obtenidos del localStorage en la consola
  return gifs;
}

@Injectable({
  providedIn: 'root'
}) //Los servicios en Angular cuando son proveidos en el root, se convierten en singleton, es decir, solo se crea una instancia de este servicio durante toda la vida de la aplicacion.
export class GifService { //Este servicio va a ser injectado en el componente trending-page

  private http = inject(HttpClient); //Injectamos y utilizamos el cliente HTTP de Angular

  trendingGifs = signal<Gif[]>([]); //Creamos una señal para almacenar los gifs que vamos a obtener de la API de Giphy
  trendingGifsLoading = signal(true); //Creamos una señal para indicar si los gifs se estan cargando

  searchHistory = signal<Record<string, Gif[]>>(loadFromLocalStorage()); //Creamos una señal para almacenar el historial de busqueda de gifs
  searchHistoryKeys = computed(() => Object.keys(this.searchHistory())); //Creamos una señal computada para obtener las claves del historial de busqueda

  constructor() {
    this.loadTrendingGifs();
  }

  saveGifsToLocalStorage = effect(() => {
    const historyString = JSON.stringify(this.searchHistory());
    localStorage.setItem(GIF_KEY, historyString); //Guardamos el historial de busqueda en el localStorage
  });

  loadTrendingGifs() { //Este metodo se encarga de cargar los gifs mas populares de la API de Giphy
    // this.trendingGifsLoading.set(true); //Indicamos que los gifs estan cargando
    this.http.get<GiphyResponse>(`${environment.giphyUrl}/gifs/trending`, {
      params: {
        api_key: environment.giphyApiKey,
        limit: 20,
      }, //Para que la peticion HTTP funcione, nos debemos susbcribir a la respuesta
    }).subscribe((response) => {
      // response.data[0].images.original.url; Accedemos a la URL del gif original. Pero en vez de esto vamos a crear un mapper.

      const gifs = GifMapper.mapGiphyItemsToGifsArray(response.data); //Utilizamos el mapper para transformar los datos de la API a un formato propio de Gif
      this.trendingGifs.set(gifs); //Actualizamos la señal con los gifs obtenidos
      this.trendingGifsLoading.set(false); //Indicamos que los gifs ya no estan cargando
      console.log({ gifs }); // Mostramos los gifs en la consola para verificar que se han obtenido correctamente

    });
  }

  searchGifs(query: string): Observable<Gif[]> {
    return this.http.get<GiphyResponse>(`${environment.giphyUrl}/gifs/search`, {
      params: {
        api_key: environment.giphyApiKey,
        q: query,
        limit: 20,
      },
    }).pipe(
      map(({ data }) => data),
      map((items) => GifMapper.mapGiphyItemsToGifsArray(items)), // Utilizamos el mapper para transformar los datos de la API a nuestro modelo Gif

      //Historial de busqueda

        // Tap es el manejador de eventos secundarios de RxJS. No necesita regresar nada.
        //Aqui vamos a tener el estado de los gifs que se han buscado
      tap( items => {
        this.searchHistory.update( history => ({ //
          ...history, //spread operator para mantener el historial existente tal cual estaba originalmente
          [query.toLowerCase()]: items, // propiedad computada que se llama query, que es el texto de busqueda, y le asignamos los items obtenidos de la busqueda
          // Actualizamos el historial de busqueda con los gifs obtenidos
        }))
      })
      //Se usa update porque queremos actualizar el valor de una señal existente
    );
  }

  getHistoryGifs(query: string): Gif[] {
    return this.searchHistory()[query] ?? []; //Obtenemos los gifs del historial de busqueda, si no existen, devolvemos un array vacio
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
