import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import { center } from '@cloudinary/url-gen/qualifiers/textAlignment';
import mapboxgl from 'mapbox-gl';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { TypingAnimationComponent } from '../typing-animation/typing-animation.component';
import { FiltrosBadgeComponent } from '../filtros-badge/filtros-badge.component';

@Component({
  selector: 'app-nuevo-evento',
  standalone: true,
  imports: [
    NgxDropzoneModule,
    CommonModule,
    TypingAnimationComponent,
    FiltrosBadgeComponent,
  ],
  styles: [
    `
      .typing-text {
        position: relative;
      }

      #typed-text::after {
        content: '|'; /* This creates the typing cursor */
        animation: blink 1s infinite;
      }

      @keyframes blink {
        0% {
          opacity: 1;
        }
        50% {
          opacity: 0;
        }
        100% {
          opacity: 1;
        }
      }
    `,
  ],
  template: `
    <div class="fixed inset-0 bg-background opacity-70 z-5 "></div>
    <div
      class="fixed text-text space-y-4 top-16 w-8/12 max-h-[75vh] custom-scrollbar overflow-y-auto left-1/2 transform -translate-x-1/2  p-6 z-10 bg-white border border-gray-200 rounded-lg shadow dark:bg-background dark:border-gray-700"
    >
      <div class="mb-4 border-b border-gray-200 dark:border-gray-700">
        <ul class="flex items-center justify-start">
          <li class="m-3 hover:text-white">
            <button>
              <span
                class="bg-gray-100 text-text text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-gray-700 dark:text-text"
                >Subir imagen</span
              >
            </button>
          </li>
          <li class="me-3 hidden">
            <button>Localización</button>
          </li>
        </ul>
      </div>

      <!-- Formulario -->
      <div class="dark:text-text" id="default-styled-tab-content">
        <div
          class="p-4 rounded-lg bg-gray-50 dark:bg-gray-800"
          id="styled-profile"
          role="tabpanel"
          aria-labelledby="profile-tab"
        >
          <!-- <p #textContainer class="text-sm">
            Imagen de donde ocurrieron los hechos <span>...</span>
          </p> -->
          <app-typing-animation
            [fullText]="'Imagen donde ocurrieron los hechos ?'"
          ></app-typing-animation>
        </div>

        <div class="flex justify-start items-start space-x-3 mt-3">
          <!-- in app.component.html -->
          <ngx-dropzone class="w-2/3" (change)="onSelect($event)">
            <ngx-dropzone-label>Arrastra y suelta</ngx-dropzone-label>
            <ngx-dropzone-preview
              *ngFor="let f of files"
              [removable]="true"
              (removed)="onRemove(f)"
            >
              <ngx-dropzone-label
                ><ngx-dropzone-image-preview
                  ngProjectAs="ngx-dropzone-preview"
                  *ngFor="let f of files"
                  [file]="f"
                >
                  <ngx-dropzone-label
                    >{{ f.name }} ({{ f.type }})</ngx-dropzone-label
                  >
                </ngx-dropzone-image-preview></ngx-dropzone-label
              >
            </ngx-dropzone-preview>
          </ngx-dropzone>
          <div class="w-1/3 space-y-3">
            <div class="flex flex-wrap justify-start gap-3 items-center">
              <app-filtros-badge [texto]="'casa embrujada'"></app-filtros-badge>
              <app-filtros-badge
                [texto]="'niebla tenebrosa'"
              ></app-filtros-badge>
              <app-filtros-badge [texto]="'Humo'"></app-filtros-badge>
              <app-filtros-badge
                [texto]="'Figuras tenebrosas'"
              ></app-filtros-badge>
              <app-filtros-badge
                [texto]="'Figuras tenebrosas'"
              ></app-filtros-badge>
              <app-filtros-badge [texto]="'oscuridad'"></app-filtros-badge>
              <app-filtros-badge
                [texto]="'invertir colores'"
              ></app-filtros-badge>
              <app-filtros-badge [texto]="'sombras'"></app-filtros-badge>
              <app-filtros-badge [texto]="'blanco y negro'"></app-filtros-badge>
              <app-filtros-badge [texto]="'desaturación'"></app-filtros-badge>
            </div>
          </div>
        </div>
      </div>

      <div
        class="p-4 rounded-lg bg-gray-50 dark:bg-gray-800"
        id="styled-profile"
        role="tabpanel"
        aria-labelledby="profile-tab"
      >
        <p class="text-sm ">Que ocurrió en el lugar <span>?</span></p>
      </div>

      <div>
        <form class="">
          <textarea
            id="message"
            rows="4"
            class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Escribe tu historia..."
          ></textarea>
        </form>
      </div>

      <div
        class="p-4 rounded-lg bg-gray-50 dark:bg-gray-800"
        id="styled-profile"
        role="tabpanel"
        aria-labelledby="profile-tab"
      >
        <p class="text-sm">
          Por último, <span>¿Donde ocurrieron los hechos?</span>
        </p>
      </div>
      <div
        class="p-4 rounded-lg bg-gray-50 dark:bg-gray-800"
        id="styled-profile"
        role="tabpanel"
        aria-labelledby="profile-tab"
      >
        <p class="text-sm">
          Arrastra el mapa para seleccionar la ubicación exacta de los hechos
        </p>
      </div>

      <!-- Map -->
      <div id="mapa" class="map-container w-70 h-[300px]" #mapContainer></div>

      <!-- // Botones de cerrar y publicar -->
      <div>
        <div class="flex justify-end items-center space-x-3">
          <button
            class="px-4 py-2 text-sm font-medium text-text dark:bg-accentv3 opacity-50 rounded-lg shadow-md hover:dark:bg-accent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white"
            (click)="cerrar()"
          >
            Cerrar
          </button>
          <button
            class="px-4 py-2 text-sm font-medium text-text dark:bg-primaryv2 rounded-lg shadow-md hover:dark:bg-primary focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white"
            (click)="cerrar()"
          >
            Publicar
          </button>
        </div>
      </div>
    </div>
  `,
})
export class NuevoEventoComponent implements AfterViewInit {
  @Input() mapa!: mapboxgl.Map | undefined;
  @Input() center!: [number, number];
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;
  // Access the span element
  @ViewChild('textContainer') textContainer!: ElementRef;

