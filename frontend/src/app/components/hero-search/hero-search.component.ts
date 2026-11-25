import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  inject,
  signal,
  computed
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaritimeService } from '../../services/maritime.service';
import { VoyageSchedule } from '../../models/maritime.models';

@Component({
  selector: 'app-hero-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- =========================================================
         GFS-STYLE MARITIME HERO VIEWPORT & APPLICATION FRAME
         ========================================================= -->
    <section
      id="hero-viewport"
      class="w-full bg-slate-50 border-b border-slate-200 px-3 sm:px-6 lg:px-10 pt-3 pb-10 sm:pb-14 transition-colors duration-500">
      
      <!-- Rounded Viewport Application Frame (Fits cleanly above fold on 1440x900) -->
      <div class="relative w-full max-w-[1720px] mx-auto rounded-2xl sm:rounded-3xl lg:rounded-[36px] overflow-hidden border border-slate-800 shadow-2xl bg-slate-950 min-h-[580px] sm:min-h-[630px] lg:min-h-[660px] xl:min-h-[700px] flex flex-col justify-between">
        
        <!-- High-Definition Looping Video Backdrop (VP9 WebM + H.264 MP4 + WebP Poster) -->
        <div class="absolute inset-0 w-full h-full overflow-hidden pointer-events-none" aria-hidden="true">
          <video
            #heroVideo
            width="1280"
            height="720"
            autoplay
            loop
            muted
            [muted]="true"
            playsinline
            preload="auto"
            poster="images/hero-vessel-loop-poster.webp"
            aria-hidden="true"
            class="w-full h-full object-cover object-center scale-105 transition-transform duration-1000">
            <source src="videos/hero-vessel-loop.webm" type="video/webm">
            <source src="videos/hero-vessel-loop.mp4" type="video/mp4">
          </video>
        </div>

        <!-- Atmospheric Vignettes & Ocean Sunlight Shimmer Gradient -->
        <div class="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-slate-950/45 to-slate-950/85 sm:bg-gradient-to-r sm:from-slate-950/90 sm:via-slate-950/50 sm:to-transparent pointer-events-none"></div>
        <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/40 pointer-events-none"></div>

        <!-- Top Status Bar Inside Frame -->
        <div class="relative z-20 px-5 sm:px-8 lg:px-12 pt-4 sm:pt-5 flex flex-wrap items-center justify-between gap-4">
          <!-- Nautical Brand / Route Badge -->
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/75 backdrop-blur-md border border-white/15 text-xs text-white shadow-lg">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span class="tracking-wide uppercase font-mono text-[10.5px] font-bold text-[#ef2325]">
              {{ isRtl() ? 'خدمة تغذية مخصصة' : 'DEDICATED FEEDER SERVICE' }}
            </span>
            <span class="text-slate-400">•</span>
            <span class="font-mono text-[10.5px] text-slate-200">SOHAR ➔ NHAVA SHEVA ➔ MUNDRA ➔ KARACHI</span>
          </div>

          <!-- Corridor Status Pill -->
          <div class="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/75 backdrop-blur-md border border-white/15 text-[11px] font-mono text-slate-300 shadow-lg">
            <span class="text-emerald-400 font-bold">SMNK CORRIDOR</span>
            <span class="text-slate-500">•</span>
            <span class="text-white font-bold">WEEKLY FIXED DAY</span>
            <span class="text-slate-500">•</span>
            <span class="text-white font-bold">11-DAY CYCLE</span>
            <span class="text-slate-500">•</span>
            <span class="text-[#ef2325] font-bold">4 GATEWAY PORTS</span>
          </div>
        </div>

        <!-- Midground Hero Content -->
        <div class="relative z-20 flex-1 px-5 sm:px-8 lg:px-12 py-4 sm:py-5 flex flex-col justify-center">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center w-full">
            
            <!-- Left Column: Kinetic Typography, Subtitle & Dual CTA Pill Buttons -->
            <div class="lg:col-span-6 xl:col-span-7 space-y-3 sm:space-y-4">
              
              <!-- Kinetic Headline Matching Reference -->
              <h1 class="text-3xl sm:text-5xl lg:text-5xl xl:text-6xl font-black text-white tracking-tight leading-[1.08] drop-shadow-xl">
                <span>{{ isRtl() ? 'حلول التغذية' : 'Global Feeder &' }}</span><br>
                <span class="text-white">{{ isRtl() ? 'والشحن العالمية' : 'Freight Solutions' }}</span>
              </h1>

              <!-- Subtitle Description -->
              <p class="text-sm sm:text-base lg:text-lg text-slate-200/95 leading-relaxed max-w-xl font-normal drop-shadow">
                {{ isRtl()
                  ? 'شريككم الموثوق في خدمات التغذية والشحن الإقليمي. توفر شركة مافريك للملاحة خدمات نقل حاويات موثوقة وعالية الكفاءة تربط موانئ الخليج العربي وباكستان والهند.'
                  : 'Your trusted partner in regional feeder shipping. Maverick Shipping LLC connects key regional ports across the Arabian Gulf, Pakistan, and India with dependable, efficient, and commercially competitive container feeder solutions.' }}
              </p>

              <!-- Dual Pill Buttons (Maverick Red + Glass Translucent) -->
              <div class="flex flex-wrap items-center gap-3.5 pt-1">
                <!-- Maverick Red Pill: Get a Quote -->
                <button
                  type="button"
                  (click)="service.toggleBookingModal(true)"
                  class="px-7 sm:px-8 py-3.5 rounded-full bg-[#dd0103] hover:bg-[#b50102] text-white font-extrabold text-xs sm:text-sm tracking-wide shadow-xl shadow-red-600/30 hover:scale-[1.03] active:scale-95 transition-all cursor-pointer">
                  {{ isRtl() ? 'طلب تسعيرة' : 'Get a Quote' }}
                </button>

                <!-- Glass Translucent Pill: Sailing Schedules -->
                <button
                  type="button"
                  (click)="scrollToEngine('schedule')"
                  class="px-7 sm:px-8 py-3.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold text-xs sm:text-sm border border-white/25 hover:border-white/50 shadow-lg shadow-black/20 hover:scale-[1.03] active:scale-95 transition-all cursor-pointer flex items-center gap-2">
                  <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>{{ isRtl() ? 'جدول الرحلات' : 'Sailing Schedules' }}</span>
                </button>
              </div>

              <!-- Mobile Compact Trust Pill -->
              <div class="lg:hidden flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-slate-950/80 backdrop-blur-md border border-white/15 text-white max-w-md shadow-lg">
                <div class="flex items-center gap-2.5">
                  <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <div class="flex items-baseline gap-1.5 text-xs font-bold">
                    <span class="text-white">99.4%</span>
                    <span class="text-[11px] text-slate-300 font-normal">{{ isRtl() ? 'دقة المواعيد' : 'Schedule Reliability' }}</span>
                  </div>
                </div>
                <button type="button" (click)="scrollToEngine('quote')" class="text-[11px] font-bold text-white hover:text-[#ef2325] underline underline-offset-2 cursor-pointer">
                  {{ isRtl() ? 'طلب تسعيرة' : 'Slot Enquiry' }}
                </button>
              </div>

              <!-- Quick Key Metrics Strip -->
              <div class="grid grid-cols-3 gap-2.5 sm:gap-3 pt-2 max-w-md">
                <div class="bg-slate-950/70 backdrop-blur-md rounded-xl p-2.5 sm:p-3 border border-white/15 shadow-lg">
                  <div class="text-[9.5px] sm:text-[10px] font-mono text-slate-400 uppercase font-bold">{{ isRtl() ? 'الشبكة' : 'NETWORK' }}</div>
                  <div class="text-base sm:text-xl font-black text-white">{{ isRtl() ? '4 موانئ' : '4 Ports' }}</div>
                  <div class="text-[9.5px] text-slate-300 truncate">{{ isRtl() ? 'مسار SMNK' : 'SMNK Loop' }}</div>
                </div>
                <div class="bg-slate-950/70 backdrop-blur-md rounded-xl p-2.5 sm:p-3 border border-white/15 shadow-lg">
                  <div class="text-[9.5px] sm:text-[10px] font-mono text-emerald-400 uppercase font-bold">{{ isRtl() ? 'الموثوقية' : 'RELIABILITY' }}</div>
                  <div class="text-base sm:text-xl font-black text-emerald-400">99.4%</div>
                  <div class="text-[9.5px] text-slate-300 truncate">{{ isRtl() ? 'التزام المواعيد' : 'On-Time Sailing' }}</div>
                </div>
                <div class="bg-slate-950/70 backdrop-blur-md rounded-xl p-2.5 sm:p-3 border border-white/15 shadow-lg">
                  <div class="text-[9.5px] sm:text-[10px] font-mono text-red-400 uppercase font-bold">{{ isRtl() ? 'التواتر' : 'FREQUENCY' }}</div>
                  <div class="text-base sm:text-xl font-black text-white">{{ isRtl() ? 'أسبوعي' : 'Weekly' }}</div>
                  <div class="text-[9.5px] text-slate-300 truncate">{{ isRtl() ? 'دورة 11 يوماً' : '11-Day Cycle' }}</div>
                </div>
              </div>
            </div>

            <!-- Right Column: Floating Corporate Trust Card (Desktop Only) -->
            <div class="hidden lg:flex lg:col-span-6 xl:col-span-5 flex-col items-end justify-center relative min-h-[160px] lg:min-h-[190px]">
              
              <!-- Floating Card 1: Regional Carrier Performance (White Glassmorphic) -->
              <div class="w-72 xl:w-80 bg-white/95 backdrop-blur-xl border border-white/70 rounded-2xl p-4 xl:p-5 shadow-2xl text-[#02194b] hover:-translate-y-1 transition-transform duration-300 z-30">
                <div class="flex items-center justify-between gap-3 mb-2.5">
                  <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 border border-red-200/70 text-[10px] font-mono font-bold text-[#dd0103] uppercase tracking-wider">
                    <span class="w-1.5 h-1.5 rounded-full bg-[#dd0103] animate-pulse"></span>
                    <span>{{ isRtl() ? 'خدمة SMNK' : 'SMNK SERVICE DESK' }}</span>
                  </div>
                  <button type="button" (click)="scrollToEngine('quote')" class="text-[11px] font-bold text-[#02194b] hover:text-[#dd0103] underline underline-offset-2 cursor-pointer">
                    {{ isRtl() ? 'طلب تسعيرة' : 'Slot Enquiry' }}
                  </button>
                </div>
                <p class="text-xs text-slate-600 leading-snug font-medium mb-3">
                  {{ isRtl()
                    ? 'موثوق من قبل خطوط الشحن العالمية ووكلاء الشحن لنقل الحاويات بكفاءة وجداول ثابتة.'
                    : 'Serving international shipping lines, NVOCCs, and forwarders across Sohar, Nhava Sheva, Mundra, and Karachi.' }}
                </p>
                <div class="flex items-center justify-between pt-2.5 border-t border-slate-100">
                  <div>
                    <div class="text-[10px] font-mono uppercase text-slate-500 font-bold">{{ isRtl() ? 'التزام المواعيد' : 'Reliability' }}</div>
                    <div class="text-xl font-black text-[#02194b]">99.4%</div>
                  </div>
                  <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[10.5px] font-bold text-emerald-700">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>{{ isRtl() ? 'إبحار أسبوعي ثابت' : 'Weekly Fixed Day' }}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        <!-- Bottom Area of Frame: Floating Card 2 (Left) & Floating Card 3 (Right) -->
        <div class="relative z-20 px-5 sm:px-8 lg:px-12 pb-4 sm:pb-5 flex flex-col md:flex-row items-stretch md:items-end justify-between gap-4">
          
          <!-- Floating Card 2 (Bottom-Left): Container Slot Booking & 3D Container -->
          <div class="w-full sm:w-80 lg:w-88 bg-slate-950/85 backdrop-blur-xl border border-white/15 rounded-2xl p-4 shadow-2xl text-white relative overflow-hidden group hover:border-[#dd0103]/50 transition-all duration-300">
            <div class="relative z-10 pr-24 rtl:pr-0 rtl:pl-24">
              <span class="text-[10px] font-mono font-bold tracking-widest text-[#ef2325] uppercase">
                {{ isRtl() ? 'تخصيص المساحات' : 'SLOT ALLOCATION' }}
              </span>
              <h3 class="text-sm sm:text-base font-black text-white mt-1 leading-snug">
                {{ isRtl() ? 'احجز مساحات الحاويات اليوم' : 'Book Container Feeder Slots' }}
              </h3>
              <button
                type="button"
                (click)="service.toggleBookingModal(true)"
                class="inline-flex items-center gap-1.5 text-xs font-bold text-white hover:text-[#ef2325] mt-3 group-hover:translate-x-1 transition-all cursor-pointer">
                <span>{{ isRtl() ? 'احجز الآن' : 'Book Now' }}</span>
                <span class="rtl:rotate-180">→</span>
              </button>
            </div>

            <!-- Suspended 3D Container with Crane Rigging Lines -->
            <div class="absolute right-1 rtl:right-auto rtl:left-1 -bottom-1 w-28 h-28 pointer-events-none transform -rotate-12 group-hover:scale-105 transition-transform duration-300">
              <svg class="absolute inset-0 w-full h-full text-slate-400 opacity-60" viewBox="0 0 100 100">
                <line x1="50" y1="0" x2="20" y2="45" stroke="currentColor" stroke-width="1.2" stroke-dasharray="2,2" />
                <line x1="50" y1="0" x2="80" y2="45" stroke="currentColor" stroke-width="1.2" stroke-dasharray="2,2" />
                <line x1="50" y1="0" x2="50" y2="45" stroke="currentColor" stroke-width="1.5" />
              </svg>
              <!-- Container Body in Maverick Brand Red -->
              <div class="absolute bottom-2 right-1 w-20 h-13 bg-gradient-to-tr from-[#b50102] via-[#dd0103] to-[#ef2325] rounded shadow-2xl border border-red-200/40 flex flex-col justify-between p-1.5 transform skew-y-6">
                <div class="flex justify-between items-center text-[7px] font-mono font-bold text-white">
                  <span>MAVERICK</span>
                  <span>40' HC</span>
                </div>
                <div class="w-full h-1 bg-white/25 rounded my-0.5"></div>
                <div class="flex justify-between items-center text-[6px] font-mono text-red-100 font-bold">
                  <span>OM SOH</span>
                  <span>IN NSA</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Floating Card 3 (Bottom-Right): Corridor Rotation Leg Card -->
          <div class="w-full sm:w-88 lg:w-96 bg-slate-950/85 backdrop-blur-xl border border-white/15 rounded-2xl p-4 sm:p-5 shadow-2xl text-white hover:border-[#dd0103]/40 transition-all duration-300">
            <!-- Port pair header -->
            <div class="flex items-center justify-between gap-3 pb-3 border-b border-white/10">
              <div class="text-start">
                <div class="text-base sm:text-lg font-black tracking-wide text-white">OM SOH</div>
                <div class="text-[10px] font-mono text-slate-400">Sohar, Oman</div>
              </div>

              <!-- Ship icon in circle -->
              <div class="w-8 h-8 rounded-full bg-[#dd0103]/20 flex items-center justify-center border border-[#dd0103]/40 shadow-inner text-white">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 21c-1.39 0-2.78-.47-4-1.32-2.44 1.71-5.56 1.71-8 0C6.78 20.53 5.39 21 4 21H2v2h2c1.38 0 2.74-.35 4-.99 2.53 1.28 5.47 1.28 8 0 1.26.64 2.62.99 4 .99h2v-2h-2zM3.95 19H4c1.6 0 3.02-.88 4-2 .98 1.12 2.4 2 4 2s3.02-.88 4-2c.98 1.12 2.4 2 4 2h.05l1.89-6.68c.08-.26.06-.54-.06-.78s-.34-.42-.6-.47L20 11V6c0-1.1-.9-2-2-2h-3V1h-2v3h-2V1H9v3H6c-1.1 0-2 .9-2 2v5l-1.28.27c-.26.05-.48.23-.6.47s-.14.52-.06.78L3.95 19zM6 6h12v5.47l-6-1.27-6 1.27V6z" />
                </svg>
              </div>

              <div class="text-end">
                <div class="text-base sm:text-lg font-black tracking-wide text-white">PK KHI</div>
                <div class="text-[10px] font-mono text-slate-400">Karachi via India</div>
              </div>
            </div>

            <!-- Corridor Rotation Timeline Bar -->
            <div class="py-3">
              <div class="relative w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div class="absolute inset-y-0 left-0 bg-gradient-to-r from-[#dd0103] to-emerald-400 rounded-full w-full"></div>
              </div>
              <div class="flex items-center justify-between text-[10px] font-mono text-slate-300 mt-2">
                <div>
                  <span class="text-slate-500 uppercase">DAY 1</span><br>
                  <span class="font-bold text-white">Sohar (OMSOH)</span>
                </div>
                <div class="text-center">
                  <span class="inline-flex items-center gap-1 text-emerald-400 font-bold">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Nhava Sheva • Mundra
                  </span>
                </div>
                <div class="text-end">
                  <span class="text-slate-500 uppercase">DAY 8</span><br>
                  <span class="font-bold text-white">Karachi (PKKHI)</span>
                </div>
              </div>
            </div>

            <!-- Footer: Corridor service identity -->
            <div class="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span>SERVICE: <b class="text-white">SMNK FEEDER LOOP</b></span>
              <span class="text-emerald-400 font-bold">WEEKLY FIXED DAY</span>
            </div>
          </div>

        </div>

      </div>

      <!-- =========================================================
           MARITIME OPERATIONS CONSOLE & LIVE DESK (BALANCED 2-COLUMN COMMAND CENTER)
           ========================================================= -->
      <div id="tracking-engine" class="max-w-7xl mx-auto mt-10 sm:mt-14">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          <!-- Column 1: 3-Tab Maritime Operations Console (8 cols) -->
          <div class="lg:col-span-8 flex flex-col justify-between bg-white rounded-2xl sm:rounded-3xl shadow-xl shadow-slate-200/80 border border-slate-200 overflow-hidden">
            
            <!-- Console Top Status Bar -->
            <div class="px-5 sm:px-6 py-3.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span class="font-mono font-bold tracking-wider text-[11px] text-[#02194b]">
                  {{ isRtl() ? 'منظومة الخدمات والعمليات البحرية' : 'MARITIME OPERATIONS CONSOLE' }}
                </span>
              </div>
              <div class="flex items-center gap-3 text-[10.5px] font-mono text-slate-500">
                <span class="flex items-center gap-1.5">
                  <span class="w-1.5 h-1.5 rounded-full bg-[#dd0103]"></span>
                  {{ isRtl() ? 'مكتب العمليات المباشر • دبي' : 'SMNK CORRIDOR • DUBAI OPS DESK' }}
                </span>
              </div>
            </div>

            <!-- 3-Tab Header Strip -->
            <div class="grid grid-cols-3 border-b border-slate-200 bg-slate-50/70 text-center text-xs sm:text-sm font-semibold">
              <!-- Tab 1: Find Service -->
              <button
                type="button"
                id="tab-btn-service"
                (click)="activeTab.set('service')"
                [class]="activeTab() === 'service' 
                  ? 'bg-white text-[#dd0103] border-b-2 border-[#dd0103] font-bold py-3.5 px-3 flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer'
                  : 'text-slate-600 hover:text-[#02194b] py-3.5 px-3 flex items-center justify-center gap-2 hover:bg-white/60 transition-all cursor-pointer'">
                <svg class="w-4 h-4 text-[#dd0103]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                <span>{{ isRtl() ? 'الخدمات' : 'Services' }}</span>
              </button>

              <!-- Tab 2: Find Schedule -->
              <button
                type="button"
                id="tab-btn-schedule"
                (click)="activeTab.set('schedule')"
                [class]="activeTab() === 'schedule' 
                  ? 'bg-white text-[#dd0103] border-b-2 border-[#dd0103] font-bold py-3.5 px-3 flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer'
                  : 'text-slate-600 hover:text-[#02194b] py-3.5 px-3 flex items-center justify-center gap-2 hover:bg-white/60 transition-all cursor-pointer'">
                <svg class="w-4 h-4 text-[#dd0103]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{{ isRtl() ? 'الرحلات' : 'Schedules' }}</span>
              </button>

              <!-- Tab 3: Quick Quote & Commercial Booking -->
              <button
                type="button"
                id="tab-btn-quote"
                (click)="activeTab.set('quote')"
                [class]="activeTab() === 'quote' 
                  ? 'bg-white text-[#dd0103] border-b-2 border-[#dd0103] font-bold py-3.5 px-3 flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer'
                  : 'text-slate-600 hover:text-[#02194b] py-3.5 px-3 flex items-center justify-center gap-2 hover:bg-white/60 transition-all cursor-pointer'">
                <svg class="w-4 h-4 text-[#dd0103]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>{{ isRtl() ? 'طلب تسعيرة' : 'Quick Quote Desk' }}</span>
              </button>
            </div>

            <!-- Console Tab Content Body -->
            <div class="p-5 sm:p-7 text-slate-900 flex-1 flex flex-col justify-between">
              
              <!-- TAB 1: FIND A SERVICE -->
              <div *ngIf="activeTab() === 'service'" class="space-y-4">
                <div class="space-y-1.5">
                  <label class="block text-xs uppercase font-bold text-slate-700 tracking-wider">
                    {{ isRtl() ? 'اختر خط الخدمة الملاحية' : 'Select Feeder Service Code' }}
                  </label>
                  <div class="relative">
                    <select
                      [ngModel]="selectedServiceCode()"
                      (ngModelChange)="onServiceCodeChange($event)"
                      class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#dd0103]/20 focus:border-[#dd0103] appearance-none cursor-pointer text-xs sm:text-sm">
                      <option *ngFor="let s of service.services()" [value]="s.code" class="bg-white text-slate-900">
                        {{ s.code }} — {{ s.name }} ({{ s.frequency }})
                      </option>
                    </select>
                    <div class="pointer-events-none absolute inset-y-0 right-0 rtl:right-auto rtl:left-0 flex items-center px-4 text-slate-500">
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <!-- Active Service Preview Card -->
                <div *ngIf="currentService() as cs" class="p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div class="flex flex-wrap items-center justify-between gap-2">
                    <div class="flex items-center gap-2.5">
                      <span class="text-lg sm:text-xl font-black text-[#02194b]">{{ cs.code }}</span>
                      <span class="text-[11px] px-2.5 py-0.5 rounded-full bg-red-50 text-[#dd0103] border border-red-200/60 font-bold">
                        {{ cs.frequency }}
                      </span>
                      <span class="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 font-bold">
                        {{ cs.transit_days }} {{ isRtl() ? 'يوم' : 'Days' }}
                      </span>
                    </div>
                  </div>
                  <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">{{ cs.description }}</p>

                  <!-- Port Call Sequence Timeline -->
                  <div class="space-y-1.5 pt-2 border-t border-slate-200">
                    <span class="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      {{ isRtl() ? 'دوران الموانئ:' : 'Port Rotation Sequence:' }}
                    </span>
                    <div class="flex flex-wrap items-center gap-2 pt-1">
                      <ng-container *ngFor="let port of cs.port_rotation; let i = index; let last = last">
                        <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs shadow-xs">
                          <span class="w-2 h-2 rounded-full bg-[#dd0103]"></span>
                          <span class="font-bold text-[#02194b]">{{ port.port_name }}</span>
                          <span class="text-[10px] text-slate-500 font-mono">({{ port.unlocode }})</span>
                        </div>
                        <span *ngIf="!last" class="text-slate-400 text-xs font-bold rtl:rotate-180">→</span>
                      </ng-container>
                    </div>
                  </div>

                  <button
                    type="button"
                    (click)="jumpToInteractiveRoute()"
                    class="w-full py-3 px-4 rounded-xl bg-[#dd0103] hover:bg-[#b50102] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-600/20 cursor-pointer mt-2">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    <span>{{ isRtl() ? 'عرض المسار على الخريطة الملاحية' : 'View Navigational Route on Map' }}</span>
                  </button>
                </div>
              </div>

              <!-- TAB 2: FIND SCHEDULE -->
              <div *ngIf="activeTab() === 'schedule'" class="space-y-4">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
                  <div class="space-y-1">
                    <label class="block text-[11px] uppercase font-bold text-slate-700 tracking-wider">
                      {{ isRtl() ? 'ميناء الشحن (POL)' : 'Port of Loading (POL)' }}
                    </label>
                    <select
                      [ngModel]="schedulePol()"
                      (ngModelChange)="onPolChange($event)"
                      class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 font-semibold focus:outline-none focus:border-[#dd0103] cursor-pointer text-xs">
                      <option value="" class="bg-white text-slate-900">{{ isRtl() ? 'جميع موانئ الشحن' : 'All Loading Ports' }}</option>
                      <option value="Sohar" class="bg-white text-slate-900">Sohar, Oman (OMSOH)</option>
                      <option value="Nhava Sheva" class="bg-white text-slate-900">Nhava Sheva, India (INNSA)</option>
                      <option value="Mundra" class="bg-white text-slate-900">Mundra, India (INMUN)</option>
                      <option value="Karachi" class="bg-white text-slate-900">Karachi, Pakistan (PKKHI)</option>
                    </select>
                  </div>

                  <div class="space-y-1">
                    <label class="block text-[11px] uppercase font-bold text-slate-700 tracking-wider">
                      {{ isRtl() ? 'ميناء التفريغ (POD)' : 'Port of Discharge (POD)' }}
                    </label>
                    <select
                      [ngModel]="schedulePod()"
                      (ngModelChange)="onPodChange($event)"
                      class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 font-semibold focus:outline-none focus:border-[#dd0103] cursor-pointer text-xs">
                      <option value="" class="bg-white text-slate-900">{{ isRtl() ? 'جميع موانئ التفريغ' : 'All Discharge Ports' }}</option>
                      <option value="Nhava Sheva" class="bg-white text-slate-900">Nhava Sheva, India (INNSA)</option>
                      <option value="Mundra" class="bg-white text-slate-900">Mundra, India (INMUN)</option>
                      <option value="Karachi" class="bg-white text-slate-900">Karachi, Pakistan (PKKHI)</option>
                      <option value="Sohar" class="bg-white text-slate-900">Sohar, Oman (OMSOH)</option>
                    </select>
                  </div>
                </div>

                <!-- Schedules Result Table -->
                <div class="overflow-x-auto rounded-xl border border-slate-200 bg-white max-h-64 shadow-xs">
                  <table class="w-full text-start text-xs text-slate-700">
                    <thead class="bg-slate-50 text-slate-700 uppercase text-[9.5px] tracking-wider border-b border-slate-200 sticky top-0">
                      <tr>
                        <th class="py-2.5 px-3.5 font-bold">{{ isRtl() ? 'الخدمة' : 'Service Loop' }}</th>
                        <th class="py-2.5 px-3.5 font-bold">{{ isRtl() ? 'الرحلة' : 'Voyage' }}</th>
                        <th class="py-2.5 px-3.5 font-bold">POL</th>
                        <th class="py-2.5 px-3.5 font-bold">POD</th>
                        <th class="py-2.5 px-3.5 font-bold">ETD</th>
                        <th class="py-2.5 px-3.5 font-bold">ETA</th>
                        <th class="py-2.5 px-3.5 font-bold">{{ isRtl() ? 'الحالة' : 'Status' }}</th>
                        <th class="py-2.5 px-3.5 font-bold text-end">{{ isRtl() ? 'إجراء' : 'Action' }}</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 font-mono text-[11px]">
                      <tr *ngFor="let s of filteredSchedules()" class="hover:bg-slate-50/80 transition-colors">
                        <td class="py-2.5 px-3.5 font-bold text-[#02194b] truncate max-w-[120px]">
                          SMNK Loop
                        </td>
                        <td class="py-2.5 px-3.5 font-bold text-[#dd0103]">{{ s.voyage_no }}</td>
                        <td class="py-2.5 px-3.5 text-slate-700">{{ s.pol }}</td>
                        <td class="py-2.5 px-3.5 text-slate-700">{{ s.pod }}</td>
                        <td class="py-2.5 px-3.5 text-slate-500">{{ s.etd | date:'shortDate' }}</td>
                        <td class="py-2.5 px-3.5 text-[#02194b] font-bold">{{ s.eta | date:'shortDate' }}</td>
                        <td class="py-2.5 px-3.5">
                          <span [ngClass]="{
                            'bg-emerald-50 text-emerald-700 border-emerald-200': s.status === 'On Schedule',
                            'bg-blue-50 text-blue-700 border-blue-200': s.status === 'In Transit',
                            'bg-red-50 text-[#dd0103] border-red-200': s.status === 'At Berth'
                          }" class="px-2 py-0.5 rounded-full text-[9px] font-bold border">
                            {{ s.status }}
                          </span>
                        </td>
                        <td class="py-2.5 px-3.5 text-end font-sans">
                          <button
                            type="button"
                            (click)="service.openBookingWithDraft({ pol: s.pol, pod: s.pod })"
                            class="px-2.5 py-1 rounded-lg bg-[#dd0103] hover:bg-[#b50102] text-white text-[10px] font-bold transition-all cursor-pointer shadow-xs">
                            {{ isRtl() ? 'حجز مساحة' : 'Book Slot' }}
                          </button>
                        </td>
                      </tr>
                      <tr *ngIf="filteredSchedules().length === 0">
                        <td colspan="8" class="py-5 text-center text-slate-500 font-sans">
                          {{ isRtl() ? 'لا توجد رحلات مطابقة للمعايير المحددة.' : 'No voyage schedules found for the selected port pair.' }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- TAB 3: QUICK QUOTE & BOOKING DESK -->
              <div *ngIf="activeTab() === 'quote'" class="space-y-4">
                <div class="p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-4 shadow-sm">
                  <div class="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-200">
                    <div>
                      <h4 class="text-sm font-black text-[#02194b]">
                        {{ isRtl() ? 'طلب تسعيرة أو حجز مساحات الحاويات' : 'Regional Feeder Slot & Rate Enquiry' }}
                      </h4>
                      <p class="text-[11px] text-slate-500 mt-0.5">
                        {{ isRtl() ? 'خدمة مخصصة لخطوط الشحن، وكلاء الشحن، ومشغلي NVOCC' : 'Dedicated to shipping lines, freight forwarders, and NVOCC operators' }}
                      </p>
                    </div>
                    <span class="shrink-0 whitespace-nowrap text-[10.5px] font-mono font-bold text-[#dd0103] bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full">
                      {{ isRtl() ? 'رد خلال ساعتين' : '2-Hour Quote SLA' }}
                    </span>
                  </div>

                  <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label class="block text-[10.5px] uppercase font-bold text-slate-600 mb-1">POL (Loading)</label>
                      <select
                        [ngModel]="quickPol()"
                        (ngModelChange)="quickPol.set($event)"
                        class="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-semibold focus:outline-none focus:border-[#dd0103] cursor-pointer">
                        <option value="Sohar (OMSOH)">Sohar, Oman (OMSOH)</option>
                        <option value="Nhava Sheva (INNSA)">Nhava Sheva, India (INNSA)</option>
                        <option value="Mundra (INMUN)">Mundra, India (INMUN)</option>
                        <option value="Karachi (PKKHI)">Karachi, Pakistan (PKKHI)</option>
                      </select>
                    </div>
                    <div>
                      <label class="block text-[10.5px] uppercase font-bold text-slate-600 mb-1">POD (Discharge)</label>
                      <select
                        [ngModel]="quickPod()"
                        (ngModelChange)="quickPod.set($event)"
                        class="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-semibold focus:outline-none focus:border-[#dd0103] cursor-pointer">
                        <option value="Nhava Sheva (INNSA)">Nhava Sheva, India (INNSA)</option>
                        <option value="Mundra (INMUN)">Mundra, India (INMUN)</option>
                        <option value="Karachi (PKKHI)">Karachi, Pakistan (PKKHI)</option>
                        <option value="Sohar (OMSOH)">Sohar, Oman (OMSOH)</option>
                      </select>
                    </div>
                    <div>
                      <label class="block text-[10.5px] uppercase font-bold text-slate-600 mb-1">Equipment Type</label>
                      <select
                        [ngModel]="quickEquipment()"
                        (ngModelChange)="quickEquipment.set($event)"
                        class="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-semibold focus:outline-none focus:border-[#dd0103] cursor-pointer">
                        <option value="20GP">20' Dry Standard (20GP)</option>
                        <option value="40HC">40' High Cube (40HC)</option>
                        <option value="40RF">40' High Cube Reefer (40RF)</option>
                        <option value="SOC">SOC / COC Feeder Slot</option>
                      </select>
                    </div>
                  </div>

                  <div class="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200">
                    <span class="text-xs text-slate-600 flex items-center gap-1.5 font-medium">
                      <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span>{{ isRtl() ? 'المكتب التجاري جاهز للرد الفوري' : 'HQ Commercial Desk Ready' }}</span>
                    </span>
                    <button
                      type="button"
                      (click)="openQuickQuoteModal()"
                      class="px-5 py-2.5 rounded-full bg-[#dd0103] hover:bg-[#b50102] text-white font-extrabold text-xs shadow-md shadow-red-600/20 transition-all cursor-pointer">
                      {{ isRtl() ? 'إرسال طلب الحجز والتسعيرة →' : 'Open Booking Desk Form →' }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Column 2: Live Maritime Command & Booking Dispatch Hub (4 cols) -->
          <div class="lg:col-span-4 flex flex-col justify-between space-y-6">
            
            <!-- Live Regional Corridor Status Card -->
            <div class="bg-white rounded-2xl sm:rounded-3xl p-6 shadow-xl shadow-slate-200/80 border border-slate-200 space-y-4">
              <div class="flex items-center justify-between pb-3 border-b border-slate-100">
                <div class="flex items-center gap-2">
                  <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                  <span class="text-[11px] font-mono font-bold text-[#02194b] uppercase tracking-wider">
                    {{ isRtl() ? 'حالة الخط الإقليمي' : 'REGIONAL CORRIDOR STATUS' }}
                  </span>
                </div>
                <span class="text-[10px] font-mono text-[#dd0103] bg-red-50 border border-red-200 px-2 py-0.5 rounded-full font-bold">
                  ACTIVE ROTATION
                </span>
              </div>

              <!-- Service Identity -->
              <div>
                <h4 class="text-base font-black text-[#02194b]">SMNK Dedicated Feeder Loop</h4>
                <p class="text-[11px] font-mono text-slate-500 mt-0.5">Sohar ⇄ Nhava Sheva ⇄ Mundra ⇄ Karachi</p>
              </div>

              <!-- Corridor Progress Bar -->
              <div class="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                <div class="flex items-center justify-between text-xs font-bold">
                  <span class="text-[#02194b]">Sohar (OMSOH)</span>
                  <span class="text-[#dd0103]">Karachi (PKKHI)</span>
                </div>
                <div class="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div class="bg-gradient-to-r from-[#dd0103] to-[#02194b] h-1.5 rounded-full w-full"></div>
                </div>
                <div class="flex items-center justify-between text-[10.5px] font-mono text-slate-500">
                  <span>Frequency: <b class="text-emerald-700">Weekly Fixed Day</b></span>
                  <span>Transit: <b class="text-[#02194b]">11-Day Cycle</b></span>
                </div>
              </div>

              <!-- Action Link -->
              <button
                type="button"
                (click)="jumpToInteractiveRoute()"
                class="w-full py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-[#02194b] hover:text-[#dd0103] flex items-center justify-center gap-2 transition-all cursor-pointer">
                <svg class="w-4 h-4 text-[#dd0103]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                <span>{{ isRtl() ? 'عرض مسار الرحلة على الخريطة' : 'View Navigational Route on Live Map' }}</span>
              </button>
            </div>

            <!-- 24/7 Operations Desk & Quick Booking Inquiries -->
            <div class="bg-gradient-to-br from-[#02194b] via-[#042468] to-[#02194b] rounded-2xl sm:rounded-3xl p-6 shadow-xl border border-slate-800 text-white space-y-3.5">
              <div class="flex items-center justify-between">
                <span class="text-[10px] font-mono font-bold tracking-widest uppercase text-[#ef2325]">
                  {{ isRtl() ? 'مكتب الحجوزات والعمليات' : '24/7 OPERATIONS DESK' }}
                </span>
                <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              </div>

              <div>
                <h4 class="text-base font-black text-white">
                  {{ isRtl() ? 'احجز مساحة لحاوياتك اليوم' : 'Commercial Feeder Inquiries' }}
                </h4>
                <p class="text-xs text-slate-300 mt-1 leading-snug">
                  <span *ngIf="isRtl()">فريق العمليات متاح على مدار الساعة لتأكيد الحجوزات والرد على استفسارات الأسعار خلال ساعتين.</span>
                  <span *ngIf="!isRtl()">Direct access to regional booking desks. Fast quote turnaround within 2 hours for standard &amp; high-cube container bookings.</span>
                </p>
              </div>

              <div class="pt-2 border-t border-white/10 flex flex-col gap-2">
                <button
                  type="button"
                  (click)="service.toggleBookingModal(true)"
                  class="w-full py-3 px-4 rounded-full bg-[#dd0103] hover:bg-[#b50102] text-white font-extrabold text-xs sm:text-sm tracking-wide shadow-lg shadow-red-600/25 transition-all hover:scale-[1.02] cursor-pointer text-center">
                  {{ isRtl() ? 'طلب تسعيرة أو حجز فوري' : 'Request Instant Container Quote' }}
                </button>
                <a
                  href="tel:+97142105105"
                  class="w-full py-2.5 px-3 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-mono font-bold flex items-center justify-center gap-2 border border-white/15 transition-all">
                  <svg class="w-3.5 h-3.5 text-[#dd0103]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span dir="ltr">+971 4 210 51 05 (HQ Desk)</span>
                </a>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  `
})
export class HeroSearchComponent implements AfterViewInit {
  service = inject(MaritimeService);
  isRtl = this.service.isRtl;

  @ViewChild('heroVideo') heroVideoRef?: ElementRef<HTMLVideoElement>;

  // 3-Tab Action Engine Signals
  activeTab = signal<'service' | 'schedule' | 'quote'>('service');
  selectedServiceCode = signal<string>('SMNK');
  schedulePol = signal<string>('');
  schedulePod = signal<string>('');
  quickPol = signal<string>('Sohar (OMSOH)');
  quickPod = signal<string>('Nhava Sheva (INNSA)');
  quickEquipment = signal<string>('40HC');

  currentService = computed(() => {
    const code = this.selectedServiceCode();
    return this.service.services().find(s => s.code.toUpperCase() === code.toUpperCase()) || this.service.services()[0];
  });

  filteredSchedules = computed(() => {
    let list = this.service.schedules();
    const pol = this.schedulePol().toLowerCase().trim();
    const pod = this.schedulePod().toLowerCase().trim();
    if (pol) list = list.filter(s => s.pol.toLowerCase().includes(pol));
    if (pod) list = list.filter(s => s.pod.toLowerCase().includes(pod));
    return list;
  });

  ngAfterViewInit() {
    const videoEl = this.heroVideoRef?.nativeElement;
    if (!videoEl || typeof window === 'undefined') return;

    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      videoEl.pause();
    } else {
      videoEl.muted = true;
      videoEl.play().catch(() => {});
    }
  }

  scrollToEngine(tab: 'service' | 'schedule' | 'quote' = 'quote') {
    this.activeTab.set(tab);
    const engineEl = document.getElementById('tracking-engine');
    if (engineEl) {
      engineEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

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

  openQuickQuoteModal() {
    this.service.openBookingWithDraft({
      pol: this.quickPol(),
      pod: this.quickPod(),
      containerType: this.quickEquipment()
    });
  }
}
