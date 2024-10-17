import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-typing-animation',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
      <p class="text-text">
        <ng-container *ngIf="isThinking; else typingText">
          <span class="flex items-center gap-1">
            <span class="flex gap-1">
              <span
                class="w-2 h-2 bg-gray-400 dark:bg-gray-300 rounded-full"
                [ngClass]="'animate-bounce-delay-1'"
              ></span>
              <span
                class="w-2 h-2 bg-gray-400 dark:bg-gray-300 rounded-full"
                [ngClass]="'animate-bounce-delay-2'"
              ></span>
              <span
                class="w-2 h-2 bg-gray-400 dark:bg-gray-300 rounded-full"
                [ngClass]="'animate-bounce-delay-3'"
              ></span>
            </span>
          </span>
        </ng-container>
        <ng-template #typingText>
          {{ displayText }}
          <span
            class="inline-block w-0.5 h-4 ml-1 -mb-0.5 bg-gray-400 dark:bg-gray-300"
            [ngClass]="{ 'opacity-100': showCursor, 'opacity-0': !showCursor }"
          ></span>
        </ng-template>
      </p>
    </div>
  `,
  styles: `
    [
      .animate-bounce-delay-1 {
      animation: bounce 1s infinite;
      animation-delay: -0.3s;
    }
    .animate-bounce-delay-2 {
      animation: bounce 1s infinite;
      animation-delay: -0.15s;
    }
    .animate-bounce-delay-3 {
      animation: bounce 1s infinite;
    }
    @keyframes bounce {
      0%, 100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-5px);
      }
    }
    ]
  `,
})
export class TypingAnimationComponent implements OnInit, OnDestroy {
  @Input() fullText: string = '';

  displayText: string = '';
  isThinking: boolean = true;
  showCursor: boolean = true;
  private index: number = 0;
  private typingInterval: any;
  private cursorInterval: any;

  ngOnInit() {
    // Simular tiempo de "pensamiento"
    setTimeout(() => {
      this.isThinking = false;
      this.startTyping();
    }, 300);

    // Iniciar el parpadeo del cursor
    this.cursorInterval = setInterval(() => {
      this.showCursor = !this.showCursor;
    }, 500);
  }

  ngOnDestroy() {
    if (this.typingInterval) clearInterval(this.typingInterval);
    if (this.cursorInterval) clearInterval(this.cursorInterval);
  }

  private startTyping() {
    this.typingInterval = setInterval(() => {
      if (this.index < this.fullText.length) {
        this.displayText += this.fullText.charAt(this.index);
        this.index++;
      } else {
        clearInterval(this.typingInterval);
      }
    }, 50);
  }
}
