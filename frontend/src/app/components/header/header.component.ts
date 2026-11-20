import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaritimeService } from '../../services/maritime.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Top Utility Bar (Dark Slate Nautical Theme) -->
    <div class="bg-slate-950 border-b border-slate-800/80 text-xs text-slate-400 py-1.5 px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
      <div class="w-full max-w-[1920px] mx-auto flex flex-wrap items-center justify-between gap-3">
        <!-- Left: Operations Status -->
        <div class="flex items-center gap-4">
          <span class="hidden sm:flex items-center gap-1.5 text-slate-400">
            <svg class="w-3.5 h-3.5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="whitespace-nowrap">{{ isRtl() ? 'ساعات العمل: 08:00 - 18:00 (GMT+4)' : 'HQ Ops: Mon - Fri 08:00 - 18:00 (GMT+4)' }}</span>
          </span>
          <span class="hidden md:inline text-slate-700">|</span>
          <span class="flex items-center gap-1.5 text-slate-200 font-medium">
            <span class="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span class="whitespace-nowrap text-[11px] sm:text-xs">{{ isRtl() ? 'مركز العمليات 24/7' : '24/7 Operations Desk' }}</span>
          </span>
        </div>

        <!-- Center: Active Corridor Status Pill (Desktop/Tablet) -->
        <div class="hidden md:flex items-center gap-2 px-3 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300 shadow-inner">
          <span class="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
          <span class="font-bold text-amber-400">SMNK EXPRESS LOOP:</span>
          <span class="text-slate-400">Sohar • Nhava Sheva • Mundra • Karachi • Sohar</span>
        </div>

        <div class="flex items-center gap-4">
          <a href="tel:+97142105105" class="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-semibold transition-colors whitespace-nowrap">
            <svg class="w-3.5 h-3.5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span>+971 4 210 51 05</span>
          </a>

          <!-- Language / RTL Toggle -->
          <button
            (click)="service.toggleRtl()"
            class="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold shadow-sm transition-all whitespace-nowrap cursor-pointer"
            [title]="isRtl() ? 'Switch to English' : 'التبديل إلى العربية (RTL)'">
            <svg class="w-3.5 h-3.5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
            <span>{{ isRtl() ? 'EN (LTR)' : 'عربي (RTL)' }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Main Navigation Bar (Modern Glassmorphic Floating Header) -->
    <header class="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-xl border-b border-white/10 shadow-lg text-white">
      <div class="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-2.5 sm:py-3 flex items-center justify-between gap-4 xl:gap-8">
        <!-- Maverick Brand Logo (Left) -->
        <div class="flex-shrink-0 flex items-center gap-3">
          <a href="#" class="flex items-center gap-2 group py-0.5">
            <div class="bg-white/95 px-2.5 py-1 rounded-xl shadow-md border border-white/40 flex items-center">
              <img 
                src="maverick-logo.svg" 
                alt="MAVERICK SHIPPING LLC" 
                class="h-10 sm:h-12 lg:h-14 w-auto object-contain group-hover:scale-[1.02] transition-transform duration-200" />
            </div>
          </a>
        </div>

        <!-- Desktop Navigation Links (Center, clean modern aesthetic like reference) -->
        <nav class="hidden lg:flex flex-1 items-center justify-center gap-6 xl:gap-8 text-xs xl:text-sm font-semibold text-slate-200">
          <a href="#" class="hover:text-amber-400 transition-colors py-1.5 px-1 whitespace-nowrap text-white font-bold">{{ isRtl() ? 'الرئيسية' : 'Home' }}</a>
          <a href="#services-section" class="hover:text-amber-400 transition-colors py-1.5 px-1 whitespace-nowrap flex items-center gap-1">
            <span>{{ isRtl() ? 'الخدمات' : 'Services' }}</span>
            <span class="text-[10px] text-slate-400">▾</span>
          </a>
          <a href="#tracking-engine" class="hover:text-amber-400 transition-colors py-1.5 px-1 flex items-center gap-1.5 whitespace-nowrap">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>{{ isRtl() ? 'تتبع الشحنة' : 'Track Your Shipment' }}</span>
          </a>
          <a href="#interactive-map-section" class="hover:text-amber-400 transition-colors py-1.5 px-1 whitespace-nowrap">{{ isRtl() ? 'خريطة المسار' : 'Trade Route' }}</a>
          <a href="#fleet-section" class="hover:text-amber-400 transition-colors py-1.5 px-1 whitespace-nowrap">{{ isRtl() ? 'الأسطول' : 'Fleet' }}</a>
          <a href="#agents-section" class="hover:text-amber-400 transition-colors py-1.5 px-1 whitespace-nowrap">{{ isRtl() ? 'اتصل بنا' : 'Contact' }}</a>
        </nav>

        <!-- Right Action Button & Mobile Menu Toggle (Right) -->
        <div class="flex-shrink-0 flex items-center gap-3">
          <!-- Corporate Maverick Red Pill CTA Button -->
          <button
            (click)="service.toggleBookingModal(true)"
            class="hidden sm:inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#df0003] hover:bg-[#b80002] text-white font-extrabold text-xs xl:text-sm shadow-lg shadow-red-500/25 transition-all hover:scale-105 cursor-pointer whitespace-nowrap">
            <span>{{ isRtl() ? 'طلب تسعيرة' : 'Get a Quote' }}</span>
          </button>

          <!-- Mobile Hamburger Toggle -->
          <button
            aria-label="Toggle Navigation Menu"
            (click)="mobileMenuOpen = !mobileMenuOpen"
            class="lg:hidden p-2 rounded-xl bg-slate-900/90 text-white hover:text-amber-400 border border-slate-800 cursor-pointer">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path *ngIf="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              <path *ngIf="mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Dropdown Menu -->
      <div *ngIf="mobileMenuOpen" class="lg:hidden bg-slate-950 border-b border-slate-800 px-5 py-4 space-y-3.5 shadow-2xl animate-fadeIn">
        <!-- Mobile Corridor Info Card -->
        <div class="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1">
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-bold uppercase text-amber-400 tracking-wider">SMNK Express Loop</span>
            <span class="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">Weekly Fixed Day</span>
          </div>
          <div class="text-xs font-bold text-white">Sohar • Nhava Sheva • Mundra • Karachi • Sohar</div>
        </div>

        <nav class="space-y-1 pt-1 text-sm font-semibold text-slate-200">
          <a (click)="mobileMenuOpen = false" href="#" class="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-900 hover:text-amber-400 transition-colors">
            <span>{{ isRtl() ? 'الرئيسية' : 'Home' }}</span>
            <span class="text-slate-500 text-xs">→</span>
          </a>
          <a (click)="mobileMenuOpen = false" href="#services-section" class="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-900 hover:text-amber-400 transition-colors">
            <span>{{ isRtl() ? 'الخدمات' : 'Services' }}</span>
            <span class="text-slate-500 text-xs">→</span>
          </a>
          <a (click)="mobileMenuOpen = false" href="#tracking-engine" class="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-900 hover:text-amber-400 transition-colors">
            <span class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{{ isRtl() ? 'تتبع الشحنة' : 'Track Your Shipment' }}</span>
            </span>
            <span class="text-slate-500 text-xs">→</span>
          </a>
          <a (click)="mobileMenuOpen = false" href="#interactive-map-section" class="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-900 hover:text-amber-400 transition-colors">
            <span>{{ isRtl() ? 'خريطة المسار' : 'Trade Route' }}</span>
            <span class="text-slate-500 text-xs">→</span>
          </a>
          <a (click)="mobileMenuOpen = false" href="#fleet-section" class="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-900 hover:text-amber-400 transition-colors">
            <span>{{ isRtl() ? 'الأسطول' : 'Fleet' }}</span>
            <span class="text-slate-500 text-xs">→</span>
          </a>
          <a (click)="mobileMenuOpen = false" href="#agents-section" class="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-900 hover:text-amber-400 transition-colors">
            <span>{{ isRtl() ? 'اتصل بنا' : 'Contact' }}</span>
            <span class="text-slate-500 text-xs">→</span>
          </a>
        </nav>

        <div class="pt-2 border-t border-slate-800 flex flex-col gap-2">
          <a href="tel:+97142105105" class="w-full py-2 px-3 rounded-lg bg-slate-900 text-slate-200 font-mono font-bold text-xs flex items-center justify-center gap-2 border border-slate-800">
            <span>📞</span>
            <span>+971 4 210 51 05 (24/7 Ops)</span>
          </a>
          <button
            (click)="service.toggleBookingModal(true); mobileMenuOpen = false"
            class="w-full py-2.5 rounded-full bg-[#df0003] hover:bg-[#b80002] text-white font-extrabold text-sm text-center shadow-lg shadow-red-500/20 cursor-pointer">
            {{ isRtl() ? 'طلب تسعيرة' : 'Get a Quote' }}
          </button>
        </div>
      </div>
    </header>
  `
})
export class HeaderComponent {
  service = inject(MaritimeService);
  isRtl = this.service.isRtl;
  mobileMenuOpen = false;
}
