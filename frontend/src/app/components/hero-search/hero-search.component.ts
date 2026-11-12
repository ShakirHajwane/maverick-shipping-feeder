import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaritimeService } from '../../services/maritime.service';
import { FeederService, VoyageSchedule, Vessel } from '../../models/maritime.models';

@Component({
  selector: 'app-hero-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="relative bg-gradient-to-b from-navy-950 via-navy-900 to-navy-950 pt-16 pb-24 overflow-hidden border-b border-navy-800">
      <!-- Background Ambient Lighting & Grid Elements -->
      <div class="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#00B4D8_1px,transparent_1px)] [background-size:24px_24px]"></div>
      <div class="absolute top-1/4 -left-48 w-96 h-96 bg-ocean-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute bottom-10 -right-48 w-96 h-96 bg-amber-accent/10 rounded-full blur-3xl pointer-events-none"></div>

      <div class="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        <!-- Hero Text Header -->
        <div class="max-w-3xl mb-12">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ocean-500/10 border border-ocean-500/30 text-ocean-400 text-xs font-semibold tracking-wide uppercase mb-4">
            <span class="w-2 h-2 rounded-full bg-ocean-400 animate-pulse"></span>
            <span>{{ isRtl() ? 'الشبكة البحرية الإقليمية الرائدة' : 'Premier Independent Feeder Network' }}</span>
          </div>

          <h1 class="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight mb-5">
            {{ isRtl() ? 'تمكين عمالقة الشحن من خلال الابتكار الملاحي' : 'Empowering Shipping Giants Through Feeder Innovation' }}
          </h1>

          <p class="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            {{ isRtl() 
              ? 'ربط الموانئ المحورية في الخليج العربي والبحر الأحمر وشبه القارة الهندية وجنوب شرق آسيا بأعلى تردد وأدق مواعيد.' 
              : 'Connecting key container hubs across the Arabian Gulf, Red Sea, Indian Subcontinent, and Southeast Asia with high-frequency feeder reliability and precision logistics.' }}
          </p>
        </div>

        <!-- 3-Tab Action Engine Widget (Global Feeders Style) -->
        <div id="tracking-engine" class="bg-navy-900/90 backdrop-blur-xl border border-navy-700/80 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden">
          <!-- Tab Navigation Headers -->
          <div class="grid grid-cols-3 border-b border-navy-700/80 bg-navy-950/70 text-center text-sm font-semibold">
            <!-- Tab 1: Find a Service -->
            <button
              (click)="activeTab.set('service')"
              [class]="activeTab() === 'service' 
                ? 'bg-navy-900 text-ocean-400 border-b-2 border-ocean-400 font-bold py-4 px-4 flex items-center justify-center gap-2 transition-all'
                : 'text-slate-400 hover:text-slate-200 py-4 px-4 flex items-center justify-center gap-2 hover:bg-navy-900/40 transition-all'">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              <span class="truncate">{{ isRtl() ? 'البحث عن خدمة' : 'Find a Service' }}</span>
            </button>

            <!-- Tab 2: Find Schedule -->
            <button
              (click)="activeTab.set('schedule')"
              [class]="activeTab() === 'schedule' 
                ? 'bg-navy-900 text-ocean-400 border-b-2 border-ocean-400 font-bold py-4 px-4 flex items-center justify-center gap-2 transition-all'
                : 'text-slate-400 hover:text-slate-200 py-4 px-4 flex items-center justify-center gap-2 hover:bg-navy-900/40 transition-all'">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span class="truncate">{{ isRtl() ? 'جدول الرحلات' : 'Find Schedule' }}</span>
            </button>

            <!-- Tab 3: Vessel Tracking -->
            <button
              (click)="activeTab.set('tracking')"
              [class]="activeTab() === 'tracking' 
                ? 'bg-navy-900 text-ocean-400 border-b-2 border-ocean-400 font-bold py-4 px-4 flex items-center justify-center gap-2 transition-all'
                : 'text-slate-400 hover:text-slate-200 py-4 px-4 flex items-center justify-center gap-2 hover:bg-navy-900/40 transition-all'">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span class="truncate">{{ isRtl() ? 'تتبع السفينة' : 'Vessel Tracking' }}</span>
            </button>
          </div>

          <!-- Tab Content Area -->
          <div class="p-6 sm:p-8">
            <!-- TAB 1: FIND A SERVICE -->
            <div *ngIf="activeTab() === 'service'" class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div class="md:col-span-2 space-y-1.5">
                  <label class="block text-xs uppercase font-bold text-slate-400 tracking-wider">
                    {{ isRtl() ? 'اختر خط الخدمة الملاحية' : 'Select Feeder Service Code' }}
                  </label>
                  <div class="relative">
                    <select
                      [ngModel]="selectedServiceCode()"
                      (ngModelChange)="onServiceCodeChange($event)"
                      class="w-full bg-navy-950 border border-navy-700 rounded-xl px-4 py-3 text-white font-medium focus:outline-none focus:border-ocean-400 appearance-none cursor-pointer">
                      <option *ngFor="let s of service.services()" [value]="s.code">
                        {{ s.code }} — {{ s.name }} ({{ s.frequency }})
                      </option>
                    </select>
                    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <button
                    (click)="jumpToInteractiveRoute()"
                    class="w-full py-3 px-6 rounded-xl bg-ocean-500 hover:bg-ocean-400 text-navy-950 font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-ocean-500/20 cursor-pointer">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    <span>{{ isRtl() ? 'عرض المسار على الخريطة' : 'View Route on Map' }}</span>
                  </button>
                </div>
              </div>

              <!-- Active Service Preview Card -->
              <div *ngIf="currentService() as cs" class="p-5 rounded-xl bg-navy-950/80 border border-navy-800 space-y-4">
                <div class="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div class="flex items-center gap-2.5">
                      <span class="text-xl font-black text-white">{{ cs.code }}</span>
                      <span class="text-xs px-2.5 py-0.5 rounded-full bg-ocean-500/10 text-ocean-400 border border-ocean-500/20 font-semibold">
                        {{ cs.frequency }}
                      </span>
                      <span class="text-xs px-2.5 py-0.5 rounded-full bg-amber-accent/10 text-amber-accent border border-amber-accent/20 font-semibold">
                        {{ cs.transit_days }} {{ isRtl() ? 'يوم عبور' : 'Days Round Transit' }}
                      </span>
                    </div>
                    <h3 class="text-sm font-semibold text-slate-300 mt-1">{{ cs.name }}</h3>
                  </div>
                  <p class="text-xs text-slate-400 max-w-md">{{ cs.description }}</p>
                </div>

                <!-- Port Call Sequence Timeline -->
                <div class="space-y-1.5 pt-2 border-t border-navy-800">
                  <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">{{ isRtl() ? 'تسلسل الموانئ والدوران:' : 'Port Call Rotation & Hubs:' }}</span>
                  <div class="flex flex-wrap items-center gap-2 pt-1">
                    <ng-container *ngFor="let port of cs.port_rotation; let i = index; let last = last">
                      <div class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-navy-900 border border-navy-700 text-xs">
                        <span class="w-2 h-2 rounded-full bg-ocean-400"></span>
                        <span class="font-bold text-white">{{ port.port_name }}</span>
                        <span class="text-[10px] text-slate-400 font-mono">({{ port.unlocode }})</span>
                        <span *ngIf="port.day_of_week" class="text-[10px] text-ocean-300 bg-navy-950 px-1.5 py-0.5 rounded">
                          {{ port.day_of_week }}
                        </span>
                      </div>
                      <span *ngIf="!last" class="text-slate-500 font-bold">→</span>
                    </ng-container>
                  </div>
                </div>
              </div>
            </div>

            <!-- TAB 2: FIND SCHEDULE -->
            <div *ngIf="activeTab() === 'schedule'" class="space-y-6">
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
                <!-- Port of Loading -->
                <div class="space-y-1.5">
                  <label class="block text-xs uppercase font-bold text-slate-400 tracking-wider">
                    {{ isRtl() ? 'ميناء الشحن (POL)' : 'Port of Loading (POL)' }}
                  </label>
                  <select
                    [ngModel]="schedulePol()"
                    (ngModelChange)="onPolChange($event)"
                    class="w-full bg-navy-950 border border-navy-700 rounded-xl px-4 py-3 text-white font-medium focus:outline-none focus:border-ocean-400 cursor-pointer">
                    <option value="">{{ isRtl() ? 'جميع موانئ الشحن' : 'All Loading Ports' }}</option>
                    <option value="Jebel Ali">Jebel Ali (AEJEA)</option>
                    <option value="Mundra">Mundra (INMUN)</option>
                    <option value="Jeddah">Jeddah (SAJED)</option>
                    <option value="Singapore">Singapore (SGSIN)</option>
                    <option value="Dammam">Dammam (SADMN)</option>
                    <option value="Shuwaikh">Shuwaikh (KWSWK)</option>
                  </select>
                </div>

                <!-- Port of Discharge -->
                <div class="space-y-1.5">
                  <label class="block text-xs uppercase font-bold text-slate-400 tracking-wider">
                    {{ isRtl() ? 'ميناء التفريغ (POD)' : 'Port of Discharge (POD)' }}
                  </label>
                  <select
                    [ngModel]="schedulePod()"
                    (ngModelChange)="onPodChange($event)"
                    class="w-full bg-navy-950 border border-navy-700 rounded-xl px-4 py-3 text-white font-medium focus:outline-none focus:border-ocean-400 cursor-pointer">
                    <option value="">{{ isRtl() ? 'جميع موانئ التفريغ' : 'All Discharge Ports' }}</option>
                    <option value="Mundra">Mundra (INMUN)</option>
                    <option value="Singapore">Singapore (SGSIN)</option>
                    <option value="Sokhna">Ain Sokhna (EGSOK)</option>
                    <option value="Jeddah">Jeddah (SAJED)</option>
                    <option value="Colombo">Colombo (LKCMB)</option>
                    <option value="Nhava Sheva">Nhava Sheva (INNSA)</option>
                    <option value="Fujairah">Fujairah (AEFJR)</option>
                    <option value="Sharjah">Sharjah (AESHJ)</option>
                  </select>
                </div>

                <!-- Action Button -->
                <div>
                  <button
                    (click)="searchSchedules()"
                    class="w-full py-3 px-6 rounded-xl bg-ocean-500 hover:bg-ocean-400 text-navy-950 font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-ocean-500/20 cursor-pointer">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <span>{{ isRtl() ? 'عرض الرحلات المتاحة' : 'Search Schedules' }}</span>
                  </button>
                </div>
              </div>

              <!-- Schedules Result Table -->
              <div class="overflow-x-auto rounded-xl border border-navy-800 bg-navy-950/60">
                <table class="w-full text-left text-xs text-slate-300">
                  <thead class="bg-navy-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-navy-800">
                    <tr>
                      <th class="py-3 px-4 font-bold">{{ isRtl() ? 'اسم السفينة' : 'Vessel' }}</th>
                      <th class="py-3 px-4 font-bold">{{ isRtl() ? 'رقم الرحلة' : 'Voyage No' }}</th>
                      <th class="py-3 px-4 font-bold">{{ isRtl() ? 'الخدمة' : 'Service' }}</th>
                      <th class="py-3 px-4 font-bold">POL</th>
                      <th class="py-3 px-4 font-bold">POD</th>
                      <th class="py-3 px-4 font-bold">ETD</th>
                      <th class="py-3 px-4 font-bold">ETA</th>
                      <th class="py-3 px-4 font-bold">{{ isRtl() ? 'الإغلاق' : 'Cut-off' }}</th>
                      <th class="py-3 px-4 font-bold">{{ isRtl() ? 'الحالة' : 'Status' }}</th>
                      <th class="py-3 px-4 font-bold text-right">{{ isRtl() ? 'إجراء' : 'Action' }}</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-navy-800/80">
                    <tr *ngFor="let s of filteredSchedules()" class="hover:bg-navy-900/50 transition-colors">
                      <td class="py-3 px-4 font-bold text-white flex items-center gap-1.5">
                        <svg class="w-3.5 h-3.5 text-ocean-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span>{{ s.vessel_name }}</span>
                      </td>
                      <td class="py-3 px-4 font-mono font-medium text-ocean-300">{{ s.voyage_no }}</td>
                      <td class="py-3 px-4">
                        <span class="px-2 py-0.5 rounded bg-navy-800 border border-navy-700 text-slate-200 font-mono text-[11px]">
                          {{ s.service_code }}
                        </span>
                      </td>
                      <td class="py-3 px-4 text-slate-200">{{ s.pol }}</td>
                      <td class="py-3 px-4 text-slate-200">{{ s.pod }}</td>
                      <td class="py-3 px-4 font-mono text-slate-300">{{ s.etd | date:'mediumDate' }}</td>
                      <td class="py-3 px-4 font-mono text-ocean-300 font-semibold">{{ s.eta | date:'mediumDate' }}</td>
                      <td class="py-3 px-4 font-mono text-amber-accent/90">{{ s.cutoff_date | date:'mediumDate' }}</td>
                      <td class="py-3 px-4">
                        <span [ngClass]="{
                          'bg-emerald-500/10 text-emerald-400 border-emerald-500/20': s.status === 'On Schedule',
                          'bg-amber-500/10 text-amber-400 border-amber-500/20': s.status === 'In Transit',
                          'bg-ocean-500/10 text-ocean-400 border-ocean-500/20': s.status === 'At Berth'
                        }" class="px-2 py-0.5 rounded-full text-[10px] font-semibold border">
                          {{ s.status }}
                        </span>
                      </td>
                      <td class="py-3 px-4 text-right">
                        <button
                          (click)="trackVesselFromSchedule(s)"
                          class="px-2.5 py-1 rounded bg-navy-800 hover:bg-ocean-500 hover:text-navy-950 text-ocean-400 text-[11px] font-semibold border border-navy-700 transition-all cursor-pointer">
                          {{ isRtl() ? 'تتبع' : 'Track' }}
                        </button>
                      </td>
                    </tr>
                    <tr *ngIf="filteredSchedules().length === 0">
                      <td colspan="10" class="py-6 text-center text-slate-400">
                        {{ isRtl() ? 'لا توجد رحلات مطابقة للمعايير المحددة.' : 'No voyage schedules found for the selected port pair.' }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- TAB 3: VESSEL TRACKING -->
            <div *ngIf="activeTab() === 'tracking'" class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div class="md:col-span-2 space-y-1.5">
                  <label class="block text-xs uppercase font-bold text-slate-400 tracking-wider">
                    {{ isRtl() ? 'اسم السفينة أو رقم المنظمة البحرية (IMO) أو الرحلة' : 'Search Vessel by Name, IMO, or Voyage Number' }}
                  </label>
                  <div class="relative">
                    <input
                      type="text"
                      [ngModel]="vesselSearchQuery()"
                      (ngModelChange)="onVesselSearchChange($event)"
                      placeholder="e.g., GFS RHINE, X-PRESS CAPELLA, 9338278, 2611E..."
                      class="w-full bg-navy-950 border border-navy-700 rounded-xl px-4 py-3 text-white font-medium focus:outline-none focus:border-ocean-400 placeholder-slate-500" />
                    <div class="absolute inset-y-0 right-0 flex items-center px-4 text-slate-400 pointer-events-none">
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <button
                    (click)="findAndFocusVessel()"
                    class="w-full py-3 px-6 rounded-xl bg-ocean-500 hover:bg-ocean-400 text-navy-950 font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-ocean-500/20 cursor-pointer">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    <span>{{ isRtl() ? 'تحديد موقع السفينة' : 'Locate on Live Map' }}</span>
                  </button>
                </div>
              </div>

              <!-- Quick Vessel Chips -->
              <div class="flex flex-wrap items-center gap-2">
                <span class="text-xs font-semibold text-slate-400">{{ isRtl() ? 'سفن سريعة:' : 'Quick Select:' }}</span>
                <button
                  *ngFor="let name of ['GFS RHINE', 'X-PRESS CAPELLA', 'GFS ROJA', 'AL FARAHIDI', 'ACACIA HAWK', 'CALLIOPE']"
                  (click)="quickSelectVessel(name)"
                  class="px-2.5 py-1 rounded-lg bg-navy-950 hover:bg-navy-800 text-xs font-mono text-ocean-300 border border-navy-800 transition-colors">
                  {{ name }}
                </button>
              </div>

              <!-- Live Tracked Vessel Card -->
              <div *ngIf="matchedVessel() as mv" class="p-6 rounded-xl bg-navy-950/80 border border-navy-700 space-y-4">
                <div class="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div class="flex items-center gap-2">
                      <span class="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 beacon-pulse"></span>
                      <h3 class="text-xl font-black text-white">{{ mv.name }}</h3>
                      <span class="text-xs px-2 py-0.5 rounded bg-ocean-500/10 text-ocean-400 border border-ocean-500/20 font-bold">
                        {{ mv.flag }}
                      </span>
                    </div>
                    <p class="text-xs font-mono text-slate-400 mt-1">
                      IMO: {{ mv.imo }} | Call Sign: {{ mv.call_sign }} | Service: {{ mv.service_code }}
                    </p>
                  </div>

                  <div class="flex items-center gap-3">
                    <button
                      (click)="focusOnMatchedVessel()"
                      class="px-4 py-2 rounded-lg bg-ocean-500 hover:bg-ocean-400 text-navy-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md">
                      <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span>{{ isRtl() ? 'عرض في الخريطة الحية' : 'Center on Live Map' }}</span>
                    </button>
                    <button
                      (click)="service.openVesselModal(mv)"
                      class="px-4 py-2 rounded-lg bg-navy-800 hover:bg-navy-700 text-white font-semibold text-xs border border-navy-700 transition-all">
                      {{ isRtl() ? 'المواصفات الفنية (16 نقطة)' : 'Full 16-Pt Specs' }}
                    </button>
                  </div>
                </div>

                <!-- Live Status Metrics Grid -->
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-navy-800">
                  <div class="bg-navy-900/80 p-3 rounded-lg border border-navy-800">
                    <span class="text-[10px] uppercase font-bold text-slate-400 tracking-wider">AIS Status</span>
                    <p class="text-xs font-semibold text-emerald-400 mt-1 truncate">{{ mv.current_status }}</p>
                  </div>
                  <div class="bg-navy-900/80 p-3 rounded-lg border border-navy-800">
                    <span class="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Coordinates</span>
                    <p class="text-xs font-mono font-semibold text-ocean-300 mt-1">
                      {{ mv.current_lat.toFixed(3) }}°N, {{ mv.current_lng.toFixed(3) }}°E
                    </p>
                  </div>
                  <div class="bg-navy-900/80 p-3 rounded-lg border border-navy-800">
                    <span class="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Nominal Capacity</span>
                    <p class="text-xs font-semibold text-white mt-1">{{ mv.nominal_cap_teu }} TEU</p>
                  </div>
                  <div class="bg-navy-900/80 p-3 rounded-lg border border-navy-800">
                    <span class="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Summer Draft</span>
                    <p class="text-xs font-semibold text-amber-accent mt-1">{{ mv.summer_draft }} m</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `
})
export class HeroSearchComponent {
  service = inject(MaritimeService);
  isRtl = this.service.isRtl;

  activeTab = signal<'service' | 'schedule' | 'tracking'>('service');

  // Tab 1 state
  selectedServiceCode = signal<string>('JSA');
  currentService = computed(() => {
    const code = this.selectedServiceCode();
    return this.service.services().find(s => s.code.toUpperCase() === code.toUpperCase()) || this.service.services()[0];
  });

  // Tab 2 state
  schedulePol = signal<string>('');
  schedulePod = signal<string>('');
  filteredSchedules = computed(() => {
    let list = this.service.schedules();
    const pol = this.schedulePol().toLowerCase().trim();
    const pod = this.schedulePod().toLowerCase().trim();
    if (pol) {
      list = list.filter(s => s.pol.toLowerCase().includes(pol));
    }
    if (pod) {
      list = list.filter(s => s.pod.toLowerCase().includes(pod));
    }
    return list;
  });

  // Tab 3 state
  vesselSearchQuery = signal<string>('GFS RHINE');
  matchedVessel = computed(() => {
    const q = this.vesselSearchQuery().toLowerCase().trim();
    if (!q) return this.service.vessels()[0] || null;
    return this.service.vessels().find(v =>
      v.name.toLowerCase().includes(q) ||
      v.imo.includes(q) ||
      (v.service_code && v.service_code.toLowerCase().includes(q))
    ) || this.service.vessels()[0] || null;
  });

  onServiceCodeChange(code: string) {
    this.selectedServiceCode.set(code);
    this.service.selectServiceByCode(code);
  }

  jumpToInteractiveRoute() {
    this.service.selectServiceByCode(this.selectedServiceCode());
    const mapEl = document.getElementById('interactive-map-section');
    if (mapEl) {
      mapEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  onPolChange(val: string) {
    this.schedulePol.set(val);
  }

  onPodChange(val: string) {
    this.schedulePod.set(val);
  }

  searchSchedules() {
    this.service.loadSchedules({
      pol: this.schedulePol() || undefined,
      pod: this.schedulePod() || undefined
    }).subscribe();
  }

  trackVesselFromSchedule(schedule: VoyageSchedule) {
    this.activeTab.set('tracking');
    this.vesselSearchQuery.set(schedule.vessel_name);
    const vessel = this.service.vessels().find(v => v.name.toLowerCase() === schedule.vessel_name.toLowerCase());
    if (vessel) {
      this.service.focusLocationOnMap(vessel.current_lat, vessel.current_lng, 8, vessel.name, `<b>${vessel.name}</b><br/>Status: ${vessel.current_status}`);
    }
  }

  onVesselSearchChange(query: string) {
    this.vesselSearchQuery.set(query);
  }

  quickSelectVessel(name: string) {
    this.vesselSearchQuery.set(name);
  }

  findAndFocusVessel() {
    const vessel = this.matchedVessel();
    if (vessel) {
      this.focusOnMatchedVessel();
    }
  }

  focusOnMatchedVessel() {
    const vessel = this.matchedVessel();
    if (vessel) {
      this.service.focusLocationOnMap(
        vessel.current_lat,
        vessel.current_lng,
        8,
        vessel.name,
        `
          <div style="font-family: inherit; padding: 4px;">
            <div style="font-weight: 800; font-size: 14px; color: #00B4D8;">${vessel.name}</div>
            <div style="font-size: 11px; color: #94A3B8; margin-bottom: 6px;">Flag: ${vessel.flag} | IMO: ${vessel.imo}</div>
            <div style="font-size: 12px; color: #F8FAFC;"><b>Capacity:</b> ${vessel.nominal_cap_teu} TEU</div>
            <div style="font-size: 12px; color: #F8FAFC;"><b>Service:</b> ${vessel.service_code || 'Spot'}</div>
            <div style="font-size: 11px; color: #34D399; margin-top: 4px;"><b>AIS:</b> ${vessel.current_status}</div>
          </div>
        `
      );
    }
  }
}
