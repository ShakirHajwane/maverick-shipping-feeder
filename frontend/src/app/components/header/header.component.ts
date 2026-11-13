import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaritimeService } from '../../services/maritime.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Top Utility Bar -->
    <div class="bg-slate-100 border-b border-slate-200 text-xs text-slate-600 py-1.5 px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
      <div class="w-full max-w-[1920px] mx-auto flex flex-wrap items-center justify-between gap-3">
        <div class="flex items-center gap-4">
          <span class="hidden sm:flex items-center gap-1.5 text-slate-500">
            <svg class="w-3.5 h-3.5 text-[#dd0103]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="whitespace-nowrap">{{ isRtl() ? 'ساعات العمل: الأحد - الخميس 08:00 - 18:00' : 'HQ Ops: Mon - Fri 08:00 - 18:00 (GMT+4)' }}</span>
          </span>
          <span class="hidden md:inline text-slate-300">|</span>
          <span class="flex items-center gap-1.5 text-[#02194b] font-medium">
            <span class="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span class="whitespace-nowrap text-[11px] sm:text-xs">{{ isRtl() ? 'مركز العمليات 24/7' : '24/7 Operations Desk' }}</span>
          </span>
        </div>

        <div class="flex items-center gap-4">
          <a href="tel:+97142105105" class="flex items-center gap-1.5 text-[#dd0103] hover:text-[#b50102] font-semibold transition-colors whitespace-nowrap">
            <svg class="w-3.5 h-3.5 text-[#dd0103]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span>+971 4 210 51 05</span>
          </a>

          <!-- Language / RTL Toggle -->
          <button
            (click)="service.toggleRtl()"
            class="flex items-center gap-1 px-2.5 py-0.5 rounded bg-white hover:bg-slate-50 text-slate-700 hover:text-[#02194b] border border-slate-300 text-xs font-semibold shadow-sm transition-all whitespace-nowrap cursor-pointer"
            [title]="isRtl() ? 'Switch to English' : 'التبديل إلى العربية (RTL)'">
            <svg class="w-3.5 h-3.5 text-[#dd0103]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
            <span>{{ isRtl() ? 'EN (LTR)' : 'عربي (RTL)' }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Main Navigation Bar -->
    <header class="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div class="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-3 flex items-center justify-between gap-4 xl:gap-8">
        <!-- Maverick Brand Logo (Left) -->
        <div class="flex-shrink-0">
          <a href="#" class="flex items-center gap-2 group py-0.5">
            <img 
              src="maverick-logo.svg" 
              alt="MAVERICK SHIPPING LLC" 
              class="h-10 sm:h-12 w-auto object-contain group-hover:scale-[1.02] transition-transform duration-200" />
          </a>
        </div>

        <!-- Desktop Navigation Links (Center, symmetrically distributed) -->
        <nav class="hidden lg:flex flex-1 items-center justify-center gap-5 xl:gap-7 2xl:gap-8 text-xs xl:text-sm font-semibold text-[#02194b]">
          <a href="#services-section" class="hover:text-[#dd0103] transition-colors py-1.5 px-1 whitespace-nowrap border-b-2 border-transparent hover:border-[#dd0103]">{{ isRtl() ? 'الخدمات والخطوط' : 'Services & Routes' }}</a>
          <a href="#interactive-map-section" class="hover:text-[#dd0103] transition-colors py-1.5 px-1 whitespace-nowrap border-b-2 border-transparent hover:border-[#dd0103]">{{ isRtl() ? 'خريطة الخطوط' : 'Trade Route Map' }}</a>
          <a href="#fleet-section" class="hover:text-[#dd0103] transition-colors py-1.5 px-1 whitespace-nowrap border-b-2 border-transparent hover:border-[#dd0103]">{{ isRtl() ? 'الأسطول البحري' : 'Fleet (Vessels)' }}</a>
          <a href="#tracking-engine" class="hover:text-[#dd0103] transition-colors py-1.5 px-1 flex items-center gap-1.5 whitespace-nowrap border-b-2 border-transparent hover:border-[#dd0103]">
            <span class="w-2 h-2 rounded-full bg-[#dd0103] animate-pulse"></span>
            <span>{{ isRtl() ? 'تتبع السفن' : 'Vessel Tracking' }}</span>
          </a>
          <a href="#sustainability-section" class="hover:text-[#dd0103] transition-colors py-1.5 px-1 whitespace-nowrap border-b-2 border-transparent hover:border-[#dd0103]">{{ isRtl() ? 'الاستدامة' : 'Sustainability' }}</a>
          <a href="#agents-section" class="hover:text-[#dd0103] transition-colors py-1.5 px-1 whitespace-nowrap border-b-2 border-transparent hover:border-[#dd0103]">{{ isRtl() ? 'المكاتب والوكلاء' : 'Offices & Agents' }}</a>
        </nav>

        <!-- Right Action Button & Mobile Menu Toggle (Right) -->
        <div class="flex-shrink-0 flex items-center gap-3">
          <button
            (click)="service.toggleBookingModal(true)"
            class="hidden sm:inline-flex items-center gap-2 px-4 xl:px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#dd0103] to-[#b50102] hover:from-[#ef2325] hover:to-[#dd0103] text-white font-bold text-xs xl:text-sm shadow-md shadow-red-600/25 transition-all hover:shadow-red-600/35 hover:-translate-y-0.5 cursor-pointer whitespace-nowrap">
            <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>{{ isRtl() ? 'طلب حجز / تسعيرة' : 'Request Booking' }}</span>
          </button>

          <!-- Mobile Hamburger Toggle -->
          <button
            (click)="mobileMenuOpen = !mobileMenuOpen"
            class="lg:hidden p-2 rounded-lg bg-slate-100 text-[#02194b] hover:text-[#dd0103] border border-slate-300">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path *ngIf="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              <path *ngIf="mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Dropdown Menu -->
      <div *ngIf="mobileMenuOpen" class="lg:hidden bg-white border-b border-slate-200 px-6 py-4 space-y-3 shadow-lg">
        <a (click)="mobileMenuOpen = false" href="#services-section" class="block text-[#02194b] hover:text-[#dd0103] py-1 font-semibold">{{ isRtl() ? 'الخدمات والخطوط' : 'Services & Routes' }}</a>
        <a (click)="mobileMenuOpen = false" href="#interactive-map-section" class="block text-[#02194b] hover:text-[#dd0103] py-1 font-semibold">{{ isRtl() ? 'خريطة الخطوط' : 'Trade Route Map' }}</a>
        <a (click)="mobileMenuOpen = false" href="#fleet-section" class="block text-[#02194b] hover:text-[#dd0103] py-1 font-semibold">{{ isRtl() ? 'الأسطول البحري' : 'Fleet (Vessels)' }}</a>
        <a (click)="mobileMenuOpen = false" href="#tracking-engine" class="block text-[#02194b] hover:text-[#dd0103] py-1 font-semibold">{{ isRtl() ? 'تتبع السفن' : 'Vessel Tracking' }}</a>
        <a (click)="mobileMenuOpen = false" href="#sustainability-section" class="block text-[#02194b] hover:text-[#dd0103] py-1 font-semibold">{{ isRtl() ? 'الاستدامة' : 'Sustainability' }}</a>
        <a (click)="mobileMenuOpen = false" href="#agents-section" class="block text-[#02194b] hover:text-[#dd0103] py-1 font-semibold">{{ isRtl() ? 'المكاتب والوكلاء' : 'Offices & Agents' }}</a>
        <button
          (click)="service.toggleBookingModal(true); mobileMenuOpen = false"
          class="w-full mt-2 py-2.5 rounded-lg bg-gradient-to-r from-[#dd0103] to-[#b50102] text-white font-bold text-sm text-center shadow-md shadow-red-600/25">
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
