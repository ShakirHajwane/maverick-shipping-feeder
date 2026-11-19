import { Component, ElementRef, ViewChild, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaritimeService } from '../../services/maritime.service';
import { Vessel } from '../../models/maritime.models';

@Component({
  selector: 'app-fleet',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section id="fleet-section" class="py-16 bg-transparent border-b border-white/20">
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
          <div *ngIf="filteredVessels().length > 1" class="flex flex-wrap items-center gap-3">
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

          <!-- Single Vessel Dedicated Pill Indicator -->
          <div *ngIf="filteredVessels().length === 1" class="flex items-center gap-2">
            <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold font-mono">
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>{{ isRtl() ? 'سفينة رئيسية مخصصة' : '1 Dedicated Flagship Feeder' }}</span>
            </span>
          </div>
        </div>

        <!-- Filter Bar (Shown only when multiple vessels exist) -->
        <div *ngIf="service.vessels().length > 1" class="bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-4 sm:p-5 mb-6 space-y-4 shadow-md">
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
                <option value="UAE">UAE</option>
                <option value="Liberia">Liberia</option>
                <option value="Singapore">Singapore</option>
                <option value="Panama">Panama</option>
                <option value="Cyprus">Cyprus</option>
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
             FLAGSHIP FEEDER VESSEL SHOWCASE (EXACTLY 1 VESSEL IN FLEET)
             ========================================================= -->
        <div *ngIf="filteredVessels().length === 1" class="max-w-5xl mx-auto">
          <div class="bg-white border-2 border-slate-200 hover:border-[#dd0103]/60 rounded-3xl overflow-hidden shadow-xl transition-all p-6 sm:p-8">
            <div class="flex flex-wrap items-start justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-[#dd0103] text-xs font-bold font-mono uppercase mb-2">
                  <span class="w-2 h-2 rounded-full bg-[#dd0103] animate-ping"></span>
                  <span>{{ isRtl() ? 'السفينة الرئيسية للأسطول' : 'FLAGSHIP FEEDER VESSEL' }} • {{ filteredVessels()[0].service_code }}</span>
                </div>
                <h3 class="text-2xl sm:text-3xl font-black text-[#02194b]">
                  {{ filteredVessels()[0].name }}
                </h3>
                <p class="text-xs sm:text-sm font-mono text-slate-500 mt-1">
                  IMO: {{ filteredVessels()[0].imo }} | Call Sign: {{ filteredVessels()[0].call_sign }} | Flag: {{ filteredVessels()[0].flag }} 🇦🇪 | Built: {{ filteredVessels()[0].built_year }} | Registry: {{ filteredVessels()[0].port_of_registry }}
                </p>
              </div>

              <!-- Live Telemetry Pill -->
              <div class="px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 shadow-xs">
                <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>{{ filteredVessels()[0].current_status }}</span>
              </div>
            </div>

            <!-- Vessel Graphic Schematic Representation with Interactive Buoyancy & Waterline -->
            <div class="my-6 h-28 sm:h-36 rounded-2xl bg-gradient-to-b from-slate-50 via-sky-50/30 to-slate-100 border border-slate-200 flex items-center justify-center p-4 relative overflow-hidden group/schematic">
              <!-- Dynamic Summer Draft Waterline Badge -->
              <div class="absolute top-2 right-3 z-10 bg-slate-900/90 backdrop-blur-xs text-sky-300 px-2.5 py-1 rounded-md text-[10px] font-mono font-bold flex items-center gap-1.5 border border-sky-400/30 shadow-xs">
                <span class="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse"></span>
                <span>DRAFT: {{ filteredVessels()[0].summer_draft }}m WATERLINE</span>
              </div>

              <!-- Floating Vessel SVG -->
              <div class="w-full max-w-lg relative z-5 animate-ship-float">
                <svg class="w-full h-20 text-slate-500 hover:text-red-500/90 transition-colors" viewBox="0 0 300 80" fill="none">
                  <rect x="50" y="25" width="22" height="15" rx="1" fill="currentColor" fill-opacity="0.3" stroke="currentColor" stroke-width="1.2"/>
                  <rect x="74" y="20" width="22" height="20" rx="1" fill="currentColor" fill-opacity="0.5" stroke="currentColor" stroke-width="1.2"/>
                  <rect x="98" y="15" width="22" height="25" rx="1" fill="#DD0103" fill-opacity="0.7" stroke="currentColor" stroke-width="1.2"/>
                  <rect x="122" y="20" width="22" height="20" rx="1" fill="currentColor" fill-opacity="0.4" stroke="currentColor" stroke-width="1.2"/>
                  <rect x="146" y="15" width="22" height="25" rx="1" fill="currentColor" fill-opacity="0.6" stroke="currentColor" stroke-width="1.2"/>
                  <rect x="170" y="25" width="22" height="15" rx="1" fill="#02194B" fill-opacity="0.7" stroke="currentColor" stroke-width="1.2"/>
                  <polygon points="210,40 215,10 235,10 238,40" fill="currentColor" fill-opacity="0.8"/>
                  <rect x="220" y="14" width="10" height="4" fill="#0F172A"/>
                  <path d="M20,42 L250,42 L240,65 L55,65 Z" fill="currentColor" fill-opacity="0.85"/>
                  <line x1="15" y1="65" x2="285" y2="65" stroke="#DD0103" stroke-width="2" stroke-dasharray="4,4"/>
                </svg>
              </div>

              <!-- Animated Layered Water Waves along the Vessel Keel -->
              <div class="absolute bottom-0 inset-x-0 h-8 overflow-hidden pointer-events-none opacity-80">
                <svg class="absolute bottom-0 block w-[200%] h-full animate-wave-slow text-sky-400/50" viewBox="0 0 600 30" preserveAspectRatio="none">
                  <path d="M0,15 C75,5 150,25 225,15 C300,5 375,25 450,15 C525,5 600,25 600,30 L0,30 Z" fill="currentColor"></path>
                </svg>
                <svg class="absolute bottom-0 block w-[200%] h-full animate-wave-fast text-sky-500/70" viewBox="0 0 600 30" preserveAspectRatio="none">
                  <path d="M0,20 C80,28 160,10 240,20 C320,28 400,10 480,20 C560,28 600,15 600,30 L0,30 Z" fill="currentColor"></path>
                </svg>
              </div>
            </div>

            <!-- 8-Point Core Specs Grid -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
              <div class="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span class="block text-[10px] uppercase font-bold text-slate-500">Nominal Capacity</span>
                <span class="font-black text-[#dd0103] font-mono text-base mt-0.5 block">{{ filteredVessels()[0].nominal_cap_teu | number }} TEU</span>
              </div>
              <div class="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span class="block text-[10px] uppercase font-bold text-slate-500">Effective Capacity</span>
                <span class="font-bold text-slate-900 font-mono text-base mt-0.5 block">{{ filteredVessels()[0].effective_cap_teu | number }} TEU</span>
              </div>
              <div class="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span class="block text-[10px] uppercase font-bold text-slate-500">Reefer Plugs</span>
                <span class="font-bold text-emerald-700 font-mono text-base mt-0.5 block">{{ filteredVessels()[0].reefer_plugs }} Plugs</span>
              </div>
              <div class="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span class="block text-[10px] uppercase font-bold text-slate-500">Deadweight (DWT)</span>
                <span class="font-bold text-slate-900 font-mono text-base mt-0.5 block">{{ filteredVessels()[0].dwt | number }} MT</span>
              </div>
              <div class="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span class="block text-[10px] uppercase font-bold text-slate-500">Gross Tonnage</span>
                <span class="font-bold text-slate-700 font-mono text-sm mt-0.5 block">{{ filteredVessels()[0].grt | number }} GT</span>
              </div>
              <div class="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span class="block text-[10px] uppercase font-bold text-slate-500">Length Overall</span>
                <span class="font-bold text-slate-700 font-mono text-sm mt-0.5 block">{{ filteredVessels()[0].loa }} m</span>
              </div>
              <div class="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span class="block text-[10px] uppercase font-bold text-slate-500">Summer Draft</span>
                <span class="font-bold text-slate-700 font-mono text-sm mt-0.5 block">{{ filteredVessels()[0].summer_draft }} m</span>
              </div>
              <div class="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span class="block text-[10px] uppercase font-bold text-slate-500">Bow Thruster</span>
                <span class="font-bold text-emerald-600 text-sm mt-0.5 block">Equipped ✓</span>
              </div>
            </div>

            <!-- Action Buttons Footer -->
            <div class="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
              <span class="text-xs text-slate-500">
                🚢 {{ isRtl() ? 'السفينة في الخدمة النشطة حالياً على مسار صحار - كراتشي' : 'Vessel currently on active rotation on the Sohar - Mundra - Nhava Sheva - Karachi Express loop.' }}
              </span>

              <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto">
                <button
                  type="button"
                  (click)="service.openVesselModal(filteredVessels()[0])"
                  class="w-full sm:w-auto justify-center px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2">
                  <span>{{ isRtl() ? 'المواصفات الفنية (١٦ نقطة)' : 'View 16-Pt Specs' }}</span>
                  <span>→</span>
                </button>
                <button
                  type="button"
                  (click)="trackVessel(filteredVessels()[0])"
                  class="w-full sm:w-auto justify-center px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#dd0103] to-[#b30002] hover:from-[#f00103] hover:to-[#dd0103] text-white font-bold text-xs shadow-md shadow-red-900/30 transition-all cursor-pointer flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  <span>{{ isRtl() ? 'تتبع على الخريطة' : 'Track on Map' }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- =========================================================
             VIEW 1: CAROUSEL SLIDER (WHEN MULTIPLE VESSELS EXIST)
             ========================================================= -->
        <div *ngIf="filteredVessels().length > 1 && viewMode() === 'carousel'" class="relative space-y-4">
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
             VIEW 2: PAGINATED COMPACT GRID (WHEN MULTIPLE VESSELS EXIST)
             ========================================================= -->
        <div *ngIf="filteredVessels().length > 1 && viewMode() === 'grid'" class="space-y-6">
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
             VIEW 3: HIGH-DENSITY MANIFEST TABLE (WHEN MULTIPLE VESSELS EXIST)
             ========================================================= -->
        <div *ngIf="filteredVessels().length > 1 && viewMode() === 'table'" class="overflow-x-auto bg-white border border-slate-200 rounded-2xl shadow-sm">
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
export class FleetDirectoryComponent {
  service = inject(MaritimeService);
  isRtl = this.service.isRtl;

  @ViewChild('vesselSlider') sliderRef?: ElementRef<HTMLDivElement>;

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
}
