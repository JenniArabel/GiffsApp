import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { GifService } from 'src/app/giffs/services/gifs.service';

interface MenuOption {
  icon: string;
  label: string;
  sublabel: string;
  router: string;
}

@Component({
  selector: 'gifs-side-menu-options',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './gifs-side-menu-options.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GifsSideMenuOptionsComponent {

  gifService = inject(GifService); // Inyectamos el servicio de Gifs para acceder a sus propiedades y métodos

  // Definimos las opciones del menú lateral
  // Cada opción tiene un icono, una etiqueta, una subetiqueta y una

  menuOptions: MenuOption[] = [
    {
      icon: 'fa-solid fa-chart-line',
      label: 'Trending',
      sublabel: 'Gifs populares',
      router: '/dashboard/trending',
    },
    {
      icon: 'search',
      label: 'Buscar',
      sublabel: 'Buscar gifs',
      router: '/dashboard/search',
    },
  ];
}
