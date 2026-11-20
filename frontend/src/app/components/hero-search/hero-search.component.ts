import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  inject,
  signal,
  computed,
  NgZone
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaritimeService } from '../../services/maritime.service';
import { FeederService, VoyageSchedule, Vessel } from '../../models/maritime.models';

interface GridVertex {
  x0: number;
  y0: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  isSounding: boolean;
  sounding: string;
}

interface WakePoint {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  life: number;
  maxLife: number;
}

interface SonarWave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  speed: number;
  alpha: number;
}

interface HiddenChartTarget {
  id: string;
  name: string;
  code: string;
  u: number; // normalized x [0, 1]
  v: number; // normalized y [0, 1]
  sounding: string;
  latLng: string;
  illumination: number; // 0.0 to 1.0
}

interface TelemetryNode {
  id: string;
  title: string;
  badge: string;
  value: string;
  subValue: string;
  normX: number; // normalized position on viewport
  normY: number;
  dx: number;    // magnetic offset
  dy: number;
  isHovered: boolean;
  glowFactor: number;
  sparkline: number[];
  type: 'speed' | 'reliability' | 'wind' | 'terminal' | 'dgps';
}

@Component({
  selector: 'app-hero-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- =========================================================
         GFS-STYLE MARITIME HERO VIEWPORT & APPLICATION FRAME
         ========================================================= -->
    <section
      #heroSection
      id="hero-viewport"
      (click)="onSectionClick($event)"
      (mousemove)="onSectionMouseMove($event)"
      (mouseleave)="onSectionMouseLeave()"
      (touchstart)="onTouchStart()"
      (touchend)="onTouchEnd()"
      (touchcancel)="onTouchEnd()"
      class="w-full bg-slate-50 border-b border-slate-200/80 px-3 sm:px-6 lg:px-10 pt-4 pb-12 sm:pb-16 transition-colors duration-500 select-none">
      
      <!-- Rounded Viewport Application Frame (Signature GFS Maritime Framing) -->
      <div class="relative w-full max-w-[1720px] mx-auto rounded-2xl sm:rounded-3xl lg:rounded-[36px] overflow-hidden border border-slate-800 shadow-2xl bg-slate-950 min-h-[660px] sm:min-h-[720px] lg:min-h-[820px] flex flex-col justify-between">
        
        <!-- High-Definition Looping Video / GIF Vessel Backdrop -->
        <div class="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
          <video
            autoplay
            loop
            muted
            playsinline
            preload="auto"
            poster="images/hero-vessel-loop-poster.jpg"
            class="w-full h-full object-cover object-center scale-105 transition-transform duration-1000">
            <source src="videos/hero-vessel-loop.mp4" type="video/mp4">
            <!-- Fallback animated GIF if video autoplay is restricted -->
            <img
              src="images/hero-vessel-loop.gif"
              alt="Cargo ship sailing across open ocean"
              class="w-full h-full object-cover object-center" />
          </video>
        </div>

        <!-- Atmospheric Vignettes & Ocean Sunlight Shimmer Gradient -->
        <div class="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-slate-950/45 to-slate-950/85 sm:bg-gradient-to-r sm:from-slate-950/90 sm:via-slate-950/50 sm:to-transparent pointer-events-none"></div>
        <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/40 pointer-events-none"></div>

        <!-- Interactive Canvas Overlay (Sonar shockwaves & hydrodynamics) -->
        <canvas
          #heroCanvas
          class="absolute inset-0 w-full h-full pointer-events-none z-10 opacity-30">
        </canvas>

        <!-- Top Status Bar Inside Frame -->
        <div class="relative z-20 px-5 sm:px-8 lg:px-12 pt-6 sm:pt-8 flex flex-wrap items-center justify-between gap-4">
          <!-- Nautical Brand / Route Badge -->
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/75 backdrop-blur-md border border-white/15 text-xs text-white shadow-lg">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span class="tracking-wide uppercase font-mono text-[10.5px] font-bold text-amber-400">
              {{ isRtl() ? 'خدمة تغذية مخصصة' : 'DEDICATED FEEDER SERVICE' }}
            </span>
            <span class="text-slate-400">•</span>
            <span class="font-mono text-[10.5px] text-slate-200">SOHAR ➔ NHAVA SHEVA ➔ MUNDRA ➔ KARACHI</span>
          </div>

          <!-- DGPS & Vessel Status Pill -->
          <div class="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/75 backdrop-blur-md border border-white/15 text-[11px] font-mono text-slate-300 shadow-lg">
            <span class="text-emerald-400 font-bold">DGPS LOCK</span>
            <span class="text-slate-500">•</span>
            <span class="text-white font-bold">LAT 23°49' N</span>
            <span class="text-slate-500">•</span>
            <span class="text-white font-bold">LON 061°27' E</span>
            <span class="text-slate-500">•</span>
            <span class="text-amber-400 font-bold">15.4 KNOTS</span>
          </div>
        </div>

        <!-- Midground Hero Content: Typography (Left) & Signature Floating Review Card (Right) -->
        <div class="relative z-20 flex-1 px-5 sm:px-8 lg:px-12 py-8 sm:py-12 flex flex-col justify-center">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full">
            
            <!-- Left Column: Kinetic Typography, Subtitle, Bullet Points & Dual CTA Pill Buttons (6 Cols) -->
            <div class="lg:col-span-6 xl:col-span-7 space-y-4 sm:space-y-5">
              
              <!-- Kinetic Headline Matching Reference -->
              <h1 class="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-white tracking-tight leading-[1.08] drop-shadow-xl">
                <span>{{ isRtl() ? 'حلول التغذية' : 'Global Feeder &' }}</span><br>
                <span class="text-white">{{ isRtl() ? 'والشحن العالمية' : 'Freight Solutions' }}</span>
              </h1>

              <!-- Subtitle Description -->
              <p class="text-sm sm:text-base lg:text-lg text-slate-200/95 leading-relaxed max-w-xl font-normal drop-shadow">
                {{ isRtl()
                  ? 'شريككم الموثوق في خدمات التغذية والشحن الإقليمي. توفر شركة مافريك للملاحة خدمات نقل حاويات موثوقة وعالية الكفاءة تربط موانئ الخليج العربي وباكستان والهند.'
                  : 'Your trusted partner in regional feeder shipping. Maverick Shipping LLC connects key regional ports across the Arabian Gulf, Pakistan, and India with dependable, efficient, and commercially competitive container feeder solutions.' }}
              </p>

              <!-- Homepage Strategic Priorities (Client Bullet Points) -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 max-w-xl text-xs sm:text-[13px] text-slate-200">
                <div class="flex items-center gap-2">
                  <span class="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0"></span>
                  <span class="drop-shadow-sm">{{ isRtl() ? 'ربط موثوق بين الموانئ الإقليمية' : 'Reliable regional container feeder connectivity' }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0"></span>
                  <span class="drop-shadow-sm">{{ isRtl() ? 'تغطية استراتيجية للموانئ والأسواق الرئيسية' : 'Strategic port coverage across key trade markets' }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0"></span>
                  <span class="drop-shadow-sm">{{ isRtl() ? 'حركة بضائع وحلول ميناء إلى ميناء فعالة' : 'Efficient cargo movement & port solutions' }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0"></span>
                  <span class="drop-shadow-sm">{{ isRtl() ? 'خدمات شحن تركز على متطلبات العملاء' : 'Customer-focused shipping services' }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0"></span>
                  <span class="drop-shadow-sm">{{ isRtl() ? 'دعم تشغيلي وتجاري مخصص ومباشر' : 'Dedicated operational & commercial support' }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0"></span>
                  <span class="drop-shadow-sm">{{ isRtl() ? 'التزام تام بالموثوقية والتميز بالخدمة' : 'Commitment to schedule reliability & excellence' }}</span>
                </div>
              </div>

              <!-- Dual Pill Buttons (Maverick Red + Glass Translucent) -->
              <div class="flex flex-wrap items-center gap-3.5 pt-1">
                <!-- Maverick Red Pill: Get a Quote -->
                <button
                  (click)="service.toggleBookingModal(true)"
                  class="px-7 sm:px-8 py-3.5 rounded-full bg-[#df0003] hover:bg-[#b80002] text-white font-extrabold text-xs sm:text-sm tracking-wide shadow-xl shadow-red-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer">
                  {{ isRtl() ? 'طلب تسعيرة' : 'Get a Quote' }}
                </button>

                <!-- Glass Translucent Pill: Track Shipment -->
                <button
                  (click)="scrollToEngine('tracking')"
                  class="px-7 sm:px-8 py-3.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold text-xs sm:text-sm border border-white/25 hover:border-white/50 shadow-lg shadow-black/20 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-2">
                  <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>{{ isRtl() ? 'تتبع الشحنة' : 'Track Shipment' }}</span>
                </button>
              </div>

              <!-- Mobile Compact Trust Pill (Avoids taking space on mobile) -->
              <div class="lg:hidden flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl bg-slate-900/80 backdrop-blur-md border border-white/15 text-white max-w-md shadow-lg">
                <div class="flex items-center gap-2">
                  <div class="flex -space-x-1.5 overflow-hidden">
                    <img class="inline-block h-6 w-6 rounded-full ring-1 ring-white object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80" alt="Avatar 1" />
                    <img class="inline-block h-6 w-6 rounded-full ring-1 ring-white object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80" alt="Avatar 2" />
                  </div>
                  <div class="flex items-baseline gap-1 text-xs font-bold">
                    <span class="text-white">4.8</span>
                    <span class="text-amber-400">★</span>
                    <span class="text-[11px] text-slate-300 font-normal ml-1">• 99.4% On-Time</span>
                  </div>
                </div>
                <button (click)="service.toggleBookingModal(true)" class="text-[11px] font-bold text-amber-400 hover:text-amber-300 underline underline-offset-2 cursor-pointer">
                  {{ isRtl() ? 'تقييم العملاء' : 'Client Reviews' }}
                </button>
              </div>

              <!-- Quick Key Metrics Strip -->
              <div class="grid grid-cols-3 gap-3 pt-2 max-w-md">
                <div class="bg-slate-950/60 backdrop-blur-md rounded-xl p-3 border border-white/10 shadow-lg">
                  <div class="text-[10px] font-mono text-slate-400 uppercase font-bold">VESSELS</div>
                  <div class="text-lg sm:text-xl font-black text-white">1</div>
                  <div class="text-[9.5px] text-slate-300 truncate">Flagship Feeder</div>
                </div>
                <div class="bg-slate-950/60 backdrop-blur-md rounded-xl p-3 border border-white/10 shadow-lg">
                  <div class="text-[10px] font-mono text-emerald-400 uppercase font-bold">RELIABILITY</div>
                  <div class="text-lg sm:text-xl font-black text-emerald-400">99.4%</div>
                  <div class="text-[9.5px] text-slate-300 truncate">On-Time Sailing</div>
                </div>
                <div class="bg-slate-950/60 backdrop-blur-md rounded-xl p-3 border border-white/10 shadow-lg">
                  <div class="text-[10px] font-mono text-amber-400 uppercase font-bold">FREQUENCY</div>
                  <div class="text-lg sm:text-xl font-black text-amber-400">Fixed Day</div>
                  <div class="text-[9.5px] text-slate-300 truncate">Weekly Rotation</div>
                </div>
              </div>
            </div>

            <!-- Right Column: Floating Card 1 (Desktop Only - Avoids Mobile Crowding) -->
            <div class="hidden lg:flex lg:col-span-6 xl:col-span-5 flex-col items-end justify-center relative min-h-[220px] lg:min-h-[300px]">
              
              <!-- Floating Card 1: Review Card (White Glassmorphic) -->
              <div class="w-72 xl:w-80 bg-white/95 backdrop-blur-xl border border-white/60 rounded-2xl p-4 xl:p-5 shadow-2xl text-slate-900 hover:-translate-y-1 transition-transform duration-300 z-30">
                <div class="flex items-center justify-between gap-3 mb-2.5">
                  <!-- Avatars -->
                  <div class="flex -space-x-2 overflow-hidden">
                    <img class="inline-block h-7 w-7 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80" alt="Avatar 1" />
                    <img class="inline-block h-7 w-7 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80" alt="Avatar 2" />
                    <img class="inline-block h-7 w-7 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80" alt="Avatar 3" />
                  </div>
                  <button (click)="service.toggleBookingModal(true)" class="text-[11px] font-bold text-slate-600 hover:text-slate-950 underline underline-offset-2 cursor-pointer">
                    {{ isRtl() ? 'تقييم العملاء' : 'Leave a Review' }}
                  </button>
                </div>
                <p class="text-xs text-slate-600 leading-snug font-medium mb-3">
                  {{ isRtl()
                    ? 'موثوق من قبل الشركات وخطوط الملاحة الإقليمية لنقل الحاويات بكفاءة وجداول ثابتة.'
                    : 'Trusted by regional shipping lines and forwarders for dependable container feeder services.' }}
                </p>
                <div class="flex items-center justify-between pt-2 border-t border-slate-100">
                  <div class="flex items-baseline gap-1.5">
                    <span class="text-2xl font-black text-slate-950">4.8</span>
                    <span class="text-amber-400 text-lg">★</span>
                  </div>
                  <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[10.5px] font-bold text-emerald-700">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>99.4% On-Time</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        <!-- Bottom Area of Frame: Floating Card 2 (Left) & Floating Card 3 (Right) -->
        <div class="relative z-20 px-5 sm:px-8 lg:px-12 pb-6 sm:pb-8 flex flex-col md:flex-row items-stretch md:items-end justify-between gap-4">
          
          <!-- Floating Card 2 (Bottom-Left): Unloading & 3D Container -->
          <div class="w-full sm:w-80 lg:w-88 bg-slate-950/85 backdrop-blur-xl border border-white/15 rounded-2xl p-4 sm:p-5 shadow-2xl text-white relative overflow-hidden group hover:border-amber-400/40 transition-all duration-300">
            <div class="relative z-10 pr-24">
              <span class="text-[10px] font-mono font-bold tracking-widest text-amber-400 uppercase">UNLOADING</span>
              <h3 class="text-sm sm:text-base font-black text-white mt-1 leading-snug">
                Book Container<br>Unloading Today
              </h3>
              <button
                (click)="service.toggleBookingModal(true)"
                class="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 mt-3 group-hover:translate-x-1 transition-transform cursor-pointer">
                <span>{{ isRtl() ? 'احجز الآن' : 'Book Now' }}</span>
                <span>→</span>
              </button>
            </div>

            <!-- Suspended 3D Yellow Container with Crane Rigging Lines -->
            <div class="absolute right-1 -bottom-1 w-28 h-28 pointer-events-none transform -rotate-12 group-hover:scale-105 transition-transform duration-300">
              <svg class="absolute inset-0 w-full h-full text-slate-400 opacity-60" viewBox="0 0 100 100">
                <line x1="50" y1="0" x2="20" y2="45" stroke="currentColor" stroke-width="1.2" stroke-dasharray="2,2" />
                <line x1="50" y1="0" x2="80" y2="45" stroke="currentColor" stroke-width="1.2" stroke-dasharray="2,2" />
                <line x1="50" y1="0" x2="50" y2="45" stroke="currentColor" stroke-width="1.5" />
              </svg>
              <!-- Container Body -->
              <div class="absolute bottom-2 right-1 w-20 h-13 bg-gradient-to-tr from-amber-600 via-amber-400 to-amber-300 rounded shadow-2xl border border-amber-200/50 flex flex-col justify-between p-1.5 transform skew-y-6">
                <div class="flex justify-between items-center text-[7px] font-mono font-bold text-amber-950">
                  <span>MAVERICK</span>
                  <span>40' HC</span>
                </div>
                <div class="w-full h-1 bg-amber-600/30 rounded my-0.5"></div>
                <div class="flex justify-between items-center text-[6px] font-mono text-amber-950 font-bold">
                  <span>OM SOH</span>
                  <span>IN NSA</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Floating Card 3 (Bottom-Right): Live Transit Progress Card -->
          <div class="w-full sm:w-88 lg:w-96 bg-slate-950/85 backdrop-blur-xl border border-white/15 rounded-2xl p-4 sm:p-5 shadow-2xl text-white hover:border-sky-400/40 transition-all duration-300">
            <!-- Port pair header -->
            <div class="flex items-center justify-between gap-3 pb-3 border-b border-white/10">
              <div class="text-left">
                <div class="text-base sm:text-lg font-black tracking-wide text-white">OM SOH</div>
                <div class="text-[10px] font-mono text-slate-400">Sohar, Oman</div>
              </div>

              <!-- Ship icon in circle -->
              <div class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/20 shadow-inner">
                <span class="text-sm">🚢</span>
              </div>

              <div class="text-right">
                <div class="text-base sm:text-lg font-black tracking-wide text-white">IN NSA</div>
                <div class="text-[10px] font-mono text-slate-400">Nhava Sheva, India</div>
              </div>
            </div>

            <!-- Transit Progress Line with Arrow -->
            <div class="py-3">
              <div class="relative w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div class="absolute inset-y-0 left-0 bg-gradient-to-r from-amber-500 to-amber-300 rounded-full w-[65%]"></div>
              </div>
              <div class="flex items-center justify-between text-[10px] font-mono text-slate-300 mt-2">
                <div>
                  <span class="text-slate-500 uppercase">ATD</span><br>
                  <span class="font-bold text-white">Nov 20 • 06:30</span>
                </div>
                <div class="text-center">
                  <span class="inline-flex items-center gap-1 text-emerald-400 font-bold">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    15.4 kn Underway
                  </span>
                </div>
                <div class="text-right">
                  <span class="text-slate-500 uppercase">ETA</span><br>
                  <span class="font-bold text-amber-400">Nov 22 • 14:00</span>
                </div>
              </div>
            </div>

            <!-- Footer: Vessel identity -->
            <div class="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span>VESSEL: <b class="text-white">MAVERICK SOHAR</b></span>
              <span class="text-amber-400 font-bold">SMNK EXPRESS</span>
            </div>
          </div>

        </div>

      </div>

      <!-- =========================================================
           MARITIME OPERATIONS CONSOLE (INTEGRATED 3-TAB SUITE BELOW HERO)
           ========================================================= -->
      <div id="tracking-engine" class="max-w-4xl mx-auto mt-8 sm:mt-12">
        <div class="bg-white rounded-2xl sm:rounded-3xl shadow-xl shadow-slate-200/80 border border-slate-200 overflow-hidden">
          
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
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                {{ isRtl() ? 'بيانات حية ومباشرة' : 'LIVE RADAR AIS FEED' }}
              </span>
            </div>
          </div>

          <!-- 3-Tab Header Strip -->
          <div class="grid grid-cols-3 border-b border-slate-200 bg-slate-50/70 text-center text-xs sm:text-sm font-semibold">
            <!-- Tab 1: Find Service -->
            <button
              id="tab-btn-service"
              (click)="activeTab.set('service')"
              [class]="activeTab() === 'service' 
                ? 'bg-white text-[#df0003] border-b-2 border-[#df0003] font-bold py-3.5 px-3 flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer'
                : 'text-slate-600 hover:text-[#02194b] py-3.5 px-3 flex items-center justify-center gap-2 hover:bg-white/60 transition-all cursor-pointer'">
              <svg class="w-4 h-4 text-[#df0003]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              <span>{{ isRtl() ? 'الخدمات' : 'Services' }}</span>
            </button>

            <!-- Tab 2: Find Schedule -->
            <button
              id="tab-btn-schedule"
              (click)="activeTab.set('schedule')"
              [class]="activeTab() === 'schedule' 
                ? 'bg-white text-[#df0003] border-b-2 border-[#df0003] font-bold py-3.5 px-3 flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer'
                : 'text-slate-600 hover:text-[#02194b] py-3.5 px-3 flex items-center justify-center gap-2 hover:bg-white/60 transition-all cursor-pointer'">
              <svg class="w-4 h-4 text-[#df0003]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{{ isRtl() ? 'الرحلات' : 'Schedules' }}</span>
            </button>

            <!-- Tab 3: Vessel Tracking -->
            <button
              id="tab-btn-tracking"
              (click)="activeTab.set('tracking')"
              [class]="activeTab() === 'tracking' 
                ? 'bg-white text-[#df0003] border-b-2 border-[#df0003] font-bold py-3.5 px-3 flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer'
                : 'text-slate-600 hover:text-[#02194b] py-3.5 px-3 flex items-center justify-center gap-2 hover:bg-white/60 transition-all cursor-pointer'">
              <svg class="w-4 h-4 text-[#df0003]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{{ isRtl() ? 'تتبع AIS' : 'Vessel AIS' }}</span>
            </button>
          </div>

          <!-- Console Tab Content Body -->
          <div class="p-5 sm:p-7 text-slate-900">
            
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
                    class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#df0003]/20 focus:border-[#df0003] appearance-none cursor-pointer text-xs sm:text-sm">
                    <option *ngFor="let s of service.services()" [value]="s.code" class="bg-white text-slate-900">
                      {{ s.code }} — {{ s.name }} ({{ s.frequency }})
                    </option>
                  </select>
                  <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
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
                    <span class="text-[11px] px-2.5 py-0.5 rounded-full bg-red-50 text-[#df0003] border border-red-200/60 font-bold">
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
                        <span class="w-2 h-2 rounded-full bg-[#df0003]"></span>
                        <span class="font-bold text-[#02194b]">{{ port.port_name }}</span>
                        <span class="text-[10px] text-slate-500 font-mono">({{ port.unlocode }})</span>
                      </div>
                      <span *ngIf="!last" class="text-slate-400 text-xs font-bold">→</span>
                    </ng-container>
                  </div>
                </div>

                <button
                  (click)="jumpToInteractiveRoute()"
                  class="w-full py-3 px-4 rounded-xl bg-[#df0003] hover:bg-[#b80002] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-500/20 cursor-pointer mt-2">
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
                    class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 font-semibold focus:outline-none focus:border-[#df0003] cursor-pointer text-xs">
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
                    class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 font-semibold focus:outline-none focus:border-[#df0003] cursor-pointer text-xs">
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
                <table class="w-full text-left text-xs text-slate-700">
                  <thead class="bg-slate-50 text-slate-700 uppercase text-[9.5px] tracking-wider border-b border-slate-200 sticky top-0">
                    <tr>
                      <th class="py-2.5 px-3.5 font-bold">{{ isRtl() ? 'السفينة' : 'Vessel' }}</th>
                      <th class="py-2.5 px-3.5 font-bold">{{ isRtl() ? 'الرحلة' : 'Voyage' }}</th>
                      <th class="py-2.5 px-3.5 font-bold">POL</th>
                      <th class="py-2.5 px-3.5 font-bold">POD</th>
                      <th class="py-2.5 px-3.5 font-bold">ETD</th>
                      <th class="py-2.5 px-3.5 font-bold">ETA</th>
                      <th class="py-2.5 px-3.5 font-bold">{{ isRtl() ? 'الحالة' : 'Status' }}</th>
                      <th class="py-2.5 px-3.5 font-bold text-right">{{ isRtl() ? 'إجراء' : 'Action' }}</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100 font-mono text-[11px]">
                    <tr *ngFor="let s of filteredSchedules()" class="hover:bg-slate-50/80 transition-colors">
                      <td class="py-2.5 px-3.5 font-bold text-[#02194b] truncate max-w-[120px]">
                        {{ s.vessel_name }}
                      </td>
                      <td class="py-2.5 px-3.5 font-bold text-[#df0003]">{{ s.voyage_no }}</td>
                      <td class="py-2.5 px-3.5 text-slate-700">{{ s.pol }}</td>
                      <td class="py-2.5 px-3.5 text-slate-700">{{ s.pod }}</td>
                      <td class="py-2.5 px-3.5 text-slate-500">{{ s.etd | date:'shortDate' }}</td>
                      <td class="py-2.5 px-3.5 text-[#02194b] font-bold">{{ s.eta | date:'shortDate' }}</td>
                      <td class="py-2.5 px-3.5">
                        <span [ngClass]="{
                          'bg-emerald-50 text-emerald-700 border-emerald-200': s.status === 'On Schedule',
                          'bg-blue-50 text-blue-700 border-blue-200': s.status === 'In Transit',
                          'bg-amber-50 text-amber-700 border-amber-200': s.status === 'At Berth'
                        }" class="px-2 py-0.5 rounded-full text-[9px] font-bold border">
                          {{ s.status }}
                        </span>
                      </td>
                      <td class="py-2.5 px-3.5 text-right font-sans">
                        <button
                          (click)="trackVesselFromSchedule(s)"
                          class="px-2.5 py-1 rounded bg-[#02194b] hover:bg-[#df0003] text-white text-[10px] font-bold transition-all cursor-pointer">
                          {{ isRtl() ? 'تتبع' : 'Track' }}
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

            <!-- TAB 3: VESSEL TRACKING -->
            <div *ngIf="activeTab() === 'tracking'" class="space-y-4">
              <div class="relative">
                <input
                  type="text"
                  [ngModel]="vesselSearchQuery()"
                  (ngModelChange)="onVesselSearchChange($event)"
                  placeholder="Search MAVERICK SOHAR, IMO 9418298..."
                  class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 font-semibold focus:outline-none focus:border-[#df0003] placeholder-slate-400 text-xs sm:text-sm" />
                <div class="absolute inset-y-0 right-0 flex items-center px-4 text-slate-400 pointer-events-none">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              <!-- Quick Vessel Select -->
              <div class="flex flex-wrap items-center gap-2">
                <span class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{{ isRtl() ? 'سفن سريعة:' : 'Quick Select:' }}</span>
                <button
                  *ngFor="let name of ['MAVERICK SOHAR']"
                  (click)="quickSelectVessel(name)"
                  class="px-3 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-xs font-mono text-[#02194b] font-bold border border-slate-200 hover:border-[#df0003] transition-colors cursor-pointer">
                  🚢 {{ name }}
                </button>
              </div>

              <!-- Live Tracked Vessel Card -->
              <div *ngIf="matchedVessel() as mv" class="p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-4 shadow-sm">
                <div class="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div class="flex items-center gap-2.5">
                      <span class="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      <h3 class="text-base sm:text-lg font-black text-[#02194b]">{{ mv.name }}</h3>
                      <span class="text-[10px] px-2 py-0.5 rounded bg-red-50 text-[#df0003] border border-red-200/60 font-bold">
                        {{ mv.flag }}
                      </span>
                    </div>
                    <p class="text-xs font-mono text-slate-500 mt-1">
                      IMO {{ mv.imo }} • Call Sign: {{ mv.call_sign }} • Corridor: {{ mv.service_code }}
                    </p>
                  </div>

                  <div class="flex items-center gap-2.5">
                    <button
                      (click)="focusOnMatchedVessel()"
                      class="px-3 py-1.5 rounded-lg bg-[#df0003] hover:bg-[#b80002] text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer">
                      <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{{ isRtl() ? 'الخريطة الحية' : 'Live Map' }}</span>
                    </button>
                    <button
                      (click)="service.openVesselModal(mv)"
                      class="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs border border-slate-300 transition-all cursor-pointer">
                      {{ isRtl() ? 'المواصفات' : '16-Pt Specs' }}
                    </button>
                  </div>
                </div>

                <!-- Live Status Metrics Grid -->
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-slate-200">
                  <div class="bg-white p-2.5 rounded-lg border border-slate-200 shadow-xs">
                    <span class="text-[9.5px] uppercase font-bold text-slate-500">AIS Status</span>
                    <p class="text-xs font-bold text-emerald-700 truncate mt-0.5">{{ mv.current_status }}</p>
                  </div>
                  <div class="bg-white p-2.5 rounded-lg border border-slate-200 shadow-xs">
                    <span class="text-[9.5px] uppercase font-bold text-slate-500">Coordinates</span>
                    <p class="text-xs font-mono font-bold text-[#02194b] mt-0.5">
                      {{ mv.current_lat.toFixed(2) }}°N, {{ mv.current_lng.toFixed(2) }}°E
                    </p>
                  </div>
                  <div class="bg-white p-2.5 rounded-lg border border-slate-200 shadow-xs">
                    <span class="text-[9.5px] uppercase font-bold text-slate-500">Nominal TEU</span>
                    <p class="text-xs font-bold text-[#02194b] mt-0.5">{{ mv.nominal_cap_teu }} TEU</p>
                  </div>
                  <div class="bg-white p-2.5 rounded-lg border border-slate-200 shadow-xs">
                    <span class="text-[9.5px] uppercase font-bold text-slate-500">Summer Draft</span>
                    <p class="text-xs font-bold text-[#df0003] mt-0.5">{{ mv.summer_draft }} m</p>
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
export class HeroSearchComponent implements AfterViewInit, OnDestroy {
  service = inject(MaritimeService);
  private ngZone = inject(NgZone);
  isRtl = this.service.isRtl;

  @ViewChild('heroSection') sectionRef!: ElementRef<HTMLElement>;
  @ViewChild('heroCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('flagshipEl') flagshipRef?: ElementRef<HTMLElement>;
  @ViewChild('magneticBtn') magneticBtnRef!: ElementRef<HTMLButtonElement>;

  // Water & Waves Atmosphere State
  waterTheme = this.service.waterTheme;
  isWaterMotionPaused = this.service.isWaterMotionPaused;

  setWaterTheme(theme: 'azure' | 'deep' | 'slate') {
    this.service.setWaterTheme(theme);
  }

  toggleWaterMotion() {
    this.service.toggleWaterMotion();
  }

  heroBackgroundStyle(): string {
    switch (this.waterTheme()) {
      case 'deep':
        return 'radial-gradient(ellipse at 50% 15%, #042766 0%, #021a47 40%, #01102e 100%)';
      case 'azure':
        return 'linear-gradient(180deg, #bae6fd 0%, #7dd3fc 18%, #38bdf8 38%, #0ea5e9 60%, #0284c7 80%, #0369a1 100%)';
      case 'slate':
      default:
        return 'linear-gradient(180deg, #f0f5fc 0%, #e8f1fb 50%, #ffffff 100%)';
    }
  }

  bottomWaveFill1(): string {
    switch (this.waterTheme()) {
      case 'deep':
        return 'rgba(2, 25, 75, 0.75)';
      case 'azure':
        return 'rgba(14, 165, 233, 0.65)';
      case 'slate':
      default:
        return 'rgba(226, 232, 240, 0.75)';
    }
  }

  bottomWaveFill2(): string {
    switch (this.waterTheme()) {
      case 'deep':
        return '#02194b';
      case 'azure':
        return '#0284c7';
      case 'slate':
      default:
        return '#f0f4fa';
    }
  }

  // 3-Tab Action Engine Signals
  activeTab = signal<'service' | 'schedule' | 'tracking'>('service');
  selectedServiceCode = signal<string>('JSA');
  schedulePol = signal<string>('');
  schedulePod = signal<string>('');
  vesselSearchQuery = signal<string>('MAVERICK SOHAR');

  // Active Hovered Node Signal for Template Expansion
  activeHoveredNodeId = signal<string | null>(null);

  // Parallax & Scroll Handoff Signals
  normMouseX = signal<number>(0);
  normMouseY = signal<number>(0);
  scrollProgress = signal<number>(0);

  // Mobile Viewport Signal (disables cursor-only tethers & sonar effects on touch devices)
  isMobileView = signal<boolean>(typeof window !== 'undefined' ? window.innerWidth < 1024 : false);

  // Magnetic Button Signals
  btnDx = signal<number>(0);
  btnDy = signal<number>(0);

  // Flagship Center & Vessel Positions (dynamically updated)
  vesselCenterX = signal<number>(typeof window !== 'undefined' ? window.innerWidth * 0.72 : 800);
  vesselCenterY = signal<number>(typeof window !== 'undefined' ? window.innerHeight * 0.48 : 380);

  // Proximity-Reactive Floating Telemetry Nodes (5 Peripheral Nodes)
  telemetryNodes: TelemetryNode[] = [];

  // Canvas Engine State
  private animationFrameId: number | null = null;
  private canvasWidth = 0;
  private canvasHeight = 0;
  private gridCols = 0;
  private gridRows = 0;
  private currentDpr = 1;
  private lastRenderTime = 0;
  private resizeObserver: ResizeObserver | null = null;
  private dprMediaQuery: MediaQueryList | null = null;
  private ctx: CanvasRenderingContext2D | null = null;

  private targetMouseX = -1000;
  private targetMouseY = -1000;
  private lerpMouseX = -1000;
  private lerpMouseY = -1000;
  private prevMouseX = -1000;
  private prevMouseY = -1000;
  private mouseVx = 0;
  private mouseVy = 0;
  private mouseSpeed = 0;
  private isMouseInside = false;

  private gridVertices: GridVertex[] = [];
  private wakeTrail: WakePoint[] = [];
  private sonarShockwaves: SonarWave[] = [];

  // Hidden Nautical Targets (Triggered by Sonar Waves)
  private hiddenTargets: HiddenChartTarget[] = [
    {
      id: 't-1',
      name: 'JEBEL ALI FAIRWAY BUOY 1',
      code: 'BUOY-01',
      u: 0.28,
      v: 0.38,
      sounding: '16.4m',
      latLng: '25°04.2\'N, 55°02.8\'E',
      illumination: 0
    },
    {
      id: 't-2',
      name: 'TARGET: MAVERICK SOHAR (AIS 9418298)',
      code: 'MAV-SOHAR',
      u: 0.72,
      v: 0.34,
      sounding: '28.2m',
      latLng: '25°02.1\'N, 55°08.4\'E',
      illumination: 0
    },
    {
      id: 't-3',
      name: 'DEEP WATER ANCHORAGE',
      code: 'ANCHOR-ALPHA',
      u: 0.42,
      v: 0.76,
      sounding: '42.5m',
      latLng: '24°58.6\'N, 55°01.2\'E',
      illumination: 0
    },
    {
      id: 't-4',
      name: 'TRAFFIC SEPARATION TSS',
      code: 'HORMUZ-CORRIDOR',
      u: 0.86,
      v: 0.62,
      sounding: '34.0m',
      latLng: '25°06.5\'N, 55°14.0\'E',
      illumination: 0
    },
    {
      id: 't-5',
      name: 'SUBSEA OPTICAL CABLE HAZARD',
      code: 'CABLE-SURVEY',
      u: 0.18,
      v: 0.84,
      sounding: '12.8m',
      latLng: '24°54.3\'N, 54°58.1\'E',
      illumination: 0
    },
    {
      id: 't-6',
      name: 'MUNDRA FEEDER DIRECT LOCUS',
      code: 'WP-ALPHA',
      u: 0.50,
      v: 0.88,
      sounding: '22.0m',
      latLng: '24°50.1\'N, 55°05.0\'E',
      illumination: 0
    }
  ];

  // Computed state for 3-Tab Search Engine
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

  matchedVessel = computed(() => {
    const q = this.vesselSearchQuery().toLowerCase().trim();
    if (!q) return this.service.vessels()[0] || null;
    return this.service.vessels().find(v =>
      v.name.toLowerCase().includes(q) ||
      v.imo.includes(q) ||
      (v.service_code && v.service_code.toLowerCase().includes(q))
    ) || this.service.vessels()[0] || null;
  });

  // Flagship Seamless Scroll Handoff Transform
  flagshipTransform(): string {
    const nx = this.normMouseX();
    const ny = this.normMouseY();
    const p = this.scrollProgress();

    // Floating 3D parallax tilt
    const tiltX = -ny * 6;
    const tiltY = nx * 6;
    const shiftX = nx * 24;
    const shiftY = ny * 24;

    // Scroll-driven handoff: As user scrolls (0 to 1), vessel translates downward and centers towards fairway gate
    const scrollOffsetY = p * 190;
    const scrollScale = 1.0 - p * 0.16;
    const scrollOpacity = 1.0 - Math.max(0, (p - 0.75) / 0.25);

    return `translate3d(${shiftX.toFixed(1)}px, ${(shiftY + scrollOffsetY).toFixed(1)}px, 20px) rotateX(${tiltX.toFixed(1)}deg) rotateY(${tiltY.toFixed(1)}deg) scale(${scrollScale.toFixed(3)}) opacity(${scrollOpacity.toFixed(2)})`;
  }

  // Magnetic Button transform
  magneticBtnTransform(): string {
    const dx = this.btnDx();
    const dy = this.btnDy();
    return `translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, 0)`;
  }

  ngAfterViewInit() {
    this.initCanvas();
    this.initScrollListener();
    this.initResizeListener();
    this.startRenderLoop();
    this.updateVesselCoordinates();
  }

  ngOnDestroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
    if (this.dprMediaQuery) {
      this.dprMediaQuery.removeEventListener('change', this.onDprChange);
      this.dprMediaQuery = null;
    }
    window.removeEventListener('scroll', this.onWindowScroll);
    window.removeEventListener('resize', this.onWindowResize);
    window.removeEventListener('focus', this.onWindowFocus);
    if (typeof document !== 'undefined') {
      document.removeEventListener('visibilitychange', this.onVisibilityChange);
    }
  }

  // =========================================================
  // CANVAS ENGINE: WAVE MESH, DISPLACEMENT, & SONAR
  // =========================================================
  private initCanvas() {
    if (!this.canvasRef || !this.sectionRef) return;
    const canvas = this.canvasRef.nativeElement;
    const rect = canvas.getBoundingClientRect();

    // Guard: During macOS Space/desktop transitions or when hidden, rect can report 0 width/height.
    // Never re-initialize with 0 or negative dimensions to avoid collapsing or distorting the grid!
    if (rect.width <= 0 || rect.height <= 0) return;

    const dpr = typeof window !== 'undefined' ? (window.devicePixelRatio || 1) : 1;
    const newWidth = Math.round(rect.width);
    const newHeight = Math.round(rect.height);
    const newPixelWidth = Math.round(newWidth * dpr);
    const newPixelHeight = Math.round(newHeight * dpr);

    this.canvasWidth = newWidth;
    this.canvasHeight = newHeight;
    this.currentDpr = dpr;

    // Set backing store physical pixel resolution
    canvas.width = newPixelWidth;
    canvas.height = newPixelHeight;

    this.ctx = canvas.getContext('2d');
    if (this.ctx) {
      // Use setTransform instead of scale to guarantee clean identity scaling without compounding zoom!
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    this.initGridMesh();
    this.updateVesselCoordinates();
  }

  private initGridMesh() {
    this.gridVertices = [];
    const spacing = 48;
    const cols = Math.ceil(this.canvasWidth / spacing) + 1;
    const rows = Math.ceil(this.canvasHeight / spacing) + 1;
    this.gridCols = cols;
    this.gridRows = rows;

    const soundings = ['14.2m', '18.6m', '24.0m', '31.5m', '42.8m', '8.9m', '12.4m', '28.0m'];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = c * spacing;
        const y = r * spacing;
        const isSounding = (r % 3 === 0 && c % 3 === 0);
        const sounding = isSounding ? soundings[(r + c) % soundings.length] : '';

        this.gridVertices.push({
          x0: x,
          y0: y,
          x,
          y,
          vx: 0,
          vy: 0,
          isSounding,
          sounding
        });
      }
    }
  }

  private updateVesselCoordinates() {
    if (this.flagshipRef && this.sectionRef) {
      const sRect = this.sectionRef.nativeElement.getBoundingClientRect();
      const fRect = this.flagshipRef.nativeElement.getBoundingClientRect();
      if (sRect.width > 0 && fRect.width > 0) {
        this.vesselCenterX.set(fRect.left - sRect.left + fRect.width / 2);
        this.vesselCenterY.set(fRect.top - sRect.top + fRect.height / 2);
      }
    } else if (this.sectionRef) {
      const rect = this.sectionRef.nativeElement.getBoundingClientRect();
      if (rect.width > 0) {
        this.vesselCenterX.set(rect.width * 0.72);
        this.vesselCenterY.set(rect.height * 0.48);
      }
    }
  }

  private startRenderLoop() {
    this.ngZone.runOutsideAngular(() => {
      this.lastRenderTime = performance.now();

      const loop = (currentTime: number) => {
        if (!this.isWaterMotionPaused()) {
          const dt = Math.min((currentTime - this.lastRenderTime) / 1000, 0.1);
          this.lastRenderTime = currentTime;

          this.updatePhysics(currentTime, dt);
          this.renderCanvas(currentTime);
        } else {
          // If paused (e.g. user toggle or reduced-motion), preserve steady frame
          this.renderCanvas(this.lastRenderTime);
        }

        this.animationFrameId = requestAnimationFrame(loop);
      };

      this.animationFrameId = requestAnimationFrame(loop);
    });
  }

  private updatePhysics(time: number, dt: number) {
    // 1. Lerp cursor coordinates
    if (this.targetMouseX > -500) {
      this.lerpMouseX += (this.targetMouseX - this.lerpMouseX) * 0.14;
      this.lerpMouseY += (this.targetMouseY - this.lerpMouseY) * 0.14;

      this.mouseVx = this.lerpMouseX - this.prevMouseX;
      this.mouseVy = this.lerpMouseY - this.prevMouseY;
      this.mouseSpeed = Math.hypot(this.mouseVx, this.mouseVy);

      this.prevMouseX = this.lerpMouseX;
      this.prevMouseY = this.lerpMouseY;

      // Spawn trailing wake particle if cursor is active
      if (this.isMouseInside && this.mouseSpeed > 0.8) {
        this.wakeTrail.push({
          x: this.lerpMouseX,
          y: this.lerpMouseY,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          radius: Math.min(this.mouseSpeed * 2.2 + 8, 38),
          life: 1.0,
          maxLife: 1.0
        });
      }
    }

    // 2. Vertex displacement physics
    const R = 140; // displacement radius
    for (let i = 0; i < this.gridVertices.length; i++) {
      const v = this.gridVertices[i];

      if (this.isMouseInside && this.targetMouseX > -500) {
        const dx = v.x - this.lerpMouseX;
        const dy = v.y - this.lerpMouseY;
        const dist = Math.hypot(dx, dy);

        if (dist < R && dist > 0.001) {
          const factor = (1 - dist / R);
          const pushForce = factor * factor * Math.min(this.mouseSpeed * 0.5 + 2.5, 18);
          const angle = Math.atan2(dy, dx);

          v.vx += Math.cos(angle) * pushForce * 0.12;
          v.vy += Math.sin(angle) * pushForce * 0.12;
        }
      }

      // Spring restoration to home position
      const ax = (v.x0 - v.x) * 0.08 - v.vx * 0.12;
      const ay = (v.y0 - v.y) * 0.08 - v.vy * 0.12;

      v.vx = (v.vx + ax) * 0.88;
      v.vy = (v.vy + ay) * 0.88;

      v.x += v.vx;
      v.y += v.vy;
    }

    // 3. Update wake particles
    for (let i = this.wakeTrail.length - 1; i >= 0; i--) {
      const p = this.wakeTrail[i];
      p.life -= dt * 0.75; // decays over ~1.3s
      p.radius += dt * 18;
      p.x += p.vx * dt * 20;
      p.y += p.vy * dt * 20;
      if (p.life <= 0) {
        this.wakeTrail.splice(i, 1);
      }
    }

    // 4. Update Sonar Shockwaves
    for (let i = this.sonarShockwaves.length - 1; i >= 0; i--) {
      const s = this.sonarShockwaves[i];
      s.radius += s.speed;
      s.alpha = Math.max(0, 1 - (s.radius / s.maxRadius));

      // Trigger hidden chart targets when wave front passes them
      for (const t of this.hiddenTargets) {
        const tx = t.u * this.canvasWidth;
        const ty = t.v * this.canvasHeight;
        const dist = Math.hypot(tx - s.x, ty - s.y);

        if (Math.abs(dist - s.radius) < 32) {
          t.illumination = 1.0; // fully illuminated!
        }
      }

      if (s.radius >= s.maxRadius || s.alpha <= 0) {
        this.sonarShockwaves.splice(i, 1);
      }
    }

    // 5. Fade out illuminated targets
    for (const t of this.hiddenTargets) {
      if (t.illumination > 0) {
        t.illumination = Math.max(0, t.illumination - dt * 0.5); // 2 second fade out
      }
    }

    // 6. Calculate proximity & magnetic pull for telemetry nodes
    this.updateNodeProximity();
  }

  private renderCanvas(time: number) {
    const ctx = this.ctx;
    if (!ctx) return;

    ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

    // 1. Draw Wave Mesh & Fluid Ocean Surface
    this.drawOceanWaves(ctx, time);

    // 2. Draw Nautical Coordinate Grid Mesh
    this.drawNauticalGrid(ctx);

    // 3. Draw Trailing Wake Ripples
    this.drawWakeTrail(ctx);

    // 4. Draw Sonar Shockwaves
    this.drawSonarShockwaves(ctx);

    // 5. Draw Dynamic SVG/Canvas Laser Tethers from Active Nodes to Vessel
    this.drawDynamicTethers(ctx, time);

    // 6. Draw Illuminated Hidden Shipping Lanes & Targets
    this.drawIlluminatedTargets(ctx);
  }

  private drawDynamicTethers(ctx: CanvasRenderingContext2D, time: number) {
    if (this.isMobileView()) return;
    const vx = this.vesselCenterX();
    const vy = this.vesselCenterY();

    for (const node of this.telemetryNodes) {
      if (node.glowFactor <= 0.02) continue;

      const nx = (node.normX * this.canvasWidth) + 112 + node.dx;
      const ny = (node.normY * this.canvasHeight) + 40 + node.dy;
      const alpha = Math.min(1.0, node.glowFactor);

      // 1. Draw glowing dashed laser line from node to vessel
      ctx.beginPath();
      ctx.setLineDash([6, 6]);
      ctx.lineDashOffset = -time * 0.04;
      ctx.moveTo(nx, ny);
      ctx.lineTo(vx, vy);
      ctx.strokeStyle = `rgba(221, 1, 3, ${alpha * 0.88})`;
      ctx.lineWidth = 2.0;
      ctx.stroke();
      ctx.setLineDash([]);

      // 2. Terminal glowing circles at node center
      ctx.beginPath();
      ctx.arc(nx, ny, 5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(221, 1, 3, ${alpha})`;
      ctx.fill();

      // 3. Terminal pulsing ring at vessel anchor
      ctx.beginPath();
      ctx.arc(vx, vy, 6 + (Math.sin(time * 0.01) + 1) * 3, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(221, 1, 3, ${alpha * 0.9})`;
      ctx.lineWidth = 1.8;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(vx, vy, 4, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(221, 1, 3, ${alpha})`;
      ctx.fill();
    }
  }

  private drawOceanWaves(ctx: CanvasRenderingContext2D, time: number) {
    const w = this.canvasWidth;
    const h = this.canvasHeight;
    const theme = this.waterTheme();
    const t = time * 0.001;

    // 0. Sunlight Water Caustics (Underwater Refraction Shimmer)
    if (theme !== 'slate') {
      this.drawWaterCaustics(ctx, time, theme);
    }

    // Determine water wave color palettes based on active theme
    let wave1Fill: CanvasGradient;
    let wave2Fill: CanvasGradient;
    let wave3Fill: CanvasGradient;
    let wave4Fill: CanvasGradient;
    let foamStroke = 'rgba(255, 255, 255, 0.75)';

    if (theme === 'deep') {
      // Deep Abyssal Swell: midnight navy with bioluminescent cyan touches
      wave1Fill = ctx.createLinearGradient(0, h * 0.35, 0, h);
      wave1Fill.addColorStop(0, 'rgba(3, 30, 85, 0.70)');
      wave1Fill.addColorStop(1, 'rgba(1, 15, 45, 0.90)');

      wave2Fill = ctx.createLinearGradient(0, h * 0.48, 0, h);
      wave2Fill.addColorStop(0, 'rgba(2, 60, 135, 0.65)');
      wave2Fill.addColorStop(1, 'rgba(2, 25, 75, 0.85)');

      wave3Fill = ctx.createLinearGradient(0, h * 0.62, 0, h);
      wave3Fill.addColorStop(0, 'rgba(14, 165, 233, 0.40)');
      wave3Fill.addColorStop(1, 'rgba(3, 40, 100, 0.75)');

      wave4Fill = ctx.createLinearGradient(0, h * 0.78, 0, h);
      wave4Fill.addColorStop(0, 'rgba(56, 189, 248, 0.35)');
      wave4Fill.addColorStop(1, 'rgba(2, 20, 60, 0.85)');

      foamStroke = 'rgba(224, 242, 254, 0.85)';
    } else if (theme === 'azure') {
      // Azure Coastal Sea: vibrant daylight marine aquamarine to cerulean
      wave1Fill = ctx.createLinearGradient(0, h * 0.35, 0, h);
      wave1Fill.addColorStop(0, 'rgba(14, 165, 233, 0.55)');
      wave1Fill.addColorStop(1, 'rgba(3, 105, 161, 0.75)');

      wave2Fill = ctx.createLinearGradient(0, h * 0.48, 0, h);
      wave2Fill.addColorStop(0, 'rgba(56, 189, 248, 0.60)');
      wave2Fill.addColorStop(1, 'rgba(2, 132, 199, 0.80)');

      wave3Fill = ctx.createLinearGradient(0, h * 0.62, 0, h);
      wave3Fill.addColorStop(0, 'rgba(125, 211, 252, 0.65)');
      wave3Fill.addColorStop(1, 'rgba(14, 165, 233, 0.85)');

      wave4Fill = ctx.createLinearGradient(0, h * 0.78, 0, h);
      wave4Fill.addColorStop(0, 'rgba(186, 230, 253, 0.70)');
      wave4Fill.addColorStop(1, 'rgba(3, 105, 161, 0.90)');

      foamStroke = 'rgba(255, 255, 255, 0.90)';
    } else {
      // Calm Slate: subtle corporate water wash
      wave1Fill = ctx.createLinearGradient(0, h * 0.50, 0, h);
      wave1Fill.addColorStop(0, 'rgba(2, 25, 75, 0.04)');
      wave1Fill.addColorStop(1, 'rgba(2, 25, 75, 0.08)');

      wave2Fill = ctx.createLinearGradient(0, h * 0.65, 0, h);
      wave2Fill.addColorStop(0, 'rgba(2, 132, 199, 0.05)');
      wave2Fill.addColorStop(1, 'rgba(2, 132, 199, 0.10)');

      wave3Fill = ctx.createLinearGradient(0, h * 0.78, 0, h);
      wave3Fill.addColorStop(0, 'rgba(221, 1, 3, 0.03)');
      wave3Fill.addColorStop(1, 'rgba(221, 1, 3, 0.06)');

      wave4Fill = wave3Fill;
      foamStroke = 'rgba(255, 255, 255, 0.35)';
    }

    // ==========================================
    // LAYER 1: DEEP OCEAN GROUND SWELL (Background)
    // ==========================================
    ctx.beginPath();
    ctx.moveTo(0, h * 0.40);
    for (let x = 0; x <= w; x += 25) {
      const y = h * 0.40 +
        Math.sin(x * 0.0022 + t * 0.7) * 22 +
        Math.cos(x * 0.0045 - t * 0.4) * 12;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fillStyle = wave1Fill;
    ctx.fill();

    // ==========================================
    // LAYER 2: MID-WATER ROLLING SURGE
    // ==========================================
    ctx.beginPath();
    const wave2Points: { x: number; y: number }[] = [];
    ctx.moveTo(0, h * 0.52);
    for (let x = 0; x <= w; x += 18) {
      const y = h * 0.52 +
        Math.sin(x * 0.0032 - t * 1.0 + 1.6) * 25 +
        Math.cos(x * 0.0065 + t * 0.6) * 14;
      wave2Points.push({ x, y });
      ctx.lineTo(x, y);
    }
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fillStyle = wave2Fill;
    ctx.fill();

    // Subtle foam crest on Layer 2
    if (theme !== 'slate') {
      ctx.beginPath();
      for (let i = 0; i < wave2Points.length; i++) {
        const pt = wave2Points[i];
        if (i === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      }
      ctx.strokeStyle = foamStroke;
      ctx.lineWidth = 1.8;
      ctx.stroke();
    }

    // ==========================================
    // LAYER 3: SURFACE WAVE ROLLERS
    // ==========================================
    ctx.beginPath();
    const wave3Points: { x: number; y: number }[] = [];
    ctx.moveTo(0, h * 0.68);
    for (let x = 0; x <= w; x += 14) {
      const y = h * 0.68 +
        Math.sin(x * 0.0045 + t * 1.3) * 20 +
        Math.cos(x * 0.009 - t * 0.9) * 10;
      wave3Points.push({ x, y });
      ctx.lineTo(x, y);
    }
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fillStyle = wave3Fill;
    ctx.fill();

    // White foam breaker line along Layer 3 crests
    if (theme !== 'slate') {
      ctx.beginPath();
      for (let i = 0; i < wave3Points.length; i++) {
        const pt = wave3Points[i];
        if (i === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      }
      ctx.strokeStyle = foamStroke;
      ctx.lineWidth = 2.4;
      ctx.stroke();
    }

    // ==========================================
    // LAYER 4: FOREGROUND WAVE CREST & SURF FOAM
    // ==========================================
    ctx.beginPath();
    const wave4Points: { x: number; y: number }[] = [];
    ctx.moveTo(0, h * 0.82);
    for (let x = 0; x <= w; x += 12) {
      const y = h * 0.82 +
        Math.sin(x * 0.006 - t * 1.6 + 0.8) * 16 +
        Math.cos(x * 0.012 + t * 1.1) * 8;
      wave4Points.push({ x, y });
      ctx.lineTo(x, y);
    }
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fillStyle = wave4Fill;
    ctx.fill();

    // Foam spray line and sparkling bubbles
    if (theme !== 'slate') {
      ctx.beginPath();
      for (let i = 0; i < wave4Points.length; i++) {
        const pt = wave4Points[i];
        if (i === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      }
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.92)';
      ctx.lineWidth = 3.0;
      ctx.stroke();

      // Spray foam bubbles at wave crest peaks
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      for (let i = 0; i < wave4Points.length; i += 3) {
        const pt = wave4Points[i];
        const sparkle = Math.sin(pt.x * 0.05 + t * 4);
        if (sparkle > 0.4) {
          ctx.beginPath();
          ctx.arc(pt.x, pt.y - 3 + sparkle * 2, 1.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  }

  private drawWaterCaustics(ctx: CanvasRenderingContext2D, time: number, theme: 'deep' | 'azure' | 'slate') {
    const w = this.canvasWidth;
    const h = this.canvasHeight;
    const t = time * 0.0006;
    const causticAlpha = theme === 'deep' ? 0.08 : 0.16;

    ctx.save();
    ctx.strokeStyle = `rgba(255, 255, 255, ${causticAlpha})`;
    ctx.lineWidth = 1.5;

    // Draw 3 interwoven caustic light curves simulating underwater refraction
    for (let c = 0; c < 3; c++) {
      ctx.beginPath();
      const phase = c * 1.8;
      const baseY = h * (0.25 + c * 0.15);
      for (let x = 0; x <= w; x += 30) {
        const y = baseY +
          Math.sin(x * 0.005 + t * (c + 1) + phase) * 20 +
          Math.cos(x * 0.009 - t * 1.5) * 12;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    ctx.restore();
  }

  private drawNauticalGrid(ctx: CanvasRenderingContext2D) {
    if (this.gridCols <= 0 || this.gridRows <= 0) return;
    const cols = this.gridCols;
    const rows = this.gridRows;
    const theme = this.waterTheme();

    ctx.lineWidth = 1;
    if (theme === 'deep') {
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.12)';
    } else if (theme === 'azure') {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
    } else {
      ctx.strokeStyle = 'rgba(2, 25, 75, 0.055)';
    }

    // Draw horizontal grid lines across displaced vertices
    for (let r = 0; r < rows; r++) {
      ctx.beginPath();
      for (let c = 0; c < cols; c++) {
        const idx = r * cols + c;
        if (idx < this.gridVertices.length) {
          const v = this.gridVertices[idx];
          if (c === 0) ctx.moveTo(v.x, v.y);
          else ctx.lineTo(v.x, v.y);
        }
      }
      ctx.stroke();
    }

    // Draw vertical grid lines
    for (let c = 0; c < cols; c++) {
      ctx.beginPath();
      for (let r = 0; r < rows; r++) {
        const idx = r * cols + c;
        if (idx < this.gridVertices.length) {
          const v = this.gridVertices[idx];
          if (r === 0) ctx.moveTo(v.x, v.y);
          else ctx.lineTo(v.x, v.y);
        }
      }
      ctx.stroke();
    }

    // Draw intersection crosses & depth soundings
    ctx.font = '9px monospace';
    if (theme === 'deep') {
      ctx.fillStyle = 'rgba(125, 211, 252, 0.55)';
    } else if (theme === 'azure') {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.70)';
    } else {
      ctx.fillStyle = 'rgba(2, 25, 75, 0.35)';
    }

    for (let i = 0; i < this.gridVertices.length; i++) {
      const v = this.gridVertices[i];

      // Intersection cross
      if (i % 2 === 0) {
        ctx.fillStyle = 'rgba(2, 25, 75, 0.2)';
        ctx.fillRect(v.x - 2, v.y, 5, 1);
        ctx.fillRect(v.x, v.y - 2, 1, 5);
      }

      // Depth Sounding text
      if (v.isSounding) {
        ctx.fillStyle = 'rgba(2, 25, 75, 0.38)';
        ctx.fillText(v.sounding, v.x + 4, v.y - 4);
      }
    }
  }

  private drawWakeTrail(ctx: CanvasRenderingContext2D) {
    for (const p of this.wakeTrail) {
      const alpha = p.life * 0.45;

      // Outer expanding foamy ring
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(2, 132, 199, ${alpha * 0.7})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Inner white foam core
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius * 0.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.8})`;
      ctx.fill();
    }
  }

  private drawSonarShockwaves(ctx: CanvasRenderingContext2D) {
    if (this.isMobileView()) return;
    for (const s of this.sonarShockwaves) {
      // 1. Glowing outer crimson shockwave ring (#DD0103)
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(221, 1, 3, ${s.alpha * 0.85})`;
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // 2. Secondary dashed blue echo ring
      if (s.radius > 30) {
        ctx.beginPath();
        ctx.setLineDash([8, 8]);
        ctx.arc(s.x, s.y, s.radius * 0.85, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(2, 132, 199, ${s.alpha * 0.5})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // 3. Faint concentric inner wash
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius * 0.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(221, 1, 3, ${s.alpha * 0.03})`;
      ctx.fill();
    }
  }

  private drawIlluminatedTargets(ctx: CanvasRenderingContext2D) {
    if (this.isMobileView()) return;
    for (const t of this.hiddenTargets) {
      if (t.illumination <= 0.01) continue;

      const tx = t.u * this.canvasWidth;
      const ty = t.v * this.canvasHeight;
      const alpha = t.illumination;

      // Target Blip: Pulsing Concentric Rings
      ctx.beginPath();
      ctx.arc(tx, ty, 14 * alpha, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(221, 1, 3, ${alpha * 0.9})`;
      ctx.lineWidth = 1.8;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(tx, ty, 6 * alpha, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(221, 1, 3, ${alpha * 0.95})`;
      ctx.fill();

      // Radar Crosshairs
      ctx.beginPath();
      ctx.moveTo(tx - 20, ty);
      ctx.lineTo(tx + 20, ty);
      ctx.moveTo(tx, ty - 20);
      ctx.lineTo(tx, ty + 20);
      ctx.strokeStyle = `rgba(2, 25, 75, ${alpha * 0.6})`;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Ghosted Nautical Chart Sounding & Tag Box
      const boxW = 165;
      const boxH = 46;
      const boxX = tx + 14;
      const boxY = ty - 23;

      ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.92})`;
      ctx.strokeStyle = `rgba(221, 1, 3, ${alpha * 0.85})`;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.roundRect(boxX, boxY, boxW, boxH, 6);
      ctx.fill();
      ctx.stroke();

      // Text Labels
      ctx.font = 'bold 9px monospace';
      ctx.fillStyle = `rgba(221, 1, 3, ${alpha})`;
      ctx.fillText(`AIS TARGET: ${t.code}`, boxX + 8, boxY + 14);

      ctx.font = '8px monospace';
      ctx.fillStyle = `rgba(2, 25, 75, ${alpha})`;
      ctx.fillText(t.name, boxX + 8, boxY + 26);
      ctx.fillText(`${t.latLng} • SNDG ${t.sounding}`, boxX + 8, boxY + 38);
    }
  }

  // =========================================================
  // INTERACTIVE EVENT HANDLERS: MOUSE, CLICK, & PROXIMITY
  // =========================================================
  onCanvasClick(e: MouseEvent) {
    if (this.isMobileView()) return;
    this.triggerSonarPing(e.clientX, e.clientY);
  }

  onSectionClick(e: MouseEvent) {
    if (this.isMobileView()) return;
    const target = e.target as HTMLElement;
    if (target.closest('button, select, input, a, .magnetic-liquid-btn')) return;
    this.triggerSonarPing(e.clientX, e.clientY);
  }

  private triggerSonarPing(clientX: number, clientY: number) {
    if (this.isMobileView() || !this.sectionRef) return;
    const rect = this.sectionRef.nativeElement.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    this.sonarShockwaves.push({
      x,
      y,
      radius: 0,
      maxRadius: Math.max(rect.width, rect.height) * 0.85,
      speed: 6.5,
      alpha: 1.0
    });
  }

  onSectionMouseMove(e: MouseEvent) {
    if (this.isMobileView() || !this.sectionRef) return;
    const rect = this.sectionRef.nativeElement.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    this.targetMouseX = x;
    this.targetMouseY = y;
    this.isMouseInside = true;

    // Normalized coordinates from center [-1, 1]
    const nx = (x - rect.width / 2) / (rect.width / 2);
    const ny = (y - rect.height / 2) / (rect.height / 2);
    this.normMouseX.set(Math.max(-1, Math.min(1, nx)));
    this.normMouseY.set(Math.max(-1, Math.min(1, ny)));

    // Magnetic Button Calculation
    this.calculateMagneticButton(e.clientX, e.clientY);
  }

  onSectionMouseLeave() {
    this.isMouseInside = false;
    this.targetMouseX = -1000;
    this.targetMouseY = -1000;
    this.normMouseX.set(0);
    this.normMouseY.set(0);
    this.btnDx.set(0);
    this.btnDy.set(0);

    for (const node of this.telemetryNodes) {
      node.dx = 0;
      node.dy = 0;
      node.isHovered = false;
      node.glowFactor = 0;
    }
    if (this.activeHoveredNodeId() !== null) {
      this.ngZone.run(() => {
        this.activeHoveredNodeId.set(null);
      });
    }
  }

  onTouchStart() {
    if (this.isMobileView()) {
      this.isMouseInside = false;
      this.targetMouseX = -1000;
      this.targetMouseY = -1000;
    }
  }

  onTouchEnd() {
    if (this.isMobileView()) {
      this.isMouseInside = false;
      this.targetMouseX = -1000;
      this.targetMouseY = -1000;
      this.normMouseX.set(0);
      this.normMouseY.set(0);
      this.btnDx.set(0);
      this.btnDy.set(0);

      for (const node of this.telemetryNodes) {
        node.dx = 0;
        node.dy = 0;
        node.isHovered = false;
        node.glowFactor = 0;
      }
      if (this.activeHoveredNodeId() !== null) {
        this.ngZone.run(() => {
          this.activeHoveredNodeId.set(null);
        });
      }
    }
  }

  private calculateMagneticButton(clientX: number, clientY: number) {
    if (this.isMobileView() || !this.magneticBtnRef) return;
    const btnRect = this.magneticBtnRef.nativeElement.getBoundingClientRect();
    const btnCenterX = btnRect.left + btnRect.width / 2;
    const btnCenterY = btnRect.top + btnRect.height / 2;

    const dx = clientX - btnCenterX;
    const dy = clientY - btnCenterY;
    const dist = Math.hypot(dx, dy);

    const pullRadius = 110;
    if (dist < pullRadius) {
      const pull = (1 - dist / pullRadius);
      this.btnDx.set(dx * 0.28 * pull);
      this.btnDy.set(dy * 0.28 * pull);

      // Angle for liquid wave fill origin
      const angle = Math.atan2(dy, dx);
      const waveX = 50 + Math.cos(angle) * 45;
      const waveY = 50 + Math.sin(angle) * 45;
      this.magneticBtnRef.nativeElement.style.setProperty('--wave-x', `${waveX}%`);
      this.magneticBtnRef.nativeElement.style.setProperty('--wave-y', `${waveY}%`);
    } else {
      this.btnDx.set(0);
      this.btnDy.set(0);
    }
  }

  private updateNodeProximity() {
    if (this.isMobileView() || !this.sectionRef || !this.isMouseInside || this.lerpMouseX < 0) return;
    const rect = this.sectionRef.nativeElement.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;

    const PROXIMITY_RADIUS = 180;
    let closestNodeId: string | null = null;
    let closestDist = PROXIMITY_RADIUS;

    for (const node of this.telemetryNodes) {
      const nodeX = node.normX * w + 110;
      const nodeY = node.normY * h + 40;

      const dx = this.lerpMouseX - nodeX;
      const dy = this.lerpMouseY - nodeY;
      const dist = Math.hypot(dx, dy);

      if (dist < PROXIMITY_RADIUS) {
        const factor = (1 - dist / PROXIMITY_RADIUS);
        node.dx = dx * 0.22 * factor;
        node.dy = dy * 0.22 * factor;
        node.isHovered = true;
        node.glowFactor = factor;
        if (dist < closestDist) {
          closestDist = dist;
          closestNodeId = node.id;
        }
      } else {
        node.dx += (0 - node.dx) * 0.15;
        node.dy += (0 - node.dy) * 0.15;
        node.isHovered = false;
        node.glowFactor = Math.max(0, node.glowFactor - 0.05);
      }
    }

    if (this.activeHoveredNodeId() !== closestNodeId) {
      this.ngZone.run(() => {
        this.activeHoveredNodeId.set(closestNodeId);
      });
    }
  }

  onNodeHover(node: TelemetryNode, isHovered: boolean) {
    node.isHovered = isHovered;
    if (isHovered) {
      node.glowFactor = 1.0;
      this.activeHoveredNodeId.set(node.id);
    } else if (this.activeHoveredNodeId() === node.id) {
      this.activeHoveredNodeId.set(null);
    }
  }

  getNodeScreenX(node: TelemetryNode): number {
    return (node.normX * this.canvasWidth) + 110 + node.dx;
  }

  getNodeScreenY(node: TelemetryNode): number {
    return (node.normY * this.canvasHeight) + 40 + node.dy;
  }

  // =========================================================
  // SCROLL & NAVIGATION HANDOFF
  // =========================================================
  private initScrollListener() {
    window.addEventListener('scroll', this.onWindowScroll, { passive: true });
  }

  private onWindowScroll = () => {
    const scrollY = window.scrollY || window.pageYOffset;
    const handoffHeight = 400; // transition window
    const progress = Math.min(Math.max(scrollY / handoffHeight, 0), 1);
    this.scrollProgress.set(progress);
    this.updateVesselCoordinates();
  };

  private initResizeListener() {
    window.addEventListener('resize', this.onWindowResize, { passive: true });
    window.addEventListener('focus', this.onWindowFocus, { passive: true });
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', this.onVisibilityChange, { passive: true });
    }

    // Use ResizeObserver for accurate container box layout tracking
    if (typeof ResizeObserver !== 'undefined' && this.sectionRef) {
      this.resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          if (entry.contentRect.width > 0 && entry.contentRect.height > 0) {
            this.initCanvas();
            this.updateVesselCoordinates();
            break;
          }
        }
      });
      this.resizeObserver.observe(this.sectionRef.nativeElement);
    }

    this.listenToDprChange();
  }

  private onWindowFocus = () => {
    this.initCanvas();
    this.updateVesselCoordinates();
  };

  private onVisibilityChange = () => {
    if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
      // Returned from another desktop/space or tab: refresh canvas size and reset animation loop timer
      this.initCanvas();
      this.updateVesselCoordinates();
      this.lastRenderTime = performance.now();
    } else {
      // Switched desktop or tab hidden: safely disengage mouse interaction
      this.onSectionMouseLeave();
    }
  };

  private onDprChange = () => {
    this.initCanvas();
    this.listenToDprChange();
  };

  private listenToDprChange() {
    if (typeof window === 'undefined') return;
    if (this.dprMediaQuery) {
      this.dprMediaQuery.removeEventListener('change', this.onDprChange);
    }
    this.dprMediaQuery = window.matchMedia(`(resolution: ${window.devicePixelRatio || 1}dppx)`);
    this.dprMediaQuery.addEventListener('change', this.onDprChange, { once: true });
  }

  private onWindowResize = () => {
    const isMobile = typeof window !== 'undefined' ? window.innerWidth < 1024 : false;
    this.isMobileView.set(isMobile);
    if (isMobile) {
      this.sonarShockwaves = [];
      for (const t of this.hiddenTargets) {
        t.illumination = 0;
      }
      for (const node of this.telemetryNodes) {
        node.dx = 0;
        node.dy = 0;
        node.isHovered = false;
        node.glowFactor = 0;
      }
      this.normMouseX.set(0);
      this.normMouseY.set(0);
      this.btnDx.set(0);
      this.btnDy.set(0);
    }
    this.initCanvas();
    this.updateVesselCoordinates();
  };

  sailToRoute() {
    const journeyEl = document.getElementById('maritime-journey');
    if (journeyEl) {
      journeyEl.scrollIntoView({ behavior: 'smooth' });
    }
  }

  scrollToEngine(tab: 'service' | 'schedule' | 'tracking' = 'tracking') {
    this.activeTab.set(tab);
    const engineEl = document.getElementById('tracking-engine');
    if (engineEl) {
      engineEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // =========================================================
  // 3-TAB ENGINE LOGIC (PRESERVED 100%)
  // =========================================================
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
            <div style="font-weight: 800; font-size: 14px; color: #02194b;">${vessel.name}</div>
            <div style="font-size: 11px; color: #64748b; margin-bottom: 6px;">Flag: ${vessel.flag} | IMO: ${vessel.imo}</div>
            <div style="font-size: 12px; color: #02194b;"><b>Capacity:</b> ${vessel.nominal_cap_teu} TEU</div>
            <div style="font-size: 12px; color: #02194b;"><b>Service:</b> ${vessel.service_code || 'Spot'}</div>
            <div style="font-size: 11px; color: #10b981; margin-top: 4px;"><b>AIS:</b> ${vessel.current_status}</div>
          </div>
        `
      );
    }
  }
}
