import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  template: `
    
      <div class="flex items-center fixed bottom-0 left-0 right-0 justify-center md:my-1">
        <button
          (click)="mostrarEventoDashboard()"
          type="button"
          class="mt-1 glow-effect text-text bg-gradient-to-br from-primaryv3 to-accentv2 hover:bg-gradient-to-bl focus:outline-none font-semibold rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
        >
          <div class="flex justify-center items-center space-x-3">
            <img src="/iconos/Add.svg" class="s-3 w-4 h-4" alt="add-button" />
            <p>Reportar actividad paranormal</p>
          </div>
        </button>
      </div>
  `,
})
export class FooterComponent {
  @Output() mostrarEvento = new EventEmitter<void>();

  mostrarEventoDashboard(): void {
    this.mostrarEvento.emit();
    console.log('Evento emitido');
  }
}
