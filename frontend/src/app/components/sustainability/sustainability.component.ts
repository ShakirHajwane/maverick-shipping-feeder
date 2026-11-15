import { Component, ElementRef, ViewChild, inject, signal, computed, AfterViewInit, OnDestroy, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaritimeService } from '../../services/maritime.service';

type EcoMode = 'cold-ironing' | 'air-lubrication' | 'bio-fuel';

interface EcoParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  life: number;
}

@Component({
  selector: 'app-sustainability',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="sustainability-section" class="py-16 relative bg-gradient-to-b from-slate-50 via-emerald-50/20 to-slate-50 border-b border-slate-200 overflow-hidden">
      <!-- Animated Eco-Bioluminescent Ocean Wave Ribbon -->
      <div class="absolute top-0 inset-x-0 h-10 pointer-events-none opacity-30 overflow-hidden">
        <svg class="block w-[200%] h-full animate-wave-slow text-emerald-400" viewBox="0 0 1200 40" preserveAspectRatio="none">
          <path d="M0,15 C200,30 400,0 600,18 C800,35 1000,5 1200,20 L1200,0 L0,0 Z" fill="currentColor"></path>
        </svg>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        
        <!-- =========================================================
             INNOVATIVE GREEN PROPULSION & MICRO-BUBBLE FLUID DYNAMICS TANK
             Interactive Graphic Canvas: Cold Ironing, Air Lubrication & Biofuel
             ========================================================= -->
        <div class="mb-12 rounded-2xl sm:rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl overflow-hidden relative text-white" style="content-visibility: auto; contain-intrinsic-size: auto none auto 380px;">
          <!-- Header Bar with Live Indicator & Mode Switcher -->
          <div class="p-4 sm:p-5 border-b border-slate-800/80 bg-slate-900/90 flex flex-wrap items-center justify-between gap-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0 shadow-inner">
                <span class="text-xl">🌱</span>
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <span class="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/60">
                    ECO-PROPULSION & FLUID DYNAMICS SIMULATOR
                  </span>
                  <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span class="text-[10px] font-mono text-emerald-400 font-bold">DECARBONIZATION LAB LIVE</span>
                </div>
                <h3 class="text-sm sm:text-base font-black text-white mt-0.5">
                  {{ isRtl() ? 'مختبر ديناميكا التدفق والوقود الحيوي والكهرباء الشاطئية' : 'Next-Gen Green Feeder Fluid Dynamic & Clean Fuel Chamber' }}
                </h3>
              </div>
            </div>

            <!-- Eco Technology Mode Switcher -->
            <div class="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                (click)="setEcoMode('cold-ironing')"
                [class]="ecoMode() === 'cold-ironing' ? 'bg-sky-600 text-white font-bold shadow-md shadow-sky-900/30' : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700/80'"
                class="px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer border border-slate-700/60 flex items-center gap-1">
                <span>⚡</span>
                <span>Cold Ironing (0 Port Emission)</span>
              </button>
              <button
                type="button"
                (click)="setEcoMode('air-lubrication')"
                [class]="ecoMode() === 'air-lubrication' ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-900/30' : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700/80'"
                class="px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer border border-slate-700/60 flex items-center gap-1">
                <span>🫧</span>
                <span>Air Bubble Carpet (-12% Drag)</span>
              </button>
              <button
                type="button"
                (click)="setEcoMode('bio-fuel')"
                [class]="ecoMode() === 'bio-fuel' ? 'bg-[#dd0103] text-white font-bold shadow-md shadow-red-900/30' : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700/80'"
                class="px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer border border-slate-700/60 flex items-center gap-1">
                <span>🍃</span>
                <span>B24 Biofuel (-22% Carbon)</span>
              </button>
            </div>
          </div>

          <!-- Dynamic Eco Simulation Canvas -->
          <div class="relative w-full h-[270px] sm:h-[310px] bg-gradient-to-b from-[#02131b] via-[#031d27] to-[#010e14] overflow-hidden">
            <canvas #ecoCanvas class="w-full h-full block cursor-pointer"></canvas>

            <!-- Mode Description Badge -->
            <div class="absolute top-3 left-3 bg-slate-900/85 backdrop-blur-md border border-slate-700/70 rounded-xl px-3 py-2 text-xs font-mono max-w-sm pointer-events-none">
              <div class="text-[10px] text-emerald-400 uppercase tracking-wider font-bold">
                {{ activeEcoData().title }}
              </div>
              <div class="text-white text-xs mt-0.5 leading-tight">
                {{ activeEcoData().desc }}
              </div>
            </div>

            <!-- Bottom Live Telemetry HUD -->
            <div class="absolute bottom-2 inset-x-2 sm:inset-x-4 bg-slate-950/85 backdrop-blur-md border border-slate-800/90 rounded-xl p-2.5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
              <div class="flex items-center gap-4">
                <div>
                  <span class="text-slate-400 text-[10px] uppercase">CII RATING:</span>
                  <span class="ml-1.5 text-emerald-400 font-bold">GRADE A (EXEMPLARY)</span>
                </div>
                <div>
                  <span class="text-slate-400 text-[10px] uppercase">CO2 REDUCTION:</span>
                  <span class="ml-1.5 text-sky-400 font-bold">{{ activeEcoData().reduction }}</span>
                </div>
                <div class="hidden sm:block">
                  <span class="text-slate-400 text-[10px] uppercase">AUX ENGINE:</span>
                  <span class="ml-1.5 text-amber-400 font-bold">{{ activeEcoData().auxStatus }}</span>
                </div>
              </div>

              <div class="flex items-center gap-3">
                <div class="text-[10px] text-slate-400">
                  PROPULSION EFFICIENCY: <span class="text-emerald-400 font-bold">{{ activeEcoData().efficiency }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <!-- Text Content -->
          <div>
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold tracking-wide uppercase mb-3 shadow-sm">
              <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>{{ isRtl() ? 'الاستدامة والحياد الكربوني 2050' : 'GREEN FEEDER INITIATIVE' }}</span>
            </div>

            <h2 class="text-3xl sm:text-4xl font-black text-[#02194b] leading-tight">
              {{ isRtl() 
                ? 'قيادة التحول الأخضر في النقل البحري الإقليمي' 
                : 'Pioneering Decarbonized Feeder Shipping' }}
            </h2>

            <p class="text-sm sm:text-base text-slate-600 mt-4 leading-relaxed">
              {{ isRtl()
                ? 'ملتزمون بخفض البصمة الكربونية لكل ميل بحري لحاوية، من خلال تبني وقود الميثانول الحيوي، وتوصيل السفن بالكهرباء الشاطئية في ميناء جبل علي، ومسارات الإبحار الذكية.'
                : 'Aligned with IMO 2030 and 2050 decarbonization mandates, our next-generation feeder fleet integrates alternative fuel flexibility, shore-power cold ironing at Jebel Ali, and hydrodynamic hull retrofits to minimize emissions per TEU-mile.' }}
            </p>

            <!-- 3 Key Pillars -->
            <div class="mt-8 space-y-4">
              <div class="flex items-start gap-3.5 p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
                <div class="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h4 class="text-xs font-bold text-[#02194b] uppercase tracking-wider">
                    {{ isRtl() ? 'الكهرباء الشاطئية في الموانئ (Cold Ironing)' : 'Cold Ironing & Shore Power Ready' }}
                  </h4>
                  <p class="text-xs text-slate-500 mt-0.5">
                    {{ isRtl() ? 'إيقاف مولدات الديزل أثناء الرسو في موانئ جبل علي والسخنة واستخدام الكهرباء المتجددة.' : 'Zero-emission port stays by plugging directly into clean shore power at DP World Jebel Ali & Sokhna quays.' }}
                  </p>
                </div>
              </div>

              <div class="flex items-start gap-3.5 p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
                <div class="w-8 h-8 rounded-lg bg-red-50 text-[#dd0103] flex items-center justify-center shrink-0 border border-red-100">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h4 class="text-xs font-bold text-[#02194b] uppercase tracking-wider">
                    {{ isRtl() ? 'جاهزية وقود الميثانول الأخضر والبيوديزل' : 'Bio-Methanol & B24 Biofuel Prepared' }}
                  </h4>
                  <p class="text-xs text-slate-500 mt-0.5">
                    {{ isRtl() ? 'تجارب تشغيلية مستمرة لخليط B24 لتخفيض انبعاثات ثاني أكسيد الكربون بنسبة 20%.' : 'Fleet bunkering trials utilizing ISCC-certified B24 biofuel blends with up to 20% GHG reduction.' }}
                  </p>
                </div>
              </div>

              <div class="flex items-start gap-3.5 p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
                <div class="w-8 h-8 rounded-lg bg-red-50 text-[#dd0103] flex items-center justify-center shrink-0 border border-red-100">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h4 class="text-xs font-bold text-[#02194b] uppercase tracking-wider">
                    {{ isRtl() ? 'توجيه المسارات بالذكاء الاصطناعي والطقس' : 'AI Weather & Trim Optimization' }}
                  </h4>
                  <p class="text-xs text-slate-500 mt-0.5">
                    {{ isRtl() ? 'خوارزميات تحسين السرعة واستهلاك الوقود حسب التيارات البحرية والرياح في المحيط الهندي.' : 'Digital twins and hydrodynamic trim monitoring shaving 7-12% off propulsion fuel demands.' }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Infographic Card -->
          <div class="relative bg-white rounded-2xl border border-slate-200 p-8 shadow-xl overflow-hidden">
            <div class="absolute -right-20 -top-20 w-64 h-64 bg-[#dd0103]/10 rounded-full blur-3xl pointer-events-none"></div>

            <div class="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <span class="text-xs font-mono text-[#dd0103] uppercase font-bold">IMO CII RATING COMPLIANCE</span>
              <span class="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">Rating: A / B Certified</span>
            </div>

            <!-- Visual Bar Metrics -->
            <div class="space-y-6">
              <div>
                <div class="flex justify-between text-xs font-semibold mb-1.5">
                  <span class="text-slate-700">Fleet Shore-Power Compatibility</span>
                  <span class="text-[#dd0103] font-mono font-bold">85%</span>
                </div>
                <div class="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div class="h-full bg-gradient-to-r from-[#dd0103] to-[#ef2325] rounded-full" style="width: 85%"></div>
                </div>
              </div>

              <div>
                <div class="flex justify-between text-xs font-semibold mb-1.5">
                  <span class="text-slate-700">Carbon Intensity Indicator (CII) Reduction</span>
                  <span class="text-emerald-700 font-mono font-bold">-22.4%</span>
                </div>
                <div class="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div class="h-full bg-emerald-500 rounded-full" style="width: 72%"></div>
                </div>
              </div>

              <div>
                <div class="flex justify-between text-xs font-semibold mb-1.5">
                  <span class="text-slate-700">Biofuel Blend Readiness</span>
                  <span class="text-[#dd0103] font-mono font-bold">100%</span>
                </div>
                <div class="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div class="h-full bg-[#dd0103] rounded-full" style="width: 100%"></div>
                </div>
              </div>

              <!-- Hydrodynamic Hull Wave Resistance Metric -->
              <div>
                <div class="flex justify-between text-xs font-semibold mb-1.5">
                  <span class="text-slate-700">Bulbous Bow Wave Resistance Reduction</span>
                  <span class="text-sky-600 font-mono font-bold">-14.2%</span>
                </div>
                <div class="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div class="h-full bg-gradient-to-r from-sky-400 to-emerald-500 rounded-full" style="width: 78%"></div>
                </div>
              </div>
            </div>

            <!-- Quote badge -->
            <div class="mt-8 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 italic">
              "Feeder shipping is the indispensable artery linking world trade hubs with regional economies. Our responsibility is delivering speed and sustainability simultaneously."
            </div>
          </div>
        </div>
      </div>
    </section>
  `
})
export class SustainabilityComponent implements AfterViewInit, OnDestroy {
  service = inject(MaritimeService);
  ngZone = inject(NgZone);
  isRtl = this.service.isRtl;

  @ViewChild('ecoCanvas') ecoCanvasRef!: ElementRef<HTMLCanvasElement>;

  ecoMode = signal<EcoMode>('air-lubrication');
  private ecoAnimId: number | null = null;
  private ecoObserver?: IntersectionObserver;
  private isEcoVisible = false;
  private bubbles: EcoParticle[] = [];
  private plasmaPulses: Array<{ progress: number; speed: number }> = [];

  activeEcoData = computed(() => {
    switch (this.ecoMode()) {
      case 'cold-ironing':
        return {
          title: 'SHORE POWER COLD IRONING AT BERTH',
          desc: 'High-voltage electric umbilical delivers clean renewable grid power directly from Jebel Ali quay, turning off auxiliary diesel engines completely.',
          reduction: '-100% At Berth',
          auxStatus: 'OFFLINE (0 RPM / 0 dB)',
          efficiency: '99.4% Grid Efficiency'
        };
      case 'air-lubrication':
        return {
          title: 'SUB-HULL AIR LUBRICATION MICRO-BUBBLE CARPET',
          desc: 'High-efficiency compressors inject an unbroken layer of micro-bubbles under the flat bottom keel, drastically minimizing skin friction drag.',
          reduction: '-12.4% Fuel & GHG',
          auxStatus: 'Compressor Active (Eco-Mode)',
          efficiency: '+14.6% Hydrodynamic Flow'
        };
      case 'bio-fuel':
        return {
          title: 'ISCC-CERTIFIED B24 BIOFUEL & GREEN METHANOL',
          desc: 'Drop-in maritime bio-bunkering blended with used cooking oil fatty acid methyl esters (FAME), cutting lifetime carbon intensity without engine retrofits.',
          reduction: '-22.4% Full Voyage',
          auxStatus: 'Dual-Fuel Injection On',
          efficiency: '98.8% Thermal Efficiency'
        };
    }
  });

  setEcoMode(mode: EcoMode) {
    this.ecoMode.set(mode);
  }

  ngAfterViewInit() {
    this.initEcoCanvas();
  }

  ngOnDestroy() {
    if (this.ecoAnimId) {
      cancelAnimationFrame(this.ecoAnimId);
      this.ecoAnimId = null;
    }
    if (this.ecoObserver) {
      this.ecoObserver.disconnect();
    }
  }

  private initEcoCanvas() {
    const canvas = this.ecoCanvasRef?.nativeElement;
    if (!canvas) return;

    this.plasmaPulses = [
      { progress: 0.1, speed: 0.02 },
      { progress: 0.4, speed: 0.022 },
      { progress: 0.7, speed: 0.019 }
    ];

    this.ecoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.isEcoVisible = true;
          this.startEcoLoop();
        } else {
          this.isEcoVisible = false;
          if (this.ecoAnimId) {
            cancelAnimationFrame(this.ecoAnimId);
            this.ecoAnimId = null;
          }
        }
      });
    }, { rootMargin: '100px' });

    this.ecoObserver.observe(canvas);
  }

  private startEcoLoop() {
    if (this.ecoAnimId) return;

    this.ngZone.runOutsideAngular(() => {
      const render = () => {
        if (!this.isEcoVisible) return;
        this.drawEcoFrame();
        this.ecoAnimId = requestAnimationFrame(render);
      };
      this.ecoAnimId = requestAnimationFrame(render);
    });
  }

  private drawEcoFrame() {
    const canvas = this.ecoCanvasRef?.nativeElement;
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

    // Dark emerald maritime water gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
    bgGrad.addColorStop(0, '#02131b');
    bgGrad.addColorStop(0.5, '#032026');
    bgGrad.addColorStop(1, '#010c11');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    const mode = this.ecoMode();
    const now = performance.now() * 0.002;

    // Vessel Position and Geometry
    const shipW = Math.min(260, w * 0.45);
    const shipH = shipW * 0.26;
    const shipX = w * 0.52;
    const waterlineY = h * 0.52;
    const keelY = waterlineY + shipH * 0.45;
    const bowX = shipX + shipW * 0.5;
    const sternX = shipX - shipW * 0.5;

    // 1. Draw Water Surface Wave
    ctx.beginPath();
    ctx.moveTo(0, h);
    for (let x = 0; x <= w; x += 10) {
      const wy = waterlineY + Math.sin(x * 0.015 + now * 1.5) * 5 + Math.cos(x * 0.03 - now) * 3;
      ctx.lineTo(x, wy);
    }
    ctx.lineTo(w, h);
    ctx.closePath();
    const waterGrad = ctx.createLinearGradient(0, waterlineY - 5, 0, h);
    waterGrad.addColorStop(0, mode === 'bio-fuel' ? 'rgba(16, 185, 129, 0.35)' : 'rgba(14, 165, 233, 0.3)');
    waterGrad.addColorStop(1, 'rgba(2, 44, 34, 0.8)');
    ctx.fillStyle = waterGrad;
    ctx.fill();

    // 2. Draw Vessel Hull Profile
    // Main topsides
    ctx.beginPath();
    ctx.moveTo(sternX, waterlineY - shipH * 0.3);
    ctx.lineTo(bowX - 12, waterlineY - shipH * 0.3);
    ctx.lineTo(bowX, waterlineY + 8);
    ctx.lineTo(bowX - 12, keelY);
    ctx.lineTo(sternX + 12, keelY);
    ctx.lineTo(sternX, waterlineY - shipH * 0.3);
    ctx.closePath();
    ctx.fillStyle = '#02194b';
    ctx.fill();
    ctx.strokeStyle = '#059669';
    ctx.lineWidth = 1.6;
    ctx.stroke();

    // Emerald Antifouling Keel Layer
    ctx.beginPath();
    ctx.moveTo(sternX + 8, keelY - 12);
    ctx.lineTo(bowX - 10, keelY - 12);
    ctx.lineTo(bowX - 12, keelY);
    ctx.lineTo(sternX + 12, keelY);
    ctx.closePath();
    ctx.fillStyle = '#047857';
    ctx.fill();

    // Container Bays on Deck
    const containerW = 20;
    const containerH = 12;
    const bayStart = sternX + 38;
    const bayEnd = bowX - 25;
    const deckY = waterlineY - shipH * 0.3;
    const ecoColors = ['#10b981', '#059669', '#0284c7', '#34d399', '#dd0103'];

    let col = 0;
    for (let bx = bayStart; bx < bayEnd; bx += containerW + 3) {
      ctx.fillStyle = ecoColors[col % ecoColors.length];
      ctx.fillRect(bx, deckY - containerH, containerW, containerH);
      ctx.fillRect(bx, deckY - containerH * 2, containerW, containerH);
      if (col % 2 === 0) {
        ctx.fillRect(bx, deckY - containerH * 3, containerW, containerH);
      }
      col++;
    }

    // Bridge Tower & Funnel
    const bridgeX = sternX + 12;
    const bridgeY = deckY - containerH * 3.2;
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(bridgeX, bridgeY, 24, containerH * 3.2);
    ctx.fillStyle = '#02194b';
    ctx.fillRect(bridgeX - 8, deckY - containerH * 2.2, 8, containerH * 2.2);

    // MODE SPECIFIC GRAPHIC ENGINES:
    if (mode === 'cold-ironing') {
      // 3A. Quay Wall & High Voltage Substation (Port Berth Mode)
      const quayX = Math.max(30, shipX - shipW * 0.75);
      const quayW = 80;

      // Concrete Pier
      ctx.fillStyle = '#334155';
      ctx.fillRect(quayX - quayW, waterlineY - 25, quayW, h - waterlineY + 25);
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(quayX - 8, waterlineY - 32, 10, 10); // Mooring bollard

      // High Voltage Substation Box
      ctx.fillStyle = '#065f46';
      ctx.fillRect(quayX - quayW + 15, waterlineY - 60, 40, 35);
      ctx.fillStyle = '#10b981';
      ctx.font = '8px monospace';
      ctx.fillText('11kV SHORE', quayX - quayW + 16, waterlineY - 45);

      // High-Voltage Umbilical Cable (Cat-enary curve to ship)
      const cableStart = { x: quayX - 10, y: waterlineY - 40 };
      const cableEnd = { x: sternX + 25, y: deckY };
      const ctrlPoint = { x: (cableStart.x + cableEnd.x) / 2, y: waterlineY + 15 };

      ctx.beginPath();
      ctx.moveTo(cableStart.x, cableStart.y);
      ctx.quadraticCurveTo(ctrlPoint.x, ctrlPoint.y, cableEnd.x, cableEnd.y);
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 3.5;
      ctx.stroke();

      // Animated Electrical Plasma Pulses along Cable
      for (const pulse of this.plasmaPulses) {
        pulse.progress += pulse.speed;
        if (pulse.progress > 1) pulse.progress = 0;

        const t = pulse.progress;
        const px = (1 - t) * (1 - t) * cableStart.x + 2 * (1 - t) * t * ctrlPoint.x + t * t * cableEnd.x;
        const py = (1 - t) * (1 - t) * cableStart.y + 2 * (1 - t) * t * ctrlPoint.y + t * t * cableEnd.y;

        ctx.beginPath();
        ctx.arc(px, py, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#34d399';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(px, py, 8, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(52, 211, 153, 0.6)';
        ctx.stroke();
      }

      // Funnel with Zero-Emission Status (Green Zero Badge)
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(bridgeX - 4, deckY - containerH * 2.6, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 9px monospace';
      ctx.fillText('0g', bridgeX - 9, deckY - containerH * 2.6 + 3);

    } else if (mode === 'air-lubrication') {
      // 3B. Sub-Hull Micro-Bubble Carpet (Active Flow)
      if (this.bubbles.length < 90) {
        for (let i = 0; i < 4; i++) {
          this.bubbles.push({
            x: bowX - 25 - Math.random() * 20,
            y: keelY + Math.random() * 4,
            vx: -Math.random() * 3.5 - 2,
            vy: -Math.random() * 0.4 - 0.1,
            radius: Math.random() * 2.2 + 0.8,
            alpha: 0.9,
            life: 1.0
          });
        }
      }

      for (let i = this.bubbles.length - 1; i >= 0; i--) {
        const b = this.bubbles[i];
        b.x += b.vx;
        b.y += b.vy;
        b.life -= 0.015;
        b.alpha = b.life * 0.85;

        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(52, 211, 153, ${b.alpha})`;
        ctx.fill();

        if (b.life <= 0 || b.x < sternX - 40) {
          this.bubbles.splice(i, 1);
        }
      }

      // Air Lubrication Keel Injector Nozzles (Luminescent points)
      for (let k = sternX + 25; k < bowX - 15; k += 28) {
        ctx.beginPath();
        ctx.arc(k, keelY, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = '#6ee7b7';
        ctx.fill();
      }

    } else if (mode === 'bio-fuel') {
      // 3C. Biofuel Clean Catalytic Combustion Chamber
      const engineX = bridgeX + 2;
      const engineY = deckY + 6;

      // Engine block glowing emerald
      const enginePulse = Math.sin(now * 8) * 0.3 + 0.7;
      ctx.fillStyle = `rgba(16, 185, 129, ${enginePulse * 0.6})`;
      ctx.fillRect(engineX - 6, engineY - 4, 18, 14);
      ctx.strokeStyle = '#34d399';
      ctx.strokeRect(engineX - 6, engineY - 4, 18, 14);

      // Clean Water Vapor Plume from Funnel (No Soot / 0 Particulates)
      for (let s = 0; s < 6; s++) {
        const plumeY = deckY - containerH * 2.5 - s * 10 - (now * 20 % 10);
        const plumeX = bridgeX - 4 + Math.sin(s + now) * 6 - s * 4;
        const radius = 6 + s * 3;
        ctx.beginPath();
        ctx.arc(plumeX, plumeY, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${0.35 - s * 0.05})`;
        ctx.fill();
      }

      // Propeller Churn Wash with Bio-Bioluminescence
      ctx.beginPath();
      ctx.arc(sternX - 4, keelY - 4, 8 + Math.sin(now * 12) * 3, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(52, 211, 153, 0.45)';
      ctx.fill();
    }

    ctx.restore();
  }
}
