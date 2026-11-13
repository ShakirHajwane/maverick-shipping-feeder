import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaritimeService } from '../../services/maritime.service';
import { RegionalAgent } from '../../models/maritime.models';

@Component({
  selector: 'app-agents',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="agents-section" class="py-16 bg-white border-b border-slate-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-8">
        <!-- Section Header -->
        <div class="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-[#dd0103] text-xs font-semibold tracking-wide uppercase mb-2">
              <span class="w-2 h-2 rounded-full bg-[#dd0103]"></span>
              <span>{{ isRtl() ? 'المكاتب الإقليمية والوكلاء' : 'GLOBAL COMMERCIAL PRESENCE' }}</span>
            </div>
            <h2 class="text-2xl sm:text-4xl font-black text-[#02194b]">
              {{ isRtl() ? 'شبكة الوكلاء والمكاتب الإقليمية' : 'Regional Offices & Dedicated Agents' }}
            </h2>
            <p class="text-sm text-slate-600 mt-1 max-w-2xl">
              {{ isRtl()
                ? 'فريق عمل متمرس في موانئ دبي وأبوظبي وجدة ومومباي وسنغافورة وشنغهاي لخدمة جميع احتياجات الشحن والمناولة.'
                : 'Local expertise across primary shipping corridors with dedicated operations desks, documentation teams, and 24/7 port agency support.' }}
            </p>
          </div>

          <!-- Country Filter Pills -->
          <div class="flex flex-wrap items-center gap-2">
            <button
              *ngFor="let country of countries"
              (click)="filterCountry(country.val)"
              [class]="selectedCountry === country.val 
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-[#02194b] font-bold border-amber-300 shadow-md shadow-amber-500/20' 
                : 'bg-slate-50 text-slate-700 border-slate-300 hover:border-[#dd0103] hover:text-slate-900 shadow-sm'"
              class="px-3 py-1.5 rounded-lg text-xs border transition-all cursor-pointer">
              {{ country.label }}
            </button>
          </div>
        </div>

        <!-- Agents Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            *ngFor="let agent of filteredAgents()"
            class="bg-white border border-slate-200 hover:border-[#dd0103]/80 rounded-2xl p-6 transition-all hover:-translate-y-1 group flex flex-col justify-between shadow-md hover:shadow-xl">
            
            <div>
              <div class="flex items-center justify-between mb-3">
                <span class="text-xs px-2.5 py-0.5 rounded-full bg-red-50 text-[#dd0103] border border-red-200 font-bold">
                  {{ agent.country }}
                </span>
                <span class="text-xs font-bold text-slate-500 flex items-center gap-1">
                  <svg class="w-3.5 h-3.5 text-[#dd0103]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  <span>{{ agent.city }}</span>
                </span>
              </div>

              <h3 class="text-base font-bold text-[#02194b] group-hover:text-[#dd0103] transition-colors">
                {{ agent.office_name }}
              </h3>

              <p class="text-xs text-slate-500 mt-2 leading-relaxed">
                {{ agent.address }}
              </p>

              <!-- Contact Info -->
              <div class="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs">
                <div class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-[#dd0103] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <a [href]="'tel:' + agent.phone" class="text-slate-700 hover:text-[#dd0103] font-mono transition-colors font-medium">
                    {{ agent.phone }}
                  </a>
                </div>

                <div class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-[#dd0103] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a [href]="'mailto:' + agent.email" class="text-slate-700 hover:text-[#dd0103] transition-colors truncate">
                    {{ agent.email }}
                  </a>
                </div>
              </div>
            </div>

            <!-- Locate on Map Button -->
            <div class="mt-6 pt-4 border-t border-slate-100">
              <button
                (click)="locateAgent(agent)"
                class="w-full py-2 px-3 rounded-xl bg-slate-50 hover:bg-amber-400 hover:text-[#02194b] text-slate-800 text-xs font-bold border border-slate-300 hover:border-[#dd0103] shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer">
                <svg class="w-3.5 h-3.5 text-[#dd0103]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                <span>{{ isRtl() ? 'تحديد الموقع على الخريطة' : 'Locate on Map' }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  `
})
export class AgentsDirectoryComponent {
  service = inject(MaritimeService);
  isRtl = this.service.isRtl;

  selectedCountry = 'all';

  countries = [
    { label: 'All Countries', val: 'all' },
    { label: 'UAE', val: 'UAE' },
    { label: 'Saudi Arabia', val: 'Saudi Arabia' },
    { label: 'India', val: 'India' },
    { label: 'Singapore', val: 'Singapore' },
    { label: 'Egypt', val: 'Egypt' },
    { label: 'China', val: 'China' }
  ];

  filteredAgents = signal<RegionalAgent[]>([]);

  constructor() {
    this.loadAgents();
  }

  filterCountry(country: string) {
    this.selectedCountry = country;
    this.loadAgents();
  }

  loadAgents() {
    this.service.loadAgents(this.selectedCountry).subscribe({
      next: (data) => this.filteredAgents.set(data)
    });
  }

  locateAgent(agent: RegionalAgent) {
    this.service.focusLocationOnMap(
      agent.lat,
      agent.lng,
      10,
      agent.office_name,
      `
        <div style="font-family: inherit; padding: 4px;">
          <div style="font-weight: 800; font-size: 13px; color: #DD0103;">${agent.office_name}</div>
          <div style="font-size: 11px; color: #64748B; margin-bottom: 4px;">${agent.city}, ${agent.country}</div>
          <div style="font-size: 11px; color: #1E293B;">${agent.address}</div>
          <div style="font-size: 11px; color: #DD0103; margin-top: 4px; font-weight: 600;"><b>Tel:</b> ${agent.phone}</div>
        </div>
      `
    );
  }
}
