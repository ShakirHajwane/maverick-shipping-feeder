import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaritimeService } from '../../services/maritime.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="bg-navy-950 text-slate-400 text-xs border-t border-navy-800 pt-16 pb-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-navy-800">
          
          <!-- Column 1: Brand & HQ (2 cols) -->
          <div class="lg:col-span-2 space-y-4">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-lg bg-gradient-to-br from-ocean-500 to-navy-800 flex items-center justify-center border border-ocean-400/40 text-white font-bold">
                <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
              </div>
              <span class="text-lg font-black text-white tracking-tight">GLOBAL FEEDERS</span>
            </div>

            <p class="text-xs text-slate-400 leading-relaxed max-w-sm">
              {{ isRtl()
                ? 'الناقل الإقليمي المستقل الرائد لربط الموانئ المحورية بشبكة تغذية مرنة عالية التردد عبر الشرق الأوسط وشبه القارة الهندية وجنوب شرق آسيا.'
                : 'Premier independent common feeder container operator delivering scheduled frequency, rapid turnarounds, and transshipment connectivity across Middle East, Red Sea, India, and Far East hubs.' }}
            </p>

            <div class="space-y-1.5 pt-2">
              <div class="flex items-center gap-2 text-slate-300">
                <span class="text-ocean-400 font-bold">Global HQ:</span>
                <span>JAFZA One Tower, Jebel Ali Free Zone, Dubai, UAE</span>
              </div>
              <div class="flex items-center gap-2 text-slate-300">
                <span class="text-ocean-400 font-bold">24/7 Duty Desk:</span>
                <a href="tel:+97142105105" class="hover:text-ocean-300 font-mono font-bold">+971 4 210 51 05</a>
              </div>
            </div>
          </div>

          <!-- Column 2: Feeder Corridors -->
          <div class="space-y-3">
            <h4 class="text-xs font-bold uppercase tracking-wider text-white">{{ isRtl() ? 'الخطوط الملاحية' : 'Feeder Corridors' }}</h4>
            <ul class="space-y-2 text-xs">
              <li><a href="#interactive-map-section" class="hover:text-ocean-400 transition-colors">JSA (Jebel Ali - Red Sea)</a></li>
              <li><a href="#interactive-map-section" class="hover:text-ocean-400 transition-colors">GALEX (Gulf Asia Express)</a></li>
              <li><a href="#interactive-map-section" class="hover:text-ocean-400 transition-colors">AES (Emirates Suez Feeder)</a></li>
              <li><a href="#interactive-map-section" class="hover:text-ocean-400 transition-colors">CCG (Central Coast & Gulf)</a></li>
              <li><a href="#interactive-map-section" class="hover:text-ocean-400 transition-colors">IMS (India ME Shuttle)</a></li>
              <li><a href="#interactive-map-section" class="hover:text-ocean-400 transition-colors">UAE-COASTAL (Emirates Feeder)</a></li>
            </ul>
          </div>

          <!-- Column 3: Tools & Services -->
          <div class="space-y-3">
            <h4 class="text-xs font-bold uppercase tracking-wider text-white">{{ isRtl() ? 'الأدوات والخدمات' : 'Online Portals' }}</h4>
            <ul class="space-y-2 text-xs">
              <li><a href="#tracking-engine" class="hover:text-ocean-400 transition-colors">Vessel AIS Tracking</a></li>
              <li><a href="#tracking-engine" class="hover:text-ocean-400 transition-colors">Point-to-Point Schedules</a></li>
              <li><a href="#fleet-section" class="hover:text-ocean-400 transition-colors">Technical Fleet Register</a></li>
              <li><a href="#sustainability-section" class="hover:text-ocean-400 transition-colors">Green Feeder Roadmap</a></li>
              <li><a href="#agents-section" class="hover:text-ocean-400 transition-colors">Port Agent Network</a></li>
              <li><button (click)="service.toggleBookingModal(true)" class="hover:text-ocean-400 transition-colors text-left cursor-pointer">Slot Rate Inquiries</button></li>
            </ul>
          </div>

          <!-- Column 4: Compliance & Memberships -->
          <div class="space-y-3">
            <h4 class="text-xs font-bold uppercase tracking-wider text-white">{{ isRtl() ? 'الاعتمادات والمعايير' : 'Quality & Standards' }}</h4>
            <div class="space-y-2">
              <div class="p-2.5 rounded-lg bg-navy-900 border border-navy-800">
                <span class="block font-bold text-white text-[11px]">BIMCO Member</span>
                <span class="text-[10px] text-slate-400">Certified Carrier Standing</span>
              </div>
              <div class="p-2.5 rounded-lg bg-navy-900 border border-navy-800">
                <span class="block font-bold text-white text-[11px]">ISO 9001 / 14001</span>
                <span class="text-[10px] text-slate-400">Integrated Marine Management</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Copyright & Disclaimers -->
        <div class="pt-8 flex flex-wrap items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            &copy; 2026 Global Feeders & DP World Shipping Alliance. All rights reserved.
          </div>
          <div class="flex items-center gap-6">
            <span>Terms of Carriage</span>
            <span>Standard Bill of Lading (B/L)</span>
            <span>Port State Control Safety</span>
            <span>Privacy Policy</span>
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
