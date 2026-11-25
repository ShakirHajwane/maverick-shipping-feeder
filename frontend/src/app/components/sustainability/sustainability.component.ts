import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaritimeService } from '../../services/maritime.service';

@Component({
  selector: 'app-sustainability',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-full bg-white text-[#02194b]">
      
      <!-- =========================================================
           TOP 3 CORE HIGHLIGHTS STRIP (WHITE SECTION TRANSITION)
           ========================================================= -->
      <section class="py-12 sm:py-16 bg-white border-b border-slate-100">
        <div class="max-w-7xl mx-auto px-4 sm:px-8">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <!-- Card 1: Dedicated Feeder Connectivity -->
            <div class="bg-white rounded-3xl border border-slate-200/90 shadow-md hover:shadow-xl hover:border-[#dd0103]/40 transition-all duration-300 overflow-hidden group flex flex-col justify-between">
              <div class="p-6 sm:p-7 space-y-4">
                <div class="flex items-center justify-between gap-2">
                  <div class="w-14 h-14 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center p-3 group-hover:scale-105 transition-transform">
                    <img src="images/demo/icon-cargo-1.svg" alt="Ocean Feeder Carrier" class="w-full h-full object-contain" />
                  </div>
                  <span class="text-[10px] font-mono font-bold uppercase tracking-wider text-[#dd0103] bg-red-50 px-3 py-1 rounded-full border border-red-200/70">
                    {{ isRtl() ? 'إبحار أسبوعي ثابت' : 'Weekly Fixed Day' }}
                  </span>
                </div>
                <div>
                  <h3 class="text-base sm:text-lg font-black text-[#02194b] tracking-tight group-hover:text-[#dd0103] transition-colors">
                    {{ isRtl() ? 'خدمة تغذية الحاويات الإقليمية' : 'Regional Feeder Connectivity' }}
                  </h3>
                  <p class="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                    {{ isRtl()
                      ? 'ربط مجدول ومنتظم يربط موانئ الخليج العربي الرئيسية وباكستان والهند بجداول إبحار دقيقة وموثوقة.'
                      : 'Dedicated scheduled container feeder service connecting key regional ports across the Arabian Gulf, Pakistan, and India.' }}
                  </p>
                </div>
              </div>
              <div class="px-6 sm:px-7 py-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
                <span class="text-slate-500 font-semibold">{{ isRtl() ? 'مسار الدوران' : 'Corridor Rotation' }}</span>
                <span class="font-bold text-[#02194b]">{{ isRtl() ? 'دورة 11 يوماً' : '11-Day Loop' }}</span>
              </div>
            </div>

            <!-- Card 2: Liner Slot Solutions -->
            <div class="bg-white rounded-3xl border border-slate-200/90 shadow-md hover:shadow-xl hover:border-[#dd0103]/40 transition-all duration-300 overflow-hidden group flex flex-col justify-between">
              <div class="p-6 sm:p-7 space-y-4">
                <div class="flex items-center justify-between gap-2">
                  <div class="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center p-3 group-hover:scale-105 transition-transform">
                    <img src="images/demo/icon-cargo-2.svg" alt="Liner Slot Solutions" class="w-full h-full object-contain" />
                  </div>
                  <span class="text-[10px] font-mono font-bold uppercase tracking-wider text-[#02194b] bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                    {{ isRtl() ? 'سعة مرنة' : 'Flexible Capacity' }}
                  </span>
                </div>
                <div>
                  <h3 class="text-base sm:text-lg font-black text-[#02194b] tracking-tight group-hover:text-[#dd0103] transition-colors">
                    {{ isRtl() ? 'حلول المساحات والخطوط الملاحية' : 'Liner Slot & Cargo Solutions' }}
                  </h3>
                  <p class="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                    {{ isRtl()
                      ? 'اتفاقيات مساحات مرنة وحلول نقل فعالة تدعم خطوط الشحن العالمية ومشغلي NVOCC ووكلاء الشحن.'
                      : 'Dependable slot agreements and feeder transportation for mainline carriers, NVOCCs, and freight forwarders.' }}
                  </p>
                </div>
              </div>
              <div class="px-6 sm:px-7 py-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
                <span class="text-slate-500 font-semibold">{{ isRtl() ? 'أولوية الرسو' : 'Berthing Priority' }}</span>
                <span class="font-bold text-emerald-700">{{ isRtl() ? 'نوافذ مضمونة' : 'Guaranteed Windows' }}</span>
              </div>
            </div>

            <!-- Card 3: Strategic Port Coverage -->
            <div class="bg-white rounded-3xl border border-slate-200/90 shadow-md hover:shadow-xl hover:border-[#dd0103]/40 transition-all duration-300 overflow-hidden group flex flex-col justify-between">
              <div class="p-6 sm:p-7 space-y-4">
                <div class="flex items-center justify-between gap-2">
                  <div class="w-14 h-14 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center p-3 group-hover:scale-105 transition-transform">
                    <img src="images/demo/icon-cargo-3.svg" alt="Strategic Ports" class="w-full h-full object-contain" />
                  </div>
                  <span class="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/70">
                    {{ isRtl() ? '4 بوابات رئيسية' : '4 Core Gateways' }}
                  </span>
                </div>
                <div>
                  <h3 class="text-base sm:text-lg font-black text-[#02194b] tracking-tight group-hover:text-[#dd0103] transition-colors">
                    {{ isRtl() ? 'تغطية الموانئ الاستراتيجية' : 'Strategic Port Coverage' }}
                  </h3>
                  <p class="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                    {{ isRtl()
                      ? 'اتصال مباشر بموانئ صحار ونهافا شيفا وموندرا وكراتشي، مع تسريع إجراءات المناولة والتخليص.'
                      : 'Direct port calls at Sohar (Oman), Nhava Sheva & Mundra (India), and Karachi (Pakistan) with rapid turnaround.' }}
                  </p>
                </div>
              </div>
              <div class="px-6 sm:px-7 py-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
                <span class="text-slate-500 font-semibold">{{ isRtl() ? 'نطاق الشبكة' : 'Network Reach' }}</span>
                <span class="font-bold text-[#dd0103]">{{ isRtl() ? 'الخليج وشبه القارة' : 'Gulf & Subcontinent' }}</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      <!-- =========================================================
           1. ABOUT MAVERICK SHIPPING LLC
           ========================================================= -->
      <section id="about-section" class="py-16 sm:py-24 relative overflow-hidden bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            <!-- Left Column: Overlapping Photos & Experience Badge (5 cols) -->
            <div class="lg:col-span-5 relative px-2 sm:px-4">
              <div class="relative mx-auto max-w-md lg:max-w-none">
                <!-- Main Primary Photo -->
                <div class="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100 aspect-4/3 sm:aspect-5/4">
                  <img 
                    src="images/demo/transportation-img-1.jpg" 
                    alt="Maverick Shipping Container Transport" 
                    loading="lazy"
                    decoding="async"
                    class="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                  <div class="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent pointer-events-none"></div>
                </div>

                <!-- Overlapping Secondary Photo -->
                <div class="absolute -bottom-6 -end-2 sm:-end-5 w-1/2 rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100 hidden sm:block aspect-4/3">
                  <img 
                    src="images/demo/transportation-img-2.jpg" 
                    alt="Maritime Logistics Operations" 
                    loading="lazy"
                    decoding="async"
                    class="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                </div>

                <!-- Floating Corporate Trust Badge -->
                <div class="absolute -top-5 -start-2 sm:-start-5 bg-[#02194b] text-white p-4 sm:p-5 rounded-2xl shadow-2xl border border-white/15 z-20 max-w-[220px]">
                  <div class="flex items-center gap-2 mb-1">
                    <span class="w-2.5 h-2.5 rounded-full bg-[#dd0103] animate-pulse"></span>
                    <span class="text-[10px] font-mono uppercase tracking-wider text-red-300 font-bold">
                      {{ isRtl() ? 'ناقل إقليمي' : 'REGIONAL CARRIER' }}
                    </span>
                  </div>
                  <div class="text-xs sm:text-sm font-black leading-snug">
                    {{ isRtl() ? 'خدمة تغذية مخصصة' : 'Dedicated Feeder Shipping Service' }}
                  </div>
                  <div class="text-[10px] text-emerald-300 mt-1 font-mono font-bold">
                    {{ isRtl() ? 'موثوقية مواعيد 99.4%' : '99.4% On-Time Reliability' }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Right Column: Corporate Narrative, Rotation Box & 6 Priorities (7 cols) -->
            <div class="lg:col-span-7 space-y-6">
              
              <!-- Eyebrow Pill -->
              <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-200/80 text-[#dd0103] text-xs font-bold font-mono uppercase tracking-wider">
                <span class="w-2 h-2 rounded-full bg-[#dd0103] animate-pulse"></span>
                <span>{{ isRtl() ? 'عن مافريك للشحن البحري' : 'ABOUT MAVERICK SHIPPING LLC' }}</span>
              </div>

              <!-- Main Heading -->
              <h2 class="text-3xl sm:text-4xl lg:text-5xl font-black text-[#02194b] tracking-tight leading-[1.15]">
                <span>{{ isRtl() ? 'شريكك الموثوق في النقل الملاحي' : 'Your Trusted Partner in' }}</span><br>
                <span class="text-[#dd0103]">{{ isRtl() ? 'والخطوط المغذية الإقليمية' : 'Regional Feeder Shipping' }}</span>
              </h2>

              <!-- Lead Description -->
              <p class="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                {{ isRtl() 
                  ? 'مافريك للشحن ش.ذ.م.م هي شركة شحن إقليمية صاعدة تأسست برؤية واضحة لتقديم خدمات تغذية حاويات موثوقة وعالية الكفاءة وتنافسية تجارياً. ينصب تركيزنا على تعزيز الربط البحري بين الموانئ الإقليمية الرئيسية، ودعم خطوط الشحن العالمية، وتزويد العملاء بحلول نقل مرنة ومبتكرة للبضائع.'
                  : 'Maverick Shipping LLC is an emerging regional shipping company established with a vision to provide dependable, efficient and commercially competitive container feeder services. Our focus is to strengthen maritime connectivity between major regional ports, support international shipping lines and provide customers with flexible cargo transportation solutions.' }}
              </p>

              <!-- Rotation Highlights Box -->
              <div class="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 shadow-sm space-y-3">
                <div class="flex flex-wrap items-center justify-between gap-2">
                  <span class="text-xs font-bold uppercase tracking-wider text-[#02194b] font-mono flex items-center gap-2">
                    <svg class="w-4 h-4 text-[#dd0103]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>{{ isRtl() ? 'مسار الدوران الأولي' : 'INITIAL SERVICE ROTATION' }}</span>
                  </span>
                  <span class="text-[10.5px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    {{ isRtl() ? 'دوران أسبوعي' : 'Weekly Rotation' }}
                  </span>
                </div>
                <div class="flex flex-wrap items-center gap-2 pt-1 text-xs">
                  <span class="px-3 py-1.5 rounded-xl bg-white border border-slate-200 font-bold text-[#02194b] shadow-xs">Sohar (Oman)</span>
                  <span class="text-[#dd0103] font-bold rtl:rotate-180">→</span>
                  <span class="px-3 py-1.5 rounded-xl bg-white border border-slate-200 font-bold text-[#02194b] shadow-xs">Nhava Sheva (India)</span>
                  <span class="text-[#dd0103] font-bold rtl:rotate-180">→</span>
                  <span class="px-3 py-1.5 rounded-xl bg-white border border-slate-200 font-bold text-[#02194b] shadow-xs">Mundra (India)</span>
                  <span class="text-[#dd0103] font-bold rtl:rotate-180">→</span>
                  <span class="px-3 py-1.5 rounded-xl bg-white border border-slate-200 font-bold text-[#02194b] shadow-xs">Karachi (Pakistan)</span>
                  <span class="text-[#dd0103] font-bold rtl:rotate-180">→</span>
                  <span class="px-3 py-1.5 rounded-xl bg-white border border-slate-200 font-bold text-[#02194b] shadow-xs">Sohar</span>
                </div>
              </div>

              <!-- Priorities Grid -->
              <div class="space-y-3 pt-2">
                <div class="text-xs font-mono font-bold uppercase tracking-wider text-[#02194b] pb-1.5 border-b border-slate-200">
                  {{ isRtl() ? 'أولوياتنا التشغيلية والتجارية' : 'OUR PRIORITIES & COMMITMENTS' }}
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  
                  <!-- Priority 1 -->
                  <div class="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-xs hover:border-[#dd0103]/30 transition-colors">
                    <span class="w-6 h-6 rounded-lg bg-red-50 text-[#dd0103] font-mono text-xs font-black flex items-center justify-center shrink-0">01</span>
                    <div>
                      <h4 class="text-xs sm:text-sm font-bold text-[#02194b]">{{ isRtl() ? 'التميز التشغيلي' : 'Operational Excellence' }}</h4>
                      <p class="text-[11px] text-slate-500 mt-0.5">{{ isRtl() ? 'أعلى معايير إدارة الرحلات والمناولة السريعة للبضائع.' : 'Highest maritime standards across voyage execution and rapid turnaround.' }}</p>
                    </div>
                  </div>

                  <!-- Priority 2 -->
                  <div class="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-xs hover:border-[#dd0103]/30 transition-colors">
                    <span class="w-6 h-6 rounded-lg bg-red-50 text-[#dd0103] font-mono text-xs font-black flex items-center justify-center shrink-0">02</span>
                    <div>
                      <h4 class="text-xs sm:text-sm font-bold text-[#02194b]">{{ isRtl() ? 'عمليات سفن موثوقة' : 'Reliable Vessel Operations' }}</h4>
                      <p class="text-[11px] text-slate-500 mt-0.5">{{ isRtl() ? 'دقة متناهية في مواعيد الإبحار وجداول الرسو الثابتة.' : 'Rigorous adherence to fixed-day sailing schedules and berth windows.' }}</p>
                    </div>
                  </div>

                  <!-- Priority 3 -->
                  <div class="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-xs hover:border-[#dd0103]/30 transition-colors">
                    <span class="w-6 h-6 rounded-lg bg-red-50 text-[#dd0103] font-mono text-xs font-black flex items-center justify-center shrink-0">03</span>
                    <div>
                      <h4 class="text-xs sm:text-sm font-bold text-[#02194b]">{{ isRtl() ? 'شراكات قوية مع الموانئ والوكلاء' : 'Strong Port & Agency Partnerships' }}</h4>
                      <p class="text-[11px] text-slate-500 mt-0.5">{{ isRtl() ? 'تعاون وثيق مع مشغلي المحطات لضمان الأولوية التشغيلية.' : 'Deep operational coordination with terminal operators across Oman, India, and Pakistan.' }}</p>
                    </div>
                  </div>

                  <!-- Priority 4 -->
                  <div class="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-xs hover:border-[#dd0103]/30 transition-colors">
                    <span class="w-6 h-6 rounded-lg bg-red-50 text-[#dd0103] font-mono text-xs font-black flex items-center justify-center shrink-0">04</span>
                    <div>
                      <h4 class="text-xs sm:text-sm font-bold text-[#02194b]">{{ isRtl() ? 'تواصل شفاف مع العملاء' : 'Transparent Customer Communication' }}</h4>
                      <p class="text-[11px] text-slate-500 mt-0.5">{{ isRtl() ? 'متابعة لحظية وتحديثات استباقية لمواقع الحاويات.' : 'Real-time cargo status reporting and proactive customer coordination.' }}</p>
                    </div>
                  </div>

                  <!-- Priority 5 -->
                  <div class="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-xs hover:border-[#dd0103]/30 transition-colors">
                    <span class="w-6 h-6 rounded-lg bg-red-50 text-[#dd0103] font-mono text-xs font-black flex items-center justify-center shrink-0">05</span>
                    <div>
                      <h4 class="text-xs sm:text-sm font-bold text-[#02194b]">{{ isRtl() ? 'علاقات طويلة الأمد مع الشركاء' : 'Long-Term Relationships with Shipping Partners' }}</h4>
                      <p class="text-[11px] text-slate-500 mt-0.5">{{ isRtl() ? 'بناء شراكات مستدامة تدعم مصالح خطوط الشحن والوكلاء.' : 'Enduring commercial trust with mainline carriers, NVOCCs, and forwarders.' }}</p>
                    </div>
                  </div>

                  <!-- Priority 6 -->
                  <div class="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-xs hover:border-[#dd0103]/30 transition-colors">
                    <span class="w-6 h-6 rounded-lg bg-red-50 text-[#dd0103] font-mono text-xs font-black flex items-center justify-center shrink-0">06</span>
                    <div>
                      <h4 class="text-xs sm:text-sm font-bold text-[#02194b]">{{ isRtl() ? 'نمو تجاري مستدام' : 'Sustainable Business Growth' }}</h4>
                      <p class="text-[11px] text-slate-500 mt-0.5">{{ isRtl() ? 'تطوير مستمر لشبكة النقل البحري وكفاءة استهلاك الطاقة.' : 'Forward-looking operational efficiency and responsible regional expansion.' }}</p>
                    </div>
                  </div>

                </div>
              </div>

              <!-- Action Row -->
              <div class="pt-4 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  (click)="service.toggleBookingModal(true)"
                  class="px-7 py-3.5 rounded-full bg-[#dd0103] hover:bg-[#b50102] text-white font-extrabold text-xs sm:text-sm tracking-wide shadow-lg shadow-red-600/25 hover:scale-[1.03] active:scale-95 transition-all cursor-pointer">
                  {{ isRtl() ? 'طلب تسعيرة تجارية' : 'Request Commercial Booking' }}
                </button>
                <a
                  href="tel:+97142105105"
                  class="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#02194b] hover:text-[#dd0103] transition-colors py-2 px-3">
                  <svg class="w-4 h-4 text-[#dd0103]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span dir="ltr">+971 4 210 51 05 (HQ Desk)</span>
                </a>
              </div>

            </div>

          </div>
        </div>
      </section>

      <!-- =========================================================
           2. EXPLORE OUR SERVICES
           ========================================================= -->
      <section id="services-section" class="py-16 sm:py-24 bg-slate-50 border-y border-slate-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
          
          <!-- Section Heading -->
          <div class="text-center max-w-3xl mx-auto space-y-3">
            <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-200 text-[#dd0103] text-xs font-mono uppercase font-bold tracking-wider">
              <span class="w-2 h-2 rounded-full bg-[#dd0103] animate-pulse"></span>
              <span>{{ isRtl() ? 'الخدمات الملاحية الأساسية' : 'CORE REGIONAL SOLUTIONS' }}</span>
            </div>
            <h2 class="text-3xl sm:text-4xl lg:text-5xl font-black text-[#02194b] tracking-tight">
              <span>{{ isRtl() ? 'استكشف ' : 'Explore Our ' }}</span><span class="text-[#dd0103]">{{ isRtl() ? 'خدماتنا الملاحية' : 'Feeder & Freight Services' }}</span>
            </h2>
            <p class="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
              {{ isRtl()
                ? 'حلول تغذية حاويات موثوقة وعالية الكفاءة ومصممة خصيصاً لربط موانئ الخليج العربي وشبه القارة الهندية.'
                : 'Delivering dependable, efficient, and customer-focused container transportation across the Arabian Gulf, Pakistan, and India.' }}
            </p>
          </div>

          <!-- 3 Service Cards Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            
            <!-- Service Card 1: Regional Container Feeder Services -->
            <div class="bg-white rounded-3xl border border-slate-200/90 shadow-md hover:shadow-xl hover:border-[#dd0103]/40 transition-all duration-300 overflow-hidden group flex flex-col justify-between">
              <div>
                <div class="relative h-56 w-full overflow-hidden bg-slate-100">
                  <img 
                    src="images/demo/service-1.jpg" 
                    alt="Regional Container Feeder Services" 
                    loading="lazy"
                    decoding="async"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div class="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent pointer-events-none"></div>
                  <div class="absolute top-4 start-4 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-mono font-bold text-[#02194b] border border-slate-200 shadow-sm">
                    {{ isRtl() ? 'ناقل تغذية' : 'FEEDER CARRIER' }}
                  </div>
                </div>

                <div class="p-6 sm:p-7 space-y-3">
                  <div class="text-[11px] font-mono font-bold text-[#dd0103]">
                    Sohar ⇄ Nhava Sheva ⇄ Mundra ⇄ Karachi
                  </div>
                  <h3 class="text-lg sm:text-xl font-black text-[#02194b] group-hover:text-[#dd0103] transition-colors leading-tight">
                    {{ isRtl() ? 'خدمات تغذية الحاويات الإقليمية' : 'Regional Container Feeder Services' }}
                  </h3>
                  <p class="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    {{ isRtl()
                      ? 'خدمة مجدولة ومنتظمة تربط الموانئ الإقليمية الرئيسية بدقة مواعيد عالية، وتوفر سرعة فائقة في نقل الحاويات بين الموانئ.'
                      : 'Dedicated scheduled feeder connectivity linking major regional trade markets with schedule reliability, high-efficiency cargo movement, and seamless port-to-port connections.' }}
                  </p>
                </div>
              </div>

              <div class="px-6 sm:px-7 py-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between">
                <span class="text-xs font-mono font-bold text-slate-500">{{ isRtl() ? 'أسبوعي ثابت' : 'Weekly Fixed Day' }}</span>
                <button
                  type="button"
                  (click)="service.toggleBookingModal(true)"
                  class="inline-flex items-center gap-1.5 text-xs font-bold text-[#dd0103] group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform cursor-pointer">
                  <span>{{ isRtl() ? 'طلب حجز مساحة' : 'Request Booking' }}</span>
                  <span class="rtl:rotate-180">→</span>
                </button>
              </div>
            </div>

            <!-- Service Card 2: Liner Slot Solutions -->
            <div class="bg-white rounded-3xl border border-slate-200/90 shadow-md hover:shadow-xl hover:border-[#dd0103]/40 transition-all duration-300 overflow-hidden group flex flex-col justify-between">
              <div>
                <div class="relative h-56 w-full overflow-hidden bg-slate-100">
                  <img 
                    src="images/demo/service-2.jpg" 
                    alt="Liner Slot Solutions" 
                    loading="lazy"
                    decoding="async"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div class="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent pointer-events-none"></div>
                  <div class="absolute top-4 start-4 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-mono font-bold text-[#02194b] border border-slate-200 shadow-sm">
                    {{ isRtl() ? 'حلول الخطوط' : 'LINER SOLUTIONS' }}
                  </div>
                </div>

                <div class="p-6 sm:p-7 space-y-3">
                  <div class="text-[11px] font-mono font-bold text-[#02194b]">
                    Mainline Carriers &amp; NVOCC Operators
                  </div>
                  <h3 class="text-lg sm:text-xl font-black text-[#02194b] group-hover:text-[#dd0103] transition-colors leading-tight">
                    {{ isRtl() ? 'حلول المساحات وحركة البضائع بين الموانئ' : 'Liner Slot & Port-to-Port Solutions' }}
                  </h3>
                  <p class="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    {{ isRtl()
                      ? 'توفير مساحات موثوقة وسعة نقل مرنة لخطوط الشحن العالمية ووكلات الشحن، مع التزام تام بنوافذ الرسو السريع في المحطات.'
                      : 'Flexible slot agreements and dependable feeder transportation for mainline carriers, freight forwarders, and NVOCCs with priority berthing and quick turnaround.' }}
                  </p>
                </div>
              </div>

              <div class="px-6 sm:px-7 py-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between">
                <span class="text-xs font-mono font-bold text-slate-500">{{ isRtl() ? 'أولوية الرسو' : 'Berth Priority' }}</span>
                <button
                  type="button"
                  (click)="service.toggleBookingModal(true)"
                  class="inline-flex items-center gap-1.5 text-xs font-bold text-[#dd0103] group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform cursor-pointer">
                  <span>{{ isRtl() ? 'طلب سعة مساحة' : 'Book Capacity' }}</span>
                  <span class="rtl:rotate-180">→</span>
                </button>
              </div>
            </div>

            <!-- Service Card 3: Agency Support & Commercial Desk -->
            <div class="bg-white rounded-3xl border border-slate-200/90 shadow-md hover:shadow-xl hover:border-[#dd0103]/40 transition-all duration-300 overflow-hidden group flex flex-col justify-between">
              <div>
                <div class="relative h-56 w-full overflow-hidden bg-slate-100">
                  <img 
                    src="images/demo/service-3.jpg" 
                    alt="Agency Support & Commercial Partnerships" 
                    loading="lazy"
                    decoding="async"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div class="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent pointer-events-none"></div>
                  <div class="absolute top-4 start-4 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-mono font-bold text-[#02194b] border border-slate-200 shadow-sm">
                    {{ isRtl() ? 'شراكات تجارية' : 'COMMERCIAL ALLIANCE' }}
                  </div>
                </div>

                <div class="p-6 sm:p-7 space-y-3">
                  <div class="text-[11px] font-mono font-bold text-emerald-700">
                    24/7 Operations Desk Support
                  </div>
                  <h3 class="text-lg sm:text-xl font-black text-[#02194b] group-hover:text-[#dd0103] transition-colors leading-tight">
                    {{ isRtl() ? 'الدعم التجاري والشراكات مع الوكلاء' : 'Agency Partnerships & Dedicated Support' }}
                  </h3>
                  <p class="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    {{ isRtl()
                      ? 'فريق دعم تجاري وتشغيلي مخصص يقدم استجابة فورية، وتواصلاً شفافاً، ومتابعة دقيقة للشحنات، وبناء علاقات استراتيجية متينة.'
                      : 'Dedicated operational and commercial support desks offering 24/7 responsiveness, transparent cargo coordination, and long-term maritime alliances.' }}
                  </p>
                </div>
              </div>

              <div class="px-6 sm:px-7 py-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between">
                <span class="text-xs font-mono font-bold text-slate-500">{{ isRtl() ? 'دعم ٢٤/٧' : '24/7 Desk SLA' }}</span>
                <button
                  type="button"
                  (click)="service.toggleBookingModal(true)"
                  class="inline-flex items-center gap-1.5 text-xs font-bold text-[#dd0103] group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform cursor-pointer">
                  <span>{{ isRtl() ? 'تواصل مع المكتب' : 'Contact Desk' }}</span>
                  <span class="rtl:rotate-180">→</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      <!-- =========================================================
           3. STRATEGIC PORT COVERAGE
           ========================================================= -->
      <section id="ports-section" class="py-16 sm:py-24 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
          
          <!-- Section Header -->
          <div class="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 pb-5">
            <div>
              <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-200 text-[#dd0103] text-xs font-mono uppercase font-bold tracking-wider mb-2">
                <span class="w-2 h-2 rounded-full bg-[#dd0103]"></span>
                <span>{{ isRtl() ? 'تغطية الموانئ الإقليمية' : 'STRATEGIC PORT COVERAGE' }}</span>
              </div>
              <h2 class="text-2xl sm:text-4xl font-black text-[#02194b] tracking-tight">
                {{ isRtl() ? 'الموانئ المشمولة في مسار الخدمة' : 'Ports Covered Across Key Trade Markets' }}
              </h2>
            </div>
            <div class="text-xs font-mono text-slate-600 bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl">
              {{ isRtl() ? 'المسار:' : 'Corridor:' }} <span class="text-[#02194b] font-bold">Sohar ⇄ Nhava Sheva ⇄ Mundra ⇄ Karachi</span>
            </div>
          </div>

          <!-- 4 Port Cards Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <!-- Port 1: Sohar -->
            <div class="bg-white rounded-3xl border border-slate-200/90 shadow-md hover:shadow-xl hover:border-[#dd0103]/40 transition-all duration-300 overflow-hidden group flex flex-col justify-between">
              <div>
                <div class="relative h-48 w-full overflow-hidden bg-slate-100">
                  <img 
                    src="images/demo/cargo-shipment-bg-img-1.jpg" 
                    alt="Sohar Port Oman" 
                    loading="lazy"
                    decoding="async"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div class="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/20 to-transparent pointer-events-none"></div>
                  <div class="absolute top-3.5 end-3.5 px-2.5 py-0.5 rounded-full bg-[#02194b]/90 backdrop-blur-md text-white border border-white/20 text-[10px] font-mono font-bold">
                    OMSOH
                  </div>
                  <div class="absolute bottom-3 start-4 end-4 text-white">
                    <div class="text-lg font-black leading-tight">{{ isRtl() ? 'صحار، عُمان' : 'Sohar, Oman' }}</div>
                    <div class="text-[11px] text-slate-200 font-mono">{{ isRtl() ? 'بوابة الخليج العربي' : 'Gateway to Arabian Gulf' }}</div>
                  </div>
                </div>
                <div class="p-5 sm:p-6">
                  <p class="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    {{ isRtl()
                      ? 'البوابة الاستراتيجية إلى الخليج العربي مع أرصفة مياه عميقة ومعدلات مناولة سريعة للحاويات.'
                      : 'Strategic gateway to the Arabian Gulf with deep-water container berths and high-speed cargo throughput.' }}
                  </p>
                </div>
              </div>
              <div class="px-5 sm:px-6 py-4 bg-slate-50/70 border-t border-slate-100 text-[10.5px] font-mono font-bold text-[#dd0103] uppercase">
                Oman Int'l Container Terminal (OICT)
              </div>
            </div>

            <!-- Port 2: Nhava Sheva -->
            <div class="bg-white rounded-3xl border border-slate-200/90 shadow-md hover:shadow-xl hover:border-[#dd0103]/40 transition-all duration-300 overflow-hidden group flex flex-col justify-between">
              <div>
                <div class="relative h-48 w-full overflow-hidden bg-slate-100">
                  <img 
                    src="images/demo/cargo-shipment-bg-img-2.jpg" 
                    alt="Nhava Sheva Port India" 
                    loading="lazy"
                    decoding="async"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div class="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/20 to-transparent pointer-events-none"></div>
                  <div class="absolute top-3.5 end-3.5 px-2.5 py-0.5 rounded-full bg-[#02194b]/90 backdrop-blur-md text-white border border-white/20 text-[10px] font-mono font-bold">
                    INNSA
                  </div>
                  <div class="absolute bottom-3 start-4 end-4 text-white">
                    <div class="text-lg font-black leading-tight">{{ isRtl() ? 'نهافا شيفا، الهند' : 'Nhava Sheva, India' }}</div>
                    <div class="text-[11px] text-slate-200 font-mono">{{ isRtl() ? 'بوابة الساحل الغربي' : 'JNPT Gateway' }}</div>
                  </div>
                </div>
                <div class="p-5 sm:p-6">
                  <p class="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    {{ isRtl()
                      ? 'بوابة الحاويات الرئيسية للساحل الغربي للهند وتربط المناطق الصناعية الحيوية بشبكات الشحن الإقليمية.'
                      : "Major container gateway for India's western coast, connecting industrial hinterlands with regional feeder corridors." }}
                  </p>
                </div>
              </div>
              <div class="px-5 sm:px-6 py-4 bg-slate-50/70 border-t border-slate-100 text-[10.5px] font-mono font-bold text-[#dd0103] uppercase">
                Gateway Terminals India (GTI / BMCT)
              </div>
            </div>

            <!-- Port 3: Mundra -->
            <div class="bg-white rounded-3xl border border-slate-200/90 shadow-md hover:shadow-xl hover:border-[#dd0103]/40 transition-all duration-300 overflow-hidden group flex flex-col justify-between">
              <div>
                <div class="relative h-48 w-full overflow-hidden bg-slate-100">
                  <img 
                    src="images/demo/cargo-shipment-bg-img-3.jpg" 
                    alt="Mundra Port India" 
                    loading="lazy"
                    decoding="async"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div class="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/20 to-transparent pointer-events-none"></div>
                  <div class="absolute top-3.5 end-3.5 px-2.5 py-0.5 rounded-full bg-[#02194b]/90 backdrop-blur-md text-white border border-white/20 text-[10px] font-mono font-bold">
                    INMUN
                  </div>
                  <div class="absolute bottom-3 start-4 end-4 text-white">
                    <div class="text-lg font-black leading-tight">{{ isRtl() ? 'موندرا، الهند' : 'Mundra, India' }}</div>
                    <div class="text-[11px] text-slate-200 font-mono">{{ isRtl() ? 'مركز تجاري للحاويات' : 'Commercial Container Hub' }}</div>
                  </div>
                </div>
                <div class="p-5 sm:p-6">
                  <p class="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    {{ isRtl()
                      ? 'مركز تجاري وبحري هام للحاويات مع ربط سككي مباشر ومعدلات دوران سريعة للحاويات.'
                      : 'Important commercial and container hub offering rapid turnaround speeds and direct rail-to-vessel intermodal links.' }}
                  </p>
                </div>
              </div>
              <div class="px-5 sm:px-6 py-4 bg-slate-50/70 border-t border-slate-100 text-[10.5px] font-mono font-bold text-[#dd0103] uppercase">
                Mundra Container Terminals (MICT)
              </div>
            </div>

            <!-- Port 4: Karachi -->
            <div class="bg-white rounded-3xl border border-slate-200/90 shadow-md hover:shadow-xl hover:border-[#dd0103]/40 transition-all duration-300 overflow-hidden group flex flex-col justify-between">
              <div>
                <div class="relative h-48 w-full overflow-hidden bg-slate-100">
                  <img 
                    src="images/demo/project-3.jpg" 
                    alt="Karachi Port Pakistan" 
                    loading="lazy"
                    decoding="async"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div class="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/20 to-transparent pointer-events-none"></div>
                  <div class="absolute top-3.5 end-3.5 px-2.5 py-0.5 rounded-full bg-[#02194b]/90 backdrop-blur-md text-white border border-white/20 text-[10px] font-mono font-bold">
                    PKKHI
                  </div>
                  <div class="absolute bottom-3 start-4 end-4 text-white">
                    <div class="text-lg font-black leading-tight">{{ isRtl() ? 'كراتشي، باكستان' : 'Karachi, Pakistan' }}</div>
                    <div class="text-[11px] text-slate-200 font-mono">{{ isRtl() ? 'بوابة التجارة الدولية' : 'International Trade Gateway' }}</div>
                  </div>
                </div>
                <div class="p-5 sm:p-6">
                  <p class="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    {{ isRtl()
                      ? 'البوابة الرئيسية للتجارة الدولية لباكستان مع كفاءة جمركية عالية وجداول رحلات ثابتة.'
                      : "Key gateway for Pakistan's international trade, ensuring smooth customs clearances and reliable scheduled rotations." }}
                  </p>
                </div>
              </div>
              <div class="px-5 sm:px-6 py-4 bg-slate-50/70 border-t border-slate-100 text-[10.5px] font-mono font-bold text-[#dd0103] uppercase">
                South Asia Pakistan Terminals (SAPT)
              </div>
            </div>

          </div>
        </div>
      </section>

      <!-- =========================================================
           4. WHY CHOOSE MAVERICK SHIPPING?
           ========================================================= -->
      <section id="why-us-section" class="py-16 sm:py-24 bg-slate-50 border-y border-slate-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
          
          <!-- Section Heading -->
          <div class="text-center max-w-3xl mx-auto space-y-3">
            <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-200 text-[#dd0103] text-xs font-mono uppercase font-bold tracking-wider">
              <span class="w-2 h-2 rounded-full bg-[#dd0103] animate-pulse"></span>
              <span>{{ isRtl() ? 'المزايا التنافسية' : 'COMPETITIVE ADVANTAGE' }}</span>
            </div>
            <h2 class="text-3xl sm:text-4xl lg:text-5xl font-black text-[#02194b] tracking-tight">
              <span>{{ isRtl() ? 'لماذا تختار ' : 'Why Choose ' }}</span><span class="text-[#dd0103]">Maverick Shipping{{ isRtl() ? '؟' : '?' }}</span>
            </h2>
            <p class="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
              {{ isRtl()
                ? 'نقدم مزيجاً متكاملاً من التغطية الجغرافية الاستراتيجية والموثوقية العالية والالتزام التجاري لدعم حركة بضائعك.'
                : 'A strategic combination of regional geographic coverage, schedule reliability, and dedicated customer commitment.' }}
            </p>
          </div>

          <!-- 6 Grid Cards -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            
            <!-- Card 1: Strategic Connectivity -->
            <div class="bg-white rounded-3xl border border-slate-200/90 shadow-md hover:shadow-xl hover:border-[#dd0103]/40 transition-all duration-300 overflow-hidden group flex flex-col justify-between">
              <div>
                <div class="relative h-48 w-full overflow-hidden bg-slate-100">
                  <img 
                    src="images/demo/service-1.jpg" 
                    alt="Strategic Connectivity" 
                    loading="lazy"
                    decoding="async"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div class="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent pointer-events-none"></div>
                  <div class="absolute bottom-3 start-4 end-4 text-white font-extrabold text-base">
                    {{ isRtl() ? 'الربط الاستراتيجي' : 'Strategic Connectivity' }}
                  </div>
                </div>
                <div class="p-6">
                  <p class="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    {{ isRtl() 
                      ? 'ربط مباشر وسلس بين أهم وجهات ومراكز التجارة الإقليمية عبر صحار ونهافا شيفا وموندرا وكراتشي.' 
                      : 'Connecting important regional trade destinations across Sohar, Nhava Sheva, Mundra, and Karachi.' }}
                  </p>
                </div>
              </div>
              <div class="px-6 py-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
                <span class="text-slate-500">{{ isRtl() ? 'البوابات الإقليمية' : 'Regional Gateway' }}</span>
                <span class="font-bold text-[#dd0103]">{{ isRtl() ? '4 موانئ رئيسية' : '4 Primary Hubs' }}</span>
              </div>
            </div>

            <!-- Card 2: Reliability -->
            <div class="bg-white rounded-3xl border border-slate-200/90 shadow-md hover:shadow-xl hover:border-[#dd0103]/40 transition-all duration-300 overflow-hidden group flex flex-col justify-between">
              <div>
                <div class="relative h-48 w-full overflow-hidden bg-slate-100">
                  <img 
                    src="images/demo/service-2.jpg" 
                    alt="Reliability" 
                    loading="lazy"
                    decoding="async"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div class="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent pointer-events-none"></div>
                  <div class="absolute bottom-3 start-4 end-4 text-white font-extrabold text-base">
                    {{ isRtl() ? 'الموثوقية ودقة المواعيد' : 'Reliability' }}
                  </div>
                </div>
                <div class="p-6">
                  <p class="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    {{ isRtl()
                      ? 'تركيز مطلق على تقديم خدمة متسقة وموثوقة بجداول إبحار أسبوعية ثابتة لضمان استقرار سلاسل الإمداد.'
                      : 'Focus on consistent and dependable service delivery with fixed-day weekly sailing commitments.' }}
                  </p>
                </div>
              </div>
              <div class="px-6 py-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
                <span class="text-slate-500">{{ isRtl() ? 'انتظام الخدمة' : 'Service Regularity' }}</span>
                <span class="font-bold text-emerald-700">{{ isRtl() ? 'أسبوعي ثابت' : 'Fixed-Day Weekly' }}</span>
              </div>
            </div>

            <!-- Card 3: Customer Commitment -->
            <div class="bg-white rounded-3xl border border-slate-200/90 shadow-md hover:shadow-xl hover:border-[#dd0103]/40 transition-all duration-300 overflow-hidden group flex flex-col justify-between">
              <div>
                <div class="relative h-48 w-full overflow-hidden bg-slate-100">
                  <img 
                    src="images/demo/transportation-img-2.jpg" 
                    alt="Customer Commitment" 
                    loading="lazy"
                    decoding="async"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div class="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent pointer-events-none"></div>
                  <div class="absolute bottom-3 start-4 end-4 text-white font-extrabold text-base">
                    {{ isRtl() ? 'الالتزام تجاه العميل' : 'Customer Commitment' }}
                  </div>
                </div>
                <div class="p-6">
                  <p class="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    {{ isRtl()
                      ? 'تواصل سريع ودعم مخصص لتلبية كافة متطلبات خطوط الشحن والوكلاء بكفاءة على مدار الساعة.'
                      : 'Responsive communication, agile booking desks, and personalized customer support 24/7.' }}
                  </p>
                </div>
              </div>
              <div class="px-6 py-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
                <span class="text-slate-500">{{ isRtl() ? 'مكتب الدعم' : 'Support Desk' }}</span>
                <span class="font-bold text-[#dd0103]">{{ isRtl() ? 'مباشر ٢٤/٧' : '24/7 Live Desk' }}</span>
              </div>
            </div>

            <!-- Card 4: Operational Efficiency -->
            <div class="bg-white rounded-3xl border border-slate-200/90 shadow-md hover:shadow-xl hover:border-[#dd0103]/40 transition-all duration-300 overflow-hidden group flex flex-col justify-between">
              <div>
                <div class="relative h-48 w-full overflow-hidden bg-slate-100">
                  <img 
                    src="images/demo/service-3.jpg" 
                    alt="Operational Efficiency" 
                    loading="lazy"
                    decoding="async"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div class="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent pointer-events-none"></div>
                  <div class="absolute bottom-3 start-4 end-4 text-white font-extrabold text-base">
                    {{ isRtl() ? 'الكفاءة التشغيلية' : 'Operational Efficiency' }}
                  </div>
                </div>
                <div class="p-6">
                  <p class="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    {{ isRtl()
                      ? 'تحسين مستمر لعمليات الرسو في الموانئ وحركة الحاويات لتسريع زمن الترانزيت وتخفيض التكاليف.'
                      : 'Focused on optimizing port calls, berthing turnaround, and rapid port-to-port container movement.' }}
                  </p>
                </div>
              </div>
              <div class="px-6 py-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
                <span class="text-slate-500">{{ isRtl() ? 'عمليات الموانئ' : 'Port Operations' }}</span>
                <span class="font-bold text-[#02194b]">{{ isRtl() ? 'رسو سريع' : 'Optimized Berthing' }}</span>
              </div>
            </div>

            <!-- Card 5: Regional Expertise -->
            <div class="bg-white rounded-3xl border border-slate-200/90 shadow-md hover:shadow-xl hover:border-[#dd0103]/40 transition-all duration-300 overflow-hidden group flex flex-col justify-between">
              <div>
                <div class="relative h-48 w-full overflow-hidden bg-slate-100">
                  <img 
                    src="images/demo/project-1.jpg" 
                    alt="Regional Expertise" 
                    loading="lazy"
                    decoding="async"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div class="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent pointer-events-none"></div>
                  <div class="absolute bottom-3 start-4 end-4 text-white font-extrabold text-base">
                    {{ isRtl() ? 'الخبرة الإقليمية المتعمقة' : 'Regional Expertise' }}
                  </div>
                </div>
                <div class="p-6">
                  <p class="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    {{ isRtl()
                      ? 'فهم عميق لأسواق الشحن في الخليج العربي وشبه القارة الهندية ومتطلبات الموانئ واللوائح البحرية.'
                      : 'Deep commercial and operational understanding of Arabian Gulf, Indian, and Pakistani shipping markets.' }}
                  </p>
                </div>
              </div>
              <div class="px-6 py-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
                <span class="text-slate-500">{{ isRtl() ? 'النطاق الجغرافي' : 'Domain Coverage' }}</span>
                <span class="font-bold text-[#dd0103]">{{ isRtl() ? 'الخليج والهند وباكستان' : 'Gulf & Pakistan/India' }}</span>
              </div>
            </div>

            <!-- Card 6: Partnership Approach -->
            <div class="bg-white rounded-3xl border border-slate-200/90 shadow-md hover:shadow-xl hover:border-[#dd0103]/40 transition-all duration-300 overflow-hidden group flex flex-col justify-between">
              <div>
                <div class="relative h-48 w-full overflow-hidden bg-slate-100">
                  <img 
                    src="images/demo/project-2.jpg" 
                    alt="Partnership Approach" 
                    loading="lazy"
                    decoding="async"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div class="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent pointer-events-none"></div>
                  <div class="absolute bottom-3 start-4 end-4 text-white font-extrabold text-base">
                    {{ isRtl() ? 'منهجية الشراكة الاستراتيجية' : 'Partnership Approach' }}
                  </div>
                </div>
                <div class="p-6">
                  <p class="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    {{ isRtl()
                      ? 'بناء علاقات متينة ومثمرة مع خطوط الشحن العالمية ووكلاء الشحن ومزودي الخدمات اللوجستية.'
                      : 'Building strong relationships with shipping lines, freight forwarders, and logistics providers.' }}
                  </p>
                </div>
              </div>
              <div class="px-6 py-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
                <span class="text-slate-500">{{ isRtl() ? 'الثقة التجارية' : 'Commercial Trust' }}</span>
                <span class="font-bold text-emerald-700">{{ isRtl() ? 'تحالفات طويلة الأمد' : 'Long-Term Alliances' }}</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      <!-- =========================================================
           5. TRADE & COMMERCIAL ENQUIRIES ("LET'S MOVE YOUR CARGO TOGETHER")
           ========================================================= -->
      <section id="enquiries-section" class="py-16 sm:py-24 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-8">
          <div class="p-8 sm:p-12 lg:p-14 rounded-3xl bg-gradient-to-r from-[#02194b] via-[#062569] to-[#02194b] border border-slate-800 shadow-2xl relative overflow-hidden text-white">
            <div class="absolute -end-20 -bottom-20 w-80 h-80 bg-[#dd0103]/20 rounded-full blur-3xl pointer-events-none"></div>

            <div class="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              
              <!-- Left Column -->
              <div class="lg:col-span-8 space-y-5">
                <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-xs font-mono font-bold uppercase">
                  <span class="w-2 h-2 rounded-full bg-[#dd0103] animate-pulse"></span>
                  <span>{{ isRtl() ? 'الاستفسارات التجارية والشحن' : 'TRADE & COMMERCIAL ENQUIRIES' }}</span>
                </div>

                <h2 class="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                  {{ isRtl() ? 'لننقل بضائعكم معاً.' : "Let's Move Your Cargo Together." }}
                </h2>

                <p class="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl font-normal">
                  {{ isRtl()
                    ? 'ترحب مافريك للشحن بالاستفسارات من خطوط الشحن العالمية، ووكلاء الشحن، ومشغلي NVOCC، والمستوردين والمصدرين، وشركات الخدمات اللوجستية، ومشغلي الموانئ والمحطات.'
                    : 'Maverick Shipping LLC welcomes enquiries from international shipping lines, freight forwarders, NVOCC operators, importers and exporters, logistics companies, and port & terminal operators.' }}
                </p>

                <!-- Customer Category Chips -->
                <div class="flex flex-wrap items-center gap-2 pt-2">
                  <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 text-xs font-semibold text-slate-100">
                    <span class="w-1.5 h-1.5 rounded-full bg-[#dd0103]"></span>
                    International Shipping Lines
                  </span>
                  <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 text-xs font-semibold text-slate-100">
                    <span class="w-1.5 h-1.5 rounded-full bg-[#dd0103]"></span>
                    Freight Forwarders
                  </span>
                  <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 text-xs font-semibold text-slate-100">
                    <span class="w-1.5 h-1.5 rounded-full bg-[#dd0103]"></span>
                    NVOCC Operators
                  </span>
                  <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 text-xs font-semibold text-slate-100">
                    <span class="w-1.5 h-1.5 rounded-full bg-[#dd0103]"></span>
                    Importers &amp; Exporters
                  </span>
                  <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 text-xs font-semibold text-slate-100">
                    <span class="w-1.5 h-1.5 rounded-full bg-[#dd0103]"></span>
                    Logistics Companies
                  </span>
                  <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 text-xs font-semibold text-slate-100">
                    <span class="w-1.5 h-1.5 rounded-full bg-[#dd0103]"></span>
                    Port &amp; Terminal Operators
                  </span>
                </div>
              </div>

              <!-- Right Column -->
              <div class="lg:col-span-4 flex flex-col items-start lg:items-end justify-center gap-3.5">
                <button
                  type="button"
                  (click)="service.toggleBookingModal(true)"
                  class="w-full sm:w-auto px-8 py-4 rounded-full bg-[#dd0103] hover:bg-[#b50102] text-white font-extrabold text-xs sm:text-sm tracking-wide shadow-xl shadow-red-600/30 hover:scale-[1.03] active:scale-95 transition-all cursor-pointer whitespace-nowrap">
                  {{ isRtl() ? 'طلب تسعيرة أو حجز فوري' : 'Request Commercial Booking' }}
                </button>

                <a
                  href="tel:+97142105105"
                  class="w-full sm:w-auto px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/20 transition-all flex items-center justify-center gap-2 whitespace-nowrap">
                  <svg class="w-4 h-4 text-[#ef2325]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span dir="ltr">+971 4 210 51 05 (Operations Desk)</span>
                </a>

                <span class="text-[11px] font-mono text-slate-400 text-start lg:text-end">
                  {{ isRtl() ? 'تواصل معنا لجداول الرحلات واستفسارات الإبحار وحجز الحاويات' : 'Contact us for sailing schedules, enquiries & container bookings' }}
                </span>
              </div>

            </div>
          </div>
        </div>
      </section>

      <!-- =========================================================
           6. MEMBERSHIPS & INDUSTRY LOGOS
           ========================================================= -->
      <section class="py-12 sm:py-16 bg-slate-50 border-t border-slate-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
          
          <div class="text-center space-y-1">
            <span class="text-xs font-mono font-bold uppercase tracking-wider text-[#dd0103]">
              {{ isRtl() ? 'العضويات والشراكات الملاحية' : 'MEMBERSHIPS & MARITIME STANDARDS' }}
            </span>
            <h3 class="text-lg sm:text-xl font-black text-[#02194b]">
              {{ isRtl() ? 'شركاء ومواثيق الشحن والخدمات اللوجستية' : 'Industry Standards & Shipping Logistics Alliances' }}
            </h3>
          </div>

          <!-- Logo Ticker Grid -->
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 items-center justify-items-center">
            <div *ngFor="let i of [1, 2, 3, 4, 5, 6]" class="p-3 grayscale hover:grayscale-0 opacity-75 hover:opacity-100 transition-all duration-300 hover:scale-105 flex items-center justify-center">
              <img [src]="'images/demo/logos/logo' + i + '.png'" [alt]="'Maritime Partner ' + i" loading="lazy" decoding="async" class="h-10 sm:h-12 w-auto object-contain" />
            </div>
          </div>

        </div>
      </section>

    </div>
  `
})
export class SustainabilityComponent {
  service = inject(MaritimeService);
  isRtl = this.service.isRtl;
}
