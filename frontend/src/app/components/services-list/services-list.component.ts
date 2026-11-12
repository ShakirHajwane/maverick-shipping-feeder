import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaritimeService } from '../../services/maritime.service';
import { FeederService } from '../../models/maritime.models';

@Component({
  selector: 'app-services-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="services-section" class="py-16 bg-navy-950 border-b border-navy-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-8">
        <!-- Section Header -->
        <div class="flex flex-wrap items-end justify-between gap-4 mb-10">
          <div>
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ocean-500/10 border border-ocean-500/30 text-ocean-400 text-xs font-semibold tracking-wide uppercase mb-2">
              <span class="w-2 h-2 rounded-full bg-ocean-400"></span>
              <span>{{ isRtl() ? 'شبكة الخطوط والخدمات المنتظمة' : 'FEEDER NETWORK CORRIDORS' }}</span>
            </div>
            <h2 class="text-2xl sm:text-4xl font-black text-white">
              {{ isRtl() ? 'خطوط ملاحية عالية التردد والاعتمادية' : 'Scheduled Feeder Corridors' }}
            </h2>
            <p class="text-sm text-slate-400 mt-1 max-w-2xl">
              {{ isRtl() 
                ? 'رحلات أسبوعية ومنتظمة تضمن استمرارية سلاسل التوريد وسرعة مناولة الحاويات بين موانئ الخليج والبحر الأحمر وجنوب آسيا.' 
                : 'Connecting regional secondary ports with mother vessel deep-sea terminals at Jebel Ali, Mundra, and Singapore.' }}
            </p>
          </div>
        </div>

        <!-- Services Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            *ngFor="let s of service.services()"
            class="bg-navy-900 border border-navy-800 hover:border-ocean-500/50 rounded-2xl p-6 transition-all hover:-translate-y-1 group flex flex-col justify-between shadow-xl">
            
            <div>
              <!-- Header Badges -->
              <div class="flex items-center justify-between mb-4">
                <span class="text-lg font-black text-white font-mono bg-navy-950 px-3 py-1 rounded-lg border border-navy-800 group-hover:border-ocean-400/50 transition-colors">
                  {{ s.code }}
                </span>
                <div class="flex items-center gap-2">
                  <span class="text-xs px-2.5 py-0.5 rounded-full bg-ocean-500/10 text-ocean-400 border border-ocean-500/20 font-semibold">
                    {{ s.frequency }}
                  </span>
                  <span class="text-xs px-2.5 py-0.5 rounded-full bg-amber-accent/10 text-amber-accent border border-amber-accent/20 font-semibold font-mono">
                    {{ s.transit_days }}d
                  </span>
                </div>
              </div>

              <h3 class="text-base font-bold text-white group-hover:text-ocean-400 transition-colors">
                {{ s.name }}
              </h3>

              <p class="text-xs text-slate-400 mt-2 leading-relaxed">
                {{ s.description }}
              </p>

              <!-- Rotation Pills -->
              <div class="mt-4 pt-4 border-t border-navy-800/80">
                <span class="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-2">Rotation Ports</span>
                <div class="flex flex-wrap gap-1.5">
                  <span
                    *ngFor="let port of s.port_rotation"
                    class="text-[11px] px-2 py-0.5 rounded bg-navy-950 border border-navy-800 text-slate-300 font-medium flex items-center gap-1">
                    <span class="w-1.5 h-1.5 rounded-full bg-ocean-400"></span>
                    <span>{{ port.port_name }}</span>
                  </span>
                </div>
              </div>
            </div>

            <!-- View on Map CTA -->
            <div class="mt-6 pt-4 border-t border-navy-800 flex items-center justify-between">
              <span class="text-xs text-slate-500">{{ s.port_rotation?.length || 0 }} Port Calls</span>
              <button
                (click)="activateRoute(s)"
                class="px-3.5 py-1.5 rounded-lg bg-navy-800 hover:bg-ocean-500 hover:text-navy-950 text-ocean-400 text-xs font-bold border border-navy-700 transition-all flex items-center gap-1.5 cursor-pointer">
                <span>{{ isRtl() ? 'عرض المسار' : 'View on Map' }}</span>
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  `
})
export class ServicesListComponent {
  service = inject(MaritimeService);
  isRtl = this.service.isRtl;

  activateRoute(s: FeederService) {
    this.service.selectService(s);
    const mapEl = document.getElementById('interactive-map-section');
    if (mapEl) {
      mapEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
}
