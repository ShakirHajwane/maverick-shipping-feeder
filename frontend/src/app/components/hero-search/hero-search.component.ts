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
    <section class="relative bg-gradient-to-b from-sky-50/70 via-slate-50 to-white pt-8 pb-28 overflow-x-hidden overflow-y-clip border-b border-slate-200 w-full max-w-full">
      <!-- 1. HIGH-IMPACT MARITIME VESSEL & PORT TERMINAL PHOTOGRAPHIC BACKDROP -->
      <div class="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-15 grayscale scale-105 pointer-events-none transform-gpu"
           style="background-image: url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1400&q=70'); -webkit-transform: translateZ(0);">
      </div>

      <!-- 2. LIGHT OCEANIC MULTI-STOP GRADIENT MASK -->
      <div class="absolute inset-0 z-0 bg-gradient-to-b from-white/92 via-slate-50/85 to-white pointer-events-none"></div>

      <!-- 3. NAUTICAL COORDINATES & RADAR GRID PATTERN -->
      <div class="absolute inset-0 z-0 opacity-20 pointer-events-none bg-[radial-gradient(#0284c7_1px,transparent_1px)] [background-size:28px_28px]"></div>

      <!-- 4. HARBOR LIGHTHOUSE / TERMINAL SEARCHLIGHT BEAM -->
      <div class="absolute -top-12 left-1/4 w-96 h-[600px] pointer-events-none animate-searchlight z-0"
           style="background: conic-gradient(from 160deg at 0% 0%, transparent 0deg, rgba(2, 132, 199, 0.04) 15deg, rgba(245, 158, 11, 0.08) 20deg, rgba(2, 132, 199, 0.04) 25deg, transparent 40deg);">
      </div>

      <!-- 5. MARINE RADAR HEADS-UP DISPLAY (HUD) IN UPPER CORNER -->
      <div class="absolute top-6 right-4 lg:right-14 z-0 w-56 h-56 sm:w-72 sm:h-72 pointer-events-none opacity-40 hover:opacity-70 transition-opacity hidden sm:block">
        <div class="relative w-full h-full rounded-full border border-sky-400/40 bg-white/70 shadow-[0_0_25px_rgba(2,132,199,0.1)] flex items-center justify-center">
          <!-- Concentric Range Rings (12 NM, 24 NM, 36 NM, 48 NM) -->
          <div class="absolute inset-3 rounded-full border border-sky-400/25"></div>
          <div class="absolute inset-10 rounded-full border border-sky-400/20"></div>
          <div class="absolute inset-18 rounded-full border border-sky-400/15"></div>
          <div class="absolute inset-26 rounded-full border border-sky-400/10"></div>
          <!-- Radar Crosshairs -->
          <div class="absolute inset-x-0 top-1/2 h-px bg-sky-400/30"></div>
          <div class="absolute inset-y-0 left-1/2 w-px bg-sky-400/30"></div>
          <!-- Compass Degree Labels -->
          <span class="absolute top-1 text-[9px] font-mono text-sky-700 font-bold">000°</span>
          <span class="absolute bottom-1 text-[9px] font-mono text-sky-700 font-bold">180°</span>
          <span class="absolute right-1 text-[9px] font-mono text-sky-700 font-bold">090°</span>
          <span class="absolute left-1 text-[9px] font-mono text-sky-700 font-bold">270°</span>
          <!-- Rotating Radar Sweep Beam -->
          <div class="absolute inset-0 rounded-full animate-radar-sweep pointer-events-none"
               style="background: conic-gradient(from 0deg, rgba(2, 132, 199, 0.35) 0deg, rgba(2, 132, 199, 0.1) 30deg, transparent 60deg, transparent 360deg);">
          </div>
          <!-- AIS Vessel Target Blips on Radar -->
          <div class="absolute top-14 right-16 w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981] animate-pulse">
            <span class="absolute -top-3.5 -right-2 text-[8px] font-mono text-emerald-700 font-bold">GFS-66</span>
          </div>
          <div class="absolute bottom-16 left-14 w-1.5 h-1.5 rounded-full bg-[#dd0103] shadow-[0_0_6px_#dd0103]">
            <span class="absolute -bottom-3.5 -left-2 text-[8px] font-mono text-[#dd0103] font-bold">X-CAP</span>
          </div>
          <div class="absolute top-24 left-16 w-1.5 h-1.5 rounded-full bg-sky-600 shadow-[0_0_6px_#0284c7]">
            <span class="absolute -top-3 -left-2 text-[8px] font-mono text-sky-800 font-bold">HUB-JEA</span>
          </div>
          <div class="absolute bottom-12 right-20 w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981]"></div>
          <!-- Center Vessel Icon -->
          <div class="w-3 h-3 rounded-full bg-[#02194b] shadow-[0_0_10px_rgba(2,25,75,0.5)] border border-white"></div>
        </div>
        <div class="text-center mt-2 text-[9px] font-mono text-slate-500 tracking-widest uppercase font-semibold">
          AIS RADAR: 48 NM • ARPA AUTO-ACQUIRE
        </div>
      </div>

      <!-- 6. PORT HORIZON SKYLINE: STS CONTAINER GANTRY CRANES WITH HAZARD BEACONS -->
      <div class="absolute top-28 sm:top-20 inset-x-0 h-44 pointer-events-none z-0 opacity-30 overflow-hidden flex items-end justify-between px-6 sm:px-14">
        <!-- Port Cranes (Dubai / Jebel Ali Hub Silhouette) -->
        <div class="flex items-end gap-3 sm:gap-6">
          <!-- Crane 1 -->
          <div class="relative w-28 sm:w-36 h-36">
            <!-- Blinking Red Aviation Obstacle Beacon -->
            <span class="absolute top-0 right-4 w-2 h-2 rounded-full bg-red-500 animate-crane-warning"></span>
            <svg viewBox="0 0 120 120" class="w-full h-full text-slate-500 fill-current opacity-70">
              <path d="M20 120 L40 45 L50 45 L70 120 L62 120 L48 60 L42 60 L28 120 Z" />
              <path d="M30 85 L60 85 L60 81 L30 81 Z" />
              <path d="M35 105 L55 105 L55 102 L35 102 Z" />
              <rect x="35" y="32" width="22" height="14" rx="2" />
              <polygon points="45,10 38,32 54,32" />
              <rect x="8" y="28" width="105" height="4" />
              <line x1="45" y1="10" x2="105" y2="28" stroke="currentColor" stroke-width="1.2" />
              <line x1="45" y1="10" x2="80" y2="28" stroke="currentColor" stroke-width="1.2" />
              <line x1="45" y1="10" x2="15" y2="28" stroke="currentColor" stroke-width="1.2" />
              <rect x="75" y="32" width="8" height="6" fill="#38bdf8" />
              <line x1="79" y1="38" x2="79" y2="55" stroke="currentColor" stroke-width="1" />
              <rect x="74" y="55" width="10" height="3" fill="#f59e0b" />
            </svg>
          </div>
          <!-- Crane 2 -->
          <div class="relative w-24 sm:w-32 h-32 hidden sm:block">
            <span class="absolute top-0 right-3 w-2 h-2 rounded-full bg-red-500 animate-crane-warning-amber"></span>
            <svg viewBox="0 0 120 120" class="w-full h-full text-slate-500 fill-current opacity-60">
              <path d="M20 120 L40 45 L50 45 L70 120 L62 120 L48 60 L42 60 L28 120 Z" />
              <path d="M30 85 L60 85 L60 81 L30 81 Z" />
              <rect x="35" y="32" width="22" height="14" rx="2" />
              <polygon points="45,10 38,32 54,32" />
              <rect x="8" y="28" width="105" height="4" />
              <line x1="45" y1="10" x2="105" y2="28" stroke="currentColor" stroke-width="1.2" />
              <line x1="45" y1="10" x2="15" y2="28" stroke="currentColor" stroke-width="1.2" />
              <rect x="60" y="32" width="8" height="6" fill="#38bdf8" />
              <line x1="64" y1="38" x2="64" y2="60" stroke="currentColor" stroke-width="1" />
              <rect x="59" y="60" width="10" height="3" fill="#10b981" />
            </svg>
          </div>
          <!-- Crane 3 -->
          <div class="relative w-20 sm:w-28 h-28 hidden md:block">
            <span class="absolute top-0 right-3 w-1.5 h-1.5 rounded-full bg-red-500 animate-crane-warning"></span>
            <svg viewBox="0 0 120 120" class="w-full h-full text-slate-600 fill-current opacity-50">
              <path d="M20 120 L40 45 L50 45 L70 120 L62 120 L48 60 L42 60 L28 120 Z" />
              <rect x="35" y="32" width="22" height="14" />
              <polygon points="45,10 38,32 54,32" />
              <rect x="8" y="28" width="105" height="4" />
              <line x1="45" y1="10" x2="105" y2="28" stroke="currentColor" stroke-width="1.2" />
              <line x1="45" y1="10" x2="15" y2="28" stroke="currentColor" stroke-width="1.2" />
            </svg>
          </div>
        </div>

        <!-- Port Silhouettes Right -->
        <div class="hidden lg:flex items-end gap-4 opacity-35">
          <div class="w-20 h-24 relative">
            <span class="absolute top-0 right-2 w-1.5 h-1.5 rounded-full bg-amber-400 animate-crane-warning-amber"></span>
            <svg viewBox="0 0 100 100" class="w-full h-full text-slate-500 fill-current">
              <polygon points="50,15 35,40 65,40" />
              <rect x="30" y="40" width="40" height="60" />
              <rect x="5" y="36" width="90" height="4" />
            </svg>
          </div>
        </div>
      </div>

      <!-- 7. ANIMATED DISTANT VESSEL (REVERSE DIRECTION) -->
      <div class="absolute top-28 sm:top-24 inset-x-0 h-16 pointer-events-none z-0 opacity-40 overflow-hidden">
        <div class="animate-ship-reverse flex items-end">
          <div class="relative w-48">
            <svg viewBox="0 0 240 60" class="w-full h-auto">
              <path d="M10 50 L 230 50 L 225 38 L 15 38 Z" fill="#0f172a" />
              <rect x="30" y="26" width="16" height="12" fill="#0284c7" />
              <rect x="48" y="26" width="16" height="12" fill="#d97706" />
              <rect x="66" y="26" width="16" height="12" fill="#15803d" />
              <rect x="84" y="26" width="16" height="12" fill="#b91c1c" />
              <rect x="102" y="26" width="16" height="12" fill="#0284c7" />
              <rect x="120" y="26" width="16" height="12" fill="#f59e0b" />
              <rect x="145" y="22" width="24" height="16" fill="#cbd5e1" />
              <rect x="146" y="24" width="22" height="4" fill="#fef08a" />
              <line x1="155" y1="14" x2="155" y2="22" stroke="#94a3b8" stroke-width="1.5" />
              <circle cx="155" cy="14" r="1.5" fill="#38bdf8" class="animate-pulse" />
              <circle cx="15" cy="38" r="1.5" fill="#22c55e" />
            </svg>
          </div>
        </div>
      </div>

      <!-- 8. ANIMATED PRIMARY CONTAINER FEEDER VESSEL (CRUISING ACROSS HORIZON) -->
      <div class="absolute top-44 sm:top-40 inset-x-0 h-28 pointer-events-none z-0 overflow-hidden">
        <div class="animate-ship-cruising flex items-end">
          <div class="relative w-80 filter drop-shadow-[0_12px_15px_rgba(0,0,0,0.6)]">
            <svg viewBox="0 0 320 85" class="w-full h-auto">
              <!-- Wake and Bow Waves -->
              <path d="M10 74 Q 2 77, -40 76 Q -10 73, 10 74 Z" fill="rgba(255,255,255,0.4)" />
              <path d="M40 78 C 0 80, -60 84, -120 82 C -40 78, 20 76, 40 78 Z" fill="rgba(0, 180, 216, 0.35)" />
              
              <!-- Ship Hull (Bulbous Bow, Deep Red Underbody, Navy Upper Freeboard) -->
              <!-- Antifouling Red Keel Bottom -->
              <path d="M22 75 L 305 75 L 314 68 L 26 68 Z" fill="#991b1b" />
              <!-- Main Hull Body -->
              <path d="M24 68 L 314 68 L 308 52 L 20 52 L 15 58 Z" fill="#0f172a" stroke="#1e293b" stroke-width="1" />
              <!-- White Waterline Boot-topping Stripe -->
              <rect x="22" y="67" width="290" height="2" fill="#f8fafc" />
              <!-- Ship Name GFS RHINE -->
              <text x="32" y="62" font-size="6" font-family="monospace" font-weight="bold" fill="#38bdf8">GFS RHINE</text>
              <text x="280" y="62" font-size="5" font-family="monospace" fill="#94a3b8">PANAMA</text>
              
              <!-- Navigation Lights -->
              <!-- Starboard Green Nav Light (Bow) -->
              <circle cx="295" cy="50" r="2.5" fill="#22c55e" class="animate-pulse" filter="drop-shadow(0 0 4px #22c55e)" />
              <!-- Port Red Nav Light (Stern) -->
              <circle cx="28" cy="50" r="2" fill="#ef4444" class="animate-pulse" filter="drop-shadow(0 0 3px #ef4444)" />
              <!-- Masthead White Anchor/Steaming Light -->
              <circle cx="225" cy="12" r="2" fill="#ffffff" filter="drop-shadow(0 0 6px #ffffff)" />

              <!-- Container Stacks (Multi-tier Colorful Feeder Freight Stacks) -->
              <!-- Tier 1 (Lowest deck tier) -->
              <rect x="36" y="42" width="22" height="10" fill="#0284c7" rx="0.5" stroke="#0369a1" stroke-width="0.5" />
              <rect x="60" y="42" width="22" height="10" fill="#d97706" rx="0.5" stroke="#b45309" stroke-width="0.5" />
              <rect x="84" y="42" width="22" height="10" fill="#0f766e" rx="0.5" stroke="#115e59" stroke-width="0.5" />
              <rect x="108" y="42" width="22" height="10" fill="#1e3a8a" rx="0.5" stroke="#172554" stroke-width="0.5" />
              <rect x="132" y="42" width="22" height="10" fill="#b91c1c" rx="0.5" stroke="#991b1b" stroke-width="0.5" />
              <rect x="156" y="42" width="22" height="10" fill="#0369a1" rx="0.5" stroke="#075985" stroke-width="0.5" />
              <rect x="180" y="42" width="22" height="10" fill="#d97706" rx="0.5" stroke="#b45309" stroke-width="0.5" />
              
              <!-- Tier 2 (Middle deck tier) -->
              <rect x="38" y="32" width="22" height="10" fill="#ea580c" rx="0.5" stroke="#c2410c" stroke-width="0.5" />
              <rect x="62" y="32" width="22" height="10" fill="#0284c7" rx="0.5" stroke="#0369a1" stroke-width="0.5" />
              <rect x="86" y="32" width="22" height="10" fill="#475569" rx="0.5" stroke="#334155" stroke-width="0.5" />
              <rect x="110" y="32" width="22" height="10" fill="#15803d" rx="0.5" stroke="#166534" stroke-width="0.5" />
              <rect x="134" y="32" width="22" height="10" fill="#0284c7" rx="0.5" stroke="#0369a1" stroke-width="0.5" />
              <rect x="158" y="32" width="22" height="10" fill="#e11d48" rx="0.5" stroke="#be123c" stroke-width="0.5" />
              <rect x="182" y="32" width="22" height="10" fill="#0891b2" rx="0.5" stroke="#0e7490" stroke-width="0.5" />

              <!-- Tier 3 (Top tier - mixed 40ft & Reefer plugs) -->
              <rect x="40" y="22" width="44" height="10" fill="#0284c7" rx="0.5" stroke="#0369a1" stroke-width="0.5" />
              <!-- White Reefer Container with Green Indicator -->
              <rect x="86" y="22" width="22" height="10" fill="#f1f5f9" rx="0.5" stroke="#cbd5e1" stroke-width="0.5" />
              <circle cx="89" cy="25" r="1" fill="#22c55e" />
              <rect x="110" y="22" width="44" height="10" fill="#d97706" rx="0.5" stroke="#b45309" stroke-width="0.5" />
              <rect x="156" y="22" width="22" height="10" fill="#1e3a8a" rx="0.5" stroke="#172554" stroke-width="0.5" />
              
              <!-- Forward Hatch Stacks -->
              <rect x="250" y="44" width="22" height="8" fill="#0284c7" rx="0.5" />
              <rect x="274" y="44" width="20" height="8" fill="#d97706" rx="0.5" />
              <rect x="252" y="36" width="22" height="8" fill="#15803d" rx="0.5" />
              
              <!-- Superstructure / Bridge Tower (Aft) -->
              <path d="M208 52 L 244 52 L 242 22 L 212 22 Z" fill="#e2e8f0" stroke="#cbd5e1" stroke-width="0.5" />
              <!-- Bridge Wing & Windows with Warm Glowing Light -->
              <rect x="210" y="24" width="32" height="5" fill="#fef08a" filter="drop-shadow(0 0 3px #fde047)" rx="0.5" />
              <!-- Funnel / Exhaust Stack with Company Colors -->
              <rect x="216" y="14" width="10" height="10" fill="#0A192F" rx="1" />
              <rect x="216" y="16" width="10" height="3" fill="#00B4D8" />
              <rect x="216" y="20" width="10" height="2" fill="#F59E0B" />
              <!-- Radar Mast & Antennas -->
              <line x1="225" y1="12" x2="225" y2="22" stroke="#475569" stroke-width="1.5" />
              <line x1="220" y1="16" x2="230" y2="16" stroke="#475569" stroke-width="1" />
              <!-- Rotating Radar Scanner Bar -->
              <line x1="222" y1="13" x2="228" y2="13" stroke="#00B4D8" stroke-width="1.5" />
            </svg>
          </div>
        </div>
      </div>

      <!-- 9. MARITIME OPERATIONS AIS TELEMETRY TICKER -->
      <div class="w-full overflow-hidden bg-white/90 border-b border-slate-200 py-2.5 mb-8 backdrop-blur-md relative z-10 shadow-sm">
        <div class="animate-marquee items-center gap-10 text-xs font-mono text-slate-700">
          <span class="inline-flex items-center gap-2 text-emerald-700 font-bold">
            <span class="w-2 h-2 rounded-full bg-emerald-500 beacon-pulse"></span>
            AIS OPERATIONS: 66 FEEDER VESSELS ACTIVE
          </span>
          <span>•</span>
          <span class="text-slate-600"><strong class="text-slate-900">ARABIAN GULF:</strong> 24 FEEDERS UNDERWAY (AVG SPEED 14.8 KN)</span>
          <span>•</span>
          <span class="text-slate-600"><strong class="text-slate-900">RED SEA / SUEZ:</strong> 14 IN TRANSIT • ZERO DISRUPTIONS</span>
          <span>•</span>
          <span class="text-slate-600"><strong class="text-slate-900">INDIAN SUBCONTINENT:</strong> 18 CALLS AT MUNDRA & NHAVA SHEVA</span>
          <span>•</span>
          <span class="text-slate-600"><strong class="text-slate-900">STRAIT OF MALACCA:</strong> 10 BOUND FOR SINGAPORE PSA TERMINALS</span>
          <span>•</span>
          <span class="text-[#dd0103] font-bold">TERMINAL STATUS: JEBEL ALI T1/T2/T3 NORMAL BERTHING (0 DELAYS)</span>
          <span>•</span>
          <span class="inline-flex items-center gap-2 text-emerald-700 font-bold">
            <span class="w-2 h-2 rounded-full bg-emerald-500 beacon-pulse"></span>
            AIS OPERATIONS: 66 FEEDER VESSELS ACTIVE
          </span>
          <span>•</span>
          <span class="text-slate-600"><strong class="text-slate-900">ARABIAN GULF:</strong> 24 FEEDERS UNDERWAY (AVG SPEED 14.8 KN)</span>
          <span>•</span>
          <span class="text-slate-600"><strong class="text-slate-900">RED SEA / SUEZ:</strong> 14 IN TRANSIT • ZERO DISRUPTIONS</span>
          <span>•</span>
          <span class="text-slate-600"><strong class="text-slate-900">INDIAN SUBCONTINENT:</strong> 18 CALLS AT MUNDRA & NHAVA SHEVA</span>
          <span>•</span>
          <span class="text-slate-600"><strong class="text-slate-900">STRAIT OF MALACCA:</strong> 10 BOUND FOR SINGAPORE PSA TERMINALS</span>
          <span>•</span>
          <span class="text-[#dd0103] font-bold">TERMINAL STATUS: JEBEL ALI T1/T2/T3 NORMAL BERTHING (0 DELAYS)</span>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        <!-- Hero Text Header -->
        <div class="max-w-3xl mb-12">
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-200 text-[#dd0103] text-xs font-bold tracking-wide uppercase mb-4 shadow-sm">
            <span class="w-2 h-2 rounded-full bg-[#dd0103] animate-pulse"></span>
            <span>{{ isRtl() ? 'الشبكة البحرية الإقليمية الرائدة' : 'MAVERICK SHIPPING LLC • CONTAINER FEEDER NETWORK' }}</span>
          </div>

          <h1 class="text-3xl sm:text-5xl lg:text-6xl font-black text-[#02194b] tracking-tight leading-tight mb-5">
            {{ isRtl() ? 'تمكين عمالقة الشحن من خلال الابتكار الملاحي' : 'Empowering Shipping Giants Through Feeder Innovation' }}
          </h1>

          <p class="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            {{ isRtl() 
              ? 'ربط الموانئ المحورية في الخليج العربي والبحر الأحمر وشبه القارة الهندية وجنوب شرق آسيا بأعلى تردد وأدق مواعيد.' 
              : 'Connecting key container hubs across the Arabian Gulf, Red Sea, Indian Subcontinent, and Southeast Asia with high-frequency feeder reliability and precision logistics.' }}
          </p>
        </div>

        <!-- 3-Tab Action Engine Widget (Maverick Feeder Engine) -->
        <div id="tracking-engine" class="bg-white/95 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/50 overflow-hidden">
          <!-- Tab Navigation Headers -->
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

      <!-- 10. LAYERED UNDULATING OCEAN WAVES & BOBBING NAVIGATIONAL BUOY AT SECTION BASE -->
      <div class="absolute bottom-0 inset-x-0 h-16 pointer-events-none z-0 overflow-hidden">
        <!-- Wave 1 (Deep Navy Ocean Base) -->
        <svg class="absolute bottom-0 w-[200%] h-14 text-navy-900/60 fill-current animate-wave-slow" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,45 C150,90 350,-20 500,45 C650,110 900,10 1200,45 L1200,120 L0,120 Z"></path>
        </svg>
        <!-- Wave 2 (Ocean Teal Mid Ribbon) -->
        <svg class="absolute bottom-0 w-[200%] h-10 text-ocean-600/30 fill-current animate-wave-medium" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,60 C200,10 400,90 600,60 C800,30 1000,90 1200,60 L1200,120 L0,120 Z"></path>
        </svg>
        <!-- Wave 3 (Foreground Teal Crest with Water Shimmer) -->
        <svg class="absolute bottom-0 w-[200%] h-6 text-ocean-400/20 fill-current animate-wave-fast" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,70 C150,40 300,90 450,70 C600,50 750,90 900,70 C1050,50 1200,80 1350,70 L1350,120 L0,120 Z"></path>
        </svg>
        <!-- Navigational Sea Buoy Bobbing on the waves -->
        <div class="absolute bottom-2 left-12 sm:left-24 w-6 h-10 animate-buoy hidden sm:block">
          <span class="absolute -top-1 left-2 w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
          <span class="absolute -top-1 left-2 w-1.5 h-1.5 rounded-full bg-[#dd0103] shadow-[0_0_8px_#dd0103]"></span>
          <svg viewBox="0 0 24 36" class="w-full h-full text-[#dd0103] fill-current">
            <polygon points="12,4 6,18 18,18" />
            <path d="M4 18 L20 18 L18 28 L6 28 Z" fill="#0284c7" />
            <line x1="12" y1="4" x2="12" y2="18" stroke="#ffffff" stroke-width="1" />
          </svg>
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
