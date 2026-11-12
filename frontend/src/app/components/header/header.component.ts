import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaritimeService } from '../../services/maritime.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Top Utility Bar -->
    <div class="bg-navy-950 border-b border-navy-800 text-xs text-slate-300 py-1.5 px-4 sm:px-8">
      <div class="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div class="flex items-center gap-4">
          <span class="flex items-center gap-1.5 text-slate-400">
            <svg class="w-3.5 h-3.5 text-ocean-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{{ isRtl() ? 'ساعات العمل: الأحد - الخميس 08:00 - 18:00' : 'HQ Ops: Mon - Fri 08:00 - 18:00 (GMT+4)' }}</span>
          </span>
          <span class="hidden md:inline text-navy-700">|</span>
          <span class="hidden md:flex items-center gap-1.5 text-slate-300">
            <span class="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>{{ isRtl() ? 'مركز العمليات البحرية يعمل 24/7' : '24/7 Marine Operations Desk Active' }}</span>
          </span>
        </div>

        <div class="flex items-center gap-4">
          <a href="tel:+97142105105" class="flex items-center gap-1.5 text-ocean-400 hover:text-ocean-300 font-semibold transition-colors">
            <svg class="w-3.5 h-3.5 text-amber-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span>+971 4 210 51 05</span>
          </a>

          <!-- Language / RTL Toggle -->
          <button
            (click)="service.toggleRtl()"
            class="flex items-center gap-1 px-2.5 py-0.5 rounded bg-navy-800 hover:bg-navy-700 text-slate-200 border border-navy-700 text-xs font-medium transition-all"
            [title]="isRtl() ? 'Switch to English' : 'التبديل إلى العربية (RTL)'">
            <svg class="w-3.5 h-3.5 text-ocean-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
            <span>{{ isRtl() ? 'EN (LTR)' : 'عربي (RTL)' }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Main Navigation Bar -->
    <header class="sticky top-0 z-40 bg-navy-900/95 backdrop-blur-md border-b border-navy-800 shadow-xl">
      <div class="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <!-- Brand Logo -->
        <a href="#" class="flex items-center gap-3 group">
          <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-ocean-500 to-navy-800 flex items-center justify-center shadow-lg shadow-ocean-500/20 border border-ocean-400/40 group-hover:scale-105 transition-transform">
            <!-- Vessel Anchor / Container Icon -->
            <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 17l8 4 8-4M4 12l8 4 8-4" />
            </svg>
          </div>
          <div>
            <div class="flex items-center gap-1.5">
              <span class="text-xl font-extrabold tracking-tight text-white group-hover:text-ocean-400 transition-colors">GLOBAL FEEDERS</span>
              <span class="text-[10px] font-bold px-1.5 py-0.5 rounded bg-ocean-500/20 text-ocean-400 border border-ocean-500/30">DP WORLD ALLIANCE</span>
            </div>
            <p class="text-[10px] uppercase tracking-widest text-slate-400 font-medium">Independent Container Feeder Network</p>
          </div>
        </a>

        <!-- Desktop Navigation Links -->
        <nav class="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-300">
          <a href="#services-section" class="hover:text-ocean-400 transition-colors py-1">{{ isRtl() ? 'الخدمات والخطوط' : 'Services & Routes' }}</a>
          <a href="#interactive-map-section" class="hover:text-ocean-400 transition-colors py-1">{{ isRtl() ? 'خريطة الخطوط' : 'Trade Route Map' }}</a>
          <a href="#fleet-section" class="hover:text-ocean-400 transition-colors py-1">{{ isRtl() ? 'الأسطول البحري' : 'Fleet (Vessels)' }}</a>
          <a href="#tracking-engine" class="hover:text-ocean-400 transition-colors py-1 flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-ocean-400"></span>
            <span>{{ isRtl() ? 'تتبع السفن' : 'Vessel Tracking' }}</span>
          </a>
          <a href="#sustainability-section" class="hover:text-ocean-400 transition-colors py-1">{{ isRtl() ? 'الاستدامة' : 'Sustainability' }}</a>
          <a href="#agents-section" class="hover:text-ocean-400 transition-colors py-1">{{ isRtl() ? 'المكاتب والوكلاء' : 'Offices & Agents' }}</a>
        </nav>

        <!-- Right Action Button & Mobile Menu Toggle -->
        <div class="flex items-center gap-3">
          <button
            (click)="service.toggleBookingModal(true)"
            class="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-ocean-500 to-ocean-600 hover:from-ocean-400 hover:to-ocean-500 text-navy-950 font-bold text-sm shadow-lg shadow-ocean-500/25 transition-all hover:shadow-ocean-500/40 hover:-translate-y-0.5 cursor-pointer">
            <svg class="w-4 h-4 text-navy-950" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>{{ isRtl() ? 'طلب حجز / تسعيرة' : 'Request Booking' }}</span>
          </button>

          <!-- Mobile Hamburger Toggle -->
          <button
            (click)="mobileMenuOpen = !mobileMenuOpen"
            class="lg:hidden p-2 rounded-lg bg-navy-800 text-slate-300 hover:text-white border border-navy-700">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path *ngIf="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              <path *ngIf="mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Dropdown Menu -->
      <div *ngIf="mobileMenuOpen" class="lg:hidden bg-navy-950 border-b border-navy-800 px-6 py-4 space-y-3">
        <a (click)="mobileMenuOpen = false" href="#services-section" class="block text-slate-200 hover:text-ocean-400 py-1 font-medium">{{ isRtl() ? 'الخدمات والخطوط' : 'Services & Routes' }}</a>
        <a (click)="mobileMenuOpen = false" href="#interactive-map-section" class="block text-slate-200 hover:text-ocean-400 py-1 font-medium">{{ isRtl() ? 'خريطة الخطوط' : 'Trade Route Map' }}</a>
        <a (click)="mobileMenuOpen = false" href="#fleet-section" class="block text-slate-200 hover:text-ocean-400 py-1 font-medium">{{ isRtl() ? 'الأسطول البحري' : 'Fleet (Vessels)' }}</a>
        <a (click)="mobileMenuOpen = false" href="#tracking-engine" class="block text-slate-200 hover:text-ocean-400 py-1 font-medium">{{ isRtl() ? 'تتبع السفن' : 'Vessel Tracking' }}</a>
        <a (click)="mobileMenuOpen = false" href="#sustainability-section" class="block text-slate-200 hover:text-ocean-400 py-1 font-medium">{{ isRtl() ? 'الاستدامة' : 'Sustainability' }}</a>
        <a (click)="mobileMenuOpen = false" href="#agents-section" class="block text-slate-200 hover:text-ocean-400 py-1 font-medium">{{ isRtl() ? 'المكاتب والوكلاء' : 'Offices & Agents' }}</a>
        <button
          (click)="service.toggleBookingModal(true); mobileMenuOpen = false"
          class="w-full mt-2 py-2.5 rounded-lg bg-ocean-500 text-navy-950 font-bold text-sm text-center">
          {{ isRtl() ? 'طلب حجز / تسعيرة' : 'Request Booking' }}
        </button>
      </div>
    </header>
  `
})
export class HeaderComponent {
  service = inject(MaritimeService);
  isRtl = this.service.isRtl;
  mobileMenuOpen = false;
}
