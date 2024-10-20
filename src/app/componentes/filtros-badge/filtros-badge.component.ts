import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-filtros-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      type="button"
      class="group transition-all duration-200 ease-in-out"
      (mouseenter)="isHovered = true"
      (mouseleave)="isHovered = false"
    >
      <span
        class="inline-flex items-center border px-4 py-1 rounded-full transition-colors duration-200 ease-in-out"
        [class]="getBaseClasses()"
        [ngStyle]="getBadgeStyles()"
      >
        <p class="text-sm font-medium">{{ texto }}</p>
      </span>
    </button>
  `,
  styles: [
    `
      :host {
        display: inline-block;
      }
    `,
  ],
})
export class FiltrosBadgeComponent {
  @Input() texto: string = '';
  @Input() color: string = 'var(--accent-v3)';
  @Input() hoverColor: string = 'var(--accent-v2)';
  @Input() selectedBorderColor: string = 'var(--secondary)';
  @Input() borderColor: string = 'var(--background)';
  @Input() borderWidth: string = '2px';
  @Input() selected: boolean = false;
  @Input() tipo: string = 'background';

  isHovered: boolean = false;

  getBaseClasses(): string {
    return ['bg-blue-100 dark:bg-accentv3', 'text-text', 'me-1'].join(' ');
  }

  getBadgeStyles(): Record<string, string> {
    return {
      backgroundColor: this.isHovered ? this.hoverColor : this.color,
      border: `${this.borderWidth} solid ${
        this.selected ? this.selectedBorderColor : this.borderColor
      }`,
      // Opcional: agregar un pequeño padding interno para compensar el borde
      // padding: this.selected ? 'calc(0.25rem - 2px) calc(1rem - 2px)' : '0.25rem 1rem'
    };
  }
}
