import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaritimeService } from '../../services/maritime.service';

@Component({
  selector: 'app-vessel-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      *ngIf="vessel()"
      role="dialog"
      aria-modal="true"
      class="vessel-modal modal fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      
      <!-- Backdrop click to close -->
      <div (click)="close()" class="absolute inset-0"></div>

      <!-- Modal Dialog -->
      <div class="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-navy-900 border border-navy-700 rounded-2xl shadow-2xl z-10 flex flex-col justify-between">
        
        <!-- Modal Header -->
        <div class="p-6 border-b border-navy-800 flex items-center justify-between bg-navy-950/80 sticky top-0 z-10">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-sm">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h3 class="text-xl sm:text-2xl font-black text-white">{{ vessel()?.name }}</h3>
                <span class="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
                  {{ vessel()?.service_code || 'Spot Feeder' }}
                </span>
              </div>
              <p class="text-xs font-mono text-slate-400 mt-0.5">
                IMO: {{ vessel()?.imo }} | Call Sign: {{ vessel()?.call_sign }} | Flag: {{ vessel()?.flag }}
              </p>
            </div>
          </div>

          <button
            (click)="close()"
            class="p-2 rounded-lg bg-navy-800 hover:bg-navy-700 text-slate-400 hover:text-white border border-navy-700 transition-colors cursor-pointer">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Modal Body: 16 Technical Ship Specs Grid -->
        <div class="p-6 space-y-6">
          <!-- AIS Telemetry Alert Banner -->
          <div class="p-4 rounded-xl bg-navy-950 border border-navy-800 flex flex-wrap items-center justify-between gap-4">
            <div class="flex items-center gap-3">
              <span class="w-3 h-3 rounded-full bg-emerald-400 beacon-pulse"></span>
              <div>
                <span class="text-[10px] uppercase font-bold text-slate-400">Live AIS Transponder Telemetry</span>
                <p class="text-xs font-semibold text-emerald-400">{{ vessel()?.current_status }}</p>
              </div>
            </div>
            <div class="text-xs font-mono text-slate-300">
              Coordinates: <span class="text-amber-300 font-bold">{{ vessel()?.current_lat?.toFixed(3) }}°N, {{ vessel()?.current_lng?.toFixed(3) }}°E</span>
            </div>
          </div>

          <!-- Section: 16 Technical Specs Header -->
          <div>
            <h4 class="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-1.5">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span>{{ isRtl() ? 'المواصفات الفنية المعتمدة (16 نقطة فنية)' : 'Comprehensive 16-Point Vessel Specifications' }}</span>
            </h4>

            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <!-- Spec 1: Vessel Name -->
              <div class="p-3 bg-navy-950 rounded-xl border border-navy-800">
                <span class="block text-[10px] uppercase text-slate-400 font-bold">1. Vessel Name</span>
                <span class="font-bold text-white text-sm mt-1 block truncate">{{ vessel()?.name }}</span>
              </div>

              <!-- Spec 2: IMO Number -->
              <div class="p-3 bg-navy-950 rounded-xl border border-navy-800">
                <span class="block text-[10px] uppercase text-slate-400 font-bold">2. IMO Number</span>
                <span class="font-mono font-bold text-amber-400 text-sm mt-1 block">{{ vessel()?.imo }}</span>
              </div>

              <!-- Spec 3: Call Sign -->
              <div class="p-3 bg-navy-950 rounded-xl border border-navy-800">
                <span class="block text-[10px] uppercase text-slate-400 font-bold">3. Radio Call Sign</span>
                <span class="font-mono font-bold text-white text-sm mt-1 block">{{ vessel()?.call_sign }}</span>
              </div>

              <!-- Spec 4: Flag -->
              <div class="p-3 bg-navy-950 rounded-xl border border-navy-800">
                <span class="block text-[10px] uppercase text-slate-400 font-bold">4. Flag State</span>
                <span class="font-bold text-white text-sm mt-1 block">{{ vessel()?.flag }}</span>
              </div>

              <!-- Spec 5: Built Year -->
              <div class="p-3 bg-navy-950 rounded-xl border border-navy-800">
                <span class="block text-[10px] uppercase text-slate-400 font-bold">5. Year of Build</span>
                <span class="font-bold text-white text-sm mt-1 block font-mono">{{ vessel()?.built_year }}</span>
              </div>

              <!-- Spec 6: Port of Registry -->
              <div class="p-3 bg-navy-950 rounded-xl border border-navy-800">
                <span class="block text-[10px] uppercase text-slate-400 font-bold">6. Port of Registry</span>
                <span class="font-bold text-white text-sm mt-1 block">{{ vessel()?.port_of_registry }}</span>
              </div>

              <!-- Spec 7: Nominal Cap -->
              <div class="p-3 bg-navy-950 rounded-xl border border-navy-800">
                <span class="block text-[10px] uppercase text-slate-400 font-bold">7. Nominal Cap (TEU)</span>
                <span class="font-mono font-black text-amber-400 text-sm mt-1 block">{{ vessel()?.nominal_cap_teu }} TEU</span>
              </div>

              <!-- Spec 8: Effective Cap -->
              <div class="p-3 bg-navy-950 rounded-xl border border-navy-800">
                <span class="block text-[10px] uppercase text-slate-400 font-bold">8. 14t Homog Cap</span>
                <span class="font-mono font-bold text-white text-sm mt-1 block">{{ vessel()?.effective_cap_teu }} TEU</span>
              </div>

              <!-- Spec 9: Reefer Plugs -->
              <div class="p-3 bg-navy-950 rounded-xl border border-navy-800">
                <span class="block text-[10px] uppercase text-slate-400 font-bold">9. Reefer Plugs</span>
                <span class="font-mono font-bold text-amber-400 text-sm mt-1 block">{{ vessel()?.reefer_plugs }} Plugs</span>
              </div>

              <!-- Spec 10: Gear -->
              <div class="p-3 bg-navy-950 rounded-xl border border-navy-800">
                <span class="block text-[10px] uppercase text-slate-400 font-bold">10. Cargo Gear / Cranes</span>
                <span class="font-bold text-sm mt-1 block" [ngClass]="vessel()?.gear ? 'text-emerald-400' : 'text-slate-400'">
                  {{ vessel()?.gear ? 'Yes (Geared)' : 'No (Gearless)' }}
                </span>
              </div>

              <!-- Spec 11: Bow Thruster -->
              <div class="p-3 bg-navy-950 rounded-xl border border-navy-800">
                <span class="block text-[10px] uppercase text-slate-400 font-bold">11. Bow Thruster</span>
                <span class="font-bold text-sm mt-1 block" [ngClass]="vessel()?.bow_thruster ? 'text-emerald-400' : 'text-slate-400'">
                  {{ vessel()?.bow_thruster ? 'Fitted (Yes)' : 'Not Fitted' }}
                </span>
              </div>

              <!-- Spec 12: GRT -->
              <div class="p-3 bg-navy-950 rounded-xl border border-navy-800">
                <span class="block text-[10px] uppercase text-slate-400 font-bold">12. Gross Tonnage (GRT)</span>
                <span class="font-mono font-bold text-white text-sm mt-1 block">{{ vessel()?.grt | number }} MT</span>
              </div>

              <!-- Spec 13: NRT -->
              <div class="p-3 bg-navy-950 rounded-xl border border-navy-800">
                <span class="block text-[10px] uppercase text-slate-400 font-bold">13. Net Tonnage (NRT)</span>
                <span class="font-mono font-bold text-white text-sm mt-1 block">{{ vessel()?.nrt | number }} MT</span>
              </div>

              <!-- Spec 14: DWT -->
              <div class="p-3 bg-navy-950 rounded-xl border border-navy-800">
                <span class="block text-[10px] uppercase text-slate-400 font-bold">14. Deadweight (DWT)</span>
                <span class="font-mono font-bold text-amber-400 text-sm mt-1 block">{{ vessel()?.dwt | number }} MT</span>
              </div>

              <!-- Spec 15: LOA & Breadth -->
              <div class="p-3 bg-navy-950 rounded-xl border border-navy-800">
                <span class="block text-[10px] uppercase text-slate-400 font-bold">15. LOA x Breadth</span>
                <span class="font-mono font-bold text-white text-sm mt-1 block">{{ vessel()?.loa }}m x {{ vessel()?.breadth }}m</span>
              </div>

              <!-- Spec 16: Summer Draft -->
              <div class="p-3 bg-navy-950 rounded-xl border border-navy-800">
                <span class="block text-[10px] uppercase text-slate-400 font-bold">16. Summer Draft</span>
                <span class="font-mono font-bold text-amber-400 text-sm mt-1 block">{{ vessel()?.summer_draft }} m</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Footer Actions -->
        <div class="p-6 bg-navy-950/90 border-t border-navy-800 flex flex-wrap items-center justify-between gap-3">
          <div class="text-xs text-slate-400">
            Registered Service Corridor: <span class="text-white font-mono font-semibold">{{ vessel()?.service_code || 'Universal Feeder Deploy' }}</span>
          </div>

          <div class="flex items-center gap-3">
            <button
              (click)="trackOnMap()"
              class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-amber-500/25 cursor-pointer">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{{ isRtl() ? 'تتبع هذه السفينة على الخريطة' : 'Track This Vessel on Map' }}</span>
            </button>

            <button
              (click)="close()"
              class="px-5 py-2.5 rounded-xl bg-navy-800 hover:bg-navy-700 text-white font-semibold text-xs border border-navy-700 transition-colors cursor-pointer">
              {{ isRtl() ? 'إغلاق' : 'Close' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class VesselModalComponent {
  service = inject(MaritimeService);
  vessel = this.service.selectedVessel;
  isRtl = this.service.isRtl;

  close() {
    this.service.closeVesselModal();
  }

  trackOnMap() {
    const v = this.vessel();
    if (v) {
      this.close();
      this.service.focusLocationOnMap(
        v.current_lat,
        v.current_lng,
        8,
        v.name,
        `
          <div style="font-family: inherit; padding: 4px;">
            <div style="font-weight: 800; font-size: 14px; color: #F59E0B;">${v.name}</div>
            <div style="font-size: 11px; color: #94A3B8; margin-bottom: 6px;">Flag: ${v.flag} | IMO: ${v.imo}</div>
            <div style="font-size: 12px; color: #F8FAFC;"><b>Capacity:</b> ${v.nominal_cap_teu} TEU</div>
            <div style="font-size: 12px; color: #F8FAFC;"><b>Service:</b> ${v.service_code || 'Spot'}</div>
            <div style="font-size: 11px; color: #34D399; margin-top: 4px;"><b>AIS:</b> ${v.current_status}</div>
          </div>
        `
      );
    }
  }
}
