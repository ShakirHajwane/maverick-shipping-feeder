import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, inject, signal, computed, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaritimeService } from '../../services/maritime.service';
import { Vessel } from '../../models/maritime.models';

interface WakeParticle {
  id: number;
  x: number;
  y: number;
  angle: number;
  createdAt: number;
}

interface WaterRipple {
  id: number;
  x: number;
  y: number;
}

interface SampledPoint {
  x: number;
  y: number;
  heading: number;
  rawX: number;
  rawY: number;
}

@Component({
  selector: 'app-maritime-journey',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      #journeyContainer
      id="maritime-journey"
      (click)="onWaterClick($event)"
      (pointermove)="onWaterMove($event)"
      style="background: linear-gradient(180deg, #f0f4fa 0%, #e2eaf6 14%, #d3e0f2 28%, #c5d5ec 45%, #b9cbe7 65%, #cad8ed 80%, #fee2e2 92%, #fff5f5 100%);"
      class="relative w-full max-w-full overflow-x-hidden overflow-y-clip select-none border-b border-slate-200">

      <!-- =========================================================
           1. PARALLAX ATMOSPHERIC WEATHER & SEA FOG (GPU-ACCELERATED)
           ========================================================= -->
      <div
        class="hidden sm:block absolute inset-0 pointer-events-none z-10 opacity-30 animate-cloud-slow will-change-transform"
        [style.transform]="'translate3d(0, ' + (journeyProgress() * -120) + 'px, 0)'">
        <div class="absolute top-[12%] left-[8%] w-[500px] h-[220px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.7)_0%,transparent_70%)]"></div>
        <div class="absolute top-[28%] right-[10%] w-[580px] h-[240px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.6)_0%,transparent_70%)]"></div>
        <div class="absolute top-[48%] left-[12%] w-[540px] h-[220px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.65)_0%,transparent_70%)]"></div>
        <div class="absolute top-[68%] right-[14%] w-[600px] h-[260px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.7)_0%,transparent_70%)]"></div>
        <div class="absolute top-[86%] left-[18%] w-[640px] h-[260px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.8)_0%,transparent_70%)]"></div>
      </div>

      <div
        class="hidden sm:block absolute inset-0 pointer-events-none z-10 opacity-20 animate-cloud-fast will-change-transform"
        [style.transform]="'translate3d(0, ' + (journeyProgress() * -220) + 'px, 0)'">
        <div class="absolute top-[8%] right-[25%] w-[420px] h-[180px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.75)_0%,transparent_70%)]"></div>
        <div class="absolute top-[35%] left-[20%] w-[480px] h-[200px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.65)_0%,transparent_70%)]"></div>
        <div class="absolute top-[58%] right-[18%] w-[520px] h-[210px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.7)_0%,transparent_70%)]"></div>
        <div class="absolute top-[80%] left-[22%] w-[460px] h-[190px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.8)_0%,transparent_70%)]"></div>
      </div>

      <!-- =========================================================
           2. INTERACTIVE WATER RIPPLE RINGS (CLICK & POINTER HOVER)
           ========================================================= -->
      <div class="absolute inset-0 pointer-events-none z-15 overflow-hidden">
        <div
          *ngFor="let rip of ripples(); trackBy: trackById"
          class="absolute w-20 h-20 -ml-10 -mt-10 rounded-full border border-sky-500/80 animate-ripple"
          [style.left.px]="rip.x"
          [style.top.px]="rip.y">
        </div>
      </div>

      <!-- =========================================================
           PORT OF DEPARTURE: ORIGIN CONTAINER TERMINAL (CANAL BERTH 01)
           ========================================================= -->
      <div class="relative z-25 w-full pt-6 pb-4 flex flex-col items-center pointer-events-none">
        
        <!-- Terminal Header Pill with Dynamic Docked / Undocking / Underway Status -->
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 border border-slate-300 shadow-md text-xs font-mono font-bold text-[#02194b] mb-3 pointer-events-auto">
          <span class="w-2.5 h-2.5 rounded-full" [ngClass]="departureStatusDotClass()"></span>
          <span class="text-[#dd0103]">PORT OF ORIGIN:</span>
          <span>JEBEL ALI TERMINAL 1 • CANAL BERTH 01</span>
          <span class="text-slate-400">|</span>
          <span [ngClass]="departureStatusTextClass()">{{ departureStatusText() }}</span>
        </div>

        <!-- Dual-Quay Canal Harbor Slipway (Ship Docks in the Middle Channel) -->
        <div class="relative w-[94%] sm:w-[760px] lg:w-[920px] max-w-full">
          
          <div class="flex items-stretch justify-between relative min-h-[110px] sm:min-h-[130px]">
            
            <!-- 1. LEFT PIER (WEST QUAY APRON - PORT SIDE) -->
            <div class="w-[37%] sm:w-[39%] rounded-2xl bg-gradient-to-br from-slate-200 via-slate-100 to-slate-300 border-2 border-slate-300 shadow-xl relative overflow-visible flex flex-col justify-between p-3 sm:p-4">
              <!-- Canal Waterline Warning Stripes (Inner Canal Edge) -->
              <div class="absolute right-0 inset-y-0 w-2.5 bg-[repeating-linear-gradient(45deg,#f59e0b,#f59e0b_8px,#0f172a_8px,#0f172a_16px)] opacity-95 shadow-sm rounded-r-xs"></div>
              
              <!-- Rubber Marine Cylindrical Fenders on Canal Wall -->
              <div class="absolute -right-1 inset-y-3 flex flex-col justify-around pointer-events-none z-10">
                <span class="w-2 h-5 bg-slate-800 rounded-l-xs shadow-md border-r border-slate-600"></span>
                <span class="w-2 h-5 bg-slate-800 rounded-l-xs shadow-md border-r border-slate-600"></span>
                <span class="w-2 h-5 bg-slate-800 rounded-l-xs shadow-md border-r border-slate-600"></span>
              </div>

              <!-- Cast Iron Mooring Bollards along Canal Edge -->
              <div class="flex items-center justify-end gap-6 sm:gap-10 pr-3 relative z-10">
                <div class="flex flex-col items-center">
                  <span class="w-4 h-5 rounded-t-lg bg-slate-700 border border-slate-500 shadow flex items-center justify-center">
                    <span class="w-2.5 h-1 bg-slate-300 rounded-xs"></span>
                  </span>
                  <span class="text-[6.5px] font-mono font-bold text-slate-500 mt-0.5">BOLLARD 01</span>
                </div>
                <div class="flex flex-col items-center">
                  <span class="w-4 h-5 rounded-t-lg bg-slate-700 border border-slate-500 shadow flex items-center justify-center">
                    <span class="w-2.5 h-1 bg-slate-300 rounded-xs"></span>
                  </span>
                  <span class="text-[6.5px] font-mono font-bold text-slate-500 mt-0.5">BOLLARD 02</span>
                </div>
              </div>

              <!-- Quay Details: Container Stacks & Watchtower -->
              <div class="flex items-end justify-between relative z-10 mt-auto pt-2">
                <!-- Stacked Containers -->
                <div class="flex flex-col gap-0.5">
                  <div class="w-9 sm:w-11 h-3 rounded-xs bg-[#dd0103] border border-[#b50102] flex items-center justify-center text-[5.5px] font-mono text-white font-bold">40FT • MAV</div>
                  <div class="w-9 sm:w-11 h-3 rounded-xs bg-[#02194b] border border-[#062569] flex items-center justify-center text-[5.5px] font-mono text-white font-bold">40FT • SEA</div>
                </div>

                <!-- Harbormaster Watchtower / Beacon -->
                <div class="flex flex-col items-center">
                  <div class="w-3.5 h-6 bg-slate-700 border border-slate-500 rounded-t-sm flex flex-col items-center justify-between p-0.5">
                    <span class="w-2 h-1 bg-amber-400 rounded-xs"></span>
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  </div>
                  <span class="text-[6px] font-mono font-bold text-slate-600">TOWER 1</span>
                </div>
              </div>

              <!-- Pierhead Port Lateral Beacon (Red) -->
              <div class="absolute -bottom-3 right-2 flex items-center gap-1 bg-white/95 backdrop-blur-md px-2 py-0.5 rounded-full border border-red-200 shadow-sm z-20">
                <span class="w-2 h-2 rounded-full bg-[#dd0103] animate-ping"></span>
                <span class="text-[7px] font-mono font-bold text-[#dd0103]">PORT MARKER 01</span>
              </div>
            </div>

            <!-- 2. CENTRAL CANAL WATER CHANNEL (BERTH SLIPWAY - SHIP GLIDES HERE) -->
            <div class="w-[26%] sm:w-[22%] relative flex flex-col items-center justify-between py-1 pointer-events-none">
              <!-- Fairway Centerline Marking -->
              <div class="w-full flex justify-between items-center px-1 text-[7px] font-mono font-bold text-slate-500/80">
                <span>◀ PORT</span>
                <span class="px-1.5 py-0.5 rounded bg-white/80 border border-slate-200 shadow-2xs text-[6.5px] text-[#02194b]">CANAL FAIRWAY</span>
                <span>STBD ▶</span>
              </div>

              <!-- Depth Sounding Water Badge -->
              <div class="text-[7.5px] sm:text-[8px] font-mono font-bold text-slate-600 bg-white/90 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-slate-300 shadow-xs">
                DEPTH 18.5M • BERTH 01
              </div>

              <!-- Canal Exit Channel Gate -->
              <div class="w-full flex items-center justify-center gap-1 opacity-70">
                <span class="h-0.5 flex-1 bg-gradient-to-r from-red-400 to-transparent"></span>
                <span class="text-[6px] font-mono text-slate-500">GATE 01</span>
                <span class="h-0.5 flex-1 bg-gradient-to-l from-emerald-400 to-transparent"></span>
              </div>
            </div>

            <!-- 3. RIGHT PIER (EAST QUAY APRON - STARBOARD SIDE with OVERHANGING STS CRANE) -->
            <div class="w-[37%] sm:w-[39%] rounded-2xl bg-gradient-to-bl from-slate-200 via-slate-100 to-slate-300 border-2 border-slate-300 shadow-xl relative overflow-visible flex flex-col justify-between p-3 sm:p-4">
              <!-- Canal Waterline Warning Stripes (Inner Canal Edge) -->
              <div class="absolute left-0 inset-y-0 w-2.5 bg-[repeating-linear-gradient(45deg,#f59e0b,#f59e0b_8px,#0f172a_8px,#0f172a_16px)] opacity-95 shadow-sm rounded-l-xs"></div>
              
              <!-- Rubber Marine Cylindrical Fenders on Canal Wall -->
              <div class="absolute -left-1 inset-y-3 flex flex-col justify-around pointer-events-none z-10">
                <span class="w-2 h-5 bg-slate-800 rounded-r-xs shadow-md border-l border-slate-600"></span>
                <span class="w-2 h-5 bg-slate-800 rounded-r-xs shadow-md border-l border-slate-600"></span>
                <span class="w-2 h-5 bg-slate-800 rounded-r-xs shadow-md border-l border-slate-600"></span>
              </div>

              <!-- STS Gantry Crane reaching LEFT over the central canal -->
              <div class="absolute -top-3 sm:-top-5 -left-10 sm:-left-16 z-25 pointer-events-none">
                <svg viewBox="0 0 160 100" class="w-36 sm:w-48 h-auto overflow-visible select-none">
                  <!-- Crane Gantry Legs on Right Pier Rails -->
                  <line x1="88" y1="95" x2="114" y2="35" stroke="#dd0103" stroke-width="4.5" stroke-linecap="round" />
                  <line x1="142" y1="95" x2="126" y2="35" stroke="#dd0103" stroke-width="4.5" stroke-linecap="round" />
                  <line x1="94" y1="70" x2="136" y2="70" stroke="#b50102" stroke-width="2.5" />
                  <line x1="104" y1="50" x2="130" y2="50" stroke="#b50102" stroke-width="2.5" />
                  
                  <!-- Portal Apex Tower -->
                  <line x1="120" y1="35" x2="120" y2="10" stroke="#02194b" stroke-width="3" />
                  <line x1="120" y1="10" x2="12" y2="35" stroke="#02194b" stroke-width="1.8" />
                  <line x1="120" y1="10" x2="152" y2="35" stroke="#02194b" stroke-width="1.8" />
                  
                  <!-- Extended Boom reaching into the Central Canal above ship -->
                  <line x1="10" y1="35" x2="152" y2="35" stroke="#dd0103" stroke-width="4" stroke-linecap="round" />
                  
                  <!-- Operator Cab & Container Spreader poised over canal -->
                  <rect x="36" y="37" width="14" height="8" rx="1" fill="#02194b" />
                  <line x1="43" y1="45" x2="43" y2="60" stroke="#475569" stroke-width="1.2" />
                  <rect x="32" y="60" width="22" height="4.5" rx="0.5" fill="#f59e0b" stroke="#d97706" stroke-width="0.5" />
                  
                  <!-- High-intensity Warning Beacons -->
                  <circle cx="120" cy="10" r="2.2" fill="#ef4444" class="animate-ping" />
                  <circle cx="120" cy="10" r="1.5" fill="#dd0103" />
                  <circle cx="10" cy="35" r="1.8" fill="#f59e0b" />
                </svg>
              </div>

              <!-- Cast Iron Mooring Bollards along Canal Edge -->
              <div class="flex items-center justify-start gap-6 sm:gap-10 pl-3 relative z-10">
                <div class="flex flex-col items-center">
                  <span class="w-4 h-5 rounded-t-lg bg-slate-700 border border-slate-500 shadow flex items-center justify-center">
                    <span class="w-2.5 h-1 bg-slate-300 rounded-xs"></span>
                  </span>
                  <span class="text-[6.5px] font-mono font-bold text-slate-500 mt-0.5">BOLLARD 03</span>
                </div>
                <div class="flex flex-col items-center">
                  <span class="w-4 h-5 rounded-t-lg bg-slate-700 border border-slate-500 shadow flex items-center justify-center">
                    <span class="w-2.5 h-1 bg-slate-300 rounded-xs"></span>
                  </span>
                  <span class="text-[6.5px] font-mono font-bold text-slate-500 mt-0.5">BOLLARD 04</span>
                </div>
              </div>

              <!-- Quay Staging Reefer Stacks -->
              <div class="flex items-end justify-end gap-1.5 relative z-10 mt-auto pt-2">
                <div class="w-8 sm:w-10 h-3 rounded-xs bg-white border border-slate-300 flex items-center justify-center text-[5.5px] font-mono text-[#02194b] font-bold">REEFER</div>
                <div class="w-8 sm:w-10 h-3 rounded-xs bg-amber-500 border border-amber-600 flex items-center justify-center text-[5.5px] font-mono text-white font-bold">HAZ • 20FT</div>
              </div>

              <!-- Pierhead Starboard Lateral Beacon (Green) -->
              <div class="absolute -bottom-3 left-2 flex items-center gap-1 bg-white/95 backdrop-blur-md px-2 py-0.5 rounded-full border border-emerald-200 shadow-sm z-20">
                <span class="text-[7px] font-mono font-bold text-emerald-700">STARBOARD 02</span>
                <span class="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              </div>
            </div>

          </div>

        </div>
      </div>

      <!-- =========================================================
           3. SVG CONTINUOUS WINDING ROUTE & BATHYMETRIC CONTOURS
           (Uniform Non-Scaling Strokes for Crisp Path Lines on All Devices)
           ========================================================= -->
      <svg
        #svgCanvas
        class="absolute inset-0 w-full h-full pointer-events-none z-15"
        viewBox="0 0 1000 4000"
        preserveAspectRatio="none">

        <!-- Bathymetric Depth Contour Lines -->
        <g stroke="#b50102" stroke-opacity="0.18" stroke-width="1.5" fill="none">
          <path d="M 0 300 Q 300 250, 600 350 T 1000 320" vector-effect="non-scaling-stroke" />
          <path d="M 0 800 Q 400 950, 700 850 T 1000 900" vector-effect="non-scaling-stroke" />
          <path d="M 0 1500 Q 350 1350, 700 1600 T 1000 1450" vector-effect="non-scaling-stroke" />
          <path d="M 0 2300 Q 450 2500, 800 2350 T 1000 2400" vector-effect="non-scaling-stroke" />
          <path d="M 0 3200 Q 300 3100, 650 3300 T 1000 3150" vector-effect="non-scaling-stroke" />
        </g>

        <!-- Dynamic Animated Canal Water Current Stream Vectors -->
        <g stroke="#0284c7" stroke-opacity="0.30" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-dasharray="16 24" class="animate-current-flow">
          <path d="M 450 200 C 470 500, 480 850, 460 1200 C 440 1600, 520 2000, 490 2400 C 470 2800, 520 3200, 490 3700" />
          <path d="M 550 200 C 530 500, 520 850, 540 1200 C 560 1600, 480 2000, 510 2400 C 530 2800, 480 3200, 510 3700" />
        </g>

        <!-- Static Planned Route (Faint Nautical Dotted Line) -->
        <path
          #backgroundPath
          [attr.d]="routePathD"
          fill="none"
          stroke="#dd0103"
          stroke-opacity="0.3"
          stroke-width="3"
          stroke-dasharray="10 10"
          vector-effect="non-scaling-stroke" />

        <!-- Dynamic Drawn Route Line: Wide Ambient Sunny Gold Glow (GPU accelerated on desktop) -->
        <path
          #glowPath
          [attr.d]="routePathD"
          fill="none"
          stroke="#dd0103"
          stroke-opacity="0.45"
          stroke-width="12"
          class="hidden sm:block"
          [attr.stroke-dasharray]="pathTotalLength()"
          [attr.stroke-dashoffset]="pathDashOffset()"
          stroke-linecap="round" />

        <!-- Dynamic Drawn Route Line: Core Illuminated Sunbeam Route -->
        <path
          #activePath
          id="activePath"
          [attr.d]="routePathD"
          fill="none"
          stroke="#b50102"
          stroke-width="4.5"
          [attr.stroke-dasharray]="pathTotalLength()"
          [attr.stroke-dashoffset]="pathDashOffset()"
          stroke-linecap="round" />

        <!-- Berth 01 Mooring Hawser Lines (Taut when Progress < 0.045) -->
        <g *ngIf="journeyProgress() < 0.045" [style.opacity]="mooringLinesDepartureOpacity()">
          <line
            x1="430" y1="150"
            [attr.x2]="shipRawX() - 14" [attr.y2]="shipRawY() - 35"
            stroke="#f59e0b" stroke-width="2.5" stroke-dasharray="5 3" stroke-linecap="round" />
          <line
            x1="570" y1="150"
            [attr.x2]="shipRawX() + 14" [attr.y2]="shipRawY() - 35"
            stroke="#f59e0b" stroke-width="2.5" stroke-dasharray="5 3" stroke-linecap="round" />
        </g>

        <!-- Undocking Bow & Stern Thrusters Froth / Jet spray (Active between 0.003 and 0.045) -->
        <g *ngIf="journeyProgress() > 0.003 && journeyProgress() < 0.045" [style.opacity]="undockingThrustersOpacity()">
          <circle [attr.cx]="shipRawX() - 28" [attr.cy]="shipRawY() - 15" r="12" fill="rgba(255,255,255,0.75)" class="animate-ping" />
          <circle [attr.cx]="shipRawX() + 28" [attr.cy]="shipRawY() - 15" r="12" fill="rgba(255,255,255,0.75)" class="animate-ping" />
          <circle [attr.cx]="shipRawX() - 24" [attr.cy]="shipRawY() + 35" r="14" fill="rgba(255,255,255,0.7)" class="animate-pulse" />
          <circle [attr.cx]="shipRawX() + 24" [attr.cy]="shipRawY() + 35" r="14" fill="rgba(255,255,255,0.7)" class="animate-pulse" />
        </g>

        <!-- Berth 08 Safe Harbor Mooring Hawser Lines (Attached when Progress >= 0.96) -->
        <g *ngIf="journeyProgress() >= 0.96" [style.opacity]="mooringLinesArrivalOpacity()">
          <line
            x1="430" y1="3840"
            [attr.x2]="shipRawX() - 14" [attr.y2]="shipRawY() + 35"
            stroke="#10b981" stroke-width="2.5" stroke-dasharray="5 3" stroke-linecap="round" />
          <line
            x1="570" y1="3840"
            [attr.x2]="shipRawX() + 14" [attr.y2]="shipRawY() + 35"
            stroke="#10b981" stroke-width="2.5" stroke-dasharray="5 3" stroke-linecap="round" />
        </g>
      </svg>

      <!-- =========================================================
           WAYPOINT ANCHORAGE MARKERS (DOM OVERLAYS: GUARANTEED 100% CIRCULAR ON ALL SCREENS)
           ========================================================= -->
      <div class="absolute inset-0 pointer-events-none z-16 overflow-hidden">
        
        <!-- Waypoint 1 Marker: The Shallows (X: 80%, Y: 23.75%) -->
        <div
          class="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style="left: 80%; top: 23.75%;">
          <div class="relative w-14 h-14 flex items-center justify-center">
            <!-- Rotating dashed ring (Guaranteed 100% circular) -->
            <div class="absolute inset-0 rounded-full border-2 border-dashed border-[#dd0103] animate-spin [animation-duration:20s]"></div>
            <!-- Sonar ripple pulse -->
            <div class="absolute inset-1.5 rounded-full border border-red-500/40 animate-ping"></div>
            <!-- Center waypoint core -->
            <div class="w-7 h-7 rounded-full bg-white border-2 border-[#dd0103] shadow-md flex items-center justify-center">
              <div class="w-2.5 h-2.5 rounded-full bg-[#dd0103]"></div>
            </div>
          </div>
        </div>

        <!-- Waypoint 2 Marker: The Reef (X: 24%, Y: 48.75%) -->
        <div
          class="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style="left: 24%; top: 48.75%;">
          <div class="relative w-14 h-14 flex items-center justify-center">
            <div class="absolute inset-0 rounded-full border-2 border-dashed border-[#dd0103] animate-spin [animation-duration:25s]"></div>
            <div class="absolute inset-1.5 rounded-full border border-red-500/40 animate-ping"></div>
            <div class="w-7 h-7 rounded-full bg-white border-2 border-[#dd0103] shadow-md flex items-center justify-center">
              <div class="w-2.5 h-2.5 rounded-full bg-[#dd0103]"></div>
            </div>
          </div>
        </div>

        <!-- Waypoint 3 Marker: The Deep Trench (X: 68%, Y: 73.75%) -->
        <div
          class="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style="left: 68%; top: 73.75%;">
          <div class="relative w-14 h-14 flex items-center justify-center">
            <div class="absolute inset-0 rounded-full border-2 border-dashed border-[#dd0103] animate-spin [animation-duration:15s]"></div>
            <div class="absolute inset-1.5 rounded-full border border-red-500/40 animate-ping"></div>
            <div class="w-7 h-7 rounded-full bg-white border-2 border-[#dd0103] shadow-md flex items-center justify-center">
              <div class="w-2.5 h-2.5 rounded-full bg-[#dd0103]"></div>
            </div>
          </div>
        </div>

        <!-- Waypoint 4 Marker: Safe Harbor Arrival (X: 50%, Y: 98.75%) -->
        <div
          class="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style="left: 50%; top: 98.75%;">
          <div class="relative w-16 h-16 flex items-center justify-center">
            <div class="absolute inset-0 rounded-full border-2 border-dashed border-emerald-500 animate-spin [animation-duration:30s]"></div>
            <div class="absolute inset-1.5 rounded-full border border-emerald-500/40 animate-ping"></div>
            <div class="w-8 h-8 rounded-full bg-white border-2 border-emerald-600 shadow-xl flex items-center justify-center">
              <div class="w-3 h-3 rounded-full bg-emerald-600"></div>
            </div>
          </div>
        </div>

      </div>

      <!-- =========================================================
           4. DYNAMIC SHIP WAKE PARTICLES (1.5s FADE-OUT)
           ========================================================= -->
      <div class="absolute inset-0 pointer-events-none z-18 overflow-hidden">
        <div
          *ngFor="let wake of wakeTrail(); trackBy: trackById"
          class="absolute w-10 h-10 -ml-5 -mt-5 rounded-full border border-white/60 bg-red-500/20 animate-wake-bubble"
          [style.left]="wake.x + '%'"
          [style.top]="wake.y + '%'"
          [style.transform]="'rotate(' + wake.angle + 'deg)'">
        </div>
      </div>

      <!-- =========================================================
           5. PATH-FOLLOWING TOP-DOWN CONTAINER FEEDER VESSEL (Z-20: Beneath Elevated Cards)
           Direct GPU transform with zero layout reflow and zero filter cost for 120 FPS iOS scrolling
           ========================================================= -->
      <div
        #shipEl
        id="ship-feeder"
        class="absolute top-0 left-0 pointer-events-none z-20 will-change-transform transform-gpu"
        style="transform: translate3d(500px, 200px, 0) translate3d(-50%, -50%, 0) rotate(180deg); -webkit-transform: translate3d(500px, 200px, 0) translate3d(-50%, -50%, 0) rotate(180deg);">
        
        <!-- Detailed Top-Down Container Feeder Vessel SVG -->
        <div class="relative w-16 sm:w-20">
          <svg viewBox="0 0 100 240" class="w-full h-auto overflow-visible">
            <!-- Dynamic Hydrodynamic Bow Wave V-Crests (Twin Parting Surf) -->
            <g class="animate-bow-wave">
              <path d="M 40 20 C 22 28, 5 45, -15 65 C -2 52, 18 36, 42 26 Z" fill="rgba(255, 255, 255, 0.75)" />
              <path d="M 35 25 C 15 35, -5 55, -25 80" stroke="rgba(56, 189, 248, 0.85)" stroke-width="2.5" stroke-linecap="round" fill="none" />
              <path d="M 60 20 C 78 28, 95 45, 115 65 C 102 52, 82 36, 58 26 Z" fill="rgba(255, 255, 255, 0.75)" />
              <path d="M 65 25 C 85 35, 105 55, 125 80" stroke="rgba(56, 189, 248, 0.85)" stroke-width="2.5" stroke-linecap="round" fill="none" />
            </g>

            <!-- Dynamic Propeller Churn Foam & Expanding Kelvin Stern Wake Wash -->
            <g class="animate-prop-churn">
              <ellipse cx="50" cy="238" rx="14" ry="9" fill="rgba(255, 255, 255, 0.85)" />
              <ellipse cx="50" cy="258" rx="22" ry="13" fill="rgba(224, 242, 254, 0.70)" />
              <ellipse cx="50" cy="285" rx="30" ry="16" fill="rgba(186, 230, 253, 0.45)" />
              <path d="M 32 225 C 18 255, -8 295, -35 335 C -15 310, 12 275, 36 235 Z" fill="rgba(255, 255, 255, 0.60)" />
              <path d="M 68 225 C 82 255, 108 295, 135 335 C 115 310, 88 275, 64 235 Z" fill="rgba(255, 255, 255, 0.60)" />
            </g>

            <!-- Hydrodynamic Hull Shadow (Hardware-Accelerated Vector Shadow) -->
            <path
              d="M 50 14 C 77 44, 95 88, 95 168 C 95 210, 86 230, 50 230 C 14 230, 5 210, 5 168 C 5 88, 23 44, 50 14 Z"
              fill="rgba(2, 25, 75, 0.35)" />

            <!-- Stern Foaming Wake Spray -->
            <path d="M 35 220 C 25 245, 10 260, 0 280 C 20 265, 30 250, 42 225 Z" fill="rgba(255, 255, 255, 0.45)" />
            <path d="M 65 220 C 75 245, 90 260, 100 280 C 80 265, 70 250, 58 225 Z" fill="rgba(255, 255, 255, 0.45)" />
            
            <!-- Main Ship Hull (Tapered Bulbous Bow, Parallel Midbody, Transom Stern) -->
            <!-- Hull Shadow Outline -->
            <path
              d="M 50 8 C 75 40, 92 85, 92 165 C 92 205, 84 224, 50 224 C 16 224, 8 205, 8 165 C 8 85, 25 40, 50 8 Z"
              fill="#02194b"
              stroke="#dd0103"
              stroke-width="2.5" />

            <!-- Foredeck & Waterline Marking -->
            <polygon points="50,14 82,65 18,65" fill="#112240" />
            <circle cx="50" cy="22" r="5" fill="rgba(253, 224, 71, 0.35)" />
            <circle cx="50" cy="22" r="3" fill="#FDE047" /> <!-- Masthead Light -->

            <!-- Deck Hatch Covers & Container Bays -->
            <!-- Bay 1 (Forward): Amber & Sun Gold Stacks -->
            <rect x="22" y="70" width="26" height="32" rx="1.5" fill="#dd0103" stroke="#b50102" stroke-width="0.8" />
            <rect x="52" y="70" width="26" height="32" rx="1.5" fill="#fbbf24" stroke="#dd0103" stroke-width="0.8" />
            
            <!-- Bay 2 (Mid-Forward): Warm Tangerine & Terracotta Stacks -->
            <rect x="22" y="106" width="26" height="32" rx="1.5" fill="#ea580c" stroke="#c2410c" stroke-width="0.8" />
            <rect x="52" y="106" width="26" height="32" rx="1.5" fill="#f97316" stroke="#ea580c" stroke-width="0.8" />

            <!-- Bay 3 (Mid-Aft): Dark Teal & Green Stacks -->
            <rect x="22" y="142" width="26" height="32" rx="1.5" fill="#0f766e" stroke="#115e59" stroke-width="0.8" />
            <rect x="52" y="142" width="26" height="32" rx="1.5" fill="#15803d" stroke="#166534" stroke-width="0.8" />

            <!-- Superstructure / Bridge Tower (Aft) -->
            <rect x="24" y="180" width="52" height="26" rx="2" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1" />
            <!-- Bridge Wing & Windows -->
            <rect x="26" y="182" width="48" height="6" fill="#02194b" rx="1" />
            <rect x="28" y="183" width="44" height="4" fill="#fef08a" />
            <!-- Funnel / Exhaust Stack with Company Colors -->
            <ellipse cx="50" cy="198" rx="8" ry="4" fill="#02194b" stroke="#dd0103" stroke-width="1.2" />

            <!-- Aft Mooring Deck & Transom -->
            <rect x="26" y="210" width="48" height="10" rx="1" fill="#1e293b" />
            <!-- Navigational Stern Lights: Port (Red), Starboard (Green) with zero-cost vector halos -->
            <circle cx="16" cy="165" r="4.5" fill="rgba(239, 68, 68, 0.35)" />
            <circle cx="16" cy="165" r="2" fill="#ef4444" />
            <circle cx="84" cy="165" r="4.5" fill="rgba(34, 197, 94, 0.35)" />
            <circle cx="84" cy="165" r="2" fill="#22c55e" />
          </svg>
        </div>
      </div>

      <!-- =========================================================
           6. FOUR FULL-HEIGHT "PORTS OF CALL" WAYPOINT SECTIONS (Z-30: Strictly Above Sea Level)
           ========================================================= -->
      
      <!-- ---------------------------------------------------------
           WAYPOINT 1: THE SHALLOWS (Depth: 18m - Coastal Shuttles)
           --------------------------------------------------------- -->
      <section
        id="services-section"
        class="relative min-h-screen flex items-center px-4 sm:px-12 lg:px-20 py-24 z-30">
        
        <div class="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-8 items-center relative z-30">
          <!-- Waypoint Marker on Left -->
          <div class="lg:col-span-5 space-y-6">
            <div class="inline-flex items-center gap-3">
              <div class="relative w-14 h-14 rounded-2xl bg-red-500/15 border border-red-500/30 flex items-center justify-center shadow-md shadow-red-600/10 text-[#dd0103]">
                <span class="absolute inset-0 rounded-2xl border-2 border-[#dd0103] animate-sonar-ping"></span>
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16zm1-13h-2v4H7v2h4v4h2v-4h4v-2h-4V7z" />
                </svg>
              </div>
              <div>
                <span class="text-xs font-mono font-bold uppercase tracking-wider text-[#dd0103]">Waypoint 01 • Nautical Mile 42</span>
                <h2 class="text-3xl sm:text-4xl font-black text-[#02194b] tracking-tight">The Coastal Shallows</h2>
              </div>
            </div>

            <p class="text-slate-700 text-base leading-relaxed">
              Navigating restricted-draft waterways and coastal shallows across the Arabian Gulf, Strait of Hormuz, and Gulf of Oman. Operating high-turnaround feeder shuttles where deep-draft mother vessels cannot enter.
            </p>

            <!-- Sonar Telemetry Card -->
            <div class="p-5 rounded-2xl bg-white/90 backdrop-blur-xl border border-slate-200/90 shadow-xl space-y-4 text-slate-900">
              <div class="flex items-center justify-between border-b border-slate-200 pb-3">
                <div class="flex items-center gap-2">
                  <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span class="text-xs font-bold uppercase text-slate-700">Sonar Sounder: Active</span>
                </div>
                <span class="text-xs font-mono text-[#dd0103] font-bold">DEPTH: 22.4 METERS</span>
              </div>

              <div class="grid grid-cols-3 gap-3 text-center">
                <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span class="text-[10px] text-slate-500 uppercase font-bold">Under-Keel</span>
                  <p class="text-sm font-black text-[#02194b] mt-0.5">8.6 m</p>
                </div>
                <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span class="text-[10px] text-slate-500 uppercase font-bold">Tidal Shift</span>
                  <p class="text-sm font-black text-[#dd0103] mt-0.5">+1.8 m</p>
                </div>
                <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span class="text-[10px] text-slate-500 uppercase font-bold">Berth Window</span>
                  <p class="text-sm font-black text-emerald-700 mt-0.5">GUARANTEED</p>
                </div>
              </div>

              <button
                (click)="triggerSonarPing()"
                class="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#dd0103] to-[#b50102] hover:from-[#ef2325] hover:to-[#dd0103] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-red-600/20 cursor-pointer">
                <svg class="w-4 h-4 text-[#02194b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>{{ isRtl() ? 'إرسال إشارة السونار الاستكشافية' : 'Transmit Hydrographic Sonar Ping' }}</span>
              </button>
            </div>
          </div>

          <!-- Feature Cards Anchored on Center-Left -->
          <div class="lg:col-span-4 space-y-3.5">
            <div class="p-5 rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200/90 hover:border-[#dd0103]/80 transition-all group shadow-lg text-slate-900">
              <div class="flex items-start gap-3.5">
                <div class="p-2.5 rounded-xl bg-red-50 text-[#dd0103] group-hover:scale-110 transition-transform">
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 class="text-base font-bold text-[#02194b] mb-1">Rapid 24-48h Shuttle Frequencies</h3>
                  <p class="text-xs text-slate-600 leading-relaxed">Dedicated express rotations connecting Jebel Ali with Sharjah, Sohar, and Khalifa Port. Zero idle anchorages with priority berthing windows.</p>
                </div>
              </div>
            </div>

            <div class="p-5 rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200/90 hover:border-[#dd0103]/80 transition-all group shadow-lg text-slate-900">
              <div class="flex items-start gap-3.5">
                <div class="p-2.5 rounded-xl bg-red-50 text-[#dd0103] group-hover:scale-110 transition-transform">
                  <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h3 class="text-base font-bold text-[#02194b] mb-1">Intermodal Sea-to-Rail Clearance</h3>
                  <p class="text-xs text-slate-600 leading-relaxed">Pre-cleared bonded container transit straight to Etihad Rail and inland dry container depots without terminal congestion bottlenecks.</p>
                </div>
              </div>
            </div>

            <div class="p-5 rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200/90 hover:border-[#dd0103]/80 transition-all group shadow-lg text-slate-900">
              <div class="flex items-start gap-3.5">
                <div class="p-2.5 rounded-xl bg-emerald-100 text-emerald-800 group-hover:scale-110 transition-transform">
                  <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 class="text-base font-bold text-[#02194b] mb-1">Cold-Chain Reefer Monitoring</h3>
                  <p class="text-xs text-slate-600 leading-relaxed">High-capacity reefer plug configurations on all coastal feeders with 24/7 automated temperature logs for pharmaceuticals and fresh produce.</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Column 3: Dedicated Open Ocean Fairway on Right (Ship & Golden Route Sail Unobstructed!) -->
          <div class="hidden lg:flex lg:col-span-3 items-center justify-center pointer-events-none min-h-[380px]">
            <div class="p-3.5 rounded-2xl bg-white/70 border border-amber-300 backdrop-blur-sm text-center space-y-1 shadow-sm">
              <span class="inline-block px-2 py-0.5 rounded bg-red-50 text-[10px] font-mono text-amber-900 font-bold tracking-widest uppercase">FAIRWAY 01 • OPEN SEA</span>
              <p class="text-[10px] text-slate-600 font-mono font-medium">CHANNEL DEPTH: 24.5M</p>
            </div>
          </div>
        </div>
      </section>

      <!-- ---------------------------------------------------------
           WAYPOINT 2: THE REEF (Depth: 75m - Interactive Showcase)
           --------------------------------------------------------- -->
      <section
        id="waypoint-reef"
        class="relative min-h-screen flex flex-col justify-center px-4 sm:px-12 lg:px-20 py-24 z-30">
        
        <div class="max-w-7xl mx-auto w-full space-y-8 relative z-30">
          <!-- Waypoint Header -->
          <div class="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/15 border border-amber-500/30 text-[#dd0103] text-xs font-bold tracking-wider uppercase mb-2">
                <span class="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                <span>Waypoint 02 • Navigational Fairway</span>
              </div>
              <h2 class="text-3xl sm:text-5xl font-black text-[#02194b] tracking-tight">The Coral Reef & Archipelago</h2>
              <p class="text-slate-700 text-sm sm:text-base max-w-2xl mt-1">
                Channel buoys and lighted beacons guide high-capacity feeder flagships through precision navigation fairways. Explore our purpose-built fleet.
              </p>
            </div>

            <!-- Carousel Controls -->
            <div class="flex items-center gap-3">
              <button
                (click)="scrollCarousel('prev')"
                type="button"
                aria-label="Previous vessel slide"
                class="w-11 h-11 rounded-xl bg-white border border-slate-300 hover:border-amber-500 text-slate-700 hover:text-[#dd0103] shadow-sm flex items-center justify-center transition-all cursor-pointer">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                (click)="scrollCarousel('next')"
                type="button"
                aria-label="Next vessel slide"
                class="w-11 h-11 rounded-xl bg-white border border-slate-300 hover:border-amber-500 text-slate-700 hover:text-[#dd0103] shadow-sm flex items-center justify-center transition-all cursor-pointer">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Interactive Horizontal Card Carousel -->
          <div
            #carouselTrack
            class="carousel-track-snap gap-4 sm:gap-6 py-4 px-1 relative z-30"
            role="region"
            aria-roledescription="carousel"
            aria-label="Flagship Feeder Fleet Showcase">
            
            <div
              *ngFor="let v of flagshipVessels; let i = index"
              class="carousel-slide-snap w-[85vw] sm:w-96 p-5 sm:p-6 rounded-2xl bg-white/95 backdrop-blur-xl border border-slate-200/90 hover:border-[#dd0103] transition-all flex flex-col justify-between group shadow-xl relative z-30 text-slate-900">
              
              <div>
                <!-- Top Badge Row -->
                <div class="flex items-center justify-between mb-4">
                  <span class="px-2.5 py-1 rounded-md bg-red-50 border border-amber-300 text-amber-900 text-xs font-mono font-bold">
                    {{ v.nominal_cap_teu }} TEU
                  </span>
                  <span class="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold border border-slate-200">
                    Flag: {{ v.flag }}
                  </span>
                </div>

                <!-- Vessel Name & Service -->
                <h3 class="text-2xl font-black text-[#02194b] group-hover:text-[#dd0103] transition-colors">{{ v.name }}</h3>
                <p class="text-xs font-mono text-slate-500 mt-1">IMO: {{ v.imo }} • Built {{ v.built_year }}</p>

                <!-- Spec Grid -->
                <div class="grid grid-cols-2 gap-2.5 my-5 text-xs">
                  <div class="p-2 rounded-lg bg-slate-50 border border-slate-200">
                    <span class="text-[10px] text-slate-500 uppercase font-semibold">Service Line</span>
                    <p class="font-bold text-slate-900 truncate">{{ v.service_code }}</p>
                  </div>
                  <div class="p-2 rounded-lg bg-slate-50 border border-slate-200">
                    <span class="text-[10px] text-slate-500 uppercase font-semibold">Summer Draft</span>
                    <p class="font-bold text-[#dd0103]">{{ v.summer_draft }} m</p>
                  </div>
                  <div class="p-2 rounded-lg bg-slate-50 border border-slate-200">
                    <span class="text-[10px] text-slate-500 uppercase font-semibold">Deadweight</span>
                    <p class="font-mono font-semibold text-slate-800">{{ v.dwt | number }} DWT</p>
                  </div>
                  <div class="p-2 rounded-lg bg-slate-50 border border-slate-200">
                    <span class="text-[10px] text-slate-500 uppercase font-semibold">Length (LOA)</span>
                    <p class="font-mono font-semibold text-slate-800">{{ v.loa }} m</p>
                  </div>
                </div>

                <p class="text-xs text-slate-600 leading-relaxed">{{ v.description }}</p>
              </div>

              <!-- Action Buttons -->
              <div class="pt-5 mt-4 border-t border-slate-200 flex items-center gap-2">
                <button
                  (click)="openVesselModal(v)"
                  class="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#dd0103] to-[#b50102] hover:from-[#ef2325] hover:to-[#dd0103] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-red-600/20 cursor-pointer">
                  <span>{{ isRtl() ? 'المواصفات الكاملة' : 'View 16-Pt Specs' }}</span>
                </button>
                <button
                  (click)="trackOnMap(v)"
                  class="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 hover:border-[#dd0103] border border-slate-300 transition-all cursor-pointer shadow-sm"
                  title="Track on Leaflet Map">
                  <svg class="w-4 h-4 text-[#dd0103]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ---------------------------------------------------------
           WAYPOINT 3: THE DEEP TRENCH (Depth: 2,400m - Metrics & Tech)
           --------------------------------------------------------- -->
      <section
        id="waypoint-trench"
        class="relative min-h-screen flex items-center px-4 sm:px-12 lg:px-20 py-24 z-30 overflow-hidden">
        
        <!-- Rotating Deep-Sea Bathymetric Sonar / Sunny Golden Lighthouse Sweep Beam -->
        <div class="absolute inset-0 pointer-events-none z-0 flex items-center justify-center opacity-30 overflow-hidden max-w-full">
          <div
            class="w-[320px] h-[320px] sm:w-[550px] sm:h-[550px] lg:w-[800px] lg:h-[800px] rounded-full animate-lighthouse-beam pointer-events-none will-change-transform transform-gpu"
            style="background: conic-gradient(from 0deg, rgba(245, 158, 11, 0.45) 0deg, rgba(245, 158, 11, 0.12) 35deg, transparent 65deg, transparent 360deg); -webkit-transform: translateZ(0); transform: translateZ(0);">
          </div>
        </div>

        <div class="max-w-7xl mx-auto w-full relative z-30 space-y-12">
          <!-- Section Title -->
          <div class="text-center max-w-3xl mx-auto space-y-3">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/15 border border-amber-500/30 text-[#dd0103] text-xs font-bold tracking-wider uppercase">
              <span class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              <span>Waypoint 03 • Abyssal Marine Trench (2,400m)</span>
            </div>
            <h2 class="text-3xl sm:text-5xl font-black text-[#02194b] tracking-tight">The Oceanic Trench & Metrics</h2>
            <p class="text-slate-700 text-sm sm:text-base">
              Deep-water long-haul ocean corridors linking the Middle East, India, and Southeast Asia. Powered by real-time telemetry, automated bunker optimization, and zero-compromise schedule integrity.
            </p>
          </div>

          <!-- 4 Core High-Impact Stat Cards -->
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 relative z-30">
            <div class="p-4 sm:p-6 rounded-2xl bg-white/95 backdrop-blur-xl border border-slate-200/90 hover:border-[#dd0103] transition-all text-center space-y-1.5 sm:space-y-2 group shadow-xl">
              <span class="text-[10px] sm:text-xs font-mono font-bold text-[#dd0103] uppercase tracking-widest">Schedule Integrity</span>
              <p class="text-3xl sm:text-5xl font-black text-[#02194b] group-hover:scale-105 transition-transform">99.4%</p>
              <p class="text-[11px] sm:text-xs text-slate-500">On-time berthing across all Middle East & Asia services</p>
            </div>

            <div class="p-4 sm:p-6 rounded-2xl bg-white/95 backdrop-blur-xl border border-slate-200/90 hover:border-[#dd0103] transition-all text-center space-y-1.5 sm:space-y-2 group shadow-xl">
              <span class="text-[10px] sm:text-xs font-mono font-bold text-[#dd0103] uppercase tracking-widest">Annual Volume</span>
              <p class="text-3xl sm:text-5xl font-black text-[#02194b] group-hover:scale-105 transition-transform">2.5M+</p>
              <p class="text-[11px] sm:text-xs text-slate-500">TEUs moved safely per year across regional hubs & feeder links</p>
            </div>

            <div class="p-4 sm:p-6 rounded-2xl bg-white/95 backdrop-blur-xl border border-slate-200/90 hover:border-[#dd0103] transition-all text-center space-y-1.5 sm:space-y-2 group shadow-xl">
              <span class="text-[10px] sm:text-xs font-mono font-bold text-emerald-700 uppercase tracking-widest">Feeder Fleet</span>
              <p class="text-3xl sm:text-5xl font-black text-[#02194b] group-hover:scale-105 transition-transform">66</p>
              <p class="text-[11px] sm:text-xs text-slate-500">Modern feeder vessels with satellite AIS & bow thrusters</p>
            </div>

            <div class="p-4 sm:p-6 rounded-2xl bg-white/95 backdrop-blur-xl border border-slate-200/90 hover:border-[#dd0103] transition-all text-center space-y-1.5 sm:space-y-2 group shadow-xl">
              <span class="text-[10px] sm:text-xs font-mono font-bold text-[#dd0103] uppercase tracking-widest">Navigated</span>
              <p class="text-3xl sm:text-5xl font-black text-[#02194b] group-hover:scale-105 transition-transform">1.2M NM</p>
              <p class="text-[11px] sm:text-xs text-slate-500">Nautical miles logged with zero lost containers at sea</p>
            </div>
          </div>

          <!-- Deep Trench Architectural Pillars -->
          <div class="p-8 rounded-3xl bg-white/90 backdrop-blur-md border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-6 relative z-30 shadow-lg text-slate-900">
            <div class="space-y-2">
              <span class="text-xs font-mono text-[#dd0103] font-bold uppercase">01 / Fuel & Speed Optimization</span>
              <h4 class="text-base font-bold text-[#02194b]">Bathymetric Current Routing</h4>
              <p class="text-xs text-slate-600">Harnessing monsoon currents and sea state telemetry to decrease carbon emissions by 14% while preserving exact port-arrival ETAs.</p>
            </div>
            <div class="space-y-2">
              <span class="text-xs font-mono text-[#dd0103] font-bold uppercase">02 / IMO Tier III Compliance</span>
              <h4 class="text-base font-bold text-[#02194b]">Eco-Hull & Silicon Coatings</h4>
              <p class="text-xs text-slate-600">Modern low-friction hull coatings and micro-bubble lubrication systems drastically reduce hydrodynamic drag across deep trench waters.</p>
            </div>
            <div class="space-y-2">
              <span class="text-xs font-mono text-emerald-700 font-bold uppercase">03 / Dual Satellite AIS Uplinks</span>
              <h4 class="text-base font-bold text-[#02194b]">Unbroken Global Telemetry</h4>
              <p class="text-xs text-slate-600">Real-time voyage position updates polled every 12 seconds with automatic anti-collision predictive vector calculations.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- ---------------------------------------------------------
           WAYPOINT 4: SAFE HARBOR (Depth: 16m - Pier & Final CTA)
           --------------------------------------------------------- -->
      <section
        id="waypoint-harbor"
        class="relative min-h-screen flex items-center px-4 sm:px-12 lg:px-20 py-24 z-30">
        
        <div class="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-30">
          <!-- Pier Graphic & Anchor Drop Micro-animation -->
          <div class="lg:col-span-5 flex flex-col items-center justify-center p-8 rounded-3xl bg-white/95 backdrop-blur-xl border border-slate-200 shadow-xl relative z-20">
            <!-- Mooring Pier Graphic -->
            <div class="w-full h-24 rounded-2xl bg-gradient-to-r from-amber-700/40 via-slate-600 to-amber-700/40 border-2 border-[#dd0103] relative overflow-hidden flex items-center justify-around px-6 mb-8 shadow-sm">
              <!-- Pier Warning Stripes -->
              <div class="absolute inset-x-0 bottom-0 h-3 bg-[repeating-linear-gradient(45deg,#f59e0b,#f59e0b_10px,#0f172a_10px,#0f172a_20px)] opacity-85"></div>
              <!-- Mooring Bollards -->
              <div class="w-6 h-8 rounded-t-lg bg-slate-200 border border-slate-400 shadow-md flex items-center justify-center">
                <span class="w-4 h-1 bg-slate-600 rounded"></span>
              </div>
              <div class="w-6 h-8 rounded-t-lg bg-slate-200 border border-slate-400 shadow-md flex items-center justify-center">
                <span class="w-4 h-1 bg-slate-600 rounded"></span>
              </div>
              <div class="w-6 h-8 rounded-t-lg bg-slate-200 border border-slate-400 shadow-md flex items-center justify-center">
                <span class="w-4 h-1 bg-slate-600 rounded"></span>
              </div>
            </div>

            <!-- Anchor Drop Graphic & Water Splash Effect -->
            <div class="relative w-28 h-28 flex items-center justify-center">
              <span *ngIf="isAnchorDropped()" class="absolute inset-0 rounded-full border-2 border-emerald-500 animate-sonar-ping"></span>
              <div [class]="isAnchorDropped() ? 'animate-anchor-drop' : 'opacity-70'">
                <svg viewBox="0 0 100 120" class="w-20 h-20 text-emerald-600 fill-current filter drop-shadow-[0_0_12px_rgba(16,185,129,0.4)]">
                  <!-- Anchor Ring -->
                  <circle cx="50" cy="20" r="12" fill="none" stroke="currentColor" stroke-width="6" />
                  <!-- Anchor Shank -->
                  <rect x="46" y="28" width="8" height="60" rx="2" />
                  <!-- Stock Crossbar -->
                  <rect x="25" y="42" width="50" height="6" rx="2" />
                  <!-- Flukes & Crown -->
                  <path d="M 12 70 C 18 106, 82 106, 88 70 L 98 72 C 90 118, 10 118, 2 72 Z" />
                  <!-- Left Fluke Tip -->
                  <polygon points="12,70 2,72 16,56" />
                  <!-- Right Fluke Tip -->
                  <polygon points="88,70 98,72 84,56" />
                </svg>
              </div>
            </div>

            <div class="mt-4 text-center">
              <span class="inline-block px-3 py-1 rounded-full text-xs font-bold font-mono tracking-wider border"
                    [ngClass]="isAnchorDropped() ? 'bg-emerald-100 text-emerald-900 border-emerald-300' : 'bg-red-50 text-amber-900 border-amber-300'">
                {{ isAnchorDropped() ? 'VESSEL SAFELY MOORED AT BERTH' : 'APPROACHING FINAL HARBOR PIER' }}
              </span>
              <p class="text-xs text-slate-500 font-mono mt-1 font-semibold">JEBEL ALI CONTAINER TERMINAL 2 • BERTH 08</p>
            </div>
          </div>

          <!-- Final High-Impact CTA & Actions -->
          <div class="lg:col-span-7 space-y-6 relative z-30">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold uppercase tracking-wider">
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Voyage Complete • Safe Harbor</span>
            </div>

            <h2 class="text-3xl sm:text-5xl font-black text-[#02194b] tracking-tight leading-tight">
              Ready to Accelerate Your Maritime Supply Chain?
            </h2>

            <p class="text-base text-slate-700 leading-relaxed">
              Join leading global container carriers who rely on our high-frequency feeder network. Instant bookings, guaranteed berthing allocations, and seamless door-to-hub visibility.
            </p>

            <div class="flex flex-wrap items-center gap-4 pt-2">
              <button
                (click)="service.toggleBookingModal(true)"
                class="py-3.5 px-8 rounded-xl bg-gradient-to-r from-[#dd0103] to-[#b50102] hover:from-[#ef2325] hover:to-[#dd0103] text-white font-black text-sm tracking-wide shadow-md shadow-red-600/25 transition-all transform hover:-translate-y-0.5 cursor-pointer">
                {{ isRtl() ? 'حجز مساحة شحن فورية' : 'Book Instant Feeder Space' }}
              </button>
              
              <button
                (click)="scrollToSchedules()"
                class="py-3.5 px-6 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm border border-slate-300 hover:border-amber-500 transition-all cursor-pointer shadow-sm">
                {{ isRtl() ? 'تحميل جدول الرحلات الكامل' : 'Download Schedule Book (PDF)' }}
              </button>
            </div>

            <!-- Regional Port Agent Quick-Connect Strip -->
            <div class="pt-6 border-t border-slate-200 space-y-2">
              <span class="text-xs uppercase font-bold text-slate-600 tracking-wider">Immediate Port Agent Contacts:</span>
              <div class="flex flex-wrap gap-2.5">
                <a href="tel:+97142105105" class="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-amber-500 text-xs font-mono text-slate-800 transition-colors shadow-sm">
                  <strong class="text-[#dd0103]">Dubai HQ:</strong> +971 4 210 51 05
                </a>
                <a href="tel:+6562201888" class="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-amber-500 text-xs font-mono text-slate-800 transition-colors shadow-sm">
                  <strong class="text-[#dd0103]">Singapore:</strong> +65 6220 1888
                </a>
                <a href="tel:+912266389000" class="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-amber-500 text-xs font-mono text-slate-800 transition-colors shadow-sm">
                  <strong class="text-[#dd0103]">Mumbai:</strong> +91 22 6638 9000
                </a>
                <a href="tel:+966126512233" class="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-amber-500 text-xs font-mono text-slate-800 transition-colors shadow-sm">
                  <strong class="text-[#dd0103]">Jeddah:</strong> +966 12 651 2233
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- =========================================================
           PORT OF ARRIVAL: SAFE HARBOR DESTINATION TERMINAL (CANAL BERTH 08)
           ========================================================= -->
      <div id="arrival-terminal-dock" class="relative z-25 w-full pt-4 pb-14 flex flex-col items-center pointer-events-none">
        
        <!-- Terminal Arrival Status Pill with Dynamic Inbound / Docking / All Fast Status -->
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 border border-emerald-300 shadow-md text-xs font-mono font-bold text-[#02194b] mb-3 pointer-events-auto">
          <span class="w-2.5 h-2.5 rounded-full" [ngClass]="arrivalStatusDotClass()"></span>
          <span class="text-emerald-700 font-black">DESTINATION PORT:</span>
          <span>SAFE HARBOR CONTAINER TERMINAL • CANAL BERTH 08</span>
          <span class="text-slate-400">|</span>
          <span [ngClass]="arrivalStatusTextClass()">{{ arrivalStatusText() }}</span>
        </div>

        <!-- Dual-Quay Receiving Canal Harbor Basin (Ship Enters in the Middle Channel) -->
        <div class="relative w-[94%] sm:w-[760px] lg:w-[920px] max-w-full">
          
          <div class="flex items-stretch justify-between relative min-h-[110px] sm:min-h-[130px]">
            
            <!-- 1. LEFT RECEIVING PIER (WEST QUAY APRON - PORT SIDE) -->
            <div class="w-[37%] sm:w-[39%] rounded-2xl bg-gradient-to-tr from-slate-200 via-slate-100 to-slate-300 border-2 border-emerald-300 shadow-xl relative overflow-visible flex flex-col justify-between p-3 sm:p-4">
              <!-- Canal Waterline Warning Stripes (Emerald & Dark Slate on Canal Edge) -->
              <div class="absolute right-0 inset-y-0 w-2.5 bg-[repeating-linear-gradient(45deg,#10b981,#10b981_8px,#0f172a_8px,#0f172a_16px)] opacity-95 shadow-sm rounded-r-xs"></div>
              
              <!-- Rubber Cylindrical Marine Fenders facing Canal -->
              <div class="absolute -right-1 inset-y-3 flex flex-col justify-around pointer-events-none z-10">
                <span class="w-2 h-5 bg-slate-800 rounded-l-xs shadow-md border-r border-slate-600"></span>
                <span class="w-2 h-5 bg-slate-800 rounded-l-xs shadow-md border-r border-slate-600"></span>
                <span class="w-2 h-5 bg-slate-800 rounded-l-xs shadow-md border-r border-slate-600"></span>
              </div>

              <!-- Pier Approach Port Beacon (Red) on top canal entry point -->
              <div class="absolute -top-3 right-2 flex items-center gap-1 bg-white/95 backdrop-blur-md px-2 py-0.5 rounded-full border border-red-200 shadow-sm z-20">
                <span class="w-2 h-2 rounded-full bg-[#dd0103] animate-ping"></span>
                <span class="text-[7px] font-mono font-bold text-[#dd0103]">APPROACH 01</span>
              </div>

              <!-- Arrival Mooring Bollards along Canal Edge -->
              <div class="flex items-center justify-end gap-6 sm:gap-10 pr-3 relative z-10 mt-1">
                <div class="flex flex-col items-center">
                  <span class="w-4 h-5 rounded-b-lg bg-slate-700 border border-slate-500 shadow flex items-center justify-center">
                    <span class="w-2.5 h-1 bg-slate-300 rounded-xs"></span>
                  </span>
                  <span class="text-[6.5px] font-mono font-bold text-slate-500 mt-0.5">BERTH 08A</span>
                </div>
                <div class="flex flex-col items-center">
                  <span class="w-4 h-5 rounded-b-lg bg-slate-700 border border-slate-500 shadow flex items-center justify-center">
                    <span class="w-2.5 h-1 bg-slate-300 rounded-xs"></span>
                  </span>
                  <span class="text-[6.5px] font-mono font-bold text-slate-500 mt-0.5">BERTH 08B</span>
                </div>
              </div>

              <!-- Customs Clearance & Inbound Holding Stacks -->
              <div class="flex items-end justify-between relative z-10 mt-auto pt-2">
                <div class="flex flex-col gap-0.5">
                  <div class="w-9 sm:w-11 h-3 rounded-xs bg-[#02194b] border border-[#062569] flex items-center justify-center text-[5.5px] font-mono text-white font-bold">40FT • INBOUND</div>
                  <div class="w-9 sm:w-11 h-3 rounded-xs bg-emerald-600 border border-emerald-700 flex items-center justify-center text-[5.5px] font-mono text-white font-bold">CUSTOMS CLEARED</div>
                </div>

                <div class="flex flex-col items-center">
                  <div class="w-4 h-6 bg-emerald-950 border border-emerald-600 rounded-t-sm flex flex-col items-center justify-between p-0.5">
                    <span class="w-2.5 h-1 bg-emerald-400 rounded-xs"></span>
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  </div>
                  <span class="text-[6px] font-mono font-bold text-emerald-800">CUSTOMS</span>
                </div>
              </div>
            </div>

            <!-- 2. CENTRAL RECEIVING CANAL WATER CHANNEL (BERTH BASIN) -->
            <div class="w-[26%] sm:w-[22%] relative flex flex-col items-center justify-between py-1 pointer-events-none">
              <!-- Canal Fairway Guide -->
              <div class="w-full flex items-center justify-center gap-1 opacity-75">
                <span class="h-0.5 flex-1 bg-gradient-to-r from-red-400 to-transparent"></span>
                <span class="text-[6px] font-mono text-slate-500">CANAL GATE 08</span>
                <span class="h-0.5 flex-1 bg-gradient-to-l from-emerald-400 to-transparent"></span>
              </div>

              <!-- Receiving Basin Center Badge -->
              <div class="text-[7.5px] sm:text-[8px] font-mono font-bold text-emerald-800 bg-white/90 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-emerald-300 shadow-xs">
                DEPTH 19.0M • BERTH 08
              </div>

              <!-- Fairway Approach Indicator -->
              <div class="w-full flex justify-between items-center px-1 text-[7px] font-mono font-bold text-emerald-700/80">
                <span>◀ DOCK A</span>
                <span class="px-1.5 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-[6.5px]">ALL FAST BASIN</span>
                <span>DOCK B ▶</span>
              </div>
            </div>

            <!-- 3. RIGHT RECEIVING PIER (EAST QUAY APRON with UPRIGHT DISCHARGE STS CRANE) -->
            <div class="w-[37%] sm:w-[39%] rounded-2xl bg-gradient-to-tl from-slate-200 via-slate-100 to-slate-300 border-2 border-emerald-300 shadow-xl relative overflow-visible flex flex-col justify-between p-3 sm:p-4">
              <!-- Canal Waterline Warning Stripes (Emerald on Inner Canal Edge) -->
              <div class="absolute left-0 inset-y-0 w-2.5 bg-[repeating-linear-gradient(45deg,#10b981,#10b981_8px,#0f172a_8px,#0f172a_16px)] opacity-95 shadow-sm rounded-l-xs"></div>
              
              <!-- Rubber Cylindrical Marine Fenders facing Canal -->
              <div class="absolute -left-1 inset-y-3 flex flex-col justify-around pointer-events-none z-10">
                <span class="w-2 h-5 bg-slate-800 rounded-r-xs shadow-md border-l border-slate-600"></span>
                <span class="w-2 h-5 bg-slate-800 rounded-r-xs shadow-md border-l border-slate-600"></span>
                <span class="w-2 h-5 bg-slate-800 rounded-r-xs shadow-md border-l border-slate-600"></span>
              </div>

              <!-- Approach Starboard Beacon (Green) on top canal entry point -->
              <div class="absolute -top-3 left-2 flex items-center gap-1 bg-white/95 backdrop-blur-md px-2 py-0.5 rounded-full border border-emerald-200 shadow-sm z-20">
                <span class="text-[7px] font-mono font-bold text-emerald-700">APPROACH 02</span>
                <span class="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              </div>

              <!-- Upright Discharge STS Gantry Crane reaching LEFT over receiving canal -->
              <div class="absolute -top-3 sm:-top-5 -left-10 sm:-left-16 z-25 pointer-events-none">
                <svg viewBox="0 0 160 100" class="w-36 sm:w-48 h-auto overflow-visible select-none">
                  <!-- Crane Gantry Legs on Right Pier Rails (UPRIGHT) -->
                  <line x1="88" y1="95" x2="114" y2="35" stroke="#047857" stroke-width="4.5" stroke-linecap="round" />
                  <line x1="142" y1="95" x2="126" y2="35" stroke="#047857" stroke-width="4.5" stroke-linecap="round" />
                  <line x1="94" y1="70" x2="136" y2="70" stroke="#065f46" stroke-width="2.5" />
                  <line x1="104" y1="50" x2="130" y2="50" stroke="#065f46" stroke-width="2.5" />
                  
                  <!-- Portal Apex Tower -->
                  <line x1="120" y1="35" x2="120" y2="10" stroke="#02194b" stroke-width="3" />
                  <line x1="120" y1="10" x2="12" y2="35" stroke="#02194b" stroke-width="1.8" />
                  <line x1="120" y1="10" x2="152" y2="35" stroke="#02194b" stroke-width="1.8" />
                  
                  <!-- Extended Boom reaching into the Central Canal above ship -->
                  <line x1="10" y1="35" x2="152" y2="35" stroke="#10b981" stroke-width="4" stroke-linecap="round" />
                  
                  <!-- Operator Cab & Discharge Spreader poised over incoming vessel -->
                  <rect x="36" y="37" width="14" height="8" rx="1" fill="#02194b" />
                  <line x1="43" y1="45" x2="43" y2="60" stroke="#475569" stroke-width="1.2" />
                  <rect x="32" y="60" width="22" height="4.5" rx="0.5" fill="#10b981" stroke="#047857" stroke-width="0.5" />
                  
                  <!-- High-intensity Green Beacon -->
                  <circle cx="120" cy="10" r="2.2" fill="#10b981" class="animate-ping" />
                  <circle cx="120" cy="10" r="1.5" fill="#047857" />
                  <circle cx="10" cy="35" r="1.8" fill="#10b981" />
                </svg>
              </div>

              <!-- Arrival Mooring Bollards along Canal Edge -->
              <div class="flex items-center justify-start gap-6 sm:gap-10 pl-3 relative z-10 mt-1">
                <div class="flex flex-col items-center">
                  <span class="w-4 h-5 rounded-b-lg bg-slate-700 border border-slate-500 shadow flex items-center justify-center">
                    <span class="w-2.5 h-1 bg-slate-300 rounded-xs"></span>
                  </span>
                  <span class="text-[6.5px] font-mono font-bold text-slate-500 mt-0.5">BERTH 08C</span>
                </div>
                <div class="flex flex-col items-center">
                  <span class="w-4 h-5 rounded-b-lg bg-slate-700 border border-slate-500 shadow flex items-center justify-center">
                    <span class="w-2.5 h-1 bg-slate-300 rounded-xs"></span>
                  </span>
                  <span class="text-[6.5px] font-mono font-bold text-slate-500 mt-0.5">BERTH 08D</span>
                </div>
              </div>

              <!-- Discharge Staging Container Stacks -->
              <div class="flex items-end justify-end gap-1.5 relative z-10 mt-auto pt-2">
                <div class="w-8 sm:w-10 h-3 rounded-xs bg-[#dd0103] border border-[#b50102] flex items-center justify-center text-[5.5px] font-mono text-white font-bold">DISCHARGE</div>
                <div class="w-8 sm:w-10 h-3 rounded-xs bg-[#02194b] border border-[#062569] flex items-center justify-center text-[5.5px] font-mono text-white font-bold">40FT • EXP</div>
              </div>
            </div>

          </div>

        </div>
      </div>

      <!-- =========================================================
           7. FIXED CORNER NAVIGATION HUD (COMPASS, KNOTS, LAT/LNG)
           ========================================================= -->
      <aside
        *ngIf="journeyProgress() > 0.02"
        id="maritime-hud"
        aria-label="Live Navigational Telemetry HUD"
        class="fixed bottom-3 right-3 sm:bottom-6 sm:right-6 z-40 bg-white/95 backdrop-blur-xl border border-slate-300 rounded-2xl p-2.5 sm:p-4 shadow-xl flex items-center gap-2.5 sm:gap-4 pointer-events-auto transition-all duration-300 max-w-[calc(100vw-1.5rem)] text-slate-900 animate-fade-in">
        
        <!-- Minimized Pill View for Mobile & Compact Screens -->
        <ng-container *ngIf="isHudMinimized()">
          <button
            (click)="isHudMinimized.set(false)"
            class="flex items-center gap-2 text-xs font-mono font-bold text-slate-900 hover:text-[#dd0103] py-1 px-1.5 cursor-pointer">
            <span class="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
            <span class="text-[#dd0103]">{{ speedKnots() }} KN</span>
            <span class="text-slate-400 text-[10px]">|</span>
            <span class="text-slate-700 text-[11px]">{{ liveLat() }}°N, {{ liveLng() }}°E</span>
            <svg class="w-4 h-4 text-[#dd0103] ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
            </svg>
          </button>
        </ng-container>

        <!-- Expanded Full View -->
        <ng-container *ngIf="!isHudMinimized()">
          <!-- Rotating Compass Rose -->
          <div class="relative w-10 h-10 sm:w-14 sm:h-14 flex items-center justify-center flex-shrink-0">
            <!-- Compass Bezel -->
            <div class="absolute inset-0 rounded-full border border-slate-300 bg-slate-50 flex items-center justify-center shadow-inner">
              <span class="absolute top-0.5 text-[7px] sm:text-[8px] font-mono text-[#dd0103] font-bold">N</span>
              <span class="absolute bottom-0.5 text-[7px] sm:text-[8px] font-mono text-slate-500 font-bold">S</span>
              <span class="absolute right-1 text-[7px] sm:text-[8px] font-mono text-slate-500 font-bold">E</span>
              <span class="absolute left-1 text-[7px] sm:text-[8px] font-mono text-slate-500 font-bold">W</span>
            </div>
            <!-- Rotating Compass Needle -->
            <div
              class="relative w-full h-full flex items-center justify-center transition-transform duration-100"
              [style.transform]="'rotate(' + compassHeading() + 'deg)'">
              <svg viewBox="0 0 40 40" class="w-6 h-6 sm:w-8 sm:h-8">
                <polygon points="20,4 23,20 17,20" fill="#ef4444" /> <!-- North Red -->
                <polygon points="20,36 23,20 17,20" fill="#dd0103" /> <!-- South Amber Gold -->
                <circle cx="20" cy="20" r="2.5" fill="#ffffff" stroke="#94a3b8" stroke-width="0.8" />
              </svg>
            </div>
          </div>

          <!-- Telemetry Data: Knots Speedometer + Coordinates -->
          <div class="border-l border-slate-200 pl-2.5 sm:pl-4 space-y-0.5 sm:space-y-1">
            <div class="flex items-center justify-between gap-3">
              <span class="text-[9px] sm:text-[10px] font-bold uppercase text-slate-500">Speed Over Ground</span>
              <button
                (click)="isHudMinimized.set(true)"
                class="text-slate-400 hover:text-slate-700 p-0.5 -mr-1"
                title="Minimize HUD">
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            <div class="flex items-baseline gap-1 sm:gap-1.5">
              <span class="text-xl sm:text-2xl font-black font-mono text-[#02194b]">{{ speedKnots() }}</span>
              <span class="text-[10px] sm:text-xs font-bold font-mono text-[#dd0103]">KN</span>
              <span class="text-[9px] sm:text-[10px] font-semibold text-slate-500 ml-1 truncate">({{ speedLabel() }})</span>
            </div>

            <div class="text-[10px] sm:text-[11px] font-mono text-slate-700 font-medium">
              <span>{{ liveLat() }}° N</span>, <span>{{ liveLng() }}° E</span>
              <span class="text-[#dd0103] font-bold ml-1">{{ headingDirection() }}</span>
            </div>
          </div>
        </ng-container>
      </aside>

    </div>
  `
})
export class MaritimeJourneyComponent implements AfterViewInit, OnDestroy {
  service = inject(MaritimeService);
  isRtl = this.service.isRtl;

  @ViewChild('journeyContainer') containerRef!: ElementRef<HTMLDivElement>;
  @ViewChild('backgroundPath') pathRef!: ElementRef<SVGPathElement>;
  @ViewChild('activePath') activePathRef!: ElementRef<SVGPathElement>;
  @ViewChild('glowPath') glowPathRef!: ElementRef<SVGPathElement>;
  @ViewChild('shipEl') shipEl!: ElementRef<HTMLDivElement>;
  @ViewChild('carouselTrack') carouselTrackRef!: ElementRef<HTMLDivElement>;

  // Continuous Winding Route Path (viewBox 0 0 1000 4000)
  // Origin starts at Berth 01 Quay (X: 500, Y: 200) and sails down fairway to destination Safe Harbor Berth 08 (X: 500, Y: 3800)
  readonly routePathD = 'M 500 200 C 500 320, 840 600, 800 950 C 760 1350, 220 1600, 240 1950 C 260 2350, 780 2600, 680 2950 C 580 3300, 480 3650, 500 3800';

  // Reactive State Signals
  journeyProgress = signal<number>(0);
  pathTotalLength = signal<number>(4200);
  pathDashOffset = signal<number>(4200);

  shipRawX = signal<number>(500);
  shipRawY = signal<number>(200);
  shipXPercent = signal<number>(50);
  shipYPercent = signal<number>(5);
  shipHeading = signal<number>(180);
  compassHeading = signal<number>(180);

  speedKnots = signal<number>(0);
  speedLabel = signal<string>('SECURED AT BERTH 01 (ALL FAST)');
  liveLat = signal<string>('25.018');
  liveLng = signal<string>('55.061');
  headingDirection = signal<string>('180° S');

  isAnchorDropped = signal<boolean>(false);
  isHudMinimized = signal<boolean>(typeof window !== 'undefined' ? window.innerWidth < 640 : false);
  wakeTrail = signal<WakeParticle[]>([]);
  ripples = signal<WaterRipple[]>([]);

  // Five Flagship Vessels for Waypoint 2 Carousel
  flagshipVessels = [
    {
      id: 1,
      name: 'GFS PRESTIGE',
      imo: '9438925',
      flag: 'Panama',
      built_year: 2018,
      nominal_cap_teu: 3500,
      summer_draft: 11.2,
      dwt: 42500,
      loa: 228.0,
      service_code: 'JSA',
      description: 'Twin bow-thruster flagship operating high-frequency Middle East to Red Sea corridors with dedicated 450 reefer plugs.'
    },
    {
      id: 2,
      name: 'X-PRESS MEGHNA',
      imo: '9512348',
      flag: 'Singapore',
      built_year: 2021,
      nominal_cap_teu: 2700,
      summer_draft: 10.5,
      dwt: 34800,
      loa: 205.5,
      service_code: 'GALEX',
      description: 'Ultra-efficient container liner with bulbous-bow hydrodynamic optimization for Straits of Malacca express operations.'
    },
    {
      id: 3,
      name: 'GFS ASIA',
      imo: '9602341',
      flag: 'Liberia',
      built_year: 2020,
      nominal_cap_teu: 4250,
      summer_draft: 12.0,
      dwt: 52000,
      loa: 260.0,
      service_code: 'AES',
      description: 'Heavy feeder workhorse linking Arabian Gulf hubs to Indian Subcontinent container terminals (Mundra & Nhava Sheva).'
    },
    {
      id: 4,
      name: 'ACACIA VIRGO',
      imo: '9345672',
      flag: 'Cyprus',
      built_year: 2017,
      nominal_cap_teu: 1850,
      summer_draft: 8.9,
      dwt: 24200,
      loa: 172.0,
      service_code: 'CCG',
      description: 'Geared container feeder equipped with twin 45-ton electro-hydraulic deck cranes for non-geared destination ports.'
    },
    {
      id: 5,
      name: 'CALLIOPE',
      imo: '9283451',
      flag: 'Malta',
      built_year: 2016,
      nominal_cap_teu: 1440,
      summer_draft: 7.8,
      dwt: 18500,
      loa: 154.0,
      service_code: 'UAE-COASTAL',
      description: 'Shallow-draft coastal shuttle specialist running weekly round-trips connecting Dubai, Sharjah, Ras Al Khaimah, and Sohar.'
    }
  ];

  // Environmental Ocean Color Shifting
  oceanGradient = computed(() => {
    const p = this.journeyProgress();
    if (p < 0.28) {
      // The Shallows (Coastal Turquoise to Deep Ocean Blue)
      return 'linear-gradient(180deg, #0284c7 0%, #0369a1 45%, #075985 80%, #0c4a6e 100%)';
    } else if (p < 0.60) {
      // The Reef (Coral Blue into Deep Midnight Blue)
      return 'linear-gradient(180deg, #0c4a6e 0%, #0a2540 45%, #06192d 85%, #041220 100%)';
    } else if (p < 0.85) {
      // The Deep Trench (Abyssal Midnight Navy & Black)
      return 'linear-gradient(180deg, #041220 0%, #020617 35%, #010409 70%, #060d19 100%)';
    } else {
      // Safe Harbor (Deep Navy transitioning to Sunset Harbor Warm Glow)
      return 'linear-gradient(180deg, #060d19 0%, #0f172a 30%, #1e1b4b 65%, #2a152e 100%)';
    }
  });

  // Dynamic Terminal Status Indicators & Mooring Rigging
  departureStatusText = computed(() => {
    const p = this.journeyProgress();
    if (p <= 0.005) return 'STATUS: MOORED AT BERTH 01 • ALL FAST';
    if (p < 0.045) return 'STATUS: UNDOCKING • CAST OFF • CLEARING BERTH';
    return 'STATUS: UNDERWAY • FULL SPEED AHEAD';
  });

  departureStatusDotClass = computed(() => {
    const p = this.journeyProgress();
    if (p <= 0.005) return 'bg-amber-500 animate-pulse';
    if (p < 0.045) return 'bg-sky-500 animate-ping';
    return 'bg-emerald-500 animate-ping';
  });

  departureStatusTextClass = computed(() => {
    const p = this.journeyProgress();
    if (p <= 0.005) return 'text-amber-700 font-bold';
    if (p < 0.045) return 'text-sky-700 font-bold';
    return 'text-emerald-700 font-bold';
  });

  arrivalStatusText = computed(() => {
    const p = this.journeyProgress();
    if (p < 0.95) return 'APPROACH CHANNEL • INBOUND STANDBY';
    if (p < 0.98) return 'BASIN MANEUVERING • DOCKING BERTH 08';
    return 'ALL FAST • SAFELY MOORED AT BERTH 08';
  });

  arrivalStatusDotClass = computed(() => {
    const p = this.journeyProgress();
    if (p < 0.95) return 'bg-slate-400';
    if (p < 0.98) return 'bg-amber-500 animate-ping';
    return 'bg-emerald-500 animate-ping';
  });

  arrivalStatusTextClass = computed(() => {
    const p = this.journeyProgress();
    if (p < 0.95) return 'text-slate-500';
    if (p < 0.98) return 'text-amber-600 font-bold';
    return 'text-emerald-700 font-black';
  });

  mooringLinesDepartureOpacity = computed(() => {
    const p = this.journeyProgress();
    if (p <= 0.005) return 1;
    if (p >= 0.045) return 0;
    return 1 - ((p - 0.005) / 0.04);
  });

  undockingThrustersOpacity = computed(() => {
    const p = this.journeyProgress();
    if (p <= 0.003 || p >= 0.045) return 0;
    if (p < 0.02) return (p - 0.003) / 0.017;
    return 1 - ((p - 0.02) / 0.025);
  });

  mooringLinesArrivalOpacity = computed(() => {
    const p = this.journeyProgress();
    if (p < 0.96) return 0;
    return Math.min(1, (p - 0.96) / 0.03);
  });

  private ngZone = inject(NgZone);

  private lastScrollY = 0;
  private lastScrollTime = performance.now();
  private rafId: number | null = null;
  private scrollLoopRaf: number | null = null;
  private cleanupListeners: (() => void) | null = null;
  private wakeCounter = 0;
  private rippleCounter = 0;

  // Cached layout dimensions to eliminate forced layout reflows on scroll
  private containerTop = 0;
  private containerWidth = 1000;
  private containerHeight = 4000;
  private windowH = typeof window !== 'undefined' ? window.innerHeight : 800;
  private isMobileDevice = typeof window !== 'undefined' ? (window.innerWidth < 768 || 'ontouchstart' in window) : false;
  private lastTelemetryTime = 0;

  // Precomputed path lookup table (800 sample points for high fidelity)
  private sampledPoints: SampledPoint[] = [];
  private isScrollLoopActive = false;
  private lastRenderedScrollY = -999999;
  private lastScrollChangeTime = 0;
  private isParticleLoopRunning = false;
  private lastProgress = 0;

  private measureContainer() {
    if (!this.containerRef?.nativeElement) return;
    const rect = this.containerRef.nativeElement.getBoundingClientRect();
    this.containerTop = rect.top + window.scrollY;
    this.containerWidth = rect.width || (typeof window !== 'undefined' ? window.innerWidth : 1000);
    this.containerHeight = rect.height || 4000;
    this.windowH = typeof window !== 'undefined' ? window.innerHeight : 800;
    this.isMobileDevice = typeof window !== 'undefined' ? (window.innerWidth < 768 || 'ontouchstart' in window) : false;
  }

  ngAfterViewInit() {
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        this.measureContainer();
        this.precomputePathSamples();
        this.renderFrame(window.scrollY);
        this.syncThrottledState(this.lastProgress);
      }, 30);

      this.ngZone.runOutsideAngular(() => {
        const trigger = () => {
          this.startScrollLoop();
        };

        const onResize = () => {
          this.measureContainer();
          this.precomputePathSamples();
          this.renderFrame(window.scrollY);
          this.syncThrottledState(this.lastProgress);
        };

        window.addEventListener('scroll', trigger, { passive: true });
        window.addEventListener('touchmove', trigger, { passive: true });
        window.addEventListener('touchstart', trigger, { passive: true });
        window.addEventListener('resize', onResize, { passive: true });
        window.addEventListener('orientationchange', onResize, { passive: true });

        this.cleanupListeners = () => {
          window.removeEventListener('scroll', trigger);
          window.removeEventListener('touchmove', trigger);
          window.removeEventListener('touchstart', trigger);
          window.removeEventListener('resize', onResize);
          window.removeEventListener('orientationchange', onResize);
        };
      });
    }
  }

  ngOnDestroy() {
    if (this.cleanupListeners) {
      this.cleanupListeners();
      this.cleanupListeners = null;
    }
    if (this.scrollLoopRaf) {
      cancelAnimationFrame(this.scrollLoopRaf);
      this.scrollLoopRaf = null;
    }
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.isScrollLoopActive = false;
    this.isParticleLoopRunning = false;
  }

  private precomputePathSamples() {
    if (!this.pathRef?.nativeElement) return;
    const path = this.pathRef.nativeElement;
    const total = path.getTotalLength();
    this.pathTotalLength.set(total);
    this.pathDashOffset.set(total * (1 - this.journeyProgress()));

    // Screen-space aspect ratio scaling so ship angle matches visible path tangent on any viewport width
    let scaleX = 1;
    let scaleY = 1;
    if (this.containerRef?.nativeElement) {
      const rect = this.containerRef.nativeElement.getBoundingClientRect();
      const w = rect.width || (typeof window !== 'undefined' ? window.innerWidth : 1000);
      const h = rect.height || 4000;
      scaleX = w / 1000;
      scaleY = h / 4000;
    }

    const SAMPLES_COUNT = 800;
    const samples: SampledPoint[] = [];
    for (let i = 0; i <= SAMPLES_COUNT; i++) {
      const l = (i / SAMPLES_COUNT) * total;
      const pt = path.getPointAtLength(l);
      const delta = 4;
      const ptAhead = path.getPointAtLength(Math.min(total, l + delta));
      const ptBehind = path.getPointAtLength(Math.max(0, l - delta));
      const dx = (ptAhead.x - ptBehind.x) * scaleX;
      const dy = (ptAhead.y - ptBehind.y) * scaleY;
      let headingDeg = (Math.atan2(dy, dx) * (180 / Math.PI)) + 90;
      if (headingDeg < 0) headingDeg += 360;
      samples.push({
        x: (pt.x / 1000) * 100,
        y: (pt.y / 4000) * 100,
        heading: Math.round(headingDeg),
        rawX: pt.x,
        rawY: pt.y
      });
    }
    this.sampledPoints = samples;
  }

  private startScrollLoop() {
    this.lastScrollChangeTime = performance.now();
    if (this.isScrollLoopActive) return;
    this.isScrollLoopActive = true;
    this.scrollLoop();
  }

  private scrollLoop = () => {
    const now = performance.now();
    const currentScrollY = window.scrollY;

    if (Math.abs(currentScrollY - this.lastRenderedScrollY) > 0.4) {
      this.lastRenderedScrollY = currentScrollY;
      this.lastScrollChangeTime = now;
      this.renderFrame(currentScrollY);
    }

    const elapsed = now - this.lastScrollChangeTime;
    // Continue running while actively scrolling, plus 140ms after scrolling ceases to capture deceleration and settle
    if (elapsed < 140) {
      this.scrollLoopRaf = requestAnimationFrame(this.scrollLoop);
    } else {
      this.isScrollLoopActive = false;
      this.scrollLoopRaf = null;
      this.syncThrottledState(this.lastProgress, undefined, currentScrollY);
    }
  };

  private renderFrame(scrollY: number) {
    if (this.sampledPoints.length === 0) return;

    const scrolledAmount = scrollY - this.containerTop;
    const totalScrollableDistance = this.containerHeight - this.windowH;

    let progress = 0;
    if (totalScrollableDistance > 0) {
      progress = Math.max(0, Math.min(1, scrolledAmount / totalScrollableDistance));
    }

    this.lastProgress = progress;

    const count = this.sampledPoints.length - 1;
    const pos = progress * count;
    const idx1 = Math.floor(pos);
    const idx2 = Math.min(count, idx1 + 1);
    const frac = pos - idx1;

    const p1 = this.sampledPoints[idx1];
    const p2 = this.sampledPoints[idx2];

    const rawX = p1.rawX + (p2.rawX - p1.rawX) * frac;
    const rawY = p1.rawY + (p2.rawY - p1.rawY) * frac;

    let dHeading = p2.heading - p1.heading;
    if (dHeading > 180) dHeading -= 360;
    if (dHeading < -180) dHeading += 360;
    const headingDeg = (p1.heading + dHeading * frac + 360) % 360;

    const pxX = (rawX / 1000) * this.containerWidth;
    const pxY = (rawY / 4000) * this.containerHeight;

    // DIRECT GPU COMPOSITOR UPDATE: 0ms delay, 0 layout reflow, 0 change detection
    if (this.shipEl?.nativeElement) {
      const transformStr = `translate3d(${pxX.toFixed(1)}px, ${pxY.toFixed(1)}px, 0) translate3d(-50%, -50%, 0) rotate(${headingDeg.toFixed(1)}deg)`;
      this.shipEl.nativeElement.style.transform = transformStr;
      this.shipEl.nativeElement.style.webkitTransform = transformStr;
    }

    // Direct active path stroke dashoffset update
    const totalLength = this.pathTotalLength();
    const newOffset = totalLength * (1 - progress);
    if (this.activePathRef?.nativeElement) {
      this.activePathRef.nativeElement.style.strokeDashoffset = `${newOffset.toFixed(1)}px`;
    }
    if (this.glowPathRef?.nativeElement) {
      this.glowPathRef.nativeElement.style.strokeDashoffset = `${newOffset.toFixed(1)}px`;
    }

    // Mooring lines & thruster updates near terminals (berth 01 / berth 08)
    if (progress <= 0.05 || progress >= 0.95) {
      this.shipRawX.set(Math.round(rawX));
      this.shipRawY.set(Math.round(rawY));
      this.journeyProgress.set(progress);
    }

    // Throttled HUD telemetry & speedometer updates (every 80ms)
    const now = performance.now();
    if (now - this.lastTelemetryTime > 80) {
      this.lastTelemetryTime = now;
      this.syncThrottledState(progress, headingDeg, scrollY);
    }

    // Desktop mouse wake bubbles only
    if (!this.isMobileDevice && Math.abs(scrollY - this.lastScrollY) > 8) {
      this.spawnWakeParticle(rawX, rawY, Math.round(headingDeg));
      this.ensureParticleLoop();
    }
  }

  private syncThrottledState(progress: number, headingDeg?: number, currentScrollY?: number) {
    this.journeyProgress.set(progress);
    this.pathDashOffset.set(this.pathTotalLength() * (1 - progress));

    const heading = headingDeg !== undefined ? headingDeg : this.shipHeading();
    const roundedHeading = Math.round(heading);
    this.shipHeading.set(roundedHeading);
    this.compassHeading.set(roundedHeading);

    this.updateSpeedometer(currentScrollY ?? window.scrollY);
    if (progress > 0.02) {
      this.updateCoordinates(progress, heading);
    }
    this.isAnchorDropped.set(progress >= 0.98);
  }

  private updateSpeedometer(currentScrollY: number) {
    const now = performance.now();
    const dt = Math.max(16, now - this.lastScrollTime);
    const dy = Math.abs(currentScrollY - this.lastScrollY);

    this.lastScrollY = currentScrollY;
    this.lastScrollTime = now;

    const rawSpeed = Math.min(24.5, (dy / dt) * 19.5);
    const smoothed = Math.round((this.speedKnots() * 0.75 + rawSpeed * 0.25) * 10) / 10;
    this.speedKnots.set(smoothed);

    if (smoothed < 0.5) {
      if (this.journeyProgress() <= 0.005) {
        this.speedLabel.set('SECURED AT BERTH 01 (ALL FAST)');
      } else if (this.journeyProgress() >= 0.98) {
        this.speedLabel.set('SECURED AT BERTH 08 (ALL FAST)');
      } else {
        this.speedLabel.set('DRIFTING / ALL STOP');
      }
    } else if (this.journeyProgress() < 0.045) {
      this.speedLabel.set('DEAD SLOW AHEAD • CLEARING BERTH');
    } else if (smoothed < 8.0) {
      this.speedLabel.set('SLOW AHEAD');
    } else if (smoothed < 16.0) {
      this.speedLabel.set('HALF AHEAD');
    } else {
      this.speedLabel.set('FULL AHEAD • FLANK SPEED');
    }
  }

  private updateCoordinates(progress: number, heading: number) {
    const lat = (25.018 - progress * (25.018 - 22.750)).toFixed(3);
    const lng = (55.061 + progress * (69.712 - 55.061)).toFixed(3);
    this.liveLat.set(lat);
    this.liveLng.set(lng);

    const deg = Math.round(heading) % 360;
    let card = 'N';
    if (deg >= 22.5 && deg < 67.5) card = 'NE';
    else if (deg >= 67.5 && deg < 112.5) card = 'E';
    else if (deg >= 112.5 && deg < 157.5) card = 'SE';
    else if (deg >= 157.5 && deg < 202.5) card = 'S';
    else if (deg >= 202.5 && deg < 247.5) card = 'SW';
    else if (deg >= 247.5 && deg < 292.5) card = 'W';
    else if (deg >= 292.5 && deg < 337.5) card = 'NW';

    this.headingDirection.set(`${deg}° ${card}`);
  }

  private spawnWakeParticle(shipSvgX: number, shipSvgY: number, headingDeg: number) {
    if (this.isMobileDevice) return;
    const headingRad = (headingDeg * Math.PI) / 180;
    const sternX = shipSvgX - Math.sin(headingRad) * 20;
    const sternY = shipSvgY + Math.cos(headingRad) * 20;

    const newParticle: WakeParticle = {
      id: ++this.wakeCounter,
      x: (sternX / 1000) * 100,
      y: (sternY / 4000) * 100,
      angle: headingDeg,
      createdAt: performance.now()
    };

    // Keep trail capped at 12 particles for optimal rendering
    const updated = [...this.wakeTrail().slice(-11), newParticle];
    this.wakeTrail.set(updated);
  }

  private ensureParticleLoop() {
    if (this.isParticleLoopRunning) return;
    this.isParticleLoopRunning = true;
    this.ngZone.runOutsideAngular(() => {
      this.tickParticles();
    });
  }

  private tickParticles = () => {
    const now = performance.now();
    let needsNextFrame = false;

    // Decay speedometer towards zero if idle
    if (now - this.lastScrollTime > 120 && this.speedKnots() > 0) {
      const decayed = Math.max(0, Math.round((this.speedKnots() * 0.88) * 10) / 10);
      this.speedKnots.set(decayed);
      if (decayed === 0) {
        this.speedLabel.set(this.journeyProgress() >= 0.92 ? 'SECURED AT BERTH' : 'DRIFTING / ALL STOP');
      }
      needsNextFrame = true;
    } else if (this.speedKnots() > 0) {
      needsNextFrame = true;
    }

    // Prune wake bubbles older than 1500ms
    const currentWake = this.wakeTrail();
    if (currentWake.length > 0) {
      const freshWake = currentWake.filter(w => now - w.createdAt < 1500);
      if (freshWake.length !== currentWake.length) {
        this.wakeTrail.set(freshWake);
      }
      if (freshWake.length > 0) {
        needsNextFrame = true;
      }
    }

    if (needsNextFrame) {
      this.rafId = requestAnimationFrame(this.tickParticles);
    } else {
      this.isParticleLoopRunning = false;
      this.rafId = null;
    }
  };

  // Interactive Water Ripples on Click / Pointer Move
  onWaterClick(e: MouseEvent) {
    const rect = this.containerRef.nativeElement.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    this.addRipple(x, y);
  }

  private lastMoveTime = 0;
  onWaterMove(e: PointerEvent) {
    if (e.pointerType === 'touch') return; // Do not spawn ripples during touch drag/scroll on mobile
    const now = performance.now();
    if (now - this.lastMoveTime < 180) return; // Throttle ripple creation
    this.lastMoveTime = now;

    const rect = this.containerRef.nativeElement.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    this.addRipple(x, y);
  }

  private addRipple(x: number, y: number) {
    const newRip: WaterRipple = { id: ++this.rippleCounter, x, y };
    this.ripples.set([...this.ripples().slice(-8), newRip]);
    setTimeout(() => {
      this.ripples.set(this.ripples().filter(r => r.id !== newRip.id));
    }, 1400);
  }

  // Sonar Ping Button Micro-interaction
  triggerSonarPing() {
    if (!this.containerRef?.nativeElement) return;
    const rect = this.containerRef.nativeElement.getBoundingClientRect();
    // Spawn ripple at center of screen
    this.addRipple(rect.width * 0.5, window.innerHeight * 0.4);
  }

  // Carousel Controls
  scrollCarousel(direction: 'prev' | 'next') {
    if (!this.carouselTrackRef?.nativeElement) return;
    const track = this.carouselTrackRef.nativeElement;
    const scrollAmount = track.clientWidth * 0.85;
    track.scrollBy({
      left: direction === 'next' ? scrollAmount : -scrollAmount,
      behavior: 'smooth'
    });
  }

  openVesselModal(vessel: any) {
    const fullVessel: Vessel = {
      id: vessel.id,
      name: vessel.name,
      imo: vessel.imo,
      call_sign: 'V3BC9',
      flag: vessel.flag,
      built_year: vessel.built_year,
      port_of_registry: vessel.flag === 'Panama' ? 'Panama City' : 'Singapore',
      nominal_cap_teu: vessel.nominal_cap_teu,
      effective_cap_teu: Math.round(vessel.nominal_cap_teu * 0.88),
      reefer_plugs: 450,
      gear: vessel.name.includes('ACACIA'),
      bow_thruster: true,
      grt: Math.round(vessel.dwt * 0.72),
      nrt: Math.round(vessel.dwt * 0.45),
      dwt: vessel.dwt,
      loa: vessel.loa,
      breadth: 32.2,
      summer_draft: vessel.summer_draft,
      current_lat: 25.018,
      current_lng: 55.061,
      current_status: 'Underway using Engine - 15.4 kn',
      service_code: vessel.service_code
    };
    this.service.openVesselModal(fullVessel);
  }

  trackOnMap(vessel: any) {
    this.service.focusLocationOnMap(
      25.018,
      55.061,
      8,
      vessel.name,
      `<b>${vessel.name}</b><br/>Capacity: ${vessel.nominal_cap_teu} TEU<br/>Service: ${vessel.service_code}`
    );
  }

  scrollToSchedules() {
    const el = document.getElementById('tracking-engine');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  trackById(_index: number, item: { id: number }) {
    return item.id;
  }
}
