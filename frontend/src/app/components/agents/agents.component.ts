import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaritimeService } from '../../services/maritime.service';
import { RegionalAgent } from '../../models/maritime.models';

@Component({
  selector: 'app-agents',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="agents-section" class="py-16 bg-navy-950 border-b border-navy-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-8">
        <!-- Section Header -->
        <div class="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold tracking-wide uppercase mb-2">
              <span class="w-2 h-2 rounded-full bg-amber-400"></span>
              <span>{{ isRtl() ? 'المكاتب الإقليمية والوكلاء' : 'GLOBAL COMMERCIAL PRESENCE' }}</span>
            </div>
            <h2 class="text-2xl sm:text-4xl font-black text-white">
              {{ isRtl() ? 'شبكة الوكلاء والمكاتب الإقليمية' : 'Regional Offices & Dedicated Agents' }}
            </h2>
            <p class="text-sm text-slate-400 mt-1 max-w-2xl">
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
                ? 'bg-amber-400 text-slate-950 font-bold border-amber-300 shadow-md shadow-amber-500/20' 
                : 'bg-navy-900 text-slate-300 border-navy-800 hover:border-amber-400/40'"
              class="px-3 py-1.5 rounded-lg text-xs border transition-all cursor-pointer">
              {{ country.label }}
            </button>
          </div>
        </div>

        <!-- Agents Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            *ngFor="let agent of filteredAgents()"
            class="bg-navy-900 border border-navy-800 hover:border-amber-400/40 rounded-2xl p-6 transition-all hover:-translate-y-1 group flex flex-col justify-between shadow-xl">
            
            <div>
              <div class="flex items-center justify-between mb-3">
                <span class="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
                  {{ agent.country }}
                </span>
                <span class="text-xs font-bold text-slate-400 flex items-center gap-1">
                  <svg class="w-3.5 h-3.5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  <span>{{ agent.city }}</span>
                </span>
              </div>

              <h3 class="text-base font-bold text-white group-hover:text-amber-400 transition-colors">
                {{ agent.office_name }}
              </h3>

              <p class="text-xs text-slate-400 mt-2 leading-relaxed">
                {{ agent.address }}
              </p>

              <!-- Contact Info -->
              <div class="mt-4 pt-4 border-t border-navy-800 space-y-2 text-xs">
                <div class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-amber-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <a [href]="'tel:' + agent.phone" class="text-slate-300 hover:text-amber-400 font-mono transition-colors font-medium">
                    {{ agent.phone }}
                  </a>
                </div>

                <div class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-amber-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a [href]="'mailto:' + agent.email" class="text-slate-300 hover:text-amber-400 transition-colors truncate">
                    {{ agent.email }}
                  </a>
                </div>
              </div>
            </div>

            <!-- Locate on Map Button -->
            <div class="mt-6 pt-4 border-t border-navy-800">
              <button
                (click)="locateAgent(agent)"
                class="w-full py-2 px-3 rounded-xl bg-navy-800 hover:bg-amber-400 hover:text-slate-950 text-amber-400 text-xs font-bold border border-navy-700 hover:border-amber-400 transition-all flex items-center justify-center gap-1.5 cursor-pointer">
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
          <div style="font-weight: 800; font-size: 13px; color: #F59E0B;">${agent.office_name}</div>
          <div style="font-size: 11px; color: #94A3B8; margin-bottom: 4px;">${agent.city}, ${agent.country}</div>
          <div style="font-size: 11px; color: #F8FAFC;">${agent.address}</div>
          <div style="font-size: 11px; color: #F59E0B; margin-top: 4px;"><b>Tel:</b> ${agent.phone}</div>
        </div>
      `
    );
  }
}
