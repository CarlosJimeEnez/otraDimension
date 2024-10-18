import { CommonModule } from '@angular/common';
import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { center } from '@cloudinary/url-gen/qualifiers/textAlignment';
import mapboxgl from 'mapbox-gl';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { TypingAnimationComponent } from '../typing-animation/typing-animation.component';
import { FiltrosBadgeComponent } from '../filtros-badge/filtros-badge.component';
import { Badges } from '../../interfaces/Badges';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormGroup, FormControl } from '@angular/forms';
import { MapboxService } from '../../services/mapbox.service';
import { set } from '@cloudinary/url-gen/actions/variable';
import { UploadService } from '../../services/upload.service';
import { environment } from '../../environment/environment.dev';

@Component({
  selector: 'app-nuevo-evento',
  standalone: true,
  imports: [
    NgxDropzoneModule,
    CommonModule,
    TypingAnimationComponent,
    FiltrosBadgeComponent,
    ReactiveFormsModule,
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

      <div class="space-y-3 mt-3">
        <app-typing-animation
          [fullText]="
            '¿Donde ocurrieron los hechos? Arrastra el mapa para ubicar el lugar de los hechos.'
          "
        ></app-typing-animation>
      </div>

      <div id="map" class="map-container w-70 h-[300px]" #mapContainer></div>
      <div class="flex justify-start items-center">
        <button
          type="button"
          class="px-4 py-2 text-sm font-medium text-white dark:bg-secondaryv1 hover:dark:bg-secondary rounded-lg shadow-md hover:dark:text-white  focus:outline-none"
          (click)="guardarPosicion()"
        >
          Guardar
        </button>
      </div>

      <!-- Formulario -->
      <div class="dark:text-text" id="default-styled-tab-content">
        @if(localizacioneSeleccionada) {
        <app-typing-animation
          [fullText]="'Imagen donde ocurrieron los hechos?'"
        ></app-typing-animation>

        <!-- DropZONE -->
        <div class="grid grid-cols-12 gap-4 mt-3 me-3">
          <!-- Primer elemento que ocupa 8/12 columnas en pantallas medianas y superiores -->
          <div class="col-span-12 ">
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

          <div class="col-span-12">
            <div
              class="flex flex-wrap justify-start gap-1 custom-scrollbar overflow-auto h-auto "
            >
              <div class="flex flex-wrap justify-start gap-1 h-auto">
                @for (item of selectedBadges; track $index) {
                <app-filtros-badge
                  [texto]="item.texto"
                  [color]="item.color"
                  [hoverColor]="item.hoverColor"
                  selectedBorderColor="var(--text)"
                  (click)="removeBadge(item.texto)"
                ></app-filtros-badge>
                }
              </div>
            </div>
          </div>
        </div>
        } @if (ImagenSeleccionada) {
        <div class="mt-3">
          <app-typing-animation
            [fullText]="'Distorciona la realidad con los siguientes filtros:'"
          ></app-typing-animation>
        </div>

        <!-- Efectos de imagen -->
        <div
          class="flex custom-scrollbar justify-start items-center overflow-x-auto mt-3"
        >
          <app-filtros-badge
            [texto]="'Oscurecer'"
            [selected]="isSelected('Oscurecer')"
            (click)="
              toggleBadge('Oscurecer', 'var(--accent-v2)', 'var(--accent-v1)')
            "
          ></app-filtros-badge>
          <app-filtros-badge
            [texto]="'Sombras'"
            [selected]="isSelected('Sombras')"
            (click)="
              toggleBadge('Sombras', 'var(--accent-v2)', 'var(--accent-v1)')
            "
          ></app-filtros-badge>
          <app-filtros-badge
            [texto]="'Blanco y Negro'"
            [selected]="isSelected('Blanco y negro')"
            (click)="
              toggleBadge(
                'Blanco y negro',
                'var(--accent-v2)',
                'var(--accent-v1)'
              )
            "
          ></app-filtros-badge>
        </div>

        <!-- Cambios bg-background -->
        <div
          class="flex custom-scrollbar justify-start items-center overflow-x-auto mt-3"
        >
          <app-filtros-badge
            texto="Niebla terrorífica"
            color="var(--primary-v2)"
            hoverColor="var(--primary-v1)"
            selectedBorderColor="var(--text)"
            [selected]="isSelected('Niebla terrorífica')"
            (click)="
              toggleBadge(
                'Niebla terrorífica',
                'var(--primary-v2)',
                'var(--primary-v1)'
              )
            "
          ></app-filtros-badge>
          <app-filtros-badge
            [texto]="'Fantasmas'"
            [color]="'var(--primary-v2)'"
            [hoverColor]="'var(--primary-v1)'"
            selectedBorderColor="var(--text)"
            [selected]="isSelected('Fantasmas')"
            (click)="
              toggleBadge('Fantasmas', 'var(--primary-v2)', 'var(--primary-v1)')
            "
          ></app-filtros-badge>
          <app-filtros-badge
            [texto]="'Murcielagos'"
            [color]="'var(--primary-v2)'"
            [hoverColor]="'var(--primary-v1)'"
            selectedBorderColor="var(--text)"
            [selected]="isSelected('Murcielagos')"
            (click)="
              toggleBadge(
                'Murcielagos',
                'var(--primary-v2)',
                'var(--primary-v1)'
              )
            "
          ></app-filtros-badge>
        </div>
        } @if (BadgesSeleccionado) {
        <div class="space-y-3 mt-3">
          <app-typing-animation
            [fullText]="'Que ocurrió en el lugar?'"
          ></app-typing-animation>
          <div>
            <form class="" [formGroup]="form" (ngSubmit)="onSubmit()">
              <textarea
                id="message"
                rows="4"
                formControlName="story"
                class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Escribe tu historia..."
              ></textarea>

              @if (form.get('story')?.invalid && form.get('story')?.dirty ||
              form.get('story')?.touched) {
              <small
                class="text-red-500"
                *ngIf="form.get('story')?.errors?.['required']"
              >
                La historia es requerida.
              </small>
              <small
                class="text-red-500"
                *ngIf="form.get('story')?.errors?.['minlength']"
              >
                La historia debe tener al menos 10 caracteres.
              </small>
              <small
                class="text-red-500"
                *ngIf="form.get('story')?.errors?.['maxlength']"
              >
                La historia no puede tener más de 100 caracteres.
              </small>
              }

              <!-- // Botones de cerrar y publicar -->
              <div class="space-y-3 my-3">
                <div class="flex justify-end items-center space-x-3">
                  <button
                    type="button"
                    class="px-4 py-2 text-sm font-medium text-text dark:bg-accentv3 opacity-90 rounded-lg shadow-md hover:dark:text-white hover:dark:bg-accent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white"
                    (click)="cerrar()"
                  >
                    Cerrar
                  </button>
                  <button
                    type="submit"
                    class="px-4 py-2 text-sm font-medium text-text dark:bg-primaryv2 rounded-lg shadow-md hover:dark:bg-primary hover:dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white"
                  >
                    Publicar
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
        }
      </div>
    </div>
  `,
})
export class NuevoEventoComponent implements AfterViewInit, OnInit {
  @Input() center!: [number, number];
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;
  // Access the span element
  @ViewChild('textContainer') textContainer!: ElementRef;

  localizacioneSeleccionada: boolean = false;
  ImagenSeleccionada: boolean = false;
  BadgesSeleccionado: boolean = false;
  selectedBadges: Badges[] = [];
  form: FormGroup;
  storyText: string = '';
  map: mapboxgl.Map | null = null;
  files: File[] = [];
  constructor(
    private fb: FormBuilder,
    private _mapService: MapboxService,
    private _uploadService: UploadService
  ) {
    this.form = this.fb.group({
      story: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(100),
        ],
      ],
    });
  }

  ngOnInit(): void {
    this.form.get('story')?.valueChanges.subscribe((value) => {
      this.storyText = value;
    });
  }

  ngAfterViewInit(): void {
    this.map = this._mapService.getMap();
    console.log(this.map);
    if (this.map) {
      const mapContainerElement = this.mapContainer.nativeElement;
      mapContainerElement.appendChild(this.map?.getContainer());
      console.log(this.map);
      this.map?.resize();
      this.reiniciarMap(this.map);

      const marker = this.addMarker();
      // Actualizar la posición del marker cuando el mapa se mueve
      this.map.on('move', () => {
        const center = this.map!.getCenter();
        this.center = [center.lng, center.lat];
        marker.setLngLat(this.center);
      });
      this.map?.setZoom(14);
    } else {
      console.log('No se ha podido cargar el mapa');
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
    mapa.setCenter(center);
    mapa.setZoom(zoom);
    mapa.setBearing(bearing);
    mapa.setPitch(pitch);
  }

  addMarker(): mapboxgl.Marker {
    const marker1 = new mapboxgl.Marker({
      color: 'var(--primary)',
      draggable: false,
    })
      .setLngLat(this.center)
      .addTo(this.map!);
    return marker1;
  }

  // Método para obtener las coordenadas actuales del marker
  getCurrentMarkerPosition(): [number, number] {
    return this.center;
  }

  addBadge(texto: string, color: string, hoverColor: string): void {
    const exists = this.selectedBadges.some((badge) => badge.texto === texto);
    if (!exists) {
      this.selectedBadges = [
        ...this.selectedBadges,
        { texto, color, hoverColor },
      ];
      console.log(this.selectedBadges);
    }
  }

  removeBadge(texto: string): void {
    this.selectedBadges = this.selectedBadges.filter(
      (badge) => badge.texto !== texto
    );
  }

  isSelected(texto: string): boolean {
    return this.selectedBadges.some((badge) => badge.texto === texto);
  }

  toggleBadge(texto: string, color: string, hoverColor: string): void {
    const exists = this.selectedBadges.some((badge) => badge.texto === texto);

    this.BadgesSeleccionado = true;

    if (exists) {
      this.removeBadge(texto);
    } else {
      this.addBadge(texto, color, hoverColor);
    }
  }

  onSubmit(): boolean {
    if (this.files.length > 0) {
      if (this.form.valid) {
        console.log(this.form.value);
        this.storyText = this.form.value.story;
        this.resetForm();
        this.upload();
        console.log('No se ha seleccionado una imagen');
      } else {
        this.form.markAllAsTouched();
      }
    }
    return false;
  }

  guardarPosicion(): void {
    this.localizacioneSeleccionada = true;
  }

  private upload() {
    console.log('Subiendo imagen y texto a la base de datos');
    const file_data = this.files[0];
    const form_data = new FormData();

    form_data.append('file', file_data);
    form_data.append('upload_preset', 'otraDimensionProd');
    form_data.append('cloud_name', environment.cloudName);

    this._uploadService.uploadImage(form_data).subscribe({
      next: (response: any) => {
        console.log(response);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  private resetForm() {
    this.form.reset();
  }
}
