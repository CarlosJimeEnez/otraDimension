import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-filtros-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      type="button"
      class="inline-flex items-center"
      (mouseenter)="isHovered = true"
      (mouseleave)="isHovered = false"
    >
      <span
        [ngStyle]="{
          'background-color': isHovered ? hoverColor : color
        }"
        class="bg-blue-100 text-text me-3 px-4 py-1 rounded-full dark:bg-accentv3 dark:hover:bg-accentv2"
        ><p>{{ texto }}</p></span
      >
    </button>
  `,
})
export class FiltrosBadgeComponent {
  @Input() texto: string = '';
  @Input() color: string = 'var( --accent-v3)';
  @Input() hoverColor: string = 'var(--accent-v2)';
  isHovered: boolean = false;
}
