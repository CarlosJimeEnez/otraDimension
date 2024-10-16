import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  template: `
    <footer
      class="fixed bottom-0 left-0 w-full z-10 bg-background text-text p-4 text-center border-t border-gray-200 rounded-t-lg shadow dark:bg-background dark:border-gray-700"
    >
      <div class="flex items-center justify-center my-3">
        <button
          (click)="mostrarEventoDashboard()"
          type="button"
          class="mt-1 text-text bg-gradient-to-br from-primaryv3 to-accentv2 hover:bg-gradient-to-bl focus:outline-none font-semibold rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
        >
          <div class="flex justify-center items-center space-x-3">
            <img src="/iconos/Add.svg" class="s-3 w-4 h-4" alt="add-button" />
            <h5>Reportar actividad paranormal</h5>
          </div>
        </button>
      </div>
    </footer>
  `,
})
export class FooterComponent {
  @Output() mostrarEvento = new EventEmitter<void>();

  mostrarEventoDashboard(): void {
    this.mostrarEvento.emit();
    console.log('Evento emitido');
  }
}
