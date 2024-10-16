import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Eventos } from '../../interfaces/Eventos';
import { CloudinaryModule } from '@cloudinary/ng';

// Import the Cloudinary classes.
import { Cloudinary, CloudinaryImage } from '@cloudinary/url-gen';
import { CommonModule } from '@angular/common';
import { fill } from '@cloudinary/url-gen/actions/resize';

@Component({
  selector: 'app-eventos-detalles',
  standalone: true,
  imports: [CommonModule, CloudinaryModule],
  template: `
    <div
      class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background p-4 rounded-lg shadow-lg"
    >
      <button>
        <div
          (click)="cerrar()"
          class="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-text bg-red-500 border-2 border-white rounded-full -top-2 -end-2 dark:border-gray-900"
        >
          X
        </div>
      </button>

      <h2 class="text-text">Detalles del evento</h2>
      <p class="text-text">Nombre: {{ eventoSeleccionado?.nombre }}</p>
      <p class="text-text">
        Descripción: {{ eventoSeleccionado?.descripcion }}
      </p>
      <advanced-image [cldImg]="img"></advanced-image>
    </div>
  `,
})
export class EventosDetallesComponent {
  @Input() eventoSeleccionado: Eventos | null = null;
  @Output() cerrarEvento = new EventEmitter<any>();
  img!: CloudinaryImage;

  ngOnInit() {
    // Create a Cloudinary instance and set your cloud name.
    const cld = new Cloudinary({
      cloud: {
        cloudName: 'otraDimension',
      },
    });

    // Instantiate a CloudinaryImage object for the image with the public ID, 'docs/models'.
    this.img = cld.image('d5okkyolb8gp0psfq73u');

    // Resize to 250 x 250 pixels using the 'fill' crop mode.
    this.img.resize(fill().width(250).height(250));
  }

  cerrar() {
    this.cerrarEvento.emit();
  }
}
