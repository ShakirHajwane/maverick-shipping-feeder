import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaritimeService } from '../../services/maritime.service';

@Component({
  selector: 'app-stats-strip',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="relative bg-navy-950 py-12 border-b border-navy-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-8">
        <div class="text-center mb-8">
          <span class="text-xs uppercase font-extrabold tracking-widest text-ocean-400">
            {{ isRtl() ? 'الأرقام والإنجازات التشغيلية' : 'OPERATIONAL SCALE & METRICS' }}
          </span>
          <h2 class="text-2xl sm:text-3xl font-black text-white mt-1">
            {{ isRtl() ? 'شريان لوجستي موثوق عبر أهم الممرات المائية' : 'Powering Global Trade Through Feeder Excellence' }}
          </h2>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <!-- Stat 1: Port Calls -->
          <div class="bg-navy-900/90 border border-navy-800 hover:border-ocean-500/40 rounded-xl p-4 text-center transition-all hover:-translate-y-1 group">
            <div class="w-10 h-10 mx-auto mb-2 rounded-lg bg-ocean-500/10 text-ocean-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div class="text-2xl sm:text-3xl font-black text-white font-mono">{{ stats()?.port_calls || '15.5K' }}</div>
            <div class="text-xs text-slate-400 font-medium mt-1">{{ isRtl() ? 'زيارة ميناء سنوياً' : 'Port Calls / Year' }}</div>
          </div>

          <!-- Stat 2: TEUs / Year -->
          <div class="bg-navy-900/90 border border-navy-800 hover:border-ocean-500/40 rounded-xl p-4 text-center transition-all hover:-translate-y-1 group">
            <div class="w-10 h-10 mx-auto mb-2 rounded-lg bg-amber-accent/10 text-amber-accent flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div class="text-2xl sm:text-3xl font-black text-white font-mono">{{ stats()?.teus_per_year || '2.5M' }}</div>
            <div class="text-xs text-slate-400 font-medium mt-1">{{ isRtl() ? 'حاوية نمطية منقولة' : 'TEUs Handled / Yr' }}</div>
          </div>

          <!-- Stat 3: Vessels Count -->
          <div class="bg-navy-900/90 border border-navy-800 hover:border-ocean-500/40 rounded-xl p-4 text-center transition-all hover:-translate-y-1 group">
            <div class="w-10 h-10 mx-auto mb-2 rounded-lg bg-ocean-500/10 text-ocean-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div class="text-2xl sm:text-3xl font-black text-white font-mono">{{ stats()?.vessels_count || 66 }}</div>
            <div class="text-xs text-slate-400 font-medium mt-1">{{ isRtl() ? 'سفينة في الأسطول' : 'Modern Vessels' }}</div>
          </div>

          <!-- Stat 4: Ports Served -->
          <div class="bg-navy-900/90 border border-navy-800 hover:border-ocean-500/40 rounded-xl p-4 text-center transition-all hover:-translate-y-1 group">
            <div class="w-10 h-10 mx-auto mb-2 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
            </div>
            <div class="text-2xl sm:text-3xl font-black text-white font-mono">{{ stats()?.ports_served || 88 }}</div>
            <div class="text-xs text-slate-400 font-medium mt-1">{{ isRtl() ? 'ميناء مخدوم' : 'Ports Served' }}</div>
          </div>

          <!-- Stat 5: Countries -->
          <div class="bg-navy-900/90 border border-navy-800 hover:border-ocean-500/40 rounded-xl p-4 text-center transition-all hover:-translate-y-1 group">
            <div class="w-10 h-10 mx-auto mb-2 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="text-2xl sm:text-3xl font-black text-white font-mono">{{ stats()?.countries || 54 }}</div>
            <div class="text-xs text-slate-400 font-medium mt-1">{{ isRtl() ? 'دولة متصلة' : 'Countries Connected' }}</div>
          </div>

          <!-- Stat 6: Feeder Services -->
          <div class="bg-navy-900/90 border border-navy-800 hover:border-ocean-500/40 rounded-xl p-4 text-center transition-all hover:-translate-y-1 group">
            <div class="w-10 h-10 mx-auto mb-2 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
              </svg>
            </div>
            <div class="text-2xl sm:text-3xl font-black text-white font-mono">{{ stats()?.feeder_services || 32 }}</div>
            <div class="text-xs text-slate-400 font-medium mt-1">{{ isRtl() ? 'خط خدمة منتظم' : 'Feeder Services' }}</div>
          </div>
        </div>
      </div>
    </section>
  `
})
export class StatsStripComponent {
  service = inject(MaritimeService);
  stats = this.service.stats;
  isRtl = this.service.isRtl;
}
