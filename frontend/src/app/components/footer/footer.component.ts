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
    <!-- Clean Brand Accent Bar Transition into Navy Footer -->
    <div class="w-full h-1.5 bg-gradient-to-r from-[#02194b] via-[#dd0103] to-[#02194b]"></div>

    <footer class="bg-[#011238] text-slate-300 text-xs pt-12 sm:pt-16 pb-12 border-t border-white/10 relative overflow-hidden">
      <!-- Subtle Ambient Maritime Glow -->
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_75%_50%_at_50%_-10%,rgba(221,1,3,0.09),transparent)] pointer-events-none"></div>

      <div class="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        
        <!-- =========================================================
             NAUTICAL COMPASS ROSE & SYNCHRONIZED CORRIDOR CLOCKS
             ========================================================= -->
        <div class="mb-12 rounded-3xl bg-[#02194b]/80 border border-white/10 p-5 sm:p-6 shadow-2xl">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            <!-- Left: Interactive Gyro-Compass Rose Canvas -->
            <div class="lg:col-span-4 flex items-center gap-4 border-b lg:border-b-0 lg:border-e border-white/10 pb-5 lg:pb-0 lg:pe-6">
              <div class="relative w-24 h-24 shrink-0 flex items-center justify-center">
                <canvas #compassCanvas class="w-full h-full block cursor-pointer" title="Navigational Gyro-Compass"></canvas>
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span class="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400">
                    {{ isRtl() ? 'التوقيت القياسي للموانئ' : 'CORRIDOR TIME SYNC' }}
                  </span>
                </div>
                <h4 class="text-sm font-black text-white mt-0.5">
                  {{ isRtl() ? 'غرفة العمليات الملاحية والتحكم المركزي 24/7' : 'Global Maritime Ops & 24/7 Corridor Control' }}
                </h4>
                <p class="text-[11px] text-slate-300 mt-1">
                  {{ isRtl() ? 'تنسيق مباشر مع موانئ صحار ونهافا شيفا وموندرا وكراتشي.' : 'Synchronized agency coordination across Sohar, Nhava Sheva, Mundra, and Karachi.' }}
                </p>
              </div>
            </div>

            <!-- Right: Live Synchronized Regional Port Clocks -->
            <div class="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div
                *ngFor="let clock of portClocks"
                class="bg-[#010e2d]/80 border border-white/10 rounded-2xl p-3.5 hover:border-[#dd0103]/50 transition-all flex flex-col justify-between">
                <div>
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-mono font-bold text-white">{{ clock.city }}</span>
                    <span class="text-[9px] font-mono uppercase text-slate-400">{{ clock.country }}</span>
                  </div>
                </div>
                <div class="mt-2.5 pt-2 border-t border-white/10">
                  <div class="text-sm font-mono font-black text-white">
                    {{ getPortTime(clock.timeZone) }}
                  </div>
                  <div class="flex items-center gap-1.5 mt-1">
                    <span class="w-1.5 h-1.5 rounded-full" [ngClass]="clock.statusClass"></span>
                    <span class="text-[9px] font-mono text-slate-300 truncate">{{ clock.status }}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          
          <!-- Column 1: Brand & HQ (2 cols) -->
          <div class="lg:col-span-2 space-y-4">
            <div class="inline-flex items-center bg-white px-3.5 py-2 rounded-2xl shadow-md">
              <img 
                src="images/maverick-logo.svg" 
                alt="MAVERICK SHIPPING LLC" 
                class="h-11 sm:h-12 w-auto object-contain" />
            </div>

            <p class="text-xs text-slate-300 leading-relaxed max-w-sm">
              {{ isRtl()
                ? 'مافريك للشحن البحري: شريكك الموثوق في النقل الملاحي والخطوط المغذية الإقليمية بين الخليج العربي وباكستان والهند.'
                : 'Maverick Shipping LLC: Dependable, efficient, and commercially competitive container feeder services connecting the Arabian Gulf, Pakistan, and India.' }}
            </p>

            <div class="space-y-1.5 pt-2">
              <div class="flex items-center gap-2 text-slate-300">
                <span class="text-[#ef2325] font-bold">Global HQ:</span>
                <span>JAFZA One Tower, Jebel Ali Free Zone, Dubai, UAE</span>
              </div>
              <div class="flex items-center gap-2 text-slate-300">
                <span class="text-[#ef2325] font-bold">24/7 Duty Desk:</span>
                <a href="tel:+97142105105" dir="ltr" class="hover:text-white font-mono font-bold text-white transition-colors">+971 4 210 51 05</a>
              </div>
            </div>
          </div>

          <!-- Column 2: Service Rotation -->
          <div class="space-y-3">
            <h4 class="text-xs font-bold uppercase tracking-wider text-white">{{ isRtl() ? 'الخدمة الملاحية والدوران' : 'Service Rotation' }}</h4>
            <ul class="space-y-1.5 text-xs">
              <li><a href="#interactive-map-section" class="text-white font-bold hover:text-[#ef2325] transition-colors flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>SMNK Dedicated Feeder Loop</span>
              </a></li>
              <li class="text-slate-300">• Sohar, Oman (Arabian Gulf Gateway)</li>
              <li class="text-slate-300">• Nhava Sheva, India (West Coast Gateway)</li>
              <li class="text-slate-300">• Mundra, India (Commercial Hub)</li>
              <li class="text-slate-300">• Karachi, Pakistan (International Trade)</li>
              <li class="text-slate-300">• Sohar, Oman (Express Rotation)</li>
            </ul>
          </div>

          <!-- Column 3: Navigation Portals -->
          <div class="space-y-3">
            <h4 class="text-xs font-bold uppercase tracking-wider text-white">{{ isRtl() ? 'الأدوات والروابط' : 'Quick Links' }}</h4>
            <ul class="space-y-2 text-xs">
              <li><a href="#about-section" class="text-slate-300 hover:text-white transition-colors">{{ isRtl() ? 'عن مافريك للشحن' : 'About Maverick Shipping' }}</a></li>
              <li><a href="#services-section" class="text-slate-300 hover:text-white transition-colors">{{ isRtl() ? 'خدمات التغذية والشحن' : 'Feeder & Freight Services' }}</a></li>
              <li><a href="#ports-section" class="text-slate-300 hover:text-white transition-colors">{{ isRtl() ? 'الموانئ المشمولة' : 'Ports Covered' }}</a></li>
              <li><a href="#tracking-engine" class="text-slate-300 hover:text-white transition-colors">{{ isRtl() ? 'جدول الرحلات والتسعيرة' : 'Schedules & Quick Quote' }}</a></li>
              <li><a href="#interactive-map-section" class="text-slate-300 hover:text-white transition-colors">{{ isRtl() ? 'خريطة المسار الملاحي' : 'Trade Corridor Map' }}</a></li>
              <li><a href="#agents-section" class="text-slate-300 hover:text-white transition-colors">{{ isRtl() ? 'المكتب التجاري والوكلاء' : 'Regional Offices & Contact' }}</a></li>
              <li><button type="button" (click)="service.toggleBookingModal(true)" class="text-[#ef2325] hover:text-white font-semibold transition-colors text-start cursor-pointer">{{ isRtl() ? 'طلب حجز مساحة' : 'Slot Rate Inquiries' }}</button></li>
            </ul>
          </div>

          <!-- Column 4: Service Pillars -->
          <div class="space-y-3">
            <h4 class="text-xs font-bold uppercase tracking-wider text-white">{{ isRtl() ? 'معايير الخدمة' : 'Service Standards' }}</h4>
            <div class="space-y-2.5">
              <div class="p-3 rounded-xl bg-[#02194b]/80 border border-white/10 shadow-sm">
                <span class="block font-bold text-white text-[11px]">{{ isRtl() ? 'التزام أسبوعي ثابت' : 'Weekly Fixed Day' }}</span>
                <span class="text-[10px] text-slate-300">{{ isRtl() ? 'دورة 11 يوماً منتظمة' : '11-Day Dedicated Rotation' }}</span>
              </div>
              <div class="p-3 rounded-xl bg-[#02194b]/80 border border-white/10 shadow-sm">
                <span class="block font-bold text-white text-[11px]">{{ isRtl() ? 'عمليات موثوقة ٢٤/٧' : '24/7 Operations Support' }}</span>
                <span class="text-[10px] text-slate-300">{{ isRtl() ? 'تنسيق مباشر مع الموانئ' : 'Direct Port Agency Desk' }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Copyright -->
        <div class="pt-8 flex flex-wrap items-center justify-between gap-4 text-[11px] text-slate-400">
          <div>
            &copy; 2026 Maverick Shipping LLC. All rights reserved.
          </div>
          <div class="flex flex-wrap items-center gap-6">
            <a href="#about-section" class="hover:text-white transition-colors">{{ isRtl() ? 'من نحن' : 'Corporate Profile' }}</a>
            <a href="#services-section" class="hover:text-white transition-colors">{{ isRtl() ? 'الخدمات' : 'Feeder Solutions' }}</a>
            <a href="#enquiries-section" class="hover:text-white transition-colors">{{ isRtl() ? 'الاستفسارات التجارية' : 'Commercial Enquiries' }}</a>
            <a href="#agents-section" class="hover:text-white transition-colors">{{ isRtl() ? 'تواصل معنا' : 'HQ Contact' }}</a>
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
