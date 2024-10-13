import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  template: `
    <section>
      <div
        class="flex items-center bg-transparent justify-center p-3  w-full fixed top-0 left-0 z-50"
      >
        <div class="absolute left-0 text-text p-3">
          <small>México/Puebla</small>
        </div>

        <div class="flex items-center justify-center space-x-2">
          <button>
            <a href="https://github.com/CarlosJimeEnez">
              <svg
                width="18"
                height="18"
                viewBox="0 0 28 29"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.3771 24.2306C4.37352 26.1852 4.37352 20.7401 2 20.042M18.7543 27.023V22.1363C18.7543 20.7401 18.8939 20.1816 18.0562 19.3439C21.9655 18.9251 25.7352 17.3892 25.7352 10.9668C25.7335 9.29827 25.0826 7.69593 23.9202 6.49896C24.4653 5.04967 24.4152 3.44358 23.7806 2.03115C23.7806 2.03115 22.2448 1.6123 18.8939 3.8462C16.0558 3.10704 13.0756 3.10704 10.2375 3.8462C6.88666 1.6123 5.35086 2.03115 5.35086 2.03115C4.71626 3.44358 4.66607 5.04967 5.21124 6.49896C4.04884 7.69593 3.39789 9.29827 3.39619 10.9668C3.39619 17.3892 7.1659 18.9251 11.0752 19.3439C10.2375 20.1816 10.2375 21.0193 10.3771 22.1363V27.023"
                  stroke="#FFFDFD"
                  stroke-width="2.79238"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </a>
          </button>
        </div>

        <button class="text-text absolute right-0 p-3">
          <div>
            <img src="/moon.png" class="w-6 h-6" alt="moon icon" />
          </div>
        </button>
      </div>
    </section>
  `,
})
export class HeaderComponent {}
