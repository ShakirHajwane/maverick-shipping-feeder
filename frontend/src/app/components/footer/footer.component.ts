import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaritimeService } from '../../services/maritime.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="bg-slate-100 text-slate-600 text-xs border-t border-slate-200 pt-16 pb-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-200">
          
          <!-- Column 1: Brand & HQ (2 cols) -->
          <div class="lg:col-span-2 space-y-4">
            <div class="flex items-center gap-3">
              <img 
                src="maverick-logo.svg" 
                alt="MAVERICK SHIPPING LLC" 
                class="h-14 sm:h-16 w-auto object-contain" />
            </div>

            <p class="text-xs text-slate-600 leading-relaxed max-w-sm">
              {{ isRtl()
                ? 'مافريك للشحن البحري: الناقل الإقليمي الرائد لربط الموانئ المحورية بشبكة شحن وتغذية حاويات متطورة وعالية التردد.'
                : 'Maverick Shipping LLC: Premier container shipping and independent common feeder operator delivering scheduled frequency, rapid turnarounds, and transshipment connectivity across primary global maritime hubs.' }}
            </p>

            <div class="space-y-1.5 pt-2">
              <div class="flex items-center gap-2 text-slate-700">
                <span class="text-[#dd0103] font-bold">Global HQ:</span>
                <span>JAFZA One Tower, Jebel Ali Free Zone, Dubai, UAE</span>
              </div>
              <div class="flex items-center gap-2 text-slate-700">
                <span class="text-[#dd0103] font-bold">24/7 Duty Desk:</span>
                <a href="tel:+97142105105" class="hover:text-[#dd0103] font-mono font-bold transition-colors">+971 4 210 51 05</a>
              </div>
            </div>
          </div>

          <!-- Column 2: Feeder Corridors -->
          <div class="space-y-3">
            <h4 class="text-xs font-bold uppercase tracking-wider text-[#02194b]">{{ isRtl() ? 'الخطوط الملاحية' : 'Feeder Corridors' }}</h4>
            <ul class="space-y-2 text-xs">
              <li><a href="#interactive-map-section" class="hover:text-[#dd0103] transition-colors">JSA (Jebel Ali - Red Sea)</a></li>
              <li><a href="#interactive-map-section" class="hover:text-[#dd0103] transition-colors">GALEX (Gulf Asia Express)</a></li>
              <li><a href="#interactive-map-section" class="hover:text-[#dd0103] transition-colors">AES (Emirates Suez Feeder)</a></li>
              <li><a href="#interactive-map-section" class="hover:text-[#dd0103] transition-colors">CCG (Central Coast & Gulf)</a></li>
              <li><a href="#interactive-map-section" class="hover:text-[#dd0103] transition-colors">IMS (India ME Shuttle)</a></li>
              <li><a href="#interactive-map-section" class="hover:text-[#dd0103] transition-colors">UAE-COASTAL (Emirates Feeder)</a></li>
            </ul>
          </div>

          <!-- Column 3: Tools & Services -->
          <div class="space-y-3">
            <h4 class="text-xs font-bold uppercase tracking-wider text-[#02194b]">{{ isRtl() ? 'الأدوات والخدمات' : 'Online Portals' }}</h4>
            <ul class="space-y-2 text-xs">
              <li><a href="#tracking-engine" class="hover:text-[#dd0103] transition-colors">Vessel AIS Tracking</a></li>
              <li><a href="#tracking-engine" class="hover:text-[#dd0103] transition-colors">Point-to-Point Schedules</a></li>
              <li><a href="#fleet-section" class="hover:text-[#dd0103] transition-colors">Technical Fleet Register</a></li>
              <li><a href="#sustainability-section" class="hover:text-[#dd0103] transition-colors">Green Feeder Roadmap</a></li>
              <li><a href="#agents-section" class="hover:text-[#dd0103] transition-colors">Port Agent Network</a></li>
              <li><button (click)="service.toggleBookingModal(true)" class="hover:text-[#dd0103] transition-colors text-left cursor-pointer">Slot Rate Inquiries</button></li>
            </ul>
          </div>

          <!-- Column 4: Compliance & Memberships -->
          <div class="space-y-3">
            <h4 class="text-xs font-bold uppercase tracking-wider text-[#02194b]">{{ isRtl() ? 'الاعتمادات والمعايير' : 'Quality & Standards' }}</h4>
            <div class="space-y-2">
              <div class="p-2.5 rounded-lg bg-white border border-slate-200 shadow-sm">
                <span class="block font-bold text-[#02194b] text-[11px]">BIMCO Member</span>
                <span class="text-[10px] text-slate-500">Certified Carrier Standing</span>
              </div>
              <div class="p-2.5 rounded-lg bg-white border border-slate-200 shadow-sm">
                <span class="block font-bold text-[#02194b] text-[11px]">ISO 9001 / 14001</span>
                <span class="text-[10px] text-slate-500">Integrated Marine Management</span>
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
            <span class="hover:text-[#02194b] cursor-pointer">Terms of Carriage</span>
            <span class="hover:text-[#02194b] cursor-pointer">Standard Bill of Lading (B/L)</span>
            <span class="hover:text-[#02194b] cursor-pointer">Port State Control Safety</span>
            <span class="hover:text-[#02194b] cursor-pointer">Privacy Policy</span>
          </div>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {
  service = inject(MaritimeService);
  isRtl = this.service.isRtl;
}
