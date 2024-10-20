import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
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

import { UploadService } from '../../services/upload.service';
import { environment } from '../../environment/environment.dev';
import { FirebaseService } from '../../services/firebase-service.service';
import { Item } from '../../interfaces/ImagePost';
import { GeoPoint } from 'firebase/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { text } from '@cloudinary/url-gen/qualifiers/source';
import { blackwhite } from '@cloudinary/url-gen/actions/effect';

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
      <button>
        <div
          (click)="cerrar()"
          class="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-text bg-red-500 border-2 border-white rounded-full top-1 end-1  dark:border-gray-900"
        >
          X
        </div>
      </button>
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
          [fullText]="'Imagen de donde ocurrieron los hechos?'"
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
                    <ngx-dropzone-label></ngx-dropzone-label> </ngx-dropzone-image-preview
                ></ngx-dropzone-label>
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
        <small class="mt-4">Efectos de imagen</small>
        <div
          class="flex custom-scrollbar justify-start items-center overflow-x-auto mt-2"
        >
          <app-filtros-badge
            [texto]="'Saturacion'"
            [selected]="isSelected('Saturacion')"
            (click)="
              toggleBadge(
                'Saturacion',
                'var(--accent-v2)',
                'var(--accent-v1)',
                'efecto'
              )
            "
          ></app-filtros-badge>
          <app-filtros-badge
            [texto]="'Escala de grises'"
            [selected]="isSelected('Escala de grises')"
            (click)="
              toggleBadge(
                'Escala de grises',
                'var(--accent-v2)',
                'var(--accent-v1)',
                'efecto'
              )
            "
          ></app-filtros-badge>
          <app-filtros-badge
            [texto]="'Contraste'"
            [selected]="isSelected('Contraste')"
            (click)="
              toggleBadge(
                'Contraste',
                'var(--accent-v2)',
                'var(--accent-v1)',
                'efecto'
              )
            "
          ></app-filtros-badge>
          <app-filtros-badge
            [texto]="'Blanco y Negro'"
            [selected]="isSelected('Blanco y negro')"
            (click)="
              toggleBadge(
                'Blanco y negro',
                'var(--accent-v2)',
                'var(--accent-v1)',
                'efecto'
              )
            "
          ></app-filtros-badge>

          <app-filtros-badge
            [texto]="'Imagen Negada'"
            [selected]="isSelected('Imagen Negada')"
            (click)="
              toggleBadge(
                'Imagen Negada',
                'var(--accent-v2)',
                'var(--accent-v1)',
                'efecto'
              )
            "
          ></app-filtros-badge>
        </div>

        <!-- Cambios bg-background -->
        <small class="mt-4"
          >Generar background. (Solo se puede seleccionar uno)</small
        >
        <div
          class="flex custom-scrollbar justify-start items-center overflow-x-auto mt-2"
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
                'var(--primary-v1)',
                'background'
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
              toggleBadge(
                'Fantasmas',
                'var(--primary-v2)',
                'var(--primary-v1)',
                'background'
              )
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
                'var(--primary-v1)',
                'background'
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

              <!-- Condicionales -->
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

              <!-- Nombre -->
              <div class="mt-3 mb-3">
                <app-typing-animation
                  [fullText]="'Cómo llamarías esta historia?'"
                ></app-typing-animation>
              </div>

              <textarea
                id="message"
                rows="4"
                formControlName="nombre"
                class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="El edificio abandonado ... "
              ></textarea>

              @if (form.get('nombre')?.invalid && form.get('nombre')?.dirty ||
              form.get('nombre')?.touched) {
              <small
                class="text-red-500"
                *ngIf="form.get('nombre')?.errors?.['required']"
              >
                El nombre es requerido
              </small>
              <small
                class="text-red-500"
                *ngIf="form.get('nombre')?.errors?.['minlength']"
              >
                El nombre debe tener más de 1 caracter.
              </small>
              <small
                class="text-red-500"
                *ngIf="form.get('nombre')?.errors?.['maxlength']"
              >
                El nombre no puede tener más de 100 caracteres.
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
  center: [number, number];
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;
  // Access the span element
  @ViewChild('textContainer') textContainer!: ElementRef;

  localizacioneSeleccionada: boolean = false;
  localizacion: GeoPoint | null = null;
  ImagenSeleccionada: boolean = false;
  BadgesSeleccionado: boolean = false;
  selectedBadges: Badges[] = [];
  form: FormGroup;
  map: mapboxgl.Map | null = null;
  files: File[] = [];
  processedImageUrl: any | null = null;
  isUploading: boolean = false;
  originalImageUrl: string = '';
  transformedImageUrl: string = '';
  items: Item[] = [];
  storyText: string = '';
  nombreText: string = '';

  constructor(
    private fb: FormBuilder,
    private _mapService: MapboxService,
    private _uploadService: UploadService,
    private _firebaseService: FirebaseService,
    private _route: ActivatedRoute,
    private _router: Router
  ) {
    this.form = this.fb.group({
      story: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(500),
        ],
      ],
      nombre: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(100),
        ],
      ],
    });

    this.center = this._route.snapshot.queryParams['center'];
  }

  ngOnInit(): void {
    this.form.get('story')?.valueChanges.subscribe((value) => {
      this.storyText = value;
    });
    this.form.get('nombre')?.valueChanges.subscribe((value) => {
      this.nombreText = value;
    });
  }

  ngAfterViewInit(): void {
    this.map = this._mapService.getMap();
    if (this.map) {
      const mapContainerElement = this.mapContainer.nativeElement;
      mapContainerElement.appendChild(this.map?.getContainer());
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
      this.map = this._mapService.initializeMap('map', {
        center: this.center, // Personaliza las opciones según necesites
      });
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
    this._router.navigate(['']);
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

  addBadge(
    texto: string,
    color: string,
    hoverColor: string,
    tipo: string
  ): void {
    const exists = this.selectedBadges.some((badge) => badge.texto === texto);
    if (!exists) {
      this.selectedBadges = [
        ...this.selectedBadges,
        { texto, color, hoverColor, tipo },
      ];
      console.log(this.selectedBadges);
    }
  }

  removeBadge(texto: string): void {
    this.selectedBadges = this.selectedBadges.filter(
      (badge) => badge.texto !== texto
    );
  }

  removeBadgeTipo(tipo: string): void {
    this.selectedBadges = this.selectedBadges.filter(
      (badge) => badge.tipo !== tipo
    );
  }

  isSelected(texto: string): boolean {
    return this.selectedBadges.some((badge) => badge.texto === texto);
  }

  toggleBadge(
    texto: string,
    color: string,
    hoverColor: string,
    tipo: string
  ): void {
    const exists = this.selectedBadges.some((badge) => badge.texto === texto);
    const existsBackground = this.selectedBadges.some(
      (badge) => badge.tipo === tipo
    );
    this.BadgesSeleccionado = true;

    if (exists) {
      this.removeBadge(texto);
    }

    if (tipo == 'background') {
      if (!exists && !existsBackground) {
        this.addBadge(texto, color, hoverColor, tipo);
      } else {
        this.removeBadgeTipo(tipo);
        this.addBadge(texto, color, hoverColor, tipo);
      }
    } else {
      if (exists) {
        this.removeBadge(texto);
      } else {
        this.addBadge(texto, color, hoverColor, tipo);
      }
    }
  }

  onSubmit(): boolean {
    if (!this.isImageSelected()) {
      console.log('No se ha seleccionado una imagen');
      return false;
    }
    if (!this.isFormValid()) {
      this.form.markAllAsTouched();
      return false;
    }
    this.processForm();
    return false;
  }

  guardarPosicion(): void {
    this.localizacion = new GeoPoint(this.center[1], this.center[0]);

    this.localizacioneSeleccionada = true;
  }

  private upload() {
    this.isUploading = true;
    const badgeBackground = this.selectedBadges.filter((badge) => {
      badge.tipo === 'background';
    });
    const backgroundPrompt = badgeBackground[0].texto;
    console.log(`Background promt: ${backgroundPrompt}`);

    const localizacion = this.localizacion;
    const story = this.form.get('story')?.value;
    const nombre = this.form.get('nombre')?.value;
    console.log(`Story: ${story}, Nombre: ${nombre}`);

    this._uploadService.uploadImage(this.files[0]).subscribe({
      next: (response: any) => {
        this.originalImageUrl = response.secure_url;
        // Generamos la URL con las transformaciones
        this.transformedImageUrl = this._uploadService.getAiTransformedUrl(
          response.public_id,
          backgroundPrompt,
          {
            blackAndWhite: this.isSelected('Blanco y Negro'),
            negate: this.isSelected('Imagen negada'),
            saturation: this.isSelected('Saturacion'),
            graySacale: this.isSelected('Escala de grises'),
            contrast: this.isSelected('Contraste'),
          }
        );

        this.isUploading = false;
      },

      error: (error) => {
        console.error(error);
        this.isUploading = false;
      },

      complete: () => {
        console.log('Completado');
        console.log(this.transformedImageUrl);
        this.saveFirebase(backgroundPrompt, localizacion!);
        this.cerrar();
      },
    });
  }

  private resetForm() {
    this.form.reset();
  }

  private isImageSelected(): boolean {
    return this.files.length > 0 && this.ImagenSeleccionada;
  }

  private isFormValid(): boolean {
    return this.form.valid;
  }

  private processForm(): void {
    this.resetForm();
    this.upload();
  }

  private saveFirebase(backgroundPrompt: string, localizacion: GeoPoint) {
    this._firebaseService.addItem(
      this.nombreText,
      backgroundPrompt,
      localizacion,
      this.storyText,
      this.originalImageUrl,
      this.transformedImageUrl
    );
  }
}
