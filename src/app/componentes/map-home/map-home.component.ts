import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
  OnDestroy,
} from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { EventosDetallesComponent } from '../eventos-detalles/eventos-detalles.component';
import { FooterComponent } from '../footer/footer.component';
import { NuevoEventoComponent } from '../nuevo-evento/nuevo-evento.component';
import { MapboxService } from '../../services/mapbox.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Item } from '../../interfaces/ImagePost';
import { FirebaseService } from '../../services/firebase-service.service';

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
export class MapHomeComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;
  map: mapboxgl.Map | null = null;
  center: [number, number] = [-98.18318658713179, 19.047718948679815];
  popup: mapboxgl.Popup | undefined;
  eventoSeleccionado: Item | undefined;
  mostrarDashboard: boolean = false;
  activePopup: mapboxgl.Popup | null = null;
  creandoImagen: boolean = false;  

  items: Item[] = [];

  constructor(
    private _firebaseService: FirebaseService,
    private _mapboxService: MapboxService,
    private _route: Router,
    private _router: ActivatedRoute,
  ) {

    this.creandoImagen = this._router.snapshot.queryParams['creandoImagen']; 
  }

  ngOnDestroy(): void {
    this._mapboxService.destroyMap();
  }

  ngOnInit() {
    this._firebaseService.getItems().subscribe({
      next: (items) => {
        this.items = items;
        this.cargarEventos();
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  ngAfterViewInit(): void {
    this.map = this._mapboxService.getMap();
    if (!this.map) {
      this.map = this._mapboxService.initializeMap('map', {
        center: this.center, // Personaliza las opciones según necesites
      });
    } else {
      console.log('Mapa encontrado');
      const mapContainerElement = this.mapContainer.nativeElement;
      const mapContainer = this.map?.getContainer();
      if (mapContainer) {
        mapContainer.style.height = '100vh';
        mapContainerElement.appendChild(mapContainer);
      }
      this.map.resize();
      this.reiniciarMap(this.map);
      this.map?.setZoom(14);
    }
  }

  cargarEventos(): void {
    this.items.forEach((evento) => {
      const el = document.createElement('div');
      const Lng = evento.Center?.longitude;
      const Lat = evento.Center?.latitude;
      const center: [number, number] = [Lng!, Lat!];
      console.log(center);

      el.className = 'marker';
      el.style.backgroundImage = 'url(animaciones/inimaFrame1.png)';
      el.style.width = '50px';
      el.style.height = '50px';
      el.style.backgroundSize = '100%';

      const marker = new mapboxgl.Marker(el).setLngLat(center).addTo(this.map!);

      const marker1 = new mapboxgl.Marker({ color: 'var(--primary)' })
        .setLngLat(center)
        .addTo(this.map!);

      const popup = new mapboxgl.Popup({
        closeButton: true,
        closeOnClick: false,
      }).setHTML(
        `<div class="flex items-center justify-center">
          <p class="font-extrabold select-none  p-3">${evento.Nombre}</p>
          <button id="visitButton-${evento.id}" type="button" class="mt-1 text-text bg-gradient-to-br from-primaryv3 to-accentv2 hover:bg-gradient-to-bl focus:outline-none font-semibold rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Visitar... </button>
          </div>`
      );

      marker1.setPopup(popup);
      marker1.getElement().addEventListener('click', () => {
        this.map!.flyTo({
          center: center,
          zoom: 17,
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

  mostrarEvento(evento: Item): any {
    this.eventoSeleccionado = evento;
  }

  cerrarEvento(): any {
    this.eventoSeleccionado = undefined;
  }

  cerrarNuevoComponente(): any {}

  mostrarCreateDashboard(): void {
    this._route.navigate(['/nuevo-evento'], {
      queryParams: { center: this.center },
    });
  }

  private reiniciarMap(mapa: mapboxgl.Map): void {
    // Guardar el estado actual del mapa si lo necesitas
    const center = mapa.getCenter();
    const zoom = mapa.getZoom();
    const bearing = mapa.getBearing();
    const pitch = mapa.getPitch();

    // Remover todos los marcadores
    const markers = document.getElementsByClassName('mapboxgl-marker');
    while (markers.length > 0) {
      markers[0].remove();
    }

    // Remover todos los popups
    const popups = document.getElementsByClassName('mapboxgl-popup');
    while (popups.length > 0) {
      popups[0].remove();
    }
    mapa.setCenter(center);
    mapa.setZoom(zoom);
    mapa.setBearing(bearing);
    mapa.setPitch(pitch);
  }
}
