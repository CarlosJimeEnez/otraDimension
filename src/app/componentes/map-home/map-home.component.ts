import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { Eventos } from '../../interfaces/Eventos';
import { EventosDetallesComponent } from '../eventos-detalles/eventos-detalles.component';
import { FooterComponent } from '../footer/footer.component';
import { NuevoEventoComponent } from '../nuevo-evento/nuevo-evento.component';

@Component({
  selector: 'app-map-home',
  standalone: true,
  imports: [EventosDetallesComponent, FooterComponent, NuevoEventoComponent],
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
        // border-top-color: #3498db;
      }

      ::ng-deep .mapboxgl-popup-close-button {
        background-color: red;
        border-color: var(--text);
        color: var(--text);
        border-radius: 50%;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      }
    `,
  ],
})
export class MapHomeComponent implements OnInit, AfterViewInit {
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;
  map: mapboxgl.Map | undefined;
  center: [number, number] = [-98.18318658713179, 19.047718948679815];
  popup: mapboxgl.Popup | undefined;
  eventoSeleccionado: Eventos | undefined;
  mostrarDashboard: boolean = false;
  activePopup: mapboxgl.Popup | null = null;

  eventos: Eventos[] = [
    {
      id: 1,
      nombre: 'Evento 1',
      coordenadas: [-98.1831865, 19.04771894],
      descripcion: 'Descripcion 1',
    },
    {
      id: 2,
      nombre: 'Evento 2',
      coordenadas: [-98.183, 19.04],
      descripcion: 'Descripcion 2',
    },
  ];

  constructor() {}

  ngOnInit() {}
  ngAfterViewInit(): void {
    this.cargarMapa();
    this.cargarEventos();
  }

  cargarMapa(): void {
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
    // Añadir controles de navegación
    this.map!.addControl(new mapboxgl.NavigationControl());
  }

  cargarEventos(): void {
    this.eventos.forEach((evento) => {
      const el = document.createElement('div');
      el.className = 'marker';
      el.style.backgroundImage = 'url(animaciones/inimaFrame1.png)';
      el.style.width = '50px';
      el.style.height = '50px';
      el.style.backgroundSize = '100%';

      const marker = new mapboxgl.Marker(el)
        .setLngLat(evento.coordenadas)
        .addTo(this.map!);

      const marker1 = new mapboxgl.Marker({ color: 'var(--primary)' })
        .setLngLat(evento.coordenadas)
        .addTo(this.map!);

      const popup = new mapboxgl.Popup({
        closeButton: true,
        closeOnClick: false,
      }).setHTML(
        `<div class="flex items-center justify-center">
          <p class="font-extrabold select-none  p-3">${evento.nombre}</p>
          <button id="visitButton-${evento.id}" type="button" class="mt-1 text-text bg-gradient-to-br from-primaryv3 to-accentv2 hover:bg-gradient-to-bl focus:outline-none font-semibold rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Visitar... </button>
          </div>`
      );

      marker1.setPopup(popup);
      marker1.getElement().addEventListener('click', () => {
        this.map!.flyTo({
          center: evento.coordenadas,
          zoom: 14,
          speed: 0.5,
        });
        
        // Togglear el popup
        if (popup.isOpen()) {
          popup.remove();
        } else {
          popup.addTo(this.map!);
        }
        
        this.activePopup = popup;
      });

      marker1.getElement().addEventListener('mouseenter', () => {
        if (this.activePopup && this.activePopup !== popup) {
          this.activePopup.remove();
        }
        if (!popup.isOpen()) {
          popup.addTo(this.map!);
        }
        this.activePopup = popup;
      });

      marker1.getElement().addEventListener('mouseleave', () => {
        if (this.activePopup === popup && !popup.isOpen()) {
          popup.remove();
        }
      });

      popup.on('open', () => {
        const visitButton = document.getElementById(`visitButton-${evento.id}`);
        if (visitButton) {
          visitButton.addEventListener('click', () =>
            this.mostrarEvento(evento)
          );
        }
      });
    });
  }

  mostrarEvento(evento: Eventos): any {
    this.eventoSeleccionado = evento;
  }

  cerrarEvento(): any {
    this.eventoSeleccionado = undefined;
  }

  mostrarCreateDashboard(): void {
    this.mostrarDashboard = true;
  }
}
