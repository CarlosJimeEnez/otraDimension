import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-map-home',
  standalone: true,
  imports: [],
  templateUrl: './map-home.component.html',
  styles: [
    `
      ::ng-deep .mapboxgl-popup-content {
        background-color: var(--background);
        color: var(--text);
        border-radius: 10px;
        padding: 15px;
      }
      ::ng-deep .mapboxgl-popup-tip {
        border-top-color: #3498db;
      }
    `,
  ],
})
export class MapHomeComponent implements OnInit, AfterViewInit {
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;
  map: mapboxgl.Map | undefined;
  center: [number, number] = [-98.18318658713179, 19.047718948679815];
  ngOnInit() {}

  ngAfterViewInit(): void {
    this.map = new mapboxgl.Map({
      accessToken:
        'pk.eyJ1IjoiY2FlbG9zZGV2IiwiYSI6ImNtMjVxZzJjbTB1aXMybG9pN2gzZTU2ZHEifQ.iEZQ-BTw9GLmRXyQB8L3mA',
      container: 'map',
      style: 'mapbox://styles/mapbox/dark-v11',
      center: this.center,
      zoom: 11,
      pitch: 25, // Inclinación para efecto 3D
      bearing: -60, // Rotación del mapa
      antialias: true, // Suaviza los bordes de las geometrías
    });

    // Crea un elemento img para el SVG
    const el = document.createElement('img');
    // Establece la ruta al archivo SVG en la carpeta assets
    el.src = 'animaciones/inimaFrame1.png';
    // Establece el tamaño de la imagen (ajusta según sea necesario)
    el.style.width = '50px';
    el.style.height = '50px';

    // Crea un marcador con el elemento SVG personalizado
    new mapboxgl.Marker(el).setLngLat(this.center).addTo(this.map);

    // Añadir controles de navegación
    this.map.addControl(new mapboxgl.NavigationControl());

    //Commented out the creation of a default Marker to avoid redeclaration error.
    const marker1 = new mapboxgl.Marker({ color: 'var(--primary)' })
      .setLngLat(this.center)
      .addTo(this.map);

    // Create a popup, but don't add it to the map yet.
    const popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
    }).setHTML(
      '<div class="flex items-center justify-center">' +
        '<p class="font-extrabold p-3">La fuente de los Muñecos</p>' +
        '<button type="button" class="mt-1 text-text bg-gradient-to-br from-primaryv3 to-accentv2 hover:bg-gradient-to-bl focus:outline-none font-semibold rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Visitar... </button>' +
        '</div>'
    );

    marker1.setPopup(popup).togglePopup();
  }
}
