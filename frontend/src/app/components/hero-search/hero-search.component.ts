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
         1. 100VH IMMERSIVE CURSOR-REACTIVE HERO VIEWPORT
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
      class="relative w-full h-screen min-h-[760px] max-h-[1100px] overflow-hidden bg-gradient-to-b from-[#f0f5fc] via-[#e8f1fb] to-[#ffffff] border-b border-slate-200 perspective-1200 preserve-3d select-none flex flex-col justify-between">

      <!-- =========================================================
           BACKGROUND LAYER: INTERACTIVE HTML5 CANVAS OCEAN & SONAR GRID
           ========================================================= -->
      <canvas
        #heroCanvas
        class="absolute inset-0 w-full h-full pointer-events-none lg:pointer-events-auto z-0 lg:cursor-crosshair">
      </canvas>

      <!-- =========================================================
           TOP REAL-TIME AIS TICKER STRIP
           ========================================================= -->
      <div class="relative z-20 w-full overflow-hidden bg-white/90 border-b border-slate-200/80 py-2 backdrop-blur-md shadow-sm">
        <div class="animate-marquee items-center gap-10 text-[11px] font-mono text-slate-700">
          <span class="inline-flex items-center gap-2 text-emerald-700 font-bold">
            <span class="w-2 h-2 rounded-full bg-emerald-500 beacon-pulse"></span>
            AIS LIVE SATELLITE FEED: 66 ACTIVE FEEDER VESSELS
          </span>
          <span>•</span>
          <span class="text-slate-600"><strong class="text-[#02194b]">ARABIAN GULF:</strong> 24 FEEDERS UNDERWAY (AVG 14.8 KN)</span>
          <span>•</span>
          <span class="text-slate-600"><strong class="text-[#02194b]">RED SEA / SUEZ:</strong> 14 IN TRANSIT • ZERO DISRUPTIONS</span>
          <span>•</span>
          <span class="text-slate-600"><strong class="text-[#02194b]">INDIAN SUBCONTINENT:</strong> 18 CALLS AT MUNDRA & NHAVA SHEVA</span>
          <span>•</span>
          <span class="text-[#dd0103] font-bold">JEBEL ALI HUB T1/T2/T3: 100% BERTHING EFFICIENCY</span>
          <span>•</span>
          <span class="inline-flex items-center gap-2 text-emerald-700 font-bold">
            <span class="w-2 h-2 rounded-full bg-emerald-500 beacon-pulse"></span>
            AIS LIVE SATELLITE FEED: 66 ACTIVE FEEDER VESSELS
          </span>
          <span>•</span>
          <span class="text-slate-600"><strong class="text-[#02194b]">ARABIAN GULF:</strong> 24 FEEDERS UNDERWAY (AVG 14.8 KN)</span>
        </div>
      </div>

      <!-- =========================================================
           DYNAMIC SVG TETHER LINES (CONNECTS ACTIVE NODES TO FLAGSHIP)
           ========================================================= -->
      <svg
        #tetherSvg
        class="hidden lg:block absolute inset-0 w-full h-full pointer-events-none z-15">
        <ng-container *ngFor="let node of telemetryNodes">
          <!-- Draw dynamic tether line if node has hover or glow -->
          <g *ngIf="node.isHovered || node.glowFactor > 0.05">
            <line
              [attr.x1]="getNodeScreenX(node)"
              [attr.y1]="getNodeScreenY(node)"
              [attr.x2]="vesselCenterX()"
              [attr.y2]="vesselCenterY()"
              stroke="#dd0103"
              [attr.stroke-opacity]="0.35 + node.glowFactor * 0.65"
              stroke-width="1.8"
              stroke-dasharray="5 5"
              class="animate-dash-tether" />
            
            <!-- Terminal Ping Node at Vessel Anchor Point -->
            <circle
              [attr.cx]="vesselCenterX()"
              [attr.cy]="vesselCenterY()"
              r="4.5"
              fill="#dd0103"
              class="animate-ping" />
            <circle
              [attr.cx]="vesselCenterX()"
              [attr.cy]="vesselCenterY()"
              r="3.5"
              fill="#dd0103" />

            <!-- Terminal Dot at Node -->
            <circle
              [attr.cx]="getNodeScreenX(node)"
              [attr.cy]="getNodeScreenY(node)"
              r="4.5"
              fill="#dd0103"
              [attr.opacity]="node.glowFactor" />
          </g>
        </ng-container>
      </svg>

      <!-- =========================================================
           MIDGROUND 2-COLUMN STAGE: TYPOGRAPHY (LEFT) & FLAGSHIP 3D THEATER (RIGHT)
           ========================================================= -->
      <div class="relative z-20 flex-1 max-w-7xl mx-auto px-4 sm:px-8 w-full flex items-center">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full py-4 sm:py-8">
          
          <!-- LEFT COLUMN: KINETIC TYPOGRAPHY & MAGNETIC CONTROLS (7 Cols) -->
          <div class="lg:col-span-7 z-30 space-y-5">
            
            <!-- Spinning Compass Reticle & Brand Pill Badge -->
            <div class="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/95 border border-red-200 shadow-sm text-xs font-bold text-[#dd0103]">
              <div class="w-4 h-4 relative flex items-center justify-center animate-compass-lock">
                <svg viewBox="0 0 24 24" class="w-full h-full text-[#dd0103] fill-none stroke-current" stroke-width="2">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 3 L12 6 M12 18 L12 21 M3 12 L6 12 M18 12 L21 12" />
                  <polygon points="12,7 14,12 12,17 10,12" fill="#dd0103" />
                </svg>
              </div>
              <span class="tracking-wide uppercase font-mono text-[11px] font-bold">
                {{ isRtl() ? 'الشبكة البحرية الإقليمية الرائدة' : 'MAVERICK SHIPPING LLC • CONTAINER FEEDER NETWORK' }}
              </span>
            </div>

            <!-- Live-Ticking Nautical Telemetry Bar -->
            <div class="flex items-center gap-2 text-[11px] font-mono text-slate-600 bg-white/80 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-slate-200/90 w-fit shadow-xs">
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span class="text-emerald-700 font-bold">DGPS LOCK</span>
              <span>•</span>
              <span class="text-[#02194b] font-bold">LAT 25°01.8' N</span>
              <span>•</span>
              <span class="text-[#02194b] font-bold">LON 055°06.4' E</span>
              <span>•</span>
              <span class="text-[#dd0103] font-bold">TIDE +1.4m</span>
            </div>

            <!-- Headline with Staggered Clip-Path Reveal -->
            <h1 class="text-3xl sm:text-5xl lg:text-6xl font-black text-[#02194b] tracking-tight leading-[1.08]">
              <span class="block overflow-hidden">
                <span class="inline-block animate-clip-reveal-1">
                  {{ isRtl() ? 'تمكين عمالقة الشحن' : 'Empowering Shipping Giants' }}
                </span>
              </span>
              <span class="block overflow-hidden">
                <span class="inline-block text-[#dd0103] animate-clip-reveal-2">
                  {{ isRtl() ? 'من خلال الابتكار الملاحي' : 'Through Feeder Innovation' }}
                </span>
              </span>
            </h1>

            <!-- Subtitle Description -->
            <p class="text-base sm:text-lg text-slate-700 leading-relaxed max-w-xl font-normal animate-fade-up">
              {{ isRtl() 
                ? 'ربط الموانئ المحورية في الخليج العربي والبحر الأحمر وشبه القارة الهندية وجنوب شرق آسيا بأعلى تردد وأدق مواعيد.' 
                : 'Connecting key container hubs across the Arabian Gulf, Red Sea, Indian Subcontinent, and Southeast Asia with high-frequency feeder reliability and precision logistics.' }}
            </p>

            <!-- Action Controls & Magnetic Liquid CTA Button -->
            <div class="flex flex-wrap items-center gap-4 pt-2 animate-fade-up">
              <!-- Magnetic Liquid CTA Button -->
              <button
                #magneticBtn
                id="sailCtaBtn"
                (click)="sailToRoute()"
                class="magnetic-liquid-btn py-4 px-8 rounded-2xl bg-[#dd0103] text-white font-black text-sm tracking-wide shadow-xl shadow-red-600/30 flex items-center gap-3 cursor-pointer group"
                [style.transform]="magneticBtnTransform()">
                <span class="liquid-wave"></span>
                <svg class="w-5 h-5 text-white transition-transform group-hover:rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
                <span>{{ isRtl() ? 'انطلق في المسار الملاحي' : 'Set Sail • Explore Navigational Route' }}</span>
              </button>

              <!-- Secondary Quick Access to 3-Tab Search Engine -->
              <button
                (click)="scrollToEngine()"
                class="py-4 px-6 rounded-2xl bg-white/90 hover:bg-white text-[#02194b] hover:text-[#dd0103] border border-slate-300 hover:border-[#dd0103] font-bold text-sm shadow-sm transition-all flex items-center gap-2 cursor-pointer backdrop-blur-md">
                <svg class="w-4 h-4 text-[#dd0103]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span>{{ isRtl() ? 'محرك الجداول والخدمات' : 'Find Services & Schedules' }}</span>
              </button>
            </div>
          </div>

          <!-- RIGHT COLUMN: 3D PARALLAX FLAGSHIP THEATER (5 Cols) -->
          <div class="lg:col-span-5 relative h-56 sm:h-72 lg:h-[440px] flex items-center justify-center pointer-events-none">
            
            <!-- Central Flagship Container (Seamless Scroll Handoff to Lower SVG Path) -->
            <div
              #flagshipEl
              class="relative pointer-events-none transition-all duration-300 ease-out will-change-transform"
              [style.transform]="flagshipTransform()">
              
              <div class="relative w-60 sm:w-80 lg:w-88 filter drop-shadow-[0_20px_25px_rgba(2,25,75,0.25)]">
                <svg viewBox="0 0 380 130" class="w-full h-auto overflow-visible">
                  <!-- Bow Parting Waves -->
                  <path d="M 190 20 C 130 10, 40 40, 10 90 C 80 55, 140 40, 190 25 Z" fill="rgba(255,255,255,0.75)" />
                  <path d="M 190 20 C 250 10, 340 40, 370 90 C 300 55, 240 40, 190 25 Z" fill="rgba(255,255,255,0.75)" />

                  <!-- Stern Engine Wake Bubbles -->
                  <ellipse cx="190" cy="118" rx="48" ry="14" fill="rgba(2,132,199,0.22)" />
                  <ellipse cx="190" cy="115" rx="32" ry="9" fill="rgba(255,255,255,0.85)" />

                  <!-- Outer Hull Contour (Maverick Navy #02194B) -->
                  <path
                    d="M 190 15 C 220 36, 230 68, 226 108 L 154 108 C 150 68, 160 36, 190 15 Z"
                    fill="#02194b"
                    stroke="#ffffff"
                    stroke-width="1.8" />

                  <!-- Bulbous Bow Tip & Red Keel Accent (#DD0103) -->
                  <path d="M 190 15 C 196 23, 198 29, 190 33 C 182 29, 184 23, 190 15 Z" fill="#dd0103" />

                  <!-- Foredeck -->
                  <polygon points="190,31 168,44 212,44" fill="#0f2b6e" />
                  <circle cx="190" cy="37" r="2.5" fill="#94a3b8" />

                  <!-- Container Stacks Grid (Alternating Maverick Red #DD0103 & Navy #02194B) -->
                  <!-- Tier 1 -->
                  <rect x="166" y="46" width="11" height="16" rx="1" fill="#dd0103" stroke="#b50102" stroke-width="0.5" />
                  <rect x="179" y="46" width="11" height="16" rx="1" fill="#02194b" stroke="#062569" stroke-width="0.5" />
                  <rect x="192" y="46" width="11" height="16" rx="1" fill="#f8fafc" stroke="#cbd5e1" stroke-width="0.5" /> <!-- Reefer -->
                  <rect x="205" y="46" width="11" height="16" rx="1" fill="#dd0103" stroke="#b50102" stroke-width="0.5" />

                  <!-- Tier 2 -->
                  <rect x="164" y="65" width="11" height="16" rx="1" fill="#02194b" stroke="#062569" stroke-width="0.5" />
                  <rect x="177" y="65" width="11" height="16" rx="1" fill="#dd0103" stroke="#b50102" stroke-width="0.5" />
                  <rect x="190" y="65" width="11" height="16" rx="1" fill="#02194b" stroke="#062569" stroke-width="0.5" />
                  <rect x="203" y="65" width="11" height="16" rx="1" fill="#dd0103" stroke="#b50102" stroke-width="0.5" />

                  <!-- Tier 3 -->
                  <rect x="164" y="84" width="11" height="13" rx="1" fill="#dd0103" stroke="#b50102" stroke-width="0.5" />
                  <rect x="177" y="84" width="11" height="13" rx="1" fill="#f8fafc" stroke="#cbd5e1" stroke-width="0.5" /> <!-- Reefer -->
                  <rect x="190" y="84" width="11" height="13" rx="1" fill="#dd0103" stroke="#b50102" stroke-width="0.5" />
                  <rect x="203" y="84" width="11" height="13" rx="1" fill="#02194b" stroke="#062569" stroke-width="0.5" />

                  <!-- Superstructure Bridge Tower (Aft) -->
                  <rect x="170" y="99" width="40" height="9" rx="1.5" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="0.8" />
                  <rect x="174" y="100.5" width="32" height="2.8" rx="0.5" fill="#fef08a" /> <!-- Bridge Windows Glow -->
                  <circle cx="190" cy="103" r="1.5" fill="#dd0103" /> <!-- Radar Mast Beacon -->

                  <!-- Masthead Navigation Lights -->
                  <circle cx="154" cy="74" r="2.2" fill="#ef4444" class="animate-pulse" /> <!-- Port Red Light -->
                  <circle cx="226" cy="74" r="2.2" fill="#22c55e" class="animate-pulse" /> <!-- Starboard Green Light -->
                  <circle cx="190" cy="18" r="2.5" fill="#ffffff" filter="drop-shadow(0 0 6px #ffffff)" /> <!-- Steaming Light -->

                  <!-- Vessel Name Branding -->
                  <text x="190" y="122" font-size="5.5" font-family="monospace" font-weight="900" fill="#02194b" text-anchor="middle" letter-spacing="1">
                    MAVERICK FLAGSHIP
                  </text>
                </svg>
              </div>
            </div>

            <!-- Flanking Buoy 01 (Starboard Lateral Green) -->
            <div class="absolute -top-4 left-6 w-10 h-16 pointer-events-none animate-buoy hidden sm:block">
              <span class="absolute top-0 left-4 w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span class="absolute top-0 left-4 w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_12px_#10b981]"></span>
              <svg viewBox="0 0 40 70" class="w-full h-full text-emerald-600 fill-current">
                <polygon points="20,8 10,32 30,32" />
                <rect x="8" y="32" width="24" height="18" rx="2" fill="#047857" />
                <path d="M6 50 C12 62, 28 62, 34 50 Z" fill="#065f46" />
              </svg>
            </div>

            <!-- Flanking Buoy 02 (Port Lateral Red) -->
            <div class="absolute -bottom-4 right-6 w-10 h-16 pointer-events-none animate-buoy hidden sm:block" style="animation-delay: -1.6s;">
              <span class="absolute top-0 left-4 w-2 h-2 rounded-full bg-red-400 animate-ping"></span>
              <span class="absolute top-0 left-4 w-2 h-2 rounded-full bg-[#dd0103] shadow-[0_0_12px_#dd0103]"></span>
              <svg viewBox="0 0 40 70" class="w-full h-full text-[#dd0103] fill-current">
                <rect x="12" y="10" width="16" height="22" rx="1" />
                <rect x="8" y="32" width="24" height="18" rx="2" fill="#b50102" />
                <path d="M6 50 C12 62, 28 62, 34 50 Z" fill="#7f1d1d" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- =========================================================
           PROXIMITY-REACTIVE FLOATING TELEMETRY NODES (POSITIONED IN PERIPHERY)
           ========================================================= -->
      <div class="absolute inset-0 pointer-events-none z-25 overflow-hidden">
        
        <!-- Node 0: Live Fleet Status (Top Right Flank) -->
        <div
          class="absolute pointer-events-auto transition-transform duration-150 ease-out will-change-transform hidden sm:block"
          [style.left]="(telemetryNodes[0].normX * 100) + '%'"
          [style.top]="(telemetryNodes[0].normY * 100) + '%'"
          [style.transform]="'translate3d(' + telemetryNodes[0].dx + 'px, ' + telemetryNodes[0].dy + 'px, 0)'">
          <div
            (mouseenter)="onNodeHover(telemetryNodes[0], true)"
            (mouseleave)="onNodeHover(telemetryNodes[0], false)"
            [ngClass]="activeHoveredNodeId() === telemetryNodes[0].id || telemetryNodes[0].isHovered ? 'border-[#dd0103] shadow-[0_0_25px_rgba(221,1,3,0.35)] scale-105' : 'border-slate-300/80 shadow-md'"
            class="bg-white/85 backdrop-blur-xl border rounded-2xl p-3 w-56 transition-all duration-200 cursor-pointer">
            <div class="flex items-center justify-between">
              <span class="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-wider">{{ telemetryNodes[0].title }}</span>
              <span class="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[8px] font-mono font-bold">
                {{ telemetryNodes[0].badge }}
              </span>
            </div>
            <div class="text-xs font-black text-[#02194b] mt-0.5">{{ telemetryNodes[0].value }}</div>
            <div class="text-[9px] font-mono text-slate-600">{{ telemetryNodes[0].subValue }}</div>

            <!-- Expandable Sparkline -->
            <div
              [ngClass]="activeHoveredNodeId() === telemetryNodes[0].id || telemetryNodes[0].isHovered ? 'max-h-14 opacity-100 mt-2 pt-1.5 border-t border-slate-200' : 'max-h-0 opacity-0 overflow-hidden'"
              class="transition-all duration-300 ease-out">
              <div class="flex items-center justify-between text-[8px] font-mono text-slate-500 mb-0.5">
                <span>SPEED TREND</span>
                <span class="text-[#dd0103] font-bold">+0.6 KN</span>
              </div>
              <svg viewBox="0 0 100 20" class="w-full h-5 text-[#dd0103]">
                <polyline fill="none" stroke="currentColor" stroke-width="2" points="0,16 20,13 40,17 60,8 80,7 100,4" />
                <circle cx="100" cy="4" r="2.5" fill="#dd0103" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Node 1: Feeder Corridors (Middle Right Flank) -->
        <div
          class="absolute pointer-events-auto transition-transform duration-150 ease-out will-change-transform hidden md:block"
          [style.left]="(telemetryNodes[1].normX * 100) + '%'"
          [style.top]="(telemetryNodes[1].normY * 100) + '%'"
          [style.transform]="'translate3d(' + telemetryNodes[1].dx + 'px, ' + telemetryNodes[1].dy + 'px, 0)'">
          <div
            (mouseenter)="onNodeHover(telemetryNodes[1], true)"
            (mouseleave)="onNodeHover(telemetryNodes[1], false)"
            [ngClass]="activeHoveredNodeId() === telemetryNodes[1].id || telemetryNodes[1].isHovered ? 'border-[#dd0103] shadow-[0_0_25px_rgba(221,1,3,0.35)] scale-105' : 'border-slate-300/80 shadow-md'"
            class="bg-white/85 backdrop-blur-xl border rounded-2xl p-3 w-56 transition-all duration-200 cursor-pointer">
            <div class="flex items-center justify-between">
              <span class="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-wider">{{ telemetryNodes[1].title }}</span>
              <span class="px-2 py-0.5 rounded-full bg-red-50 text-[#dd0103] border border-red-200 text-[8px] font-mono font-bold">
                {{ telemetryNodes[1].badge }}
              </span>
            </div>
            <div class="text-xs font-black text-[#02194b] mt-0.5">{{ telemetryNodes[1].value }}</div>
            <div class="text-[9px] font-mono text-slate-600">{{ telemetryNodes[1].subValue }}</div>

            <!-- Expandable Performance Bars -->
            <div
              [ngClass]="activeHoveredNodeId() === telemetryNodes[1].id || telemetryNodes[1].isHovered ? 'max-h-14 opacity-100 mt-2 pt-1.5 border-t border-slate-200' : 'max-h-0 opacity-0 overflow-hidden'"
              class="transition-all duration-300 ease-out space-y-1">
              <div class="flex justify-between text-[8px] font-mono text-slate-600">
                <span>JSA EXPRESS</span>
                <span class="font-bold text-[#dd0103]">100%</span>
              </div>
              <div class="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
                <div class="bg-[#dd0103] h-full w-full"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Node 2: Port Berthing Status (Bottom Right Flank) -->
        <div
          class="absolute pointer-events-auto transition-transform duration-150 ease-out will-change-transform hidden lg:block"
          [style.left]="(telemetryNodes[2].normX * 100) + '%'"
          [style.top]="(telemetryNodes[2].normY * 100) + '%'"
          [style.transform]="'translate3d(' + telemetryNodes[2].dx + 'px, ' + telemetryNodes[2].dy + 'px, 0)'">
          <div
            (mouseenter)="onNodeHover(telemetryNodes[2], true)"
            (mouseleave)="onNodeHover(telemetryNodes[2], false)"
            [ngClass]="activeHoveredNodeId() === telemetryNodes[2].id || telemetryNodes[2].isHovered ? 'border-[#dd0103] shadow-[0_0_25px_rgba(221,1,3,0.35)] scale-105' : 'border-slate-300/80 shadow-md'"
            class="bg-white/85 backdrop-blur-xl border rounded-2xl p-3 w-56 transition-all duration-200 cursor-pointer">
            <div class="flex items-center justify-between">
              <span class="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-wider">{{ telemetryNodes[2].title }}</span>
              <span class="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[8px] font-mono font-bold">
                {{ telemetryNodes[2].badge }}
              </span>
            </div>
            <div class="text-xs font-black text-[#02194b] mt-0.5">{{ telemetryNodes[2].value }}</div>
            <div class="text-[9px] font-mono text-slate-600">{{ telemetryNodes[2].subValue }}</div>

            <!-- Expandable Berth Gauge -->
            <div
              [ngClass]="activeHoveredNodeId() === telemetryNodes[2].id || telemetryNodes[2].isHovered ? 'max-h-14 opacity-100 mt-2 pt-1.5 border-t border-slate-200' : 'max-h-0 opacity-0 overflow-hidden'"
              class="transition-all duration-300 ease-out">
              <div class="flex justify-between text-[8px] font-mono text-slate-500">
                <span>BERTH OCCUPANCY</span>
                <span class="text-emerald-700 font-bold">OPTIMAL (82%)</span>
              </div>
              <div class="w-full bg-slate-200 h-1 rounded-full overflow-hidden mt-1">
                <div class="bg-emerald-500 h-full w-[82%]"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Node 3: Metocean & Wind (Northwest Flank) -->
        <div
          class="absolute pointer-events-auto transition-transform duration-150 ease-out will-change-transform hidden xl:block"
          [style.left]="(telemetryNodes[3].normX * 100) + '%'"
          [style.top]="(telemetryNodes[3].normY * 100) + '%'"
          [style.transform]="'translate3d(' + telemetryNodes[3].dx + 'px, ' + telemetryNodes[3].dy + 'px, 0)'">
          <div
            (mouseenter)="onNodeHover(telemetryNodes[3], true)"
            (mouseleave)="onNodeHover(telemetryNodes[3], false)"
            [ngClass]="activeHoveredNodeId() === telemetryNodes[3].id || telemetryNodes[3].isHovered ? 'border-[#dd0103] shadow-[0_0_25px_rgba(221,1,3,0.35)] scale-105' : 'border-slate-300/80 shadow-md'"
            class="bg-white/85 backdrop-blur-xl border rounded-2xl p-3 w-56 transition-all duration-200 cursor-pointer">
            <div class="flex items-center justify-between">
              <span class="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-wider">{{ telemetryNodes[3].title }}</span>
              <span class="px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200 text-[8px] font-mono font-bold">
                {{ telemetryNodes[3].badge }}
              </span>
            </div>
            <div class="text-xs font-black text-[#02194b] mt-0.5">{{ telemetryNodes[3].value }}</div>
            <div class="text-[9px] font-mono text-slate-600">{{ telemetryNodes[3].subValue }}</div>

            <!-- Expandable Swell Readout -->
            <div
              [ngClass]="activeHoveredNodeId() === telemetryNodes[3].id || telemetryNodes[3].isHovered ? 'max-h-14 opacity-100 mt-2 pt-1.5 border-t border-slate-200' : 'max-h-0 opacity-0 overflow-hidden'"
              class="transition-all duration-300 ease-out">
              <div class="flex items-center gap-1.5">
                <span class="text-xs font-mono font-bold text-[#dd0103]">1.2m</span>
                <div class="flex-1 bg-slate-200 h-1 rounded-full overflow-hidden">
                  <div class="bg-gradient-to-r from-emerald-500 to-[#dd0103] h-full w-2/5"></div>
                </div>
                <span class="text-[8px] font-mono text-slate-500">PERIOD 6.4s</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Node 4: AIS DGPS Datum (Center Top Nav) -->
        <div
          class="absolute pointer-events-auto transition-transform duration-150 ease-out will-change-transform hidden xl:block"
          [style.left]="(telemetryNodes[4].normX * 100) + '%'"
          [style.top]="(telemetryNodes[4].normY * 100) + '%'"
          [style.transform]="'translate3d(' + telemetryNodes[4].dx + 'px, ' + telemetryNodes[4].dy + 'px, 0)'">
          <div
            (mouseenter)="onNodeHover(telemetryNodes[4], true)"
            (mouseleave)="onNodeHover(telemetryNodes[4], false)"
            [ngClass]="activeHoveredNodeId() === telemetryNodes[4].id || telemetryNodes[4].isHovered ? 'border-[#dd0103] shadow-[0_0_25px_rgba(221,1,3,0.35)] scale-105' : 'border-slate-300/80 shadow-md'"
            class="bg-white/85 backdrop-blur-xl border rounded-2xl p-2.5 w-52 transition-all duration-200 cursor-pointer">
            <div class="flex items-center justify-between">
              <span class="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-wider">{{ telemetryNodes[4].title }}</span>
              <span class="px-1.5 py-0.5 rounded-full bg-red-50 text-[#dd0103] border border-red-200 text-[8px] font-mono font-bold">
                {{ telemetryNodes[4].badge }}
              </span>
            </div>
            <div class="text-[11px] font-black font-mono text-[#dd0103] mt-0.5">{{ telemetryNodes[4].value }}</div>
            <div class="text-[8px] font-mono text-slate-600">{{ telemetryNodes[4].subValue }}</div>
          </div>
        </div>
      </div>

      <!-- =========================================================
           SEAMLESS SCROLL HANDOFF & BOTTOM FAIRWAY GATE
           ========================================================= -->
      <div class="relative z-20 w-full pb-3 flex flex-col items-center justify-center pointer-events-auto">
        <!-- Fairway Gate Beacons -->
        <div class="flex items-center gap-20 mb-1">
          <div class="flex items-center gap-1.5 text-[9px] font-mono font-bold text-emerald-800">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            <span>FAIRWAY GATE [STARBOARD]</span>
          </div>

          <div class="flex items-center gap-1.5 text-[9px] font-mono font-bold text-[#dd0103]">
            <span>FAIRWAY GATE [PORT]</span>
            <span class="w-2.5 h-2.5 rounded-full bg-[#dd0103] animate-ping"></span>
          </div>
        </div>

        <!-- Scroll Indicator & Downward Beacon Line -->
        <button
          (click)="sailToRoute()"
          class="flex flex-col items-center gap-1 text-slate-500 hover:text-[#dd0103] transition-colors cursor-pointer group">
          <span class="text-[10px] font-mono font-bold uppercase tracking-widest text-[#02194b] group-hover:text-[#dd0103]">
            {{ isRtl() ? 'تمرير لبدء الرحلة الملاحية' : 'SCROLL TO SAIL ROUTE' }}
          </span>
          <svg class="w-5 h-5 text-[#dd0103] animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </button>
      </div>
    </section>

    <!-- =========================================================
         2. PRESERVED 3-TAB ACTION ENGINE (FIND SERVICE, SCHEDULE, TRACKING)
         Anchored right at #tracking-engine so all links remain 100% active!
         ========================================================= -->
    <section id="tracking-engine" class="py-14 bg-white border-b border-slate-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-8">
        <!-- Section Title & Tabs Container -->
        <div class="bg-white border border-slate-200 rounded-3xl shadow-xl shadow-slate-200/60 overflow-hidden">
          
          <!-- Tab Headers -->
          <div class="grid grid-cols-3 border-b border-slate-200 bg-slate-50 text-center text-sm font-semibold">
            <!-- Tab 1: Find a Service -->
            <button
              (click)="activeTab.set('service')"
              [class]="activeTab() === 'service' 
                ? 'bg-white text-[#dd0103] border-b-2 border-[#dd0103] font-bold py-4 px-4 flex items-center justify-center gap-2 transition-all shadow-sm'
                : 'text-slate-600 hover:text-slate-900 py-4 px-4 flex items-center justify-center gap-2 hover:bg-slate-100/60 transition-all'">
              <svg class="w-5 h-5 text-[#dd0103]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              <span class="truncate">{{ isRtl() ? 'البحث عن خدمة' : 'Find a Service' }}</span>
            </button>

            <!-- Tab 2: Find Schedule -->
            <button
              (click)="activeTab.set('schedule')"
              [class]="activeTab() === 'schedule' 
                ? 'bg-white text-[#dd0103] border-b-2 border-[#dd0103] font-bold py-4 px-4 flex items-center justify-center gap-2 transition-all shadow-sm'
                : 'text-slate-600 hover:text-slate-900 py-4 px-4 flex items-center justify-center gap-2 hover:bg-slate-100/60 transition-all'">
              <svg class="w-5 h-5 text-[#dd0103]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span class="truncate">{{ isRtl() ? 'جدول الرحلات' : 'Find Schedule' }}</span>
            </button>

            <!-- Tab 3: Vessel Tracking -->
            <button
              (click)="activeTab.set('tracking')"
              [class]="activeTab() === 'tracking' 
                ? 'bg-white text-[#dd0103] border-b-2 border-[#dd0103] font-bold py-4 px-4 flex items-center justify-center gap-2 transition-all shadow-sm'
                : 'text-slate-600 hover:text-slate-900 py-4 px-4 flex items-center justify-center gap-2 hover:bg-slate-100/60 transition-all'">
              <svg class="w-5 h-5 text-[#dd0103]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                  <label class="block text-xs uppercase font-bold text-slate-700 tracking-wider">
                    {{ isRtl() ? 'اختر خط الخدمة الملاحية' : 'Select Feeder Service Code' }}
                  </label>
                  <div class="relative">
                    <select
                      [ngModel]="selectedServiceCode()"
                      (ngModelChange)="onServiceCodeChange($event)"
                      class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 font-semibold focus:outline-none focus:border-[#dd0103] focus:bg-white appearance-none cursor-pointer">
                      <option *ngFor="let s of service.services()" [value]="s.code">
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

                <div>
                  <button
                    (click)="jumpToInteractiveRoute()"
                    class="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-[#dd0103] to-[#b50102] hover:from-[#ef2325] hover:to-[#dd0103] text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-red-600/25 cursor-pointer">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    <span>{{ isRtl() ? 'عرض المسار على الخريطة' : 'View Route on Map' }}</span>
                  </button>
                </div>
              </div>

              <!-- Active Service Preview Card -->
              <div *ngIf="currentService() as cs" class="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
                <div class="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div class="flex items-center gap-2.5">
                      <span class="text-xl font-black text-slate-950">{{ cs.code }}</span>
                      <span class="text-xs px-2.5 py-0.5 rounded-full bg-red-50 text-[#dd0103] border border-red-200 font-bold">
                        {{ cs.frequency }}
                      </span>
                      <span class="text-xs px-2.5 py-0.5 rounded-full bg-red-50 text-[#dd0103] border border-red-200 font-bold">
                        {{ cs.transit_days }} {{ isRtl() ? 'يوم عبور' : 'Days Round Transit' }}
                      </span>
                    </div>
                    <h3 class="text-sm font-bold text-slate-800 mt-1">{{ cs.name }}</h3>
                  </div>
                  <p class="text-xs text-slate-600 max-w-md">{{ cs.description }}</p>
                </div>

                <!-- Port Call Sequence Timeline -->
                <div class="space-y-1.5 pt-2 border-t border-slate-200">
                  <span class="text-xs font-bold uppercase tracking-wider text-slate-600">{{ isRtl() ? 'تسلسل الموانئ والدوران:' : 'Port Call Rotation & Hubs:' }}</span>
                  <div class="flex flex-wrap items-center gap-2 pt-1">
                    <ng-container *ngFor="let port of cs.port_rotation; let i = index; let last = last">
                      <div class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs shadow-sm">
                        <span class="w-2 h-2 rounded-full bg-[#dd0103]"></span>
                        <span class="font-bold text-slate-900">{{ port.port_name }}</span>
                        <span class="text-[10px] text-slate-500 font-mono">({{ port.unlocode }})</span>
                        <span *ngIf="port.day_of_week" class="text-[10px] text-[#dd0103] bg-red-50 px-1.5 py-0.5 rounded font-bold">
                          {{ port.day_of_week }}
                        </span>
                      </div>
                      <span *ngIf="!last" class="text-slate-400 font-bold">→</span>
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
                  <label class="block text-xs uppercase font-bold text-slate-700 tracking-wider">
                    {{ isRtl() ? 'ميناء الشحن (POL)' : 'Port of Loading (POL)' }}
                  </label>
                  <select
                    [ngModel]="schedulePol()"
                    (ngModelChange)="onPolChange($event)"
                    class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 font-semibold focus:outline-none focus:border-[#dd0103] focus:bg-white cursor-pointer">
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
                  <label class="block text-xs uppercase font-bold text-slate-700 tracking-wider">
                    {{ isRtl() ? 'ميناء التفريغ (POD)' : 'Port of Discharge (POD)' }}
                  </label>
                  <select
                    [ngModel]="schedulePod()"
                    (ngModelChange)="onPodChange($event)"
                    class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 font-semibold focus:outline-none focus:border-[#dd0103] focus:bg-white cursor-pointer">
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
                    class="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-[#dd0103] to-[#b50102] hover:from-[#ef2325] hover:to-[#dd0103] text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-red-600/25 cursor-pointer">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <span>{{ isRtl() ? 'عرض الرحلات المتاحة' : 'Search Schedules' }}</span>
                  </button>
                </div>
              </div>

              <!-- Schedules Result Table -->
              <div class="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
                <table class="w-full text-left text-xs text-slate-700">
                  <thead class="bg-slate-100 text-slate-700 uppercase text-[10px] tracking-wider border-b border-slate-200">
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
                  <tbody class="divide-y divide-slate-100">
                    <tr *ngFor="let s of filteredSchedules()" class="hover:bg-slate-50 transition-colors">
                      <td class="py-3 px-4 font-bold text-slate-900 flex items-center gap-1.5">
                        <svg class="w-3.5 h-3.5 text-[#dd0103]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span>{{ s.vessel_name }}</span>
                      </td>
                      <td class="py-3 px-4 font-mono font-bold text-[#dd0103]">{{ s.voyage_no }}</td>
                      <td class="py-3 px-4">
                        <span class="px-2 py-0.5 rounded bg-slate-100 border border-slate-300 text-slate-800 font-mono text-[11px] font-bold">
                          {{ s.service_code }}
                        </span>
                      </td>
                      <td class="py-3 px-4 text-slate-800 font-medium">{{ s.pol }}</td>
                      <td class="py-3 px-4 text-slate-800 font-medium">{{ s.pod }}</td>
                      <td class="py-3 px-4 font-mono text-slate-600">{{ s.etd | date:'mediumDate' }}</td>
                      <td class="py-3 px-4 font-mono text-[#dd0103] font-bold">{{ s.eta | date:'mediumDate' }}</td>
                      <td class="py-3 px-4 font-mono text-[#dd0103] font-semibold">{{ s.cutoff_date | date:'mediumDate' }}</td>
                      <td class="py-3 px-4">
                        <span [ngClass]="{
                          'bg-emerald-50 text-emerald-800 border-emerald-300': s.status === 'On Schedule',
                          'bg-red-50 text-[#dd0103] border-red-200': s.status === 'In Transit',
                          'bg-sky-50 text-sky-800 border-sky-300': s.status === 'At Berth'
                        }" class="px-2 py-0.5 rounded-full text-[10px] font-bold border">
                          {{ s.status }}
                        </span>
                      </td>
                      <td class="py-3 px-4 text-right">
                        <button
                          (click)="trackVesselFromSchedule(s)"
                          class="px-2.5 py-1 rounded bg-slate-100 hover:bg-[#dd0103] hover:text-white text-slate-800 hover:border-[#dd0103] text-[11px] font-bold border border-slate-300 transition-all cursor-pointer shadow-sm">
                          {{ isRtl() ? 'تتبع' : 'Track' }}
                        </button>
                      </td>
                    </tr>
                    <tr *ngIf="filteredSchedules().length === 0">
                      <td colspan="10" class="py-6 text-center text-slate-500 font-medium">
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
                  <label class="block text-xs uppercase font-bold text-slate-700 tracking-wider">
                    {{ isRtl() ? 'اسم السفينة أو رقم المنظمة البحرية (IMO) أو الرحلة' : 'Search Vessel by Name, IMO, or Voyage Number' }}
                  </label>
                  <div class="relative">
                    <input
                      type="text"
                      [ngModel]="vesselSearchQuery()"
                      (ngModelChange)="onVesselSearchChange($event)"
                      placeholder="e.g., GFS RHINE, X-PRESS CAPELLA, 9338278, 2611E..."
                      class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 font-semibold focus:outline-none focus:border-[#dd0103] focus:bg-white placeholder-slate-400" />
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
                    class="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-[#dd0103] to-[#b50102] hover:from-[#ef2325] hover:to-[#dd0103] text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-red-600/25 cursor-pointer">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    <span>{{ isRtl() ? 'تحديد موقع السفينة' : 'Locate on Live Map' }}</span>
                  </button>
                </div>
              </div>

              <!-- Quick Vessel Chips -->
              <div class="flex flex-wrap items-center gap-2">
                <span class="text-xs font-bold text-slate-600">{{ isRtl() ? 'سفن سريعة:' : 'Quick Select:' }}</span>
                <button
                  *ngFor="let name of ['GFS RHINE', 'X-PRESS CAPELLA', 'GFS ROJA', 'AL FARAHIDI', 'ACACIA HAWK', 'CALLIOPE']"
                  (click)="quickSelectVessel(name)"
                  class="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-mono text-slate-800 font-semibold border border-slate-300 hover:border-[#dd0103] transition-colors">
                  {{ name }}
                </button>
              </div>

              <!-- Live Tracked Vessel Card -->
              <div *ngIf="matchedVessel() as mv" class="p-6 rounded-xl bg-slate-50 border border-slate-200 space-y-4 shadow-sm">
                <div class="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div class="flex items-center gap-2">
                      <span class="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 beacon-pulse"></span>
                      <h3 class="text-xl font-black text-slate-950">{{ mv.name }}</h3>
                      <span class="text-xs px-2.5 py-0.5 rounded bg-red-50 text-[#dd0103] border border-red-200 font-bold">
                        {{ mv.flag }}
                      </span>
                    </div>
                    <p class="text-xs font-mono text-slate-600 mt-1 font-medium">
                      IMO: {{ mv.imo }} | Call Sign: {{ mv.call_sign }} | Service: {{ mv.service_code }}
                    </p>
                  </div>

                  <div class="flex items-center gap-3">
                    <button
                      (click)="focusOnMatchedVessel()"
                      class="px-4 py-2 rounded-lg bg-gradient-to-r from-[#dd0103] to-[#b50102] hover:from-[#ef2325] hover:to-[#dd0103] text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-red-600/25">
                      <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span>{{ isRtl() ? 'عرض في الخريطة الحية' : 'Center on Live Map' }}</span>
                    </button>
                    <button
                      (click)="service.openVesselModal(mv)"
                      class="px-4 py-2 rounded-lg bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs border border-slate-300 transition-all shadow-sm">
                      {{ isRtl() ? 'المواصفات الفنية (16 نقطة)' : 'Full 16-Pt Specs' }}
                    </button>
                  </div>
                </div>

                <!-- Live Status Metrics Grid -->
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-200">
                  <div class="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                    <span class="text-[10px] uppercase font-bold text-slate-500 tracking-wider">AIS Status</span>
                    <p class="text-xs font-bold text-emerald-700 mt-1 truncate">{{ mv.current_status }}</p>
                  </div>
                  <div class="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                    <span class="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Coordinates</span>
                    <p class="text-xs font-mono font-bold text-[#dd0103] mt-1">
                      {{ mv.current_lat.toFixed(3) }}°N, {{ mv.current_lng.toFixed(3) }}°E
                    </p>
                  </div>
                  <div class="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                    <span class="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Nominal Capacity</span>
                    <p class="text-xs font-bold text-slate-900 mt-1">{{ mv.nominal_cap_teu }} TEU</p>
                  </div>
                  <div class="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                    <span class="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Summer Draft</span>
                    <p class="text-xs font-bold text-[#dd0103] mt-1">{{ mv.summer_draft }} m</p>
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
  @ViewChild('flagshipEl') flagshipRef!: ElementRef<HTMLElement>;
  @ViewChild('magneticBtn') magneticBtnRef!: ElementRef<HTMLButtonElement>;

  // 3-Tab Action Engine Signals
  activeTab = signal<'service' | 'schedule' | 'tracking'>('service');
  selectedServiceCode = signal<string>('JSA');
  schedulePol = signal<string>('');
  schedulePod = signal<string>('');
  vesselSearchQuery = signal<string>('GFS RHINE');

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
  telemetryNodes: TelemetryNode[] = [
    {
      id: 'fleet-status',
      title: 'LIVE FLEET RADAR',
      badge: '66 ACTIVE',
      value: 'Avg Speed: 14.8 KN',
      subValue: 'Red Sea & Gulf Corridors',
      normX: 0.79,
      normY: 0.14,
      dx: 0,
      dy: 0,
      isHovered: false,
      glowFactor: 0,
      sparkline: [14.2, 14.5, 14.4, 14.8, 15.1, 14.8],
      type: 'speed'
    },
    {
      id: 'active-routes',
      title: 'FEEDER CORRIDORS',
      badge: '32 LINES',
      value: '99.4% On-Time Index',
      subValue: 'JSA • GALEX • AES • CCG',
      normX: 0.80,
      normY: 0.38,
      dx: 0,
      dy: 0,
      isHovered: false,
      glowFactor: 0,
      sparkline: [98.5, 99.0, 99.2, 99.5, 99.4],
      type: 'reliability'
    },
    {
      id: 'port-capacity',
      title: 'PORT BERTHING STATUS',
      badge: 'HUB OPTIMAL',
      value: 'Zero Berthing Delay',
      subValue: 'Jebel Ali Berths T1/T2/T3',
      normX: 0.79,
      normY: 0.58,
      dx: 0,
      dy: 0,
      isHovered: false,
      glowFactor: 0,
      sparkline: [80, 85, 82, 84, 82],
      type: 'terminal'
    },
    {
      id: 'metocean-state',
      title: 'METOCEAN & WIND',
      badge: 'BEAUFORT 4',
      value: '16.2 KTS NW (310°)',
      subValue: 'Swell 1.2m • Period 6.4s',
      normX: 0.54,
      normY: 0.28,
      dx: 0,
      dy: 0,
      isHovered: false,
      glowFactor: 0,
      sparkline: [1.1, 1.2, 1.4, 1.3, 1.2],
      type: 'wind'
    },
    {
      id: 'dgps-datum',
      title: 'AIS DGPS POSITION',
      badge: '14 SATELLITES',
      value: '25° 01.12\' N, 55° 03.48\' E',
      subValue: 'WGS84 • HDOP 0.78 FIX',
      normX: 0.50,
      normY: 0.11,
      dx: 0,
      dy: 0,
      isHovered: false,
      glowFactor: 0,
      sparkline: [0.82, 0.79, 0.80, 0.78],
      type: 'dgps'
    }
  ];

  // Canvas Engine State
  private animationFrameId: number | null = null;
  private canvasWidth = 0;
  private canvasHeight = 0;
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
      name: 'TARGET: GFS RHINE (AIS 9338278)',
      code: 'GFS-RHINE',
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
    window.removeEventListener('scroll', this.onWindowScroll);
    window.removeEventListener('resize', this.onWindowResize);
  }

  // =========================================================
  // CANVAS ENGINE: WAVE MESH, DISPLACEMENT, & SONAR
  // =========================================================
  private initCanvas() {
    if (!this.canvasRef) return;
    const canvas = this.canvasRef.nativeElement;
    const rect = canvas.getBoundingClientRect();
    const dpr = typeof window !== 'undefined' ? (window.devicePixelRatio || 1) : 1;

    this.canvasWidth = rect.width;
    this.canvasHeight = rect.height;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    this.ctx = canvas.getContext('2d');
    if (this.ctx) {
      this.ctx.scale(dpr, dpr);
    }

    this.initGridMesh();
    this.updateVesselCoordinates();
  }

  private initGridMesh() {
    this.gridVertices = [];
    const spacing = 48;
    const cols = Math.ceil(this.canvasWidth / spacing) + 1;
    const rows = Math.ceil(this.canvasHeight / spacing) + 1;

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
      this.vesselCenterX.set(fRect.left - sRect.left + fRect.width / 2);
      this.vesselCenterY.set(fRect.top - sRect.top + fRect.height / 2);
    } else if (this.sectionRef) {
      const rect = this.sectionRef.nativeElement.getBoundingClientRect();
      this.vesselCenterX.set(rect.width * 0.72);
      this.vesselCenterY.set(rect.height * 0.48);
    }
  }

  private startRenderLoop() {
    this.ngZone.runOutsideAngular(() => {
      let lastTime = performance.now();

      const loop = (currentTime: number) => {
        const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
        lastTime = currentTime;

        this.updatePhysics(currentTime, dt);
        this.renderCanvas(currentTime);

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
    const t = time * 0.001;

    // Layer 1: Deep Fluid Wave Contour (Maverick Navy #02194B wash)
    ctx.beginPath();
    ctx.moveTo(0, h * 0.52);
    for (let x = 0; x <= w; x += 25) {
      const y = h * 0.52 + Math.sin(x * 0.003 + t * 0.8) * 16 + Math.cos(x * 0.006 - t * 0.5) * 8;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fillStyle = 'rgba(2, 25, 75, 0.035)';
    ctx.fill();

    // Layer 2: Mid Oceanic Azure Wave (Sky/Teal wash)
    ctx.beginPath();
    ctx.moveTo(0, h * 0.65);
    for (let x = 0; x <= w; x += 20) {
      const y = h * 0.65 + Math.sin(x * 0.004 - t * 1.1) * 20 + Math.cos(x * 0.008 + t * 0.6) * 10;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fillStyle = 'rgba(2, 132, 199, 0.04)';
    ctx.fill();

    // Layer 3: Foreground Shimmer Crest with subtle Maverick Red tone
    ctx.beginPath();
    ctx.moveTo(0, h * 0.78);
    for (let x = 0; x <= w; x += 15) {
      const y = h * 0.78 + Math.sin(x * 0.005 + t * 1.4) * 14;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fillStyle = 'rgba(221, 1, 3, 0.025)';
    ctx.fill();
  }

  private drawNauticalGrid(ctx: CanvasRenderingContext2D) {
    const spacing = 48;
    const cols = Math.ceil(this.canvasWidth / spacing) + 1;
    const rows = Math.ceil(this.canvasHeight / spacing) + 1;

    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(2, 25, 75, 0.055)';

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
    ctx.fillStyle = 'rgba(2, 25, 75, 0.35)';

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

  scrollToEngine() {
    const engineEl = document.getElementById('tracking-engine');
    if (engineEl) {
      engineEl.scrollIntoView({ behavior: 'smooth' });
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
