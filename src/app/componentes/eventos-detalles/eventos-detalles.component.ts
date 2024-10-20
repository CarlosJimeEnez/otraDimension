import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Eventos } from '../../interfaces/Eventos';
import { CloudinaryModule } from '@cloudinary/ng';

// Import the Cloudinary classes.
import { Cloudinary, CloudinaryImage } from '@cloudinary/url-gen';
import { CommonModule } from '@angular/common';
import { fill } from '@cloudinary/url-gen/actions/resize';
import { Item } from '../../interfaces/ImagePost';
import { FiltrosBadgeComponent } from '../filtros-badge/filtros-badge.component';

@Component({
  selector: 'app-eventos-detalles',
  standalone: true,
  imports: [CommonModule, CloudinaryModule, FiltrosBadgeComponent],
  template: `
    <div
      class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background rounded-lg shadow-lg p-3"
    >
      <button>
        <div
          (click)="cerrar()"
          class="absolute inline-flex items-center w-6 h-6 justify-center text-xs font-bold text-text bg-red-500 border-2 border-white rounded-full -top-2 -end-2 dark:border-gray-900"
        >
          X
        </div>
      </button>
      <div class="flex justify-center items-center p-3">
        <img
          [src]="eventoSeleccionado?.TransformedImageUrl"
          alt="imagenTransformada"
          class=" rounded-xl"
        />
      </div>
      <div class="flex flex-wrap justify-center items-center space-x-3">
        <app-filtros-badge
          [texto]="eventoSeleccionado?.BackgroundPrompt!"
        ></app-filtros-badge>
      </div>

      <div class="p-5 flex justify-start space-y-3 items-start flex-col">
        <h5 class="text-text">{{ eventoSeleccionado?.Nombre }}</h5>
        <p class="text-text">
          {{ eventoSeleccionado?.Descripcion }}
        </p>
      </div>
    </div>
  `,
})
export class EventosDetallesComponent {
  @Input() eventoSeleccionado: Item | null = null;
  @Output() cerrarEvento = new EventEmitter<any>();
  img!: CloudinaryImage;

  ngOnInit() {
    const cld = new Cloudinary({
      cloud: {
        cloudName: 'otraDimension',
      },
    });
  }

  cerrar() {
    this.cerrarEvento.emit();
  }
}
