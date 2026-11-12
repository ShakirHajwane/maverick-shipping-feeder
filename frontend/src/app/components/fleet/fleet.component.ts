import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaritimeService } from '../../services/maritime.service';
import { Vessel } from '../../models/maritime.models';

@Component({
  selector: 'app-fleet',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section id="fleet-section" class="py-16 bg-white border-b border-slate-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-8">
        <!-- Section Header -->
        <div class="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-700 text-xs font-semibold tracking-wide uppercase mb-2">
              <span class="w-2 h-2 rounded-full bg-amber-500"></span>
              <span>{{ isRtl() ? 'دليل الأسطول البحري' : 'MODERN CONTAINER FLEET' }}</span>
            </div>
            <h2 class="text-2xl sm:text-4xl font-black text-slate-950">
              {{ isRtl() ? 'أسطول متطور ومرن للمسافات الإقليمية' : 'High-Efficiency Feeder Fleet' }}
            </h2>
            <p class="text-sm text-slate-600 mt-1 max-w-2xl">
              {{ isRtl() 
                ? 'سفن حاويات حديثة ومجهزة بروافع ومعدات مناورة متقدمة لخدمة الموانئ الثانوية والرئيسية بأعلى كفاءة.' 
                : 'Equipped for maximum turnaround efficiency, shallow-draft river/canal access, bow thruster maneuverability, and high-density reefer cargo handling.' }}
            </p>
          </div>

          <div class="text-xs font-mono text-slate-600 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm">
            {{ isRtl() ? 'إجمالي السفن المعروضة:' : 'Showing Vessels:' }} <span class="text-amber-700 font-bold">{{ filteredVessels().length }}</span> / {{ service.vessels().length }}
          </div>
        </div>

        <!-- Filter Bar -->
        <div class="bg-slate-50 border border-slate-200 rounded-2xl p-5 mb-8 space-y-4 shadow-sm">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Search Input -->
            <div class="space-y-1">
              <label class="block text-xs uppercase font-bold text-slate-600 tracking-wider">
                {{ isRtl() ? 'بحث بالاسم / IMO / الخدمة' : 'Search Vessel, IMO, or Service' }}
              </label>
              <div class="relative">
                <input
                  type="text"
                  [(ngModel)]="searchQuery"
                  (input)="applyFilters()"
                  placeholder="e.g., GFS, X-PRESS, Liberia, JSA..."
                  class="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 shadow-sm" />
                <div class="absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-400 pointer-events-none">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <!-- Flag Dropdown -->
            <div class="space-y-1">
              <label class="block text-xs uppercase font-bold text-slate-600 tracking-wider">
                {{ isRtl() ? 'علم الدولة (Flag)' : 'Flag of Registry' }}
              </label>
              <select
                [(ngModel)]="selectedFlag"
                (change)="applyFilters()"
                class="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-amber-500 shadow-sm cursor-pointer">
                <option value="all">{{ isRtl() ? 'جميع الأعلام' : 'All Flags' }}</option>
                <option value="Liberia">Liberia</option>
                <option value="Singapore">Singapore</option>
                <option value="Panama">Panama</option>
                <option value="Cyprus">Cyprus</option>
                <option value="UAE">UAE</option>
                <option value="Malta">Malta</option>
              </select>
            </div>

            <!-- Capacity Tier Pills -->
            <div class="space-y-1">
              <label class="block text-xs uppercase font-bold text-slate-600 tracking-wider">
                {{ isRtl() ? 'فئة السعة (TEU Tier)' : 'Capacity Tier' }}
              </label>
              <div class="flex items-center gap-1.5 pt-0.5">
                <button
                  (click)="setCapacityTier('all')"
                  [class]="capacityTier === 'all' 
                    ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold border-amber-300 shadow-md shadow-amber-500/20' 
                    : 'bg-white text-slate-600 border-slate-300 hover:text-slate-900 shadow-sm'"
                  class="flex-1 py-2 px-2 rounded-lg text-[11px] border transition-all text-center cursor-pointer">
                  {{ isRtl() ? 'الكل' : 'All' }}
                </button>
                <button
                  (click)="setCapacityTier('under_1500')"
                  [class]="capacityTier === 'under_1500' 
                    ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold border-amber-300 shadow-md shadow-amber-500/20' 
                    : 'bg-white text-slate-600 border-slate-300 hover:text-slate-900 shadow-sm'"
                  class="flex-1 py-2 px-2 rounded-lg text-[11px] border transition-all text-center cursor-pointer">
                  &lt; 1500 TEU
                </button>
                <button
                  (click)="setCapacityTier('1500_to_8000')"
                  [class]="capacityTier === '1500_to_8000' 
                    ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold border-amber-300 shadow-md shadow-amber-500/20' 
                    : 'bg-white text-slate-600 border-slate-300 hover:text-slate-900 shadow-sm'"
                  class="flex-1 py-2 px-2 rounded-lg text-[11px] border transition-all text-center cursor-pointer">
                  1500 - 8000 TEU
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Vessel Cards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            *ngFor="let vessel of filteredVessels()"
            class="bg-white border border-slate-200 hover:border-amber-400/80 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all hover:-translate-y-1 group flex flex-col justify-between">
            
            <!-- Card Top: Visual Graphic & Badges -->
            <div class="p-6 pb-4">
              <div class="flex items-center justify-between mb-3">
                <span class="text-xs px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-bold font-mono">
                  {{ vessel.service_code || 'Spot Feeder' }}
                </span>
                <span class="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <span class="w-2 h-2 rounded-full" [ngClass]="vessel.current_status.includes('Underway') ? 'bg-emerald-500' : 'bg-amber-500'"></span>
                  <span>{{ vessel.built_year }} Built</span>
                </span>
              </div>

              <!-- Vessel Title & IMO -->
              <h3 class="text-xl font-black text-slate-950 group-hover:text-amber-700 transition-colors">
                {{ vessel.name }}
              </h3>
              <p class="text-xs font-mono text-slate-500 mt-0.5">
                IMO: {{ vessel.imo }} | Call Sign: {{ vessel.call_sign }}
              </p>

              <!-- Vessel Graphic Schematic Representation -->
              <div class="my-4 h-24 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center p-3 relative overflow-hidden">
                <!-- Water wave styling -->
                <div class="absolute bottom-0 inset-x-0 h-4 bg-gradient-to-t from-amber-500/10 to-transparent"></div>
                <svg class="w-full h-16 text-slate-400 group-hover:text-amber-500/80 transition-colors" viewBox="0 0 300 80" fill="none">
                  <!-- Container Stacks -->
                  <rect x="50" y="25" width="22" height="15" rx="1" fill="currentColor" fill-opacity="0.3" stroke="currentColor" stroke-width="1.2"/>
                  <rect x="74" y="20" width="22" height="20" rx="1" fill="currentColor" fill-opacity="0.5" stroke="currentColor" stroke-width="1.2"/>
                  <rect x="98" y="15" width="22" height="25" rx="1" fill="#F59E0B" fill-opacity="0.7" stroke="currentColor" stroke-width="1.2"/>
                  <rect x="122" y="20" width="22" height="20" rx="1" fill="currentColor" fill-opacity="0.4" stroke="currentColor" stroke-width="1.2"/>
                  <rect x="146" y="15" width="22" height="25" rx="1" fill="currentColor" fill-opacity="0.6" stroke="currentColor" stroke-width="1.2"/>
                  <rect x="170" y="25" width="22" height="15" rx="1" fill="#FBBF24" fill-opacity="0.7" stroke="currentColor" stroke-width="1.2"/>
                  <!-- Bridge Tower -->
                  <polygon points="210,40 215,10 235,10 238,40" fill="currentColor" fill-opacity="0.8"/>
                  <rect x="220" y="14" width="10" height="4" fill="#0F172A"/>
                  <!-- Ship Hull -->
                  <path d="M20,42 L250,42 L240,65 L55,65 Z" fill="currentColor" fill-opacity="0.85"/>
                  <line x1="15" y1="65" x2="285" y2="65" stroke="#F59E0B" stroke-width="2" stroke-dasharray="4,4"/>
                </svg>
              </div>

              <!-- 6 Core Metrics Grid -->
              <div class="grid grid-cols-3 gap-2.5 text-center text-xs pt-1">
                <div class="bg-slate-50 p-2 rounded-lg border border-slate-200">
                  <span class="block text-[10px] uppercase font-bold text-slate-500">Flag</span>
                  <span class="font-bold text-slate-900 text-xs mt-0.5 truncate block">{{ vessel.flag }}</span>
                </div>
                <div class="bg-slate-50 p-2 rounded-lg border border-slate-200">
                  <span class="block text-[10px] uppercase font-bold text-slate-500">Nominal Cap</span>
                  <span class="font-bold text-amber-700 font-mono text-xs mt-0.5 block">{{ vessel.nominal_cap_teu }} TEU</span>
                </div>
                <div class="bg-slate-50 p-2 rounded-lg border border-slate-200">
                  <span class="block text-[10px] uppercase font-bold text-slate-500">GRT</span>
                  <span class="font-semibold text-slate-800 font-mono text-xs mt-0.5 block">{{ vessel.grt | number }}</span>
                </div>
                <div class="bg-slate-50 p-2 rounded-lg border border-slate-200">
                  <span class="block text-[10px] uppercase font-bold text-slate-500">NRT</span>
                  <span class="font-semibold text-slate-800 font-mono text-xs mt-0.5 block">{{ vessel.nrt | number }}</span>
                </div>
                <div class="bg-slate-50 p-2 rounded-lg border border-slate-200">
                  <span class="block text-[10px] uppercase font-bold text-slate-500">DWT</span>
                  <span class="font-semibold text-amber-700 font-mono text-xs mt-0.5 block">{{ vessel.dwt | number }}</span>
                </div>
                <div class="bg-slate-50 p-2 rounded-lg border border-slate-200">
                  <span class="block text-[10px] uppercase font-bold text-slate-500">LOA</span>
                  <span class="font-semibold text-slate-800 font-mono text-xs mt-0.5 block">{{ vessel.loa }} m</span>
                </div>
              </div>
            </div>

            <!-- Card Bottom: Actions -->
            <div class="p-4 bg-slate-50 border-t border-slate-200 flex items-center gap-2.5">
              <button
                (click)="service.openVesselModal(vessel)"
                class="flex-1 py-2 px-3 rounded-xl bg-white hover:bg-amber-400 hover:text-slate-950 text-slate-800 font-semibold text-xs border border-slate-300 hover:border-amber-400 shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer">
                <svg class="w-3.5 h-3.5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{{ isRtl() ? 'المزيد من المعلومات (16 مواصفة)' : 'More Info' }}</span>
              </button>

              <button
                (click)="trackVessel(vessel)"
                class="py-2 px-3 rounded-xl bg-amber-50 hover:bg-amber-400 text-amber-800 hover:text-slate-950 font-bold text-xs border border-amber-300 shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                [title]="isRtl() ? 'تتبع على الخريطة' : 'Track on Map'">
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div *ngIf="filteredVessels().length === 0" class="p-12 text-center text-slate-500 bg-slate-50 rounded-2xl border border-slate-200 mt-6 shadow-sm">
          <p class="text-base font-medium">{{ isRtl() ? 'لا توجد سفن مطابقة لمعايير البحث الحالية.' : 'No vessels match the specified filters.' }}</p>
          <button (click)="resetFilters()" class="mt-3 text-xs text-amber-700 font-semibold underline cursor-pointer">{{ isRtl() ? 'إعادة ضبط الفلاتر' : 'Reset all filters' }}</button>
        </div>
      </div>
    </section>
  `
})
export class FleetDirectoryComponent {
  service = inject(MaritimeService);
  isRtl = this.service.isRtl;

  searchQuery = '';
  selectedFlag = 'all';
  capacityTier: 'all' | 'under_1500' | '1500_to_8000' = 'all';

  filteredVessels = signal<Vessel[]>([]);

  constructor() {
    this.applyFilters();
  }

  setCapacityTier(tier: 'all' | 'under_1500' | '1500_to_8000') {
    this.capacityTier = tier;
    this.applyFilters();
  }

  applyFilters() {
    this.service.loadVessels(this.searchQuery, this.selectedFlag, this.capacityTier).subscribe({
      next: (data) => this.filteredVessels.set(data)
    });
  }

  resetFilters() {
    this.searchQuery = '';
    this.selectedFlag = 'all';
    this.capacityTier = 'all';
    this.applyFilters();
  }

  trackVessel(vessel: Vessel) {
    this.service.focusLocationOnMap(
      vessel.current_lat,
      vessel.current_lng,
      8,
      vessel.name,
      `
        <div style="font-family: inherit; padding: 4px;">
          <div style="font-weight: 800; font-size: 14px; color: #D97706;">${vessel.name}</div>
          <div style="font-size: 11px; color: #64748B; margin-bottom: 6px;">Flag: ${vessel.flag} | IMO: ${vessel.imo}</div>
          <div style="font-size: 12px; color: #1E293B;"><b>Capacity:</b> ${vessel.nominal_cap_teu} TEU</div>
          <div style="font-size: 12px; color: #1E293B;"><b>Service:</b> ${vessel.service_code || 'Spot'}</div>
          <div style="font-size: 11px; color: #059669; margin-top: 4px; font-weight: 600;"><b>AIS:</b> ${vessel.current_status}</div>
        </div>
      `
    );
  }
}
