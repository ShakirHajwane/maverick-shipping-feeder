import { Component, ElementRef, ViewChild, inject, signal, computed, AfterViewInit, OnDestroy, NgZone } from '@angular/core';
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
        <div class="flex flex-wrap items-end justify-between gap-4 mb-6">
          <div>
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-[#dd0103] text-xs font-semibold tracking-wide uppercase mb-2">
              <span class="w-2 h-2 rounded-full bg-[#dd0103]"></span>
              <span>{{ isRtl() ? 'دليل الأسطول البحري' : 'MODERN CONTAINER FLEET' }}</span>
            </div>
            <h2 class="text-2xl sm:text-4xl font-black text-[#02194b]">
              {{ isRtl() ? 'أسطول متطور ومرن للمسافات الإقليمية' : 'High-Efficiency Feeder Fleet' }}
            </h2>
            <p class="text-sm text-slate-600 mt-1 max-w-2xl">
              {{ isRtl() 
                ? 'سفن حاويات حديثة ومجهزة بروافع ومعدات مناورة متقدمة لخدمة الموانئ الثانوية والرئيسية بأعلى كفاءة.' 
                : 'Equipped for maximum turnaround efficiency, shallow-draft river/canal access, bow thruster maneuverability, and high-density reefer cargo handling.' }}
            </p>
          </div>

          <!-- View Switcher & Vessel Count -->
          <div class="flex flex-wrap items-center gap-3">
            <!-- Layout View Selector -->
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
                (click)="setViewMode('table')"
                [class]="viewMode() === 'table' ? 'bg-white text-[#02194b] font-bold shadow-sm' : 'text-slate-600 hover:text-slate-900'"
                class="hidden md:flex px-3 py-1.5 rounded-lg text-xs items-center gap-1.5 transition-all cursor-pointer">
                <svg class="w-3.5 h-3.5 text-[#dd0103]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span>{{ isRtl() ? 'جدول المانيفست' : 'Manifest Table' }}</span>
              </button>
            </div>

            <!-- Vessels Count Badge -->
            <div class="text-xs font-mono text-slate-600 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl shadow-xs">
              {{ isRtl() ? 'إجمالي السفن:' : 'Vessels:' }} <span class="text-[#dd0103] font-bold">{{ filteredVessels().length }}</span> / {{ service.vessels().length }}
            </div>
          </div>
        </div>

        <!-- =========================================================
             INNOVATIVE HYDRODYNAMIC WAVE BASIN & SEA TRIAL TANK
             Interactive Graphic Canvas: Real-Time Hull Displacement & Waves
             ========================================================= -->
        <div class="mb-8 rounded-2xl sm:rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl overflow-hidden relative text-white">
          <!-- Top Control Header Bar -->
          <div class="p-4 sm:p-5 border-b border-slate-800/80 bg-slate-900/90 flex flex-wrap items-center justify-between gap-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center shrink-0 shadow-inner">
                <span class="text-xl">🌊</span>
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <span class="text-[10px] font-mono font-bold uppercase tracking-wider text-sky-400 bg-sky-950/80 px-2 py-0.5 rounded border border-sky-800/60">
                    HYDRODYNAMIC WAVE BASIN
                  </span>
                  <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span class="text-[10px] font-mono text-emerald-400 font-bold">LIVE SEA TRIAL SIMULATION</span>
                </div>
                <h3 class="text-sm sm:text-base font-black text-white mt-0.5">
                  {{ isRtl() ? 'مختبر اختبارات ديناميكا الأمواج ومقاومة الهيكل' : 'Naval Architecture Wave Resistance & Sea Trial Lab' }}
                </h3>
              </div>
            </div>

            <!-- Sea State & Simulation Speed Selectors -->
            <div class="flex flex-wrap items-center gap-2 sm:gap-3">
              <!-- Sea State Selector -->
              <div class="inline-flex items-center bg-slate-800/90 p-1 rounded-xl border border-slate-700/80 text-xs font-mono">
                <span class="px-2 text-[10px] font-bold text-slate-400 uppercase hidden sm:inline">SEA STATE:</span>
                <button
                  type="button"
                  (click)="setSeaState('calm')"
                  [class]="seaState() === 'calm' ? 'bg-sky-600 text-white font-bold shadow-xs' : 'text-slate-300 hover:text-white'"
                  class="px-2.5 py-1 rounded-lg transition-all cursor-pointer">
                  Calm (0.6m)
                </button>
                <button
                  type="button"
                  (click)="setSeaState('moderate')"
                  [class]="seaState() === 'moderate' ? 'bg-sky-600 text-white font-bold shadow-xs' : 'text-slate-300 hover:text-white'"
                  class="px-2.5 py-1 rounded-lg transition-all cursor-pointer">
                  Moderate (2.2m)
                </button>
                <button
                  type="button"
                  (click)="setSeaState('rough')"
                  [class]="seaState() === 'rough' ? 'bg-[#dd0103] text-white font-bold shadow-xs' : 'text-slate-300 hover:text-white'"
                  class="px-2.5 py-1 rounded-lg transition-all cursor-pointer">
                  Rough (4.8m)
                </button>
              </div>

              <!-- Speed Knots Selector -->
              <div class="inline-flex items-center bg-slate-800/90 p-1 rounded-xl border border-slate-700/80 text-xs font-mono">
                <span class="px-2 text-[10px] font-bold text-slate-400 uppercase hidden sm:inline">SPEED:</span>
                <button
                  type="button"
                  (click)="setSimSpeed(12)"
                  [class]="simSpeed() === 12 ? 'bg-emerald-600 text-white font-bold shadow-xs' : 'text-slate-300 hover:text-white'"
                  class="px-2 py-1 rounded-lg transition-all cursor-pointer">
                  12 KN
                </button>
                <button
                  type="button"
                  (click)="setSimSpeed(18)"
                  [class]="simSpeed() === 18 ? 'bg-emerald-600 text-white font-bold shadow-xs' : 'text-slate-300 hover:text-white'"
                  class="px-2 py-1 rounded-lg transition-all cursor-pointer">
                  18 KN
                </button>
                <button
                  type="button"
                  (click)="setSimSpeed(24)"
                  [class]="simSpeed() === 24 ? 'bg-emerald-600 text-white font-bold shadow-xs' : 'text-slate-300 hover:text-white'"
                  class="px-2 py-1 rounded-lg transition-all cursor-pointer">
                  24 KN
                </button>
              </div>
            </div>
          </div>

          <!-- Graphic Wave Tank Canvas Viewport -->
          <div class="relative w-full h-64 sm:h-80 overflow-hidden bg-gradient-to-b from-[#02112e] via-[#03204e] to-[#01091b]">
            <canvas
              #waveTankCanvas
              (mousemove)="onTankMouseMove($event)"
              (click)="onTankClick($event)"
              class="w-full h-full cursor-crosshair block">
            </canvas>

            <!-- Real-Time Telemetry HUD Overlay -->
            <div class="absolute bottom-3 left-3 sm:left-5 pointer-events-none z-10 flex flex-wrap gap-2 sm:gap-3 text-[10px] font-mono font-bold">
              <div class="bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/80 text-slate-300 shadow-lg">
                <span class="text-slate-400">HEAVE:</span> <span class="text-sky-400 font-bold ml-1">{{ heaveReadout() }}</span>
              </div>
              <div class="bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/80 text-slate-300 shadow-lg">
                <span class="text-slate-400">PITCH:</span> <span class="text-amber-400 font-bold ml-1">{{ pitchReadout() }}</span>
              </div>
              <div class="bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/80 text-slate-300 shadow-lg">
                <span class="text-slate-400">HULL RESISTANCE:</span> <span class="text-[#ff4d5e] font-bold ml-1">{{ dragReadout() }}</span>
              </div>
              <div class="bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/80 text-slate-300 shadow-lg">
                <span class="text-slate-400">BOW BULB EFFICIENCY:</span> <span class="text-emerald-400 font-bold ml-1">{{ efficiencyReadout() }}</span>
              </div>
            </div>

            <!-- Interactive Wave Hint Pill -->
            <div class="absolute top-3 right-3 sm:right-5 pointer-events-none z-10 text-[9.5px] font-mono text-sky-400/90 bg-slate-950/85 backdrop-blur-md px-2.5 py-1 rounded-lg border border-sky-900/60 hidden sm:flex items-center gap-1.5">
              <span>🖱️ Click or move cursor in wave tank to generate rogue waves</span>
            </div>
          </div>
        </div>

        <!-- Filter Bar -->
        <div class="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 mb-6 space-y-4 shadow-sm">
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
                  class="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#dd0103] shadow-sm" />
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
                class="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#dd0103] shadow-sm cursor-pointer">
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
                    ? 'bg-gradient-to-r from-[#dd0103] to-[#b30002] text-white font-bold border-[#dd0103] shadow-md shadow-[#dd0103]/25' 
                    : 'bg-white text-slate-600 border-slate-300 hover:text-slate-900 shadow-sm'"
                  class="flex-1 py-2 px-2 rounded-lg text-[11px] border transition-all text-center cursor-pointer">
                  {{ isRtl() ? 'الكل' : 'All' }}
                </button>
                <button
                  (click)="setCapacityTier('under_1500')"
                  [class]="capacityTier === 'under_1500' 
                    ? 'bg-gradient-to-r from-[#dd0103] to-[#b30002] text-white font-bold border-[#dd0103] shadow-md shadow-[#dd0103]/25' 
                    : 'bg-white text-slate-600 border-slate-300 hover:text-slate-900 shadow-sm'"
                  class="flex-1 py-2 px-2 rounded-lg text-[11px] border transition-all text-center cursor-pointer">
                  &lt; 1500 TEU
                </button>
                <button
                  (click)="setCapacityTier('1500_to_8000')"
                  [class]="capacityTier === '1500_to_8000' 
                    ? 'bg-gradient-to-r from-[#dd0103] to-[#b30002] text-white font-bold border-[#dd0103] shadow-md shadow-[#dd0103]/25' 
                    : 'bg-white text-slate-600 border-slate-300 hover:text-slate-900 shadow-sm'"
                  class="flex-1 py-2 px-2 rounded-lg text-[11px] border transition-all text-center cursor-pointer">
                  1500 - 8000 TEU
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- =========================================================
             VIEW 1: CAROUSEL SLIDER (DEFAULT • ZERO SCROLL CLUTTER)
             ========================================================= -->
        <div *ngIf="viewMode() === 'carousel'" class="relative space-y-4">
          <!-- Slider Navigation Header -->
          <div class="flex items-center justify-between px-1">
            <div class="flex items-center gap-2">
              <span class="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                {{ isRtl() ? 'السفينة' : 'Vessel' }} <span class="text-[#dd0103]">{{ activeCarouselIndex() + 1 }}</span> / {{ filteredVessels().length }}
              </span>
              <span class="hidden sm:inline-block text-[11px] text-slate-500">
                {{ isRtl() ? 'اسحب للتنقل بين السفن أو استخدم الأسهم' : 'Swipe horizontally or use arrows to navigate' }}
              </span>
            </div>

            <!-- Arrow Buttons -->
            <div class="flex items-center gap-2">
              <button
                (click)="scrollPrev()"
                [disabled]="activeCarouselIndex() === 0"
                class="w-8 h-8 rounded-full bg-white hover:bg-slate-50 disabled:opacity-35 disabled:cursor-not-allowed border border-slate-300 shadow-sm flex items-center justify-center text-[#02194b] hover:text-[#dd0103] transition-all cursor-pointer"
                [attr.aria-label]="isRtl() ? 'السابق' : 'Previous vessel'">
                <svg class="w-4 h-4" [class.rotate-180]="isRtl()" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                (click)="scrollNext()"
                [disabled]="activeCarouselIndex() >= filteredVessels().length - 1"
                class="w-8 h-8 rounded-full bg-white hover:bg-slate-50 disabled:opacity-35 disabled:cursor-not-allowed border border-slate-300 shadow-sm flex items-center justify-center text-[#02194b] hover:text-[#dd0103] transition-all cursor-pointer"
                [attr.aria-label]="isRtl() ? 'التالي' : 'Next vessel'">
                <svg class="w-4 h-4" [class.rotate-180]="isRtl()" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Horizontal Smooth Snap Carousel Track -->
          <div
            #vesselSlider
            (scroll)="onSliderScroll($event)"
            class="flex overflow-x-auto snap-x snap-mandatory scrollbar-none gap-4 sm:gap-6 pb-4 pt-1 px-1 scroll-smooth">
            <div
              *ngFor="let vessel of filteredVessels()"
              class="w-[85vw] sm:w-[350px] lg:w-[380px] shrink-0 snap-start bg-white border border-slate-200 hover:border-[#dd0103]/80 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all hover:-translate-y-1 group flex flex-col justify-between">
              <ng-container *ngTemplateOutlet="vesselCard; context: { vessel: vessel }" />
            </div>
          </div>

          <!-- Mobile Swipe Indicator Hint -->
          <div class="sm:hidden flex items-center justify-center gap-1.5 text-[11px] font-mono text-slate-600 pt-1">
            <span class="text-[#dd0103]">←</span>
            <span>{{ isRtl() ? 'مرر أفقياً لتصفح الأسطول' : 'Swipe horizontally to browse fleet' }}</span>
            <span class="text-[#dd0103]">→</span>
          </div>
        </div>

        <!-- =========================================================
             VIEW 2: PAGINATED COMPACT GRID (6 PER PAGE • CLEAN HEIGHT)
             ========================================================= -->
        <div *ngIf="viewMode() === 'grid'" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              *ngFor="let vessel of pagedVessels()"
              class="bg-white border border-slate-200 hover:border-[#dd0103]/80 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all hover:-translate-y-1 group flex flex-col justify-between">
              <ng-container *ngTemplateOutlet="vesselCard; context: { vessel: vessel }" />
            </div>
          </div>

          <!-- Pagination Bar -->
          <div class="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-200">
            <div class="text-xs text-slate-600 font-medium">
              {{ isRtl() ? 'عرض' : 'Showing' }} <span class="font-bold text-[#02194b]">{{ pagedVessels().length }}</span> {{ isRtl() ? 'من أصل' : 'of' }} <span class="font-bold text-[#dd0103]">{{ filteredVessels().length }}</span> {{ isRtl() ? 'سفن' : 'vessels' }}
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
                {{ showAllGrid() ? (isRtl() ? 'عرض بالصفحات' : 'Paginate (6/pg)') : (isRtl() ? 'عرض الكل (' + filteredVessels().length + ')' : 'Show All (' + filteredVessels().length + ')') }}
              </button>
            </div>
          </div>
        </div>

        <!-- =========================================================
             VIEW 3: HIGH-DENSITY MANIFEST TABLE (DESKTOP / TABLET)
             ========================================================= -->
        <div *ngIf="viewMode() === 'table'" class="overflow-x-auto bg-white border border-slate-200 rounded-2xl shadow-sm">
          <table class="w-full text-left text-xs text-slate-700">
            <thead class="bg-slate-50 border-b border-slate-200 text-[11px] font-mono uppercase text-slate-500">
              <tr>
                <th class="py-3 px-4">{{ isRtl() ? 'اسم السفينة' : 'Vessel' }}</th>
                <th class="py-3 px-4">{{ isRtl() ? 'الخدمة' : 'Service' }}</th>
                <th class="py-3 px-4">{{ isRtl() ? 'العلم' : 'Flag' }}</th>
                <th class="py-3 px-4">{{ isRtl() ? 'سنة الصنع' : 'Built' }}</th>
                <th class="py-3 px-4">{{ isRtl() ? 'السعة الاسمية' : 'Cap (TEU)' }}</th>
                <th class="py-3 px-4">{{ isRtl() ? 'الحمولة الساكنة' : 'DWT' }}</th>
                <th class="py-3 px-4">{{ isRtl() ? 'الطول الكلي' : 'LOA' }}</th>
                <th class="py-3 px-4">{{ isRtl() ? 'الحالة' : 'Status' }}</th>
                <th class="py-3 px-4 text-center">{{ isRtl() ? 'الإجراءات' : 'Actions' }}</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr *ngFor="let vessel of filteredVessels()" class="hover:bg-slate-50/80 transition-colors">
                <td class="py-3 px-4">
                  <div class="font-bold text-[#02194b] text-sm">{{ vessel.name }}</div>
                  <div class="text-[10px] font-mono text-slate-500">IMO: {{ vessel.imo }}</div>
                </td>
                <td class="py-3 px-4 font-mono font-bold text-[#dd0103]">
                  {{ vessel.service_code || 'Spot' }}
                </td>
                <td class="py-3 px-4 font-medium">{{ vessel.flag }}</td>
                <td class="py-3 px-4 font-mono">{{ vessel.built_year }}</td>
                <td class="py-3 px-4 font-mono font-bold text-[#dd0103]">{{ vessel.nominal_cap_teu | number }} TEU</td>
                <td class="py-3 px-4 font-mono">{{ vessel.dwt | number }} MT</td>
                <td class="py-3 px-4 font-mono">{{ vessel.loa }} m</td>
                <td class="py-3 px-4">
                  <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium"
                    [ngClass]="vessel.current_status.includes('Underway') ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'">
                    <span class="w-1.5 h-1.5 rounded-full" [ngClass]="vessel.current_status.includes('Underway') ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'"></span>
                    <span class="truncate max-w-[120px]">{{ vessel.current_status }}</span>
                  </span>
                </td>
                <td class="py-3 px-4 text-center">
                  <div class="inline-flex items-center gap-1.5">
                    <button
                      (click)="service.openVesselModal(vessel)"
                      class="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-[#dd0103] hover:text-white text-slate-700 font-semibold text-[11px] transition-colors cursor-pointer"
                      [title]="isRtl() ? 'المواصفات الفنية' : 'View 16-Pt Specs'">
                      {{ isRtl() ? 'المواصفات' : 'Specs' }}
                    </button>
                    <button
                      (click)="trackVessel(vessel)"
                      class="p-1 rounded-lg bg-red-50 hover:bg-[#dd0103] hover:text-white text-[#dd0103] transition-colors cursor-pointer"
                      [title]="isRtl() ? 'تتبع على الخريطة' : 'Track on Map'">
                      <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Zero Results Fallback -->
        <div *ngIf="filteredVessels().length === 0" class="p-12 text-center text-slate-500 bg-slate-50 rounded-2xl border border-slate-200 mt-6 shadow-sm">
          <p class="text-base font-medium">{{ isRtl() ? 'لا توجد سفن مطابقة لمعايير البحث الحالية.' : 'No vessels match the specified filters.' }}</p>
          <button (click)="resetFilters()" class="mt-3 text-xs text-[#dd0103] font-semibold underline cursor-pointer">{{ isRtl() ? 'إعادة ضبط الفلاتر' : 'Reset all filters' }}</button>
        </div>

      </div>

      <!-- =========================================================
           REUSABLE VESSEL CARD TEMPLATE
           ========================================================= -->
      <ng-template #vesselCard let-vessel="vessel">
        <!-- Card Top: Visual Graphic & Badges -->
        <div class="p-5 pb-3">
          <div class="flex items-center justify-between mb-2.5">
            <span class="text-xs px-2.5 py-0.5 rounded-full bg-red-50 text-[#dd0103] border border-red-200 font-bold font-mono">
              {{ vessel.service_code || 'Spot Feeder' }}
            </span>
            <span class="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <span class="w-2 h-2 rounded-full" [ngClass]="vessel.current_status.includes('Underway') ? 'bg-emerald-500' : 'bg-amber-500'"></span>
              <span>{{ vessel.built_year }} Built</span>
            </span>
          </div>

          <!-- Vessel Title & IMO -->
          <h3 class="text-lg font-black text-[#02194b] group-hover:text-[#dd0103] transition-colors truncate">
            {{ vessel.name }}
          </h3>
          <p class="text-[11px] font-mono text-slate-500 mt-0.5">
            IMO: {{ vessel.imo }} | Call Sign: {{ vessel.call_sign }}
          </p>

          <!-- Vessel Graphic Schematic Representation with Interactive Buoyancy & Waterline -->
          <div class="my-3.5 h-20 rounded-xl bg-gradient-to-b from-slate-50 to-sky-50/40 border border-slate-200 flex items-center justify-center p-2 relative overflow-hidden group/schematic">
            
            <!-- Dynamic Summer Draft Waterline Badge on Hover -->
            <div class="absolute top-1.5 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10 bg-slate-900/85 backdrop-blur-xs text-sky-300 px-2 py-0.5 rounded text-[9px] font-mono font-bold flex items-center gap-1 border border-sky-400/30 shadow-xs">
              <span class="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse"></span>
              <span>DRAFT: {{ vessel.summer_draft }}m WATERLINE</span>
            </div>

            <!-- Floating Vessel SVG with 3D Ocean Swell Bobbing -->
            <div class="w-full relative z-5 transition-transform duration-500 group-hover:animate-ship-float">
              <svg class="w-full h-14 text-slate-400 group-hover:text-red-500/80 transition-colors" viewBox="0 0 300 80" fill="none">
                <!-- Container Stacks -->
                <rect x="50" y="25" width="22" height="15" rx="1" fill="currentColor" fill-opacity="0.3" stroke="currentColor" stroke-width="1.2"/>
                <rect x="74" y="20" width="22" height="20" rx="1" fill="currentColor" fill-opacity="0.5" stroke="currentColor" stroke-width="1.2"/>
                <rect x="98" y="15" width="22" height="25" rx="1" fill="#DD0103" fill-opacity="0.7" stroke="currentColor" stroke-width="1.2"/>
                <rect x="122" y="20" width="22" height="20" rx="1" fill="currentColor" fill-opacity="0.4" stroke="currentColor" stroke-width="1.2"/>
                <rect x="146" y="15" width="22" height="25" rx="1" fill="currentColor" fill-opacity="0.6" stroke="currentColor" stroke-width="1.2"/>
                <rect x="170" y="25" width="22" height="15" rx="1" fill="#02194B" fill-opacity="0.7" stroke="currentColor" stroke-width="1.2"/>
                <!-- Bridge Tower -->
                <polygon points="210,40 215,10 235,10 238,40" fill="currentColor" fill-opacity="0.8"/>
                <rect x="220" y="14" width="10" height="4" fill="#0F172A"/>
                <!-- Ship Hull -->
                <path d="M20,42 L250,42 L240,65 L55,65 Z" fill="currentColor" fill-opacity="0.85"/>
                <line x1="15" y1="65" x2="285" y2="65" stroke="#DD0103" stroke-width="2" stroke-dasharray="4,4"/>
              </svg>
            </div>

            <!-- Animated Layered Water Waves along the Vessel Keel -->
            <div class="absolute bottom-0 inset-x-0 h-6 overflow-hidden pointer-events-none opacity-70 group-hover:opacity-95 transition-opacity">
              <svg class="absolute bottom-0 block w-[200%] h-full animate-wave-slow text-sky-400/40" viewBox="0 0 600 30" preserveAspectRatio="none">
                <path d="M0,15 C75,5 150,25 225,15 C300,5 375,25 450,15 C525,5 600,25 600,30 L0,30 Z" fill="currentColor"></path>
              </svg>
              <svg class="absolute bottom-0 block w-[200%] h-full animate-wave-fast text-sky-500/60" viewBox="0 0 600 30" preserveAspectRatio="none">
                <path d="M0,20 C80,28 160,10 240,20 C320,28 400,10 480,20 C560,28 600,15 600,30 L0,30 Z" fill="currentColor"></path>
              </svg>
            </div>
          </div>

          <!-- 6 Core Metrics Grid -->
          <div class="grid grid-cols-3 gap-2 text-center text-xs pt-0.5">
            <div class="bg-slate-50 p-1.5 rounded-lg border border-slate-200">
              <span class="block text-[9px] uppercase font-bold text-slate-500">Flag</span>
              <span class="font-bold text-slate-900 text-[11px] mt-0.5 truncate block">{{ vessel.flag }}</span>
            </div>
            <div class="bg-slate-50 p-1.5 rounded-lg border border-slate-200">
              <span class="block text-[9px] uppercase font-bold text-slate-500">Nominal</span>
              <span class="font-bold text-[#dd0103] font-mono text-[11px] mt-0.5 block">{{ vessel.nominal_cap_teu }} TEU</span>
            </div>
            <div class="bg-slate-50 p-1.5 rounded-lg border border-slate-200">
              <span class="block text-[9px] uppercase font-bold text-slate-500">GRT</span>
              <span class="font-semibold text-slate-800 font-mono text-[11px] mt-0.5 block">{{ vessel.grt | number }}</span>
            </div>
            <div class="bg-slate-50 p-1.5 rounded-lg border border-slate-200">
              <span class="block text-[9px] uppercase font-bold text-slate-500">NRT</span>
              <span class="font-semibold text-slate-800 font-mono text-[11px] mt-0.5 block">{{ vessel.nrt | number }}</span>
            </div>
            <div class="bg-slate-50 p-1.5 rounded-lg border border-slate-200">
              <span class="block text-[9px] uppercase font-bold text-slate-500">DWT</span>
              <span class="font-semibold text-[#dd0103] font-mono text-[11px] mt-0.5 block">{{ vessel.dwt | number }}</span>
            </div>
            <div class="bg-slate-50 p-1.5 rounded-lg border border-slate-200">
              <span class="block text-[9px] uppercase font-bold text-slate-500">LOA</span>
              <span class="font-semibold text-slate-800 font-mono text-[11px] mt-0.5 block">{{ vessel.loa }} m</span>
            </div>
          </div>
        </div>

        <!-- Card Bottom: Actions -->
        <div class="p-3.5 bg-slate-50 border-t border-slate-200 flex items-center gap-2">
          <button
            (click)="service.openVesselModal(vessel)"
            class="flex-1 py-2 px-3 rounded-xl bg-white hover:bg-[#dd0103] hover:text-white text-slate-800 font-semibold text-xs border border-slate-300 hover:border-[#dd0103] shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer">
            <svg class="w-3.5 h-3.5 text-[#dd0103] group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{{ isRtl() ? 'المواصفات (16 مواصفة)' : '16-Pt Specs' }}</span>
          </button>

          <button
            (click)="trackVessel(vessel)"
            class="py-2 px-3 rounded-xl bg-red-50 hover:bg-[#dd0103] text-[#dd0103] hover:text-white font-bold text-xs border border-red-200 hover:border-[#dd0103] shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            [title]="isRtl() ? 'تتبع على الخريطة' : 'Track on Map'">
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            <span class="hidden sm:inline">{{ isRtl() ? 'تتبع' : 'Track' }}</span>
          </button>
        </div>
      </ng-template>

    </section>
  `
})
export class FleetDirectoryComponent implements AfterViewInit, OnDestroy {
  service = inject(MaritimeService);
  private ngZone = inject(NgZone);
  isRtl = this.service.isRtl;

  @ViewChild('vesselSlider') sliderRef?: ElementRef<HTMLDivElement>;
  @ViewChild('waveTankCanvas') waveTankCanvasRef!: ElementRef<HTMLCanvasElement>;

  // Hydrodynamic Wave Basin Simulation State
  seaState = signal<'calm' | 'moderate' | 'rough'>('moderate');
  simSpeed = signal<number>(18);
  heaveReadout = signal<string>('±0.38m');
  pitchReadout = signal<string>('+1.2°');
  dragReadout = signal<string>('148 kN');
  efficiencyReadout = signal<string>('96.4%');

  private tankAnimId: number | null = null;
  private tankCtx: CanvasRenderingContext2D | null = null;
  private tankWidth = 800;
  private tankHeight = 280;
  private isTankVisible = false;
  private tankObserver: IntersectionObserver | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private tankSprayParticles: { x: number; y: number; vx: number; vy: number; r: number; alpha: number; life: number }[] = [];
  private tankRogueWaves: { x: number; amp: number; speed: number; width: number }[] = [];

  searchQuery = '';
  selectedFlag = 'all';
  capacityTier: 'all' | 'under_1500' | '1500_to_8000' = 'all';

  viewMode = signal<'carousel' | 'grid' | 'table'>('carousel');
  activeCarouselIndex = signal<number>(0);
  currentPage = signal<number>(1);
  showAllGrid = signal<boolean>(false);
  readonly pageSize = 6;

  filteredVessels = signal<Vessel[]>([]);

  pagedVessels = computed(() => {
    const all = this.filteredVessels();
    if (this.showAllGrid()) return all;
    const start = (this.currentPage() - 1) * this.pageSize;
    return all.slice(start, start + this.pageSize);
  });

  totalPages = computed(() => {
    const total = this.filteredVessels().length;
    return Math.max(1, Math.ceil(total / this.pageSize));
  });

  pageNumbers = computed(() => {
    const count = this.totalPages();
    return Array.from({ length: count }, (_, i) => i + 1);
  });

  constructor() {
    this.applyFilters();
  }

  setViewMode(mode: 'carousel' | 'grid' | 'table') {
    this.viewMode.set(mode);
  }

  setCapacityTier(tier: 'all' | 'under_1500' | '1500_to_8000') {
    this.capacityTier = tier;
    this.applyFilters();
  }

  applyFilters() {
    this.service.loadVessels(this.searchQuery, this.selectedFlag, this.capacityTier).subscribe({
      next: (data) => {
        this.filteredVessels.set(data);
        this.currentPage.set(1);
        this.activeCarouselIndex.set(0);
      }
    });
  }

  resetFilters() {
    this.searchQuery = '';
    this.selectedFlag = 'all';
    this.capacityTier = 'all';
    this.applyFilters();
  }

  scrollPrev() {
    if (this.sliderRef?.nativeElement) {
      const el = this.sliderRef.nativeElement;
      const cardWidth = el.firstElementChild ? (el.firstElementChild as HTMLElement).offsetWidth + 24 : 360;
      el.scrollBy({ left: -cardWidth, behavior: 'smooth' });
    }
  }

  scrollNext() {
    if (this.sliderRef?.nativeElement) {
      const el = this.sliderRef.nativeElement;
      const cardWidth = el.firstElementChild ? (el.firstElementChild as HTMLElement).offsetWidth + 24 : 360;
      el.scrollBy({ left: cardWidth, behavior: 'smooth' });
    }
  }

  onSliderScroll(event: Event) {
    const target = event.target as HTMLElement;
    if (!target) return;
    const cardWidth = target.firstElementChild ? (target.firstElementChild as HTMLElement).offsetWidth + 24 : 360;
    const idx = Math.round(target.scrollLeft / cardWidth);
    this.activeCarouselIndex.set(Math.max(0, Math.min(this.filteredVessels().length - 1, idx)));
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  toggleShowAllGrid() {
    this.showAllGrid.update(v => !v);
  }

  trackVessel(vessel: Vessel) {
    this.service.focusLocationOnMap(
      vessel.current_lat,
      vessel.current_lng,
      8,
      vessel.name,
      `
        <div style="font-family: inherit; padding: 4px;">
          <div style="font-weight: 800; font-size: 14px; color: #DD0103;">${vessel.name}</div>
          <div style="font-size: 11px; color: #64748B; margin-bottom: 6px;">Flag: ${vessel.flag} | IMO: ${vessel.imo}</div>
          <div style="font-size: 12px; color: #1E293B;"><b>Capacity:</b> ${vessel.nominal_cap_teu} TEU</div>
          <div style="font-size: 12px; color: #1E293B;"><b>Service:</b> ${vessel.service_code || 'Spot'}</div>
          <div style="font-size: 11px; color: #059669; margin-top: 4px; font-weight: 600;"><b>AIS:</b> ${vessel.current_status}</div>
        </div>
      `
    );
  }

  // =========================================================
  // HYDRODYNAMIC WAVE BASIN SIMULATION ENGINE
  // =========================================================
  ngAfterViewInit() {
    this.initWaveTank();
    this.setupTankObserver();
    this.startTankLoop();
  }

  ngOnDestroy() {
    if (this.tankAnimId) {
      cancelAnimationFrame(this.tankAnimId);
    }
    this.tankObserver?.disconnect();
    this.resizeObserver?.disconnect();
  }

  setSeaState(state: 'calm' | 'moderate' | 'rough') {
    this.seaState.set(state);
    this.updateTelemetryHUD();
  }

  setSimSpeed(speed: number) {
    this.simSpeed.set(speed);
    this.updateTelemetryHUD();
  }

  private updateTelemetryHUD() {
    const state = this.seaState();
    const speed = this.simSpeed();
    const ratio = speed / 18;
    if (state === 'calm') {
      this.heaveReadout.set(`±${(0.14 * ratio).toFixed(2)}m`);
      this.pitchReadout.set(`+${(0.4 * ratio).toFixed(1)}°`);
      this.dragReadout.set(`${Math.round(82 * Math.pow(ratio, 1.8))} kN`);
      this.efficiencyReadout.set('98.4%');
    } else if (state === 'moderate') {
      this.heaveReadout.set(`±${(0.38 * ratio).toFixed(2)}m`);
      this.pitchReadout.set(`+${(1.2 * ratio).toFixed(1)}°`);
      this.dragReadout.set(`${Math.round(148 * Math.pow(ratio, 1.8))} kN`);
      this.efficiencyReadout.set('96.4%');
    } else {
      this.heaveReadout.set(`±${(0.92 * ratio).toFixed(2)}m`);
      this.pitchReadout.set(`+${(3.2 * ratio).toFixed(1)}°`);
      this.dragReadout.set(`${Math.round(265 * Math.pow(ratio, 1.8))} kN`);
      this.efficiencyReadout.set('91.5%');
    }
  }

  onTankClick(e: MouseEvent) {
    if (!this.waveTankCanvasRef) return;
    const rect = this.waveTankCanvasRef.nativeElement.getBoundingClientRect();
    const x = e.clientX - rect.left;
    this.tankRogueWaves.push({
      x,
      amp: this.seaState() === 'rough' ? 28 : 16,
      speed: 4.8,
      width: 120
    });
  }

  onTankMouseMove(e: MouseEvent) {
    if (Math.random() < 0.2) {
      const rect = this.waveTankCanvasRef.nativeElement.getBoundingClientRect();
      const x = e.clientX - rect.left;
      this.tankRogueWaves.push({
        x,
        amp: 7,
        speed: 3.5,
        width: 75
      });
    }
  }

  private initWaveTank() {
    if (!this.waveTankCanvasRef) return;
    const canvas = this.waveTankCanvasRef.nativeElement;
    const rect = canvas.getBoundingClientRect();
    const dpr = typeof window !== 'undefined' ? (window.devicePixelRatio || 1) : 1;

    this.tankWidth = Math.round(rect.width || 800);
    this.tankHeight = Math.round(rect.height || 280);

    canvas.width = Math.round(this.tankWidth * dpr);
    canvas.height = Math.round(this.tankHeight * dpr);

    this.tankCtx = canvas.getContext('2d');
    if (this.tankCtx) {
      this.tankCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
  }

  private setupTankObserver() {
    if (typeof window === 'undefined') return;

    if (this.waveTankCanvasRef) {
      this.tankObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          this.isTankVisible = entry.isIntersecting;
        });
      }, { threshold: 0.05 });
      this.tankObserver.observe(this.waveTankCanvasRef.nativeElement);

      this.resizeObserver = new ResizeObserver(() => {
        this.initWaveTank();
      });
      this.resizeObserver.observe(this.waveTankCanvasRef.nativeElement);
    }
  }

  private startTankLoop() {
    this.ngZone.runOutsideAngular(() => {
      let lastTime = performance.now();

      const loop = (currentTime: number) => {
        if (this.isTankVisible) {
          const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
          lastTime = currentTime;

          this.updateTankPhysics(currentTime, dt);
          this.renderWaveTank(currentTime);
        } else {
          lastTime = currentTime;
        }

        this.tankAnimId = requestAnimationFrame(loop);
      };

      this.tankAnimId = requestAnimationFrame(loop);
    });
  }

  private updateTankPhysics(currentTime: number, dt: number) {
    // 1. Update Rogue Wave Pulses
    for (let i = this.tankRogueWaves.length - 1; i >= 0; i--) {
      const rw = this.tankRogueWaves[i];
      rw.x += rw.speed * dt * 25;
      rw.amp *= 0.985;
      if (rw.amp < 0.5 || rw.x > this.tankWidth + 150) {
        this.tankRogueWaves.splice(i, 1);
      }
    }

    // 2. Update Spray Particles
    for (let i = this.tankSprayParticles.length - 1; i >= 0; i--) {
      const p = this.tankSprayParticles[i];
      p.x += p.vx * dt * 30;
      p.y += p.vy * dt * 30;
      p.vy += dt * 9.8; // gravity
      p.life -= dt * 1.5;
      p.alpha = Math.max(0, p.life);
      if (p.life <= 0) {
        this.tankSprayParticles.splice(i, 1);
      }
    }
  }

  private renderWaveTank(currentTime: number) {
    const ctx = this.tankCtx;
    if (!ctx) return;

    const w = this.tankWidth;
    const h = this.tankHeight;
    const state = this.seaState();
    const speed = this.simSpeed();
    const t = currentTime * 0.001;

    ctx.clearRect(0, 0, w, h);

    // 1. Underwater Bathymetric Grid & Acoustic Beam Lines
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
    ctx.lineWidth = 1;
    for (let y = 40; y < h; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
    for (let x = 60; x < w; x += 80) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }

    // 2. Wave Dynamic Parameters
    const baseY = h * 0.58;
    const waveAmp = state === 'calm' ? 8 : (state === 'moderate' ? 18 : 34);
    const waveFreq = state === 'calm' ? 0.006 : (state === 'moderate' ? 0.0045 : 0.0035);
    const waveSpeed = (speed / 18) * 2.4;

    // Calculate Ship Dynamics (Heave & Pitch)
    const shipCenterNormX = 0.48;
    const shipX = w * shipCenterNormX;
    const primaryWaveAtShip = Math.sin(shipX * waveFreq - t * waveSpeed) * waveAmp;
    const slopeAtShip = Math.cos(shipX * waveFreq - t * waveSpeed) * waveAmp * waveFreq;

    const heave = primaryWaveAtShip * 0.65;
    const pitch = Math.atan(slopeAtShip) * (180 / Math.PI) * (state === 'rough' ? 1.4 : 0.9);

    // 3. Draw Background Deep Water Swell
    ctx.beginPath();
    ctx.moveTo(0, baseY + 15);
    for (let x = 0; x <= w; x += 20) {
      const y = (baseY + 15) +
        Math.sin(x * (waveFreq * 0.8) - t * (waveSpeed * 0.7)) * (waveAmp * 0.8) +
        Math.cos(x * 0.002 + t * 0.5) * 6;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fillStyle = 'rgba(2, 40, 100, 0.45)';
    ctx.fill();

    // 4. Draw Centerpiece Container Feeder Vessel
    this.drawSimulatedVessel(ctx, shipX, baseY, heave, pitch, speed, state, t);

    // 5. Draw Foreground Primary Water Surface & Moving Waves
    const wavePoints: { x: number; y: number }[] = [];
    ctx.beginPath();
    ctx.moveTo(0, baseY);

    for (let x = 0; x <= w; x += 10) {
      let y = baseY +
        Math.sin(x * waveFreq - t * waveSpeed) * waveAmp +
        Math.sin(x * waveFreq * 2.2 + t * waveSpeed * 1.3) * (waveAmp * 0.28);

      // Add Rogue Wave Disturbances
      for (const rw of this.tankRogueWaves) {
        const dist = Math.abs(x - rw.x);
        if (dist < rw.width) {
          y -= Math.cos((dist / rw.width) * (Math.PI / 2)) * rw.amp;
        }
      }

      wavePoints.push({ x, y });
      ctx.lineTo(x, y);
    }

    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();

    // Fluid Ocean Water Gradient
    const waterGrad = ctx.createLinearGradient(0, baseY - waveAmp, 0, h);
    waterGrad.addColorStop(0, 'rgba(14, 165, 233, 0.65)');
    waterGrad.addColorStop(0.35, 'rgba(2, 132, 199, 0.85)');
    waterGrad.addColorStop(1, 'rgba(2, 25, 75, 0.98)');
    ctx.fillStyle = waterGrad;
    ctx.fill();

    // Crisp Glistening Surf Foam Line on Crests
    ctx.beginPath();
    for (let i = 0; i < wavePoints.length; i++) {
      const pt = wavePoints[i];
      if (i === 0) ctx.moveTo(pt.x, pt.y);
      else ctx.lineTo(pt.x, pt.y);
    }
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.lineWidth = 2.8;
    ctx.stroke();

    // 6. Draw Spray Particles at Bulbous Bow
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    for (const p of this.tankSprayParticles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(224, 242, 254, ${p.alpha})`;
      ctx.fill();
    }

    // 7. Waterline Summer Draft Calibration Line
    ctx.beginPath();
    ctx.setLineDash([6, 6]);
    ctx.moveTo(w * 0.25, baseY + 6);
    ctx.lineTo(w * 0.75, baseY + 6);
    ctx.strokeStyle = 'rgba(221, 1, 3, 0.65)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.font = 'bold 9px monospace';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.fillText('DESIGN SUMMER DRAFT WATERLINE: 8.50m', w * 0.25 + 6, baseY + 20);
  }

  private drawSimulatedVessel(
    ctx: CanvasRenderingContext2D,
    shipX: number,
    baseY: number,
    heave: number,
    pitch: number,
    speed: number,
    state: string,
    t: number
  ) {
    const shipW = Math.min(270, this.tankWidth * 0.42);
    const shipH = shipW * 0.28;

    ctx.save();
    ctx.translate(shipX, baseY + heave);
    ctx.rotate((pitch * Math.PI) / 180);

    // Ship Hull coordinates relative to center (0, 0)
    const bowX = shipW * 0.5;
    const sternX = -shipW * 0.5;
    const keelY = shipH * 0.5;
    const deckY = -shipH * 0.1;

    // 1. Main Hull (Freeboard & Antifouling Bottom)
    // Topsides (Maverick Navy #02194B)
    ctx.beginPath();
    ctx.moveTo(sternX, deckY);
    ctx.lineTo(bowX - 15, deckY);
    ctx.lineTo(bowX, deckY + 12);
    ctx.lineTo(bowX - 10, keelY);
    ctx.lineTo(sternX + 15, keelY);
    ctx.lineTo(sternX, deckY);
    ctx.closePath();
    ctx.fillStyle = '#02194b';
    ctx.fill();
    ctx.strokeStyle = '#dd0103';
    ctx.lineWidth = 1.8;
    ctx.stroke();

    // Red Bottom Antifouling Hull
    ctx.beginPath();
    ctx.moveTo(sternX + 10, keelY - 14);
    ctx.lineTo(bowX - 8, keelY - 14);
    ctx.lineTo(bowX - 10, keelY);
    ctx.lineTo(sternX + 15, keelY);
    ctx.closePath();
    ctx.fillStyle = '#b50102';
    ctx.fill();

    // Bulbous Bow (Forward Protrusion Below Waterline)
    ctx.beginPath();
    ctx.ellipse(bowX - 2, keelY - 4, 12, 7, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#990000';
    ctx.fill();
    ctx.strokeStyle = '#ef2325';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // 2. Container Bays on Deck
    const containerW = 22;
    const containerH = 14;
    const bayStartX = sternX + 45;
    const bayEndX = bowX - 35;
    const colors = ['#dd0103', '#fbbf24', '#0f766e', '#1e293b', '#0284c7', '#ea580c'];

    let colIdx = 0;
    for (let bx = bayStartX; bx < bayEndX; bx += containerW + 4) {
      // Tier 1 (Deck Level)
      ctx.fillStyle = colors[colIdx % colors.length];
      ctx.fillRect(bx, deckY - containerH, containerW, containerH);
      ctx.strokeStyle = 'rgba(0,0,0,0.3)';
      ctx.strokeRect(bx, deckY - containerH, containerW, containerH);

      // Tier 2 (Upper Tier)
      ctx.fillStyle = colors[(colIdx + 2) % colors.length];
      ctx.fillRect(bx, deckY - containerH * 2, containerW, containerH);
      ctx.strokeRect(bx, deckY - containerH * 2, containerW, containerH);

      // Tier 3 (Partial High Stacks)
      if (colIdx % 2 === 0) {
        ctx.fillStyle = colors[(colIdx + 4) % colors.length];
        ctx.fillRect(bx, deckY - containerH * 3, containerW, containerH);
        ctx.strokeRect(bx, deckY - containerH * 3, containerW, containerH);
      }
      colIdx++;
    }

    // 3. Superstructure Bridge Tower (Aft)
    const bridgeX = sternX + 16;
    const bridgeY = deckY - containerH * 3.2;
    const bridgeW = 26;
    const bridgeH = containerH * 3.2;

    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(bridgeX, bridgeY, bridgeW, bridgeH);
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 1;
    ctx.strokeRect(bridgeX, bridgeY, bridgeW, bridgeH);

    // Bridge Windows (Navigational Helm)
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(bridgeX + 2, bridgeY + 3, bridgeW - 4, 5);

    // Funnel / Exhaust Mast with Maverick Brand Stripe
    ctx.fillStyle = '#02194b';
    ctx.fillRect(bridgeX - 10, deckY - containerH * 2.4, 9, containerH * 2.4);
    ctx.fillStyle = '#dd0103';
    ctx.fillRect(bridgeX - 10, deckY - containerH * 2.0, 9, 4);

    // Radar Mast on Bridge Roof
    ctx.beginPath();
    ctx.moveTo(bridgeX + bridgeW / 2, bridgeY);
    ctx.lineTo(bridgeX + bridgeW / 2, bridgeY - 14);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Rotating Radar Scanner
    const scannerX = Math.cos(t * 6) * 6;
    ctx.beginPath();
    ctx.moveTo(bridgeX + bridgeW / 2 - scannerX, bridgeY - 14);
    ctx.lineTo(bridgeX + bridgeW / 2 + scannerX, bridgeY - 14);
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.restore();

    // 4. Emit Dynamic Bow Spray Particles from Bulbous Bow
    const globalBowX = shipX + (bowX * Math.cos(pitch * Math.PI / 180));
    const globalBowY = baseY + heave + (bowX * Math.sin(pitch * Math.PI / 180));

    if (state !== 'calm' && Math.random() < (state === 'rough' ? 0.65 : 0.35)) {
      this.tankSprayParticles.push({
        x: globalBowX + (Math.random() - 0.5) * 6,
        y: globalBowY - 4,
        vx: -speed * 1.8 + (Math.random() - 0.5) * 4,
        vy: -Math.random() * (state === 'rough' ? 9 : 5) - 2,
        r: Math.random() * 2.5 + 1.2,
        alpha: 0.95,
        life: 1.0
      });
    }
  }
}