  files: File[] = [];

  ngAfterViewInit(): void {
    if (this.mapa) {
      this.reiniciarMap(this.mapa);
      this.cargarMapa(this.mapa);
      const marker = this.addMarker();

      // Actualizar la posición del marker cuando el mapa se mueve
      this.mapa.on('move', () => {
        const center = this.mapa!.getCenter();
        this.center = [center.lng, center.lat];
        marker.setLngLat(this.center);
      });
    }
  }

  onSelect(event: any): void {
    console.log(event);
    this.files.push(...event.addedFiles);
  }

  onRemove(event: any): void {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }

  cerrar() {
    console.log('Evento emitido');
  }

  reiniciarMap(mapa: mapboxgl.Map): void {
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

    // Opcional: Restablecer la vista del mapa a su estado inicial
    // mapa.setCenter([-74.5, 40]); // Coordenadas iniciales
    // mapa.setZoom(9); // Zoom inicial
    // mapa.setBearing(0); // Rotación inicial
    // mapa.setPitch(0); // Inclinación inicial

    // Opcional: Si quieres mantener el estado actual
    mapa.setCenter(center);
    mapa.setZoom(zoom);
    mapa.setBearing(bearing);
    mapa.setPitch(pitch);
  }

  // Cargar Mapa
  cargarMapa(mapa: mapboxgl.Map): void {
    const mapContainerElement = this.mapContainer.nativeElement;
    mapContainerElement.appendChild(mapa.getContainer());
    console.log(mapa);
    mapa.resize();
  }

  addMarker(): mapboxgl.Marker {
    const marker1 = new mapboxgl.Marker({
      color: 'var(--primary)',
      draggable: false,
    })
      .setLngLat(this.center)
      .addTo(this.mapa!);
    return marker1;
  }

  // Método para obtener las coordenadas actuales del marker
  getCurrentMarkerPosition(): [number, number] {
    return this.center;
  }
}
