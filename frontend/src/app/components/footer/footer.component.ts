import { Component, ElementRef, ViewChild, inject, signal, computed, AfterViewInit, OnDestroy, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaritimeService } from '../../services/maritime.service';

interface PortClock {
  city: string;
  country: string;
  timeZone: string;
  flag: string;
  status: string;
  statusClass: string;
}

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- =========================================================
         MULTI-HARMONIC ABYSSAL OCEAN WAVE CREST & TIDE BREAKER
         Seamless Animated Top Boundary Linking Page to Abyssal Footer
         ========================================================= -->
    <div class="relative w-full overflow-hidden leading-none z-10 -mb-[1px] select-none pointer-events-none" style="background: transparent;">
      <svg class="block w-[200%] h-14 sm:h-20 animate-wave-slow text-slate-900 opacity-95" viewBox="0 0 1200 80" preserveAspectRatio="none">
        <path d="M0,35 C150,65 350,10 500,45 C650,80 850,20 1000,50 C1150,80 1200,40 1200,40 L1200,80 L0,80 Z" fill="currentColor"></path>
      </svg>
      <svg class="block w-[200%] h-10 sm:h-14 -mt-10 sm:-mt-14 animate-wave-fast text-[#02194b]/90" viewBox="0 0 1200 60" preserveAspectRatio="none">
        <path d="M0,20 C200,45 400,5 600,28 C800,50 1000,10 1200,30 L1200,60 L0,60 Z" fill="currentColor"></path>
      </svg>
    </div>

    <footer class="bg-slate-950/85 backdrop-blur-md text-slate-400 text-xs pt-8 sm:pt-12 pb-12 border-t border-slate-800/80 relative overflow-hidden">
      <!-- Water Reflection Grid Backdrop Glow -->
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(14,165,233,0.15),transparent)] pointer-events-none"></div>

      <div class="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        
        <!-- =========================================================
             INNOVATIVE NAUTICAL COMPASS ROSE & 24/7 GLOBAL PORT TIME HUB
             Interactive Graphic Canvas & Live Synchronized Port Operations
             ========================================================= -->
        <div class="mb-12 rounded-2xl sm:rounded-3xl bg-slate-900/90 border border-slate-800/90 p-5 sm:p-6 shadow-2xl backdrop-blur-md">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            <!-- Left: Interactive Gyro-Compass Rose Canvas -->
            <div class="lg:col-span-4 flex items-center gap-4 border-b lg:border-b-0 lg:border-r border-slate-800 pb-5 lg:pb-0 lg:pr-6">
              <div class="relative w-24 h-24 shrink-0 flex items-center justify-center">
                <canvas #compassCanvas class="w-full h-full block cursor-pointer" title="Navigational Gyro-Compass"></canvas>
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span class="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400">
                    MASTER GYRO HEADING: 042° TRUE
                  </span>
                </div>
                <h4 class="text-sm font-black text-white mt-0.5">
                  {{ isRtl() ? 'غرفة العمليات الملاحية والتحكم المركزي 24/7' : 'Global Maritime Ops & 24/7 Fleet Control' }}
                </h4>
                <p class="text-[11px] text-slate-400 mt-1">
                  Synchronized port agency & vessel coordination across primary transshipment hubs.
                </p>
              </div>
            </div>

            <!-- Right: Live Synchronized Worldwide Port Clocks -->
            <div class="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div
                *ngFor="let clock of portClocks"
                class="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 hover:border-sky-500/50 transition-all flex flex-col justify-between shadow-inner">
                <div>
                  <div class="flex items-center justify-between">
                    <span class="text-base">{{ clock.flag }}</span>
                    <span class="text-[9px] font-mono uppercase text-slate-500">{{ clock.country }}</span>
                  </div>
                  <div class="text-xs font-bold text-white mt-1.5">{{ clock.city }}</div>
                </div>
                <div class="mt-2 pt-2 border-t border-slate-800/80">
                  <div class="text-sm font-mono font-black text-sky-400">
                    {{ getPortTime(clock.timeZone) }}
                  </div>
                  <div class="flex items-center gap-1.5 mt-1">
                    <span class="w-1.5 h-1.5 rounded-full" [ngClass]="clock.statusClass"></span>
                    <span class="text-[9px] font-mono text-slate-400 truncate">{{ clock.status }}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          <!-- Column 1: Brand & HQ (2 cols) -->
          <div class="lg:col-span-2 space-y-4">
            <div class="flex items-center gap-3">
              <img 
                src="maverick-logo.svg" 
                alt="MAVERICK SHIPPING LLC" 
                class="h-14 sm:h-16 w-auto object-contain brightness-110" />
            </div>

            <p class="text-xs text-slate-400 leading-relaxed max-w-sm">
              {{ isRtl()
                ? 'مافريك للشحن البحري: الناقل الإقليمي الرائد لربط الموانئ المحورية بشبكة شحن وتغذية حاويات متطورة وعالية التردد.'
                : 'Maverick Shipping LLC: Premier container shipping and independent common feeder operator delivering scheduled frequency, rapid turnarounds, and transshipment connectivity across primary global maritime hubs.' }}
            </p>

            <div class="space-y-1.5 pt-2">
              <div class="flex items-center gap-2 text-slate-300">
                <span class="text-[#dd0103] font-bold">Global HQ:</span>
                <span>JAFZA One Tower, Jebel Ali Free Zone, Dubai, UAE</span>
              </div>
              <div class="flex items-center gap-2 text-slate-300">
                <span class="text-[#dd0103] font-bold">24/7 Duty Desk:</span>
                <a href="tel:+97142105105" class="hover:text-[#dd0103] font-mono font-bold text-white transition-colors">+971 4 210 51 05</a>
              </div>
            </div>
          </div>

          <!-- Column 2: Feeder Corridors & Port Rotation -->
          <div class="space-y-3">
            <h4 class="text-xs font-bold uppercase tracking-wider text-white">{{ isRtl() ? 'الخدمة الملاحية والدوران' : 'Service Rotation' }}</h4>
            <ul class="space-y-1.5 text-xs">
              <li><a href="#interactive-map-section" class="text-amber-400 font-bold hover:text-white transition-colors flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>SMNK Dedicated Feeder Loop</span>
              </a></li>
              <li class="text-slate-400">• Sohar, Oman (Arabian Gulf Gateway)</li>
              <li class="text-slate-400">• Nhava Sheva, India (West Coast Gateway)</li>
              <li class="text-slate-400">• Mundra, India (Commercial Hub)</li>
              <li class="text-slate-400">• Karachi, Pakistan (International Trade)</li>
              <li class="text-slate-400">• Sohar, Oman (Express Rotation)</li>
            </ul>
          </div>

          <!-- Column 3: Tools & Services -->
          <div class="space-y-3">
            <h4 class="text-xs font-bold uppercase tracking-wider text-white">{{ isRtl() ? 'الأدوات والخدمات' : 'Online Portals' }}</h4>
            <ul class="space-y-2 text-xs">
              <li><a href="#tracking-engine" class="hover:text-white transition-colors">Vessel AIS Tracking</a></li>
              <li><a href="#tracking-engine" class="hover:text-white transition-colors">Point-to-Point Schedules</a></li>
              <li><a href="#fleet-section" class="hover:text-white transition-colors">Technical Fleet Register</a></li>
              <li><a href="#sustainability-section" class="hover:text-white transition-colors">Green Feeder Roadmap</a></li>
              <li><a href="#agents-section" class="hover:text-white transition-colors">Port Agent Network</a></li>
              <li><button (click)="service.toggleBookingModal(true)" class="hover:text-[#dd0103] text-sky-400 font-semibold transition-colors text-left cursor-pointer">Slot Rate Inquiries</button></li>
            </ul>
          </div>

          <!-- Column 4: Compliance & Memberships -->
          <div class="space-y-3">
            <h4 class="text-xs font-bold uppercase tracking-wider text-white">{{ isRtl() ? 'الاعتمادات والمعايير' : 'Quality & Standards' }}</h4>
            <div class="space-y-2">
              <div class="p-2.5 rounded-lg bg-slate-900 border border-slate-800 shadow-sm">
                <span class="block font-bold text-white text-[11px]">BIMCO Member</span>
                <span class="text-[10px] text-slate-400">Certified Carrier Standing</span>
              </div>
              <div class="p-2.5 rounded-lg bg-slate-900 border border-slate-800 shadow-sm">
                <span class="block font-bold text-white text-[11px]">ISO 9001 / 14001</span>
                <span class="text-[10px] text-slate-400">Integrated Marine Management</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Copyright & Disclaimers -->
        <div class="pt-8 flex flex-wrap items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            &copy; 2026 Maverick Shipping LLC. All rights reserved.
          </div>
          <div class="flex items-center gap-6">
            <span class="hover:text-slate-300 cursor-pointer">Terms of Carriage</span>
            <span class="hover:text-slate-300 cursor-pointer">Standard Bill of Lading (B/L)</span>
            <span class="hover:text-slate-300 cursor-pointer">Port State Control Safety</span>
            <span class="hover:text-slate-300 cursor-pointer">Privacy Policy</span>
          </div>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent implements AfterViewInit, OnDestroy {
  service = inject(MaritimeService);
  ngZone = inject(NgZone);
  isRtl = this.service.isRtl;

  @ViewChild('compassCanvas') compassCanvasRef!: ElementRef<HTMLCanvasElement>;

  private compassAnimId: number | null = null;
  private compassObserver?: IntersectionObserver;
  private isCompassVisible = false;
  private needleAngle = 0.73; // 42 degrees in radians
  currentTime = signal<Date>(new Date());
  private clockTimer?: ReturnType<typeof setInterval>;

  portClocks: PortClock[] = [
    {
      city: 'Dubai Hub HQ',
      country: 'UAE',
      timeZone: 'Asia/Dubai',
      flag: '🇦🇪',
      status: 'Fairway Clear • 24/7 Ops',
      statusClass: 'bg-emerald-400 animate-pulse'
    },
    {
      city: 'Sohar (OICT)',
      country: 'Oman',
      timeZone: 'Asia/Muscat',
      flag: '🇴🇲',
      status: 'Berth Window Active',
      statusClass: 'bg-emerald-400 animate-pulse'
    },
    {
      city: 'Nhava Sheva / Mundra',
      country: 'India',
      timeZone: 'Asia/Kolkata',
      flag: '🇮🇳',
      status: 'High Tide Feeder Window',
      statusClass: 'bg-sky-400'
    },
    {
      city: 'Karachi (SAPT)',
      country: 'Pakistan',
      timeZone: 'Asia/Karachi',
      flag: '🇵🇰',
      status: 'Deep Draft Clear',
      statusClass: 'bg-emerald-400 animate-pulse'
    }
  ];

  constructor() {
    this.clockTimer = setInterval(() => {
      this.currentTime.set(new Date());
    }, 1000);
  }

  getPortTime(timeZone: string): string {
    try {
      return new Intl.DateTimeFormat('en-GB', {
        timeZone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }).format(this.currentTime());
    } catch {
      return '--:--:--';
    }
  }

  ngAfterViewInit() {
    this.initCompassCanvas();
  }

  ngOnDestroy() {
    if (this.clockTimer) {
      clearInterval(this.clockTimer);
    }
    if (this.compassAnimId) {
      cancelAnimationFrame(this.compassAnimId);
      this.compassAnimId = null;
    }
    if (this.compassObserver) {
      this.compassObserver.disconnect();
    }
  }

  private initCompassCanvas() {
    const canvas = this.compassCanvasRef?.nativeElement;
    if (!canvas) return;

    this.compassObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.isCompassVisible = true;
          this.startCompassLoop();
        } else {
          this.isCompassVisible = false;
          if (this.compassAnimId) {
            cancelAnimationFrame(this.compassAnimId);
            this.compassAnimId = null;
          }
        }
      });
    }, { rootMargin: '100px' });

    this.compassObserver.observe(canvas);
  }

  private startCompassLoop() {
    if (this.compassAnimId) return;

    this.ngZone.runOutsideAngular(() => {
      const render = () => {
        if (!this.isCompassVisible) return;
        this.drawCompassFrame();
        this.compassAnimId = requestAnimationFrame(render);
      };
      this.compassAnimId = requestAnimationFrame(render);
    });
  }

  private drawCompassFrame() {
    const canvas = this.compassCanvasRef?.nativeElement;
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
    const size = Math.min(rect.width, rect.height);
    const cx = size / 2;
    const cy = size / 2;
    const radius = size * 0.44;

    ctx.clearRect(0, 0, rect.width, rect.height);

    // Outer Dial Ring
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fillStyle = '#020b17';
    ctx.fill();
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 1.8;
    ctx.stroke();

    // Inner subtle ring
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 0.82, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Degree Ticks
    for (let deg = 0; deg < 360; deg += 30) {
      const rad = (deg * Math.PI) / 180;
      const isMajor = deg % 90 === 0;
      const tickLen = isMajor ? 6 : 3;

      const x1 = cx + Math.cos(rad) * (radius - 2);
      const y1 = cy + Math.sin(rad) * (radius - 2);
      const x2 = cx + Math.cos(rad) * (radius - 2 - tickLen);
      const y2 = cy + Math.sin(rad) * (radius - 2 - tickLen);

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = isMajor ? '#38bdf8' : 'rgba(148, 163, 184, 0.4)';
      ctx.lineWidth = isMajor ? 1.5 : 0.8;
      ctx.stroke();
    }

    // Cardinal Points (N, E, S, W)
    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 9px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('N', cx, cy - radius + 11);

    ctx.fillStyle = '#94a3b8';
    ctx.fillText('E', cx + radius - 11, cy);
    ctx.fillText('S', cx, cy + radius - 11);
    ctx.fillText('W', cx - radius + 11, cy);

    // Subtle Gyro Inertia Wander on Needle
    const wander = Math.sin(performance.now() * 0.0018) * 0.04;
    const currentAngle = this.needleAngle + wander;

    // Needle North (Red Diamond)
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(currentAngle);

    ctx.beginPath();
    ctx.moveTo(0, -radius * 0.72);
    ctx.lineTo(4, 0);
    ctx.lineTo(-4, 0);
    ctx.closePath();
    ctx.fillStyle = '#dd0103';
    ctx.fill();

    // Needle South (Silver Diamond)
    ctx.beginPath();
    ctx.moveTo(0, radius * 0.72);
    ctx.lineTo(4, 0);
    ctx.lineTo(-4, 0);
    ctx.closePath();
    ctx.fillStyle = '#cbd5e1';
    ctx.fill();

    // Center Brass Pivot
    ctx.beginPath();
    ctx.arc(0, 0, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = '#facc15';
    ctx.fill();
    ctx.strokeStyle = '#02194b';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.restore();
    ctx.restore();
  }
}
