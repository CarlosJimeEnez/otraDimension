import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-filtros-badge',
  standalone: true,
  imports: [],
  template: `
    <button type="button" class="inline-flex items-center ">
      <span
        class="bg-blue-100 text-text me-3 px-4 py-1 rounded-full dark:bg-accentv3 dark:hover:bg-accentv2"
        ><p>{{ texto }}</p></span
      >
    </button>
  `,
})
export class FiltrosBadgeComponent {
  @Input() texto: string = '';
}
