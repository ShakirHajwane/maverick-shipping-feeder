import { Component, OnInit, inject, ElementRef, ViewChild, AfterViewInit, OnDestroy, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaritimeService } from './services/maritime.service';
import { HeaderComponent } from './components/header/header.component';
import { HeroSearchComponent } from './components/hero-search/hero-search.component';
import { InteractiveMapComponent } from './components/map/map.component';
import { FleetDirectoryComponent } from './components/fleet/fleet.component';
import { SustainabilityComponent } from './components/sustainability/sustainability.component';
import { AgentsDirectoryComponent } from './components/agents/agents.component';
import { MaritimeJourneyComponent } from './components/maritime-journey/maritime-journey.component';
import { VesselModalComponent } from './components/vessel-modal/vessel-modal.component';
import { BookingModalComponent } from './components/booking-modal/booking-modal.component';
import { FooterComponent } from './components/footer/footer.component';

interface WaterStreamline {
  x: number;
  y: number;
  length: number;
  speed: number;
  alpha: number;
  width: number;
}

interface WaterParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    HeroSearchComponent,
    MaritimeJourneyComponent,
    InteractiveMapComponent,
    FleetDirectoryComponent,
    SustainabilityComponent,
    AgentsDirectoryComponent,
    VesselModalComponent,
    BookingModalComponent,
    FooterComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, AfterViewInit, OnDestroy {
  service = inject(MaritimeService);
  private ngZone = inject(NgZone);
  isRtl = this.service.isRtl;

  @ViewChild('lowerOceanCanvas') canvasRef?: ElementRef<HTMLCanvasElement>;
  @ViewChild('lowerOceanContainer') containerRef?: ElementRef<HTMLDivElement>;

  private animId: number | null = null;
  private observer?: IntersectionObserver;
  private isVisible = false;
  private streamlines: WaterStreamline[] = [];
  private particles: WaterParticle[] = [];

  ngOnInit() {
    // Initial fetch of API data
    this.service.loadStats().subscribe();
    this.service.loadServices().subscribe();
    this.service.loadVessels().subscribe();
    this.service.loadSchedules().subscribe();
    this.service.loadAgents().subscribe();
  }

  oceanLowerBgStyle(): string {
    switch (this.service.waterTheme()) {
      case 'deep':
        return 'linear-gradient(180deg, #091e42 0%, #051a3d 15%, #031533 35%, #02112a 60%, #010d22 85%, #010816 100%)';
      case 'azure':
        return 'linear-gradient(180deg, #e0f2fe 0%, #bae6fd 12%, #7dd3fc 28%, #38bdf8 48%, #0ea5e9 68%, #0284c7 85%, #0369a1 95%, #02194b 100%)';
      case 'slate':
      default:
        return 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 15%, #e2e8f0 35%, #cbd5e1 60%, #94a3b8 85%, #475569 100%)';
    }
  }

  waveFillColor1(): string {
    switch (this.service.waterTheme()) {
      case 'deep':
        return 'rgba(5, 26, 61, 0.75)';
      case 'azure':
        return 'rgba(186, 230, 253, 0.7)';
      case 'slate':
      default:
        return 'rgba(241, 245, 249, 0.75)';
    }
  }

  waveFillColor2(): string {
    switch (this.service.waterTheme()) {
      case 'deep':
        return '#031533';
      case 'azure':
        return '#7dd3fc';
      case 'slate':
      default:
        return '#e2e8f0';
    }
  }

  ngAfterViewInit() {
    this.initOceanCanvas();
  }

  ngOnDestroy() {
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  private initOceanCanvas() {
    const canvas = this.canvasRef?.nativeElement;
    const container = this.containerRef?.nativeElement;
    if (!canvas || !container) return;

    const initialH = Math.max(container.clientHeight, 4000);

    // Seed fluid streamlines across full multi-section ocean height
    this.streamlines = [];
    for (let i = 0; i < 75; i++) {
      this.streamlines.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * initialH,
        length: Math.random() * 140 + 60,
        speed: Math.random() * 1.8 + 0.8,
        alpha: Math.random() * 0.35 + 0.1,
        width: Math.random() * 2.2 + 0.8
      });
    }

    // Seed ambient ocean shimmer particles
    this.particles = [];
    for (let i = 0; i < 110; i++) {
      this.particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * initialH,
        vx: Math.random() * 0.8 + 0.2,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2.5 + 1.2,
        alpha: Math.random() * 0.5 + 0.15
      });
    }

    // Modern Web Guidance: Efficient Background Processing via IntersectionObserver
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.isVisible = true;
          this.startLoop();
        } else {
          this.isVisible = false;
          if (this.animId) {
            cancelAnimationFrame(this.animId);
            this.animId = null;
          }
        }
      });
    }, { rootMargin: '150px' });

    this.observer.observe(container);
  }

  private startLoop() {
    if (this.animId) return;

    this.ngZone.runOutsideAngular(() => {
      const render = () => {
        if (!this.isVisible) return;
        this.drawOceanFrame();
        this.animId = requestAnimationFrame(render);
      };
      this.animId = requestAnimationFrame(render);
    });
  }

  private drawOceanFrame() {
    const canvas = this.canvasRef?.nativeElement;
    const container = this.containerRef?.nativeElement;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = container.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
      canvas.width = w * dpr;
      canvas.height = h * dpr;
    }

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);

    const now = performance.now() * 0.0015;
    const isPaused = this.service.isWaterMotionPaused();
    const theme = this.service.waterTheme();

    const strokeColor = theme === 'deep' 
      ? 'rgba(56, 189, 248,' 
      : theme === 'azure' 
        ? 'rgba(255, 255, 255,' 
        : 'rgba(148, 163, 184,';

    // 1. Draw Flowing Water Streamlines
    for (const line of this.streamlines) {
      if (!isPaused) {
        line.x += line.speed;
        if (line.x > w + line.length) {
          line.x = -line.length;
          line.y = Math.random() * h;
        }
      }

      ctx.beginPath();
      ctx.moveTo(line.x, line.y + Math.sin(line.x * 0.008 + now) * 6);
      ctx.lineTo(line.x + line.length, line.y + Math.sin((line.x + line.length) * 0.008 + now) * 6);
      ctx.strokeStyle = `${strokeColor} ${line.alpha})`;
      ctx.lineWidth = line.width;
      ctx.stroke();
    }

    // 2. Draw Floating Ocean Shimmer Particles
    for (const p of this.particles) {
      if (!isPaused) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x > w + 20) {
          p.x = -20;
          p.y = Math.random() * h;
        }
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y + Math.sin(p.x * 0.01 + now * 1.5) * 4, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `${strokeColor} ${p.alpha})`;
      ctx.fill();
    }

    // 3. Ambient Water Ripples across the screen height
    for (let row = 200; row < h; row += 450) {
      ctx.beginPath();
      ctx.moveTo(0, row);
      for (let rx = 0; rx <= w; rx += 25) {
        const ry = row + Math.sin(rx * 0.006 + now * 1.2) * 8 + Math.cos(rx * 0.012 - now * 0.8) * 4;
        ctx.lineTo(rx, ry);
      }
      ctx.strokeStyle = `${strokeColor} 0.12)`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    ctx.restore();
  }
}
