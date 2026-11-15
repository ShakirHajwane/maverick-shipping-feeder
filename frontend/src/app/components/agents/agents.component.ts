import { Component, ElementRef, ViewChild, inject, signal, computed, AfterViewInit, OnDestroy, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaritimeService } from '../../services/maritime.service';
import { RegionalAgent } from '../../models/maritime.models';

interface PortRadarPreset {
  id: string;
  name: string;
  fullName: string;
  countryVal: string;
  coords: string;
  depth: string;
  clearance: string;
  tideState: string;
  tideHeight: string;
  current: string;
  vesselCount: number;
}

@Component({
  selector: 'app-agents',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="agents-section" class="py-16 bg-white border-b border-slate-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-8">
        <!-- Section Header -->
        <div class="flex flex-wrap items-end justify-between gap-4 mb-6">
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

          <!-- View Mode Switcher & Offices Count -->
          <div class="flex flex-wrap items-center gap-3">
            <div class="inline-flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-inner">
              <button
                (click)="setViewMode('carousel')"
                [class]="viewMode() === 'carousel' ? 'bg-white text-[#02194b] font-bold shadow-sm' : 'text-slate-600 hover:text-slate-900'"
                class="px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-all cursor-pointer">
                <svg class="w-3.5 h-3.5 text-[#dd0103]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                </svg>
                <span>{{ isRtl() ? 'عرض المنزلق' : 'Carousel Slider' }}</span>
              </button>
              <button
                (click)="setViewMode('grid')"
                [class]="viewMode() === 'grid' ? 'bg-white text-[#02194b] font-bold shadow-sm' : 'text-slate-600 hover:text-slate-900'"
                class="px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-all cursor-pointer">
                <svg class="w-3.5 h-3.5 text-[#dd0103]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                <span>{{ isRtl() ? 'شبكة مدمجة' : 'Compact Grid' }}</span>
              </button>
              <button
                (click)="setViewMode('list')"
                [class]="viewMode() === 'list' ? 'bg-white text-[#02194b] font-bold shadow-sm' : 'text-slate-600 hover:text-slate-900'"
                class="hidden sm:flex px-3 py-1.5 rounded-lg text-xs items-center gap-1.5 transition-all cursor-pointer">
                <svg class="w-3.5 h-3.5 text-[#dd0103]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <span>{{ isRtl() ? 'قائمة المكاتب' : 'Directory List' }}</span>
              </button>
            </div>

            <!-- Total Count Badge -->
            <div class="text-xs font-mono text-slate-600 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl shadow-xs">
              {{ isRtl() ? 'المكاتب:' : 'Offices:' }} <span class="text-[#dd0103] font-bold">{{ filteredAgents().length }}</span> / {{ service.agents().length }}
            </div>
          </div>
        </div>

        <!-- =========================================================
             INNOVATIVE GLOBAL PORT TIDE SONAR & FAIRWAY APPROACH RADAR
             Interactive Graphic Canvas: Live Port Tides, Currents & Fairway Traffic
             ========================================================= -->
        <div class="mb-8 rounded-2xl sm:rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl overflow-hidden relative text-white" style="content-visibility: auto; contain-intrinsic-size: auto none auto 380px;">
          <!-- Header Bar with Live Indicator & Selected Port -->
          <div class="p-4 sm:p-5 border-b border-slate-800/80 bg-slate-900/90 flex flex-wrap items-center justify-between gap-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center shrink-0 shadow-inner">
                <span class="text-xl">📡</span>
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <span class="text-[10px] font-mono font-bold uppercase tracking-wider text-sky-400 bg-sky-950/80 px-2 py-0.5 rounded border border-sky-800/60">
                    PORT APPROACH RADAR & TIDE STATION
                  </span>
                  <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span class="text-[10px] font-mono text-emerald-400 font-bold">FAIRWAY TELEMETRY ONLINE</span>
                </div>
                <h3 class="text-sm sm:text-base font-black text-white mt-0.5">
                  {{ isRtl() ? 'رادار الميناء الحي وأرصاد المد والجزر والتيارات' : 'Global Port Tide Radar & Harborside Ocean Current Telemetry' }}
                </h3>
              </div>
            </div>

            <!-- Port Selection Buttons -->
            <div class="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <button
                *ngFor="let port of portRadarPresets"
                type="button"
                (click)="selectRadarPort(port.id)"
                [class]="selectedPortId() === port.id ? 'bg-[#dd0103] text-white font-bold shadow-md shadow-red-900/30' : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700/80'"
                class="px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer border border-slate-700/60">
                {{ port.name }}
              </button>
            </div>
          </div>

          <!-- Radar & Tide Basin Canvas -->
          <div class="relative w-full h-[280px] sm:h-[320px] bg-gradient-to-b from-[#030e22] via-[#021330] to-[#010816] overflow-hidden">
            <canvas #radarCanvas class="w-full h-full block cursor-crosshair"></canvas>

            <!-- Floating Port Telemetry HUD Cards -->
            <div class="absolute top-3 left-3 flex flex-col gap-2 pointer-events-none">
              <div class="bg-slate-900/85 backdrop-blur-md border border-slate-700/70 rounded-xl px-3 py-2 shadow-lg text-xs font-mono">
                <div class="text-[10px] text-slate-400 uppercase tracking-wider">ACTIVE PORT STATION</div>
                <div class="text-white font-bold text-sm text-sky-400">{{ activePortData().fullName }}</div>
                <div class="text-[11px] text-slate-300">{{ activePortData().coords }}</div>
              </div>
            </div>

            <div class="absolute top-3 right-3 flex flex-col gap-2 pointer-events-none">
              <div class="bg-slate-900/85 backdrop-blur-md border border-slate-700/70 rounded-xl px-3 py-2 shadow-lg text-xs font-mono text-right">
                <div class="text-[10px] text-slate-400 uppercase tracking-wider">WATER DEPTH & CLEARANCE</div>
                <div class="text-emerald-400 font-bold text-sm">{{ activePortData().depth }} CD</div>
                <div class="text-[11px] text-slate-300">{{ activePortData().clearance }}</div>
              </div>
            </div>

            <!-- Bottom Telemetry HUD Ribbon -->
            <div class="absolute bottom-2 inset-x-2 sm:inset-x-4 bg-slate-950/85 backdrop-blur-md border border-slate-800/90 rounded-xl p-2.5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
              <div class="flex items-center gap-4">
                <div>
                  <span class="text-slate-400 text-[10px] uppercase">TIDAL PHASE:</span>
                  <span class="ml-1.5 text-sky-400 font-bold">{{ activePortData().tideState }}</span>
                </div>
                <div>
                  <span class="text-slate-400 text-[10px] uppercase">WATER ELEVATION:</span>
                  <span class="ml-1.5 text-emerald-400 font-bold">{{ activePortData().tideHeight }}</span>
                </div>
                <div class="hidden sm:block">
                  <span class="text-slate-400 text-[10px] uppercase">CURRENT VECTOR:</span>
                  <span class="ml-1.5 text-amber-400 font-bold">{{ activePortData().current }}</span>
                </div>
              </div>

              <div class="flex items-center gap-3">
                <div class="text-slate-400 text-[10px] hidden md:block">
                  VESSELS IN FAIRWAY: <span class="text-white font-bold">{{ activePortData().vesselCount }} DETECTED</span>
                </div>
                <button
                  type="button"
                  (click)="filterCountry(activePortData().countryVal)"
                  class="px-2.5 py-1 rounded bg-sky-600 hover:bg-sky-500 text-white text-[11px] font-bold cursor-pointer transition-all shadow-xs">
                  {{ isRtl() ? 'عرض مكاتب هذا الميناء' : 'Filter Offices For This Port' }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Country Filter Pills Bar -->
        <div class="flex flex-wrap items-center gap-2 mb-6">
          <button
            *ngFor="let country of countries"
            (click)="filterCountry(country.val)"
            [class]="selectedCountry === country.val 
              ? 'bg-[#dd0103] text-white font-bold border-[#dd0103] shadow-md shadow-red-600/20' 
              : 'bg-slate-50 text-slate-700 border-slate-300 hover:border-[#dd0103] hover:text-[#02194b] shadow-xs'"
            class="px-3.5 py-1.5 rounded-xl text-xs border transition-all cursor-pointer">
            {{ country.label }}
          </button>
        </div>

        <!-- =========================================================
             VIEW 1: CAROUSEL SLIDER (DEFAULT • ZERO SCROLL CLUTTER)
             ========================================================= -->
        <div *ngIf="viewMode() === 'carousel'" class="relative space-y-4">
          <!-- Slider Navigation Header -->
          <div class="flex items-center justify-between px-1">
            <div class="flex items-center gap-2">
              <span class="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                {{ isRtl() ? 'المكتب' : 'Office' }} <span class="text-[#dd0103]">{{ activeCarouselIndex() + 1 }}</span> / {{ filteredAgents().length }}
              </span>
              <span class="hidden sm:inline-block text-[11px] text-slate-500">
                {{ isRtl() ? 'مرر أفقياً أو اضغط الأسهم للوصول للمكتب المطلوب' : 'Swipe horizontally or use arrows to navigate regional desks' }}
              </span>
            </div>

            <div class="flex items-center gap-2">
              <button
                (click)="scrollPrev()"
                [disabled]="activeCarouselIndex() === 0"
                class="w-8 h-8 rounded-full bg-white hover:bg-slate-50 disabled:opacity-35 disabled:cursor-not-allowed border border-slate-300 shadow-sm flex items-center justify-center text-[#02194b] hover:text-[#dd0103] transition-all cursor-pointer"
                [attr.aria-label]="isRtl() ? 'السابق' : 'Previous office'">
                <svg class="w-4 h-4" [class.rotate-180]="isRtl()" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                (click)="scrollNext()"
                [disabled]="activeCarouselIndex() >= filteredAgents().length - 1"
                class="w-8 h-8 rounded-full bg-white hover:bg-slate-50 disabled:opacity-35 disabled:cursor-not-allowed border border-slate-300 shadow-sm flex items-center justify-center text-[#02194b] hover:text-[#dd0103] transition-all cursor-pointer"
                [attr.aria-label]="isRtl() ? 'التالي' : 'Next office'">
                <svg class="w-4 h-4" [class.rotate-180]="isRtl()" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Horizontal Smooth Snap Carousel Track -->
          <div
            #agentSlider
            (scroll)="onSliderScroll($event)"
            class="flex overflow-x-auto snap-x snap-mandatory scrollbar-none gap-4 sm:gap-6 pb-4 pt-1 px-1 scroll-smooth">
            <div
              *ngFor="let agent of filteredAgents()"
              class="w-[85vw] sm:w-[340px] lg:w-[360px] shrink-0 snap-start bg-white border border-slate-200 hover:border-[#dd0103]/80 rounded-2xl p-5 transition-all hover:-translate-y-1 group flex flex-col justify-between shadow-md hover:shadow-xl">
              <ng-container *ngTemplateOutlet="agentCard; context: { agent: agent }" />
            </div>
          </div>

          <!-- Mobile Swipe Indicator Hint -->
          <div class="sm:hidden flex items-center justify-center gap-1.5 text-[11px] font-mono text-slate-600 pt-1">
            <span class="text-[#dd0103]">←</span>
            <span>{{ isRtl() ? 'مرر أفقياً لتصفح جميع المكاتب' : 'Swipe horizontally to browse offices' }}</span>
            <span class="text-[#dd0103]">→</span>
          </div>
        </div>

        <!-- =========================================================
             VIEW 2: PAGINATED COMPACT GRID (6 PER PAGE • CLEAN HEIGHT)
             ========================================================= -->
        <div *ngIf="viewMode() === 'grid'" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              *ngFor="let agent of pagedAgents()"
              class="bg-white border border-slate-200 hover:border-[#dd0103]/80 rounded-2xl p-5 transition-all hover:-translate-y-1 group flex flex-col justify-between shadow-md hover:shadow-xl">
              <ng-container *ngTemplateOutlet="agentCard; context: { agent: agent }" />
            </div>
          </div>

          <!-- Pagination Bar -->
          <div class="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-200">
            <div class="text-xs text-slate-600 font-medium">
              {{ isRtl() ? 'عرض' : 'Showing' }} <span class="font-bold text-[#02194b]">{{ pagedAgents().length }}</span> {{ isRtl() ? 'من أصل' : 'of' }} <span class="font-bold text-[#dd0103]">{{ filteredAgents().length }}</span> {{ isRtl() ? 'مكاتب' : 'offices' }}
            </div>

            <div class="flex items-center gap-2">
              <button
                (click)="goToPage(currentPage() - 1)"
                [disabled]="currentPage() === 1"
                class="px-3 py-1.5 rounded-lg text-xs border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed font-medium text-slate-700 cursor-pointer">
                {{ isRtl() ? 'السابق' : 'Previous' }}
              </button>

              <button
                *ngFor="let p of pageNumbers()"
                (click)="goToPage(p)"
                [class]="currentPage() === p 
                  ? 'bg-[#dd0103] text-white font-bold border-[#dd0103]' 
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'"
                class="w-7 h-7 rounded-lg text-xs border flex items-center justify-center font-mono cursor-pointer transition-colors">
                {{ p }}
              </button>

              <button
                (click)="goToPage(currentPage() + 1)"
                [disabled]="currentPage() >= totalPages()"
                class="px-3 py-1.5 rounded-lg text-xs border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed font-medium text-slate-700 cursor-pointer">
                {{ isRtl() ? 'التالي' : 'Next' }}
              </button>

              <button
                (click)="toggleShowAllGrid()"
                class="ml-2 text-xs font-bold text-[#dd0103] hover:underline cursor-pointer">
                {{ showAllGrid() ? (isRtl() ? 'عرض بالصفحات' : 'Paginate (6/pg)') : (isRtl() ? 'عرض الكل (' + filteredAgents().length + ')' : 'Show All (' + filteredAgents().length + ')') }}
              </button>
            </div>
          </div>
        </div>

        <!-- =========================================================
             VIEW 3: HIGH-DENSITY DIRECTORY LIST VIEW
             ========================================================= -->
        <div *ngIf="viewMode() === 'list'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            *ngFor="let agent of filteredAgents()"
            class="bg-white border border-slate-200 hover:border-[#dd0103] rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex items-center justify-between gap-4 group">
            
            <div class="space-y-1 min-w-0">
              <div class="flex items-center gap-2">
                <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-[#dd0103] border border-red-200">
                  {{ agent.country }}
                </span>
                <span class="text-xs font-bold text-slate-500">{{ agent.city }}</span>
              </div>
              <h3 class="text-sm font-bold text-[#02194b] group-hover:text-[#dd0103] transition-colors truncate">
                {{ agent.office_name }}
              </h3>
              <p class="text-[11px] text-slate-500 truncate">{{ agent.address }}</p>
            </div>

            <!-- Direct Quick Action Buttons -->
            <div class="flex items-center gap-1.5 shrink-0">
              <a
                [href]="'tel:' + agent.phone"
                class="p-2 rounded-xl bg-slate-50 hover:bg-[#dd0103] text-slate-700 hover:text-white border border-slate-200 transition-colors"
                [title]="'Call: ' + agent.phone">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </a>

              <a
                [href]="'mailto:' + agent.email"
                class="p-2 rounded-xl bg-slate-50 hover:bg-[#dd0103] text-slate-700 hover:text-white border border-slate-200 transition-colors"
                [title]="'Email: ' + agent.email">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </a>

              <button
                (click)="locateAgent(agent)"
                class="p-2 rounded-xl bg-red-50 hover:bg-[#dd0103] text-[#dd0103] hover:text-white border border-red-200 transition-colors cursor-pointer"
                [title]="isRtl() ? 'تحديد الموقع على الخريطة' : 'Locate on Map'">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Zero Results Fallback -->
        <div *ngIf="filteredAgents().length === 0" class="p-12 text-center text-slate-500 bg-slate-50 rounded-2xl border border-slate-200 mt-6 shadow-sm">
          <p class="text-base font-medium">{{ isRtl() ? 'لا يوجد وكلاء في الدولة المحددة حالياً.' : 'No agents match the specified country.' }}</p>
          <button (click)="filterCountry('all')" class="mt-3 text-xs text-[#dd0103] font-semibold underline cursor-pointer">{{ isRtl() ? 'عرض جميع الدول' : 'Show all countries' }}</button>
        </div>

      </div>

      <!-- =========================================================
           REUSABLE AGENT CARD TEMPLATE
           ========================================================= -->
      <ng-template #agentCard let-agent="agent">
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

          <p class="text-xs text-slate-500 mt-1.5 leading-relaxed line-clamp-2">
            {{ agent.address }}
          </p>

          <!-- Live Coastal Port Tide Radar Gauge -->
          <div class="mt-2.5 px-2.5 py-1 rounded-lg bg-sky-50 border border-sky-200/80 text-[10px] font-mono text-sky-900 flex items-center justify-between">
            <div class="flex items-center gap-1.5 font-bold">
              <span class="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse"></span>
              <span>{{ getPortTide(agent.city).status }}</span>
            </div>
            <div class="font-bold text-sky-700">
              {{ getPortTide(agent.city).height }} <span class="text-slate-500 font-normal">({{ getPortTide(agent.city).trend }})</span>
            </div>
          </div>

          <!-- Contact Info -->
          <div class="mt-3.5 pt-3 border-t border-slate-100 space-y-1.5 text-xs">
            <div class="flex items-center gap-2">
              <svg class="w-3.5 h-3.5 text-[#dd0103] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <a [href]="'tel:' + agent.phone" class="text-slate-700 hover:text-[#dd0103] font-mono transition-colors font-medium">
                {{ agent.phone }}
              </a>
            </div>

            <div class="flex items-center gap-2">
              <svg class="w-3.5 h-3.5 text-[#dd0103] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <a [href]="'mailto:' + agent.email" class="text-slate-700 hover:text-[#dd0103] transition-colors truncate">
                {{ agent.email }}
              </a>
            </div>
          </div>
        </div>

        <!-- Locate on Map Button -->
        <div class="mt-4 pt-3 border-t border-slate-100">
          <button
            (click)="locateAgent(agent)"
            class="w-full py-2 px-3 rounded-xl bg-slate-50 hover:bg-[#dd0103] hover:text-white text-slate-800 text-xs font-bold border border-slate-300 hover:border-[#dd0103] shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer">
            <svg class="w-3.5 h-3.5 text-[#dd0103] group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            <span>{{ isRtl() ? 'تحديد الموقع على الخريطة' : 'Locate on Map' }}</span>
          </button>
        </div>
      </ng-template>

    </section>
  `
})
export class AgentsDirectoryComponent implements AfterViewInit, OnDestroy {
  service = inject(MaritimeService);
  ngZone = inject(NgZone);
  isRtl = this.service.isRtl;

  @ViewChild('agentSlider') sliderRef?: ElementRef<HTMLDivElement>;
  @ViewChild('radarCanvas') radarCanvasRef!: ElementRef<HTMLCanvasElement>;

  private radarAnimId: number | null = null;
  private radarObserver?: IntersectionObserver;
  private isRadarVisible = false;
  private sweepAngle = 0;
  private currentParticles: Array<{ x: number; y: number; speed: number; size: number; alpha: number }> = [];

  portRadarPresets: PortRadarPreset[] = [
    {
      id: 'dubai',
      name: 'Dubai Jebel Ali',
      fullName: 'Jebel Ali Port Terminal 1 • DP World',
      countryVal: 'UAE',
      coords: '24°59\'N 55°03\'E',
      depth: '17.5m',
      clearance: 'Unrestricted Deep Channel',
      tideState: 'HIGH TIDE (FLOODING)',
      tideHeight: '+2.4m',
      current: '1.2 kn ENE',
      vesselCount: 8
    },
    {
      id: 'singapore',
      name: 'Singapore Keppel',
      fullName: 'PSA Keppel & Pasir Panjang Terminals',
      countryVal: 'Singapore',
      coords: '01°16\'N 103°50\'E',
      depth: '18.0m',
      clearance: 'Deep Water Straits Route',
      tideState: 'EBB TIDE (STAND)',
      tideHeight: '+1.6m',
      current: '2.4 kn SSW',
      vesselCount: 14
    },
    {
      id: 'mumbai',
      name: 'Mumbai Nhava Sheva',
      fullName: 'Jawaharlal Nehru Port Trust (JNPT)',
      countryVal: 'India',
      coords: '18°57\'N 72°57\'E',
      depth: '15.0m',
      clearance: 'Tidal Window Managed',
      tideState: 'SPRING TIDE (PEAK FLOOD)',
      tideHeight: '+4.2m',
      current: '3.1 kn NNE',
      vesselCount: 6
    },
    {
      id: 'jeddah',
      name: 'Jeddah Islamic',
      fullName: 'Red Sea Gateway Terminal (RSGT)',
      countryVal: 'Saudi Arabia',
      coords: '21°28\'N 39°10\'E',
      depth: '16.5m',
      clearance: 'Coral Channel Marked',
      tideState: 'NEAP TIDE (SLACK)',
      tideHeight: '+1.1m',
      current: '0.9 kn NNW',
      vesselCount: 5
    },
    {
      id: 'shanghai',
      name: 'Shanghai Yangshan',
      fullName: 'Yangshan Deepwater Port Terminal 4',
      countryVal: 'China',
      coords: '30°37\'N 122°04\'E',
      depth: '16.8m',
      clearance: 'Automated Fairway Clearance',
      tideState: 'FLOOD TIDE',
      tideHeight: '+3.6m',
      current: '2.7 kn SE',
      vesselCount: 19
    },
    {
      id: 'rotterdam',
      name: 'Rotterdam Maasvlakte',
      fullName: 'ECT Delta & Maasvlakte II',
      countryVal: 'all',
      coords: '51°57\'N 04°02\'E',
      depth: '20.0m',
      clearance: 'Ultra-Large Feeder Clearance',
      tideState: 'EBB TIDE',
      tideHeight: '+1.9m',
      current: '1.6 kn WNW',
      vesselCount: 11
    }
  ];

  selectedPortId = signal<string>('dubai');
  activePortData = computed(() => {
    return this.portRadarPresets.find(p => p.id === this.selectedPortId()) || this.portRadarPresets[0];
  });

  selectRadarPort(id: string) {
    this.selectedPortId.set(id);
  }

  selectedCountry = 'all';
  viewMode = signal<'carousel' | 'grid' | 'list'>('carousel');
  activeCarouselIndex = signal<number>(0);
  currentPage = signal<number>(1);
  showAllGrid = signal<boolean>(false);
  readonly pageSize = 6;

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

  pagedAgents = computed(() => {
    const all = this.filteredAgents();
    if (this.showAllGrid()) return all;
    const start = (this.currentPage() - 1) * this.pageSize;
    return all.slice(start, start + this.pageSize);
  });

  totalPages = computed(() => {
    const total = this.filteredAgents().length;
    return Math.max(1, Math.ceil(total / this.pageSize));
  });

  pageNumbers = computed(() => {
    const count = this.totalPages();
    return Array.from({ length: count }, (_, i) => i + 1);
  });

  constructor() {
    this.loadAgents();
  }

  setViewMode(mode: 'carousel' | 'grid' | 'list') {
    this.viewMode.set(mode);
  }

  filterCountry(country: string) {
    this.selectedCountry = country;
    this.currentPage.set(1);
    this.activeCarouselIndex.set(0);
    this.loadAgents();
  }

  loadAgents() {
    this.service.loadAgents(this.selectedCountry).subscribe({
      next: (data) => {
        this.filteredAgents.set(data);
        this.currentPage.set(1);
        this.activeCarouselIndex.set(0);
      }
    });
  }

  scrollPrev() {
    if (this.sliderRef?.nativeElement) {
      const el = this.sliderRef.nativeElement;
      const cardWidth = el.firstElementChild ? (el.firstElementChild as HTMLElement).offsetWidth + 24 : 340;
      el.scrollBy({ left: -cardWidth, behavior: 'smooth' });
    }
  }

  scrollNext() {
    if (this.sliderRef?.nativeElement) {
      const el = this.sliderRef.nativeElement;
      const cardWidth = el.firstElementChild ? (el.firstElementChild as HTMLElement).offsetWidth + 24 : 340;
      el.scrollBy({ left: cardWidth, behavior: 'smooth' });
    }
  }

  onSliderScroll(event: Event) {
    const target = event.target as HTMLElement;
    if (!target) return;
    const cardWidth = target.firstElementChild ? (target.firstElementChild as HTMLElement).offsetWidth + 24 : 340;
    const idx = Math.round(target.scrollLeft / cardWidth);
    this.activeCarouselIndex.set(Math.max(0, Math.min(this.filteredAgents().length - 1, idx)));
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  toggleShowAllGrid() {
    this.showAllGrid.update(v => !v);
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

  getPortTide(city: string): { status: string; height: string; trend: string } {
    const c = city.toLowerCase();
    if (c.includes('dubai') || c.includes('jebel ali') || c.includes('abu dhabi')) {
      return { status: 'HIGH TIDE', height: '+2.1m', trend: '▲ Rising' };
    } else if (c.includes('singapore')) {
      return { status: 'EBB TIDE', height: '+1.6m', trend: '▼ Slack' };
    } else if (c.includes('jeddah') || c.includes('sokhna')) {
      return { status: 'HIGH TIDE', height: '+1.4m', trend: '▲ Stand' };
    } else if (c.includes('mumbai') || c.includes('mundra') || c.includes('nhava')) {
      return { status: 'SPRING TIDE', height: '+3.8m', trend: '▲ Flood' };
    }
    return { status: 'COASTAL WATER', height: '+1.7m', trend: '• Mean' };
  }

  ngAfterViewInit() {
    this.initRadarCanvas();
  }

  ngOnDestroy() {
    if (this.radarAnimId) {
      cancelAnimationFrame(this.radarAnimId);
      this.radarAnimId = null;
    }
    if (this.radarObserver) {
      this.radarObserver.disconnect();
    }
  }

  private initRadarCanvas() {
    const canvas = this.radarCanvasRef?.nativeElement;
    if (!canvas) return;

    this.currentParticles = [];
    for (let i = 0; i < 40; i++) {
      this.currentParticles.push({
        x: Math.random() * 800,
        y: Math.random() * 320,
        speed: Math.random() * 1.5 + 0.8,
        size: Math.random() * 2 + 1,
        alpha: Math.random() * 0.5 + 0.2
      });
    }

    this.radarObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.isRadarVisible = true;
          this.startRadarLoop();
        } else {
          this.isRadarVisible = false;
          if (this.radarAnimId) {
            cancelAnimationFrame(this.radarAnimId);
            this.radarAnimId = null;
          }
        }
      });
    }, { rootMargin: '100px' });

    this.radarObserver.observe(canvas);
  }

  private startRadarLoop() {
    if (this.radarAnimId) return;

    this.ngZone.runOutsideAngular(() => {
      const render = () => {
        if (!this.isRadarVisible) return;
        this.drawRadarFrame();
        this.radarAnimId = requestAnimationFrame(render);
      };
      this.radarAnimId = requestAnimationFrame(render);
    });
  }

  private drawRadarFrame() {
    const canvas = this.radarCanvasRef?.nativeElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
    }

    ctx.save();
    ctx.scale(dpr, dpr);
    const w = rect.width;
    const h = rect.height;

    // Clear background
    ctx.fillStyle = '#020b1c';
    ctx.fillRect(0, 0, w, h);

    // 1. Draw Harbor Current Streamline Particles
    for (const p of this.currentParticles) {
      p.x += p.speed;
      if (p.x > w + 20) p.x = -20;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(56, 189, 248, ${p.alpha * 0.4})`;
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x - p.speed * 8, p.y);
      ctx.strokeStyle = `rgba(56, 189, 248, ${p.alpha * 0.2})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // 2. Harmonic Tidal Wave Surface across the bottom of the canvas
    const tideData = this.activePortData();
    const isHigh = tideData.tideState.includes('HIGH') || tideData.tideState.includes('SPRING') || tideData.tideState.includes('FLOOD');
    const baseWaveY = h - (isHigh ? 65 : 45);
    const now = performance.now() * 0.002;

    ctx.beginPath();
    ctx.moveTo(0, h);
    for (let x = 0; x <= w; x += 10) {
      const y = baseWaveY + Math.sin(x * 0.012 + now) * 8 + Math.cos(x * 0.024 - now * 1.4) * 4;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(w, h);
    ctx.closePath();
    const waveGrad = ctx.createLinearGradient(0, baseWaveY - 10, 0, h);
    waveGrad.addColorStop(0, 'rgba(14, 165, 233, 0.35)');
    waveGrad.addColorStop(1, 'rgba(2, 25, 75, 0.7)');
    ctx.fillStyle = waveGrad;
    ctx.fill();

    // Waterline datum reference line
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.stroke();
    ctx.setLineDash([]);

    // 3. Central Radar Screen
    const radarCenterX = Math.min(w * 0.35, 180);
    const radarCenterY = h * 0.48;
    const maxRadius = Math.min(radarCenterY - 15, 105);

    // Range rings
    const rings = [0.33, 0.66, 1.0];
    const ringLabels = ['5 NM', '10 NM', '15 NM'];
    ctx.lineWidth = 1;
    for (let i = 0; i < rings.length; i++) {
      const r = maxRadius * rings[i];
      ctx.beginPath();
      ctx.arc(radarCenterX, radarCenterY, r, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
      ctx.stroke();

      ctx.fillStyle = 'rgba(148, 163, 184, 0.6)';
      ctx.font = '9px monospace';
      ctx.fillText(ringLabels[i], radarCenterX + r - 22, radarCenterY - 3);
    }

    // Crosshairs
    ctx.beginPath();
    ctx.moveTo(radarCenterX - maxRadius, radarCenterY);
    ctx.lineTo(radarCenterX + maxRadius, radarCenterY);
    ctx.moveTo(radarCenterX, radarCenterY - maxRadius);
    ctx.lineTo(radarCenterX, radarCenterY + maxRadius);
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.2)';
    ctx.stroke();

    // Rotating Sweep Beam
    this.sweepAngle += 0.028;
    if (this.sweepAngle > Math.PI * 2) this.sweepAngle -= Math.PI * 2;

    const sweepX = radarCenterX + Math.cos(this.sweepAngle) * maxRadius;
    const sweepY = radarCenterY + Math.sin(this.sweepAngle) * maxRadius;

    ctx.beginPath();
    ctx.moveTo(radarCenterX, radarCenterY);
    ctx.lineTo(sweepX, sweepY);
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Sweep tail sector (fading phosphor trail)
    const tailAngle = 0.55;
    ctx.beginPath();
    ctx.moveTo(radarCenterX, radarCenterY);
    ctx.arc(radarCenterX, radarCenterY, maxRadius, this.sweepAngle - tailAngle, this.sweepAngle);
    ctx.closePath();
    const sweepGrad = ctx.createRadialGradient(radarCenterX, radarCenterY, 5, radarCenterX, radarCenterY, maxRadius);
    sweepGrad.addColorStop(0, 'rgba(14, 165, 233, 0.35)');
    sweepGrad.addColorStop(1, 'rgba(14, 165, 233, 0.0)');
    ctx.fillStyle = sweepGrad;
    ctx.fill();

    // 4. Detected Vessels in Fairway (Blips)
    const seed = tideData.id.length;
    const vessels = [
      { dist: 0.42, angle: 0.8 + seed * 0.1, name: 'MAVERICK EMIRATES', speed: '16 kn' },
      { dist: 0.75, angle: 2.1 + seed * 0.15, name: 'FEEDER FALCON', speed: '14 kn' },
      { dist: 0.88, angle: 4.3 + seed * 0.08, name: 'PORT TUG 04', speed: '8 kn' },
      { dist: 0.55, angle: 5.6 + seed * 0.12, name: 'SHUTTLE EXPRESS', speed: '18 kn' }
    ];

    for (const v of vessels) {
      const bx = radarCenterX + Math.cos(v.angle) * (maxRadius * v.dist);
      const by = radarCenterY + Math.sin(v.angle) * (maxRadius * v.dist);

      let angleDiff = this.sweepAngle - v.angle;
      while (angleDiff < 0) angleDiff += Math.PI * 2;
      while (angleDiff > Math.PI * 2) angleDiff -= Math.PI * 2;
      const illuminated = angleDiff < 0.6;

      ctx.beginPath();
      ctx.arc(bx, by, illuminated ? 4 : 2.5, 0, Math.PI * 2);
      ctx.fillStyle = illuminated ? '#ef4444' : 'rgba(56, 189, 248, 0.7)';
      ctx.fill();

      if (illuminated) {
        ctx.beginPath();
        ctx.arc(bx, by, 7, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.5)';
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = '8px monospace';
        ctx.fillText(v.name, bx + 8, by - 2);
        ctx.fillStyle = '#38bdf8';
        ctx.fillText(v.speed, bx + 8, by + 7);
      }
    }

    // Central Radar Station Beacon
    ctx.beginPath();
    ctx.arc(radarCenterX, radarCenterY, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#dd0103';
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.restore();
  }
}
