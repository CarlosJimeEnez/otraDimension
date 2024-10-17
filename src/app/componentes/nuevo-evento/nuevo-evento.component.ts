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
      <h2 class="text-2xl font-semibold text-text dark:text-text">
        Nuevo evento
      </h2>
      <p class="text-sm text-gray-500 dark:text-gray-400">
        Crea un nuevo evento paranormal
      </p>
      <hr class="my-4 border-t border-gray-200 dark:border-gray-700" />

      <!-- Formulario -->
      <div class="dark:text-text" id="default-styled-tab-content">
        <app-typing-animation
          [fullText]="'Imagen donde ocurrieron los hechos?'"
        ></app-typing-animation>

        <!-- DropZONE -->
        <div class="grid grid-cols-12 gap-4 mt-3">
          <!-- Primer elemento que ocupa 8/12 columnas en pantallas medianas y superiores -->
          <div class="col-span-12 md:col-span-8">
            <ngx-dropzone
              class="w-full h-64 dark:bg-gray-800"
              (change)="onSelect($event)"
            >
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
          </div>

          <!-- Segundo elemento que ocupa 4/12 columnas en pantallas medianas y superiores -->
          <div class="col-span-12 md:col-span-4 space-y-3">
            <div
              class="flex flex-wrap justify-start gap-2 items-start custom-scrollbar overflow-auto h-48"
            >
              @for (item of selectedBadges; track $index) {
              <app-filtros-badge
                *ngFor="let badge of selectedBadges"
                [texto]="badge.texto"
                [color]="badge.color"
              ></app-filtros-badge>
              }
            </div>
          </div>
        </div>

        @if (ImagenSeleccionada) {
        <app-typing-animation
          [fullText]="'Distorciona la realidad con los siguientes filtros:'"
        ></app-typing-animation>

        <!-- Efectos de imagen -->
        <div class="flex  justify-start items-center overflow-x-auto mt-3">
          <app-filtros-badge [texto]="'Oscurecer'"></app-filtros-badge>
          <app-filtros-badge [texto]="'Sombras'"></app-filtros-badge>
          <app-filtros-badge [texto]="'Blanco y Negro'"></app-filtros-badge>
        </div>

        <!-- Cambios bg-background -->
        <div class="flex  justify-start items-center overflow-x-auto mt-3">
          <app-filtros-badge
            [texto]="'Niebla terrorífica'"
            [color]="'var(--primary-v2)'"
            [hoverColor]="'var(--primary-v1)'"
            (click)="addBadge('Niebla terrorífica', 'var(--primary-v2)')"
          ></app-filtros-badge>
          <app-filtros-badge
            [color]="'var(--primary-v2)'"
            [texto]="'Fantasmas'"
            [hoverColor]="'var(--primary-v1)'"
          ></app-filtros-badge>
          <app-filtros-badge
            [texto]="'Fantasmas'"
            [color]="'var(--primary-v2)'"
            [hoverColor]="'var(--primary-v1)'"
          ></app-filtros-badge>
        </div>

        } @if (BadgesSeleccionados) {
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
        }
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
  ImagenSeleccionada: boolean = false;
  BadgesSeleccionados: boolean = false;
  selectedBadges: { texto: string; color: string }[] = [
    {
      texto: 'casa embrujada',
      color: 'var(--primary-v2)',
    },
  ];

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
    this.ImagenSeleccionada = true;
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

  addBadge(texto: string, color: string) {
    this.selectedBadges.push({ texto, color });
    console.log(this.selectedBadges);
  }
}
