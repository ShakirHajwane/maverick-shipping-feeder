import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaritimeService } from '../../services/maritime.service';

@Component({
  selector: 'app-sustainability',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="services-section" class="py-16 sm:py-24 relative bg-white border-t border-slate-200/80 text-slate-900 overflow-hidden">
      <!-- Subtle ambient pattern -->
      <div class="absolute inset-0 bg-gradient-to-b from-slate-50/50 via-white to-slate-50/40 pointer-events-none"></div>

      <div class="max-w-7xl mx-auto px-4 sm:px-8 relative z-10 space-y-16 sm:space-y-24">
        
        <!-- =========================================================
             1. ABOUT MAVERICK SHIPPING LLC & OUR PRIORITIES
             ========================================================= -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <!-- Left Column: Corporate Profile (7 cols) -->
          <div class="lg:col-span-7 space-y-5">
            <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-200/70 text-[#df0003] text-xs font-bold font-mono uppercase tracking-wider">
              <span class="w-2 h-2 rounded-full bg-[#df0003] animate-pulse"></span>
              <span>{{ isRtl() ? 'عن مافريك للشحن البحري' : 'ABOUT MAVERICK SHIPPING LLC' }}</span>
            </div>

            <h2 class="text-3xl sm:text-4xl lg:text-5xl font-black text-[#02194b] tracking-tight leading-tight">
              <span>{{ isRtl() ? 'شريكك الموثوق في النقل الملاحي' : 'Your Trusted Partner in' }}</span><br>
              <span class="text-[#df0003]">{{ isRtl() ? 'والخطوط المغذية الإقليمية' : 'Regional Feeder Shipping' }}</span>
            </h2>

            <p class="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              {{ isRtl() 
                ? 'مافريك للشحن ش.ذ.م.م هي شركة شحن إقليمية صاعدة تأسست برؤية واضحة لتقديم خدمات تغذية حاويات موثوقة وعالية الكفاءة وتنافسية تجارياً. ينصب تركيزنا على تعزيز الربط البحري بين الموانئ الإقليمية الرئيسية، ودعم خطوط الشحن العالمية، وتزويد العملاء بحلول نقل مرنة ومبتكرة للبضائع.'
                : 'Maverick Shipping LLC is an emerging regional shipping company established with a vision to provide dependable, efficient, and commercially competitive container feeder services. Our focus is to strengthen maritime connectivity between major regional ports, support international shipping lines, and provide customers with flexible cargo transportation solutions.' }}
            </p>

            <!-- Corporate Positioning Highlight Box -->
            <div class="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200/90 shadow-sm space-y-3">
              <div class="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#02194b] font-mono">
                <svg class="w-4 h-4 text-[#df0003]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>{{ isRtl() ? 'شبكة خطوط التغذية الإقليمية' : 'REGIONAL FEEDER SERVICE NETWORK' }}</span>
              </div>
              <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {{ isRtl()
                  ? 'خدمة مكوكية مخصصة تربط الموانئ الإقليمية الرئيسية عبر الخليج العربي وباكستان والهند عبر مسار الدوران الأولي: صحار ← نهافا شيفا ← موندرا ← كراتشي ← صحار.'
                  : 'Dedicated feeder shipping service connecting key regional ports across the Arabian Gulf, Pakistan, and India with initial service rotation: Sohar → Nhava Sheva → Mundra → Karachi → Sohar.' }}
              </p>
              
              <div class="flex flex-wrap items-center gap-2 pt-1 text-xs">
                <span class="px-2.5 py-1 rounded-md bg-white border border-slate-200 font-bold text-[#02194b] shadow-xs">Sohar</span>
                <span class="text-[#df0003] font-bold">→</span>
                <span class="px-2.5 py-1 rounded-md bg-white border border-slate-200 font-bold text-[#02194b] shadow-xs">Nhava Sheva</span>
                <span class="text-[#df0003] font-bold">→</span>
                <span class="px-2.5 py-1 rounded-md bg-white border border-slate-200 font-bold text-[#02194b] shadow-xs">Mundra</span>
                <span class="text-[#df0003] font-bold">→</span>
                <span class="px-2.5 py-1 rounded-md bg-white border border-slate-200 font-bold text-[#02194b] shadow-xs">Karachi</span>
                <span class="text-[#df0003] font-bold">→</span>
                <span class="px-2.5 py-1 rounded-md bg-white border border-slate-200 font-bold text-[#02194b] shadow-xs">Sohar</span>
              </div>
            </div>
          </div>

          <!-- Right Column: Our 6 Priorities (5 cols) -->
          <div class="lg:col-span-5 bg-slate-50/90 border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-lg shadow-slate-100 space-y-4">
            <div class="flex items-center justify-between pb-3 border-b border-slate-200">
              <span class="text-xs font-mono font-bold uppercase tracking-wider text-[#02194b]">
                {{ isRtl() ? 'أولوياتنا التشغيلية والتجارية' : 'OUR PRIORITIES' }}
              </span>
              <span class="text-[10px] font-mono text-[#df0003] bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200 font-bold">
                6 Core Pillars
              </span>
            </div>

            <div class="space-y-2.5">
              <!-- Pillar 1 -->
              <div class="flex items-start gap-3 p-3 rounded-xl bg-white border border-slate-200/80 shadow-xs hover:border-[#df0003]/40 transition-colors">
                <span class="w-7 h-7 rounded-lg bg-red-50 text-[#df0003] font-mono text-xs font-black flex items-center justify-center shrink-0">01</span>
                <div>
                  <h4 class="text-xs sm:text-sm font-bold text-[#02194b]">{{ isRtl() ? 'التميز التشغيلي' : 'Operational Excellence' }}</h4>
                  <p class="text-[11px] text-slate-500 mt-0.5">{{ isRtl() ? 'أعلى معايير الإبحار وإدارة الأسطول والمناولة السريعة.' : 'Highest maritime standards across voyage planning and rapid cargo turnaround.' }}</p>
                </div>
              </div>

              <!-- Pillar 2 -->
              <div class="flex items-start gap-3 p-3 rounded-xl bg-white border border-slate-200/80 shadow-xs hover:border-[#df0003]/40 transition-colors">
                <span class="w-7 h-7 rounded-lg bg-red-50 text-[#df0003] font-mono text-xs font-black flex items-center justify-center shrink-0">02</span>
                <div>
                  <h4 class="text-xs sm:text-sm font-bold text-[#02194b]">{{ isRtl() ? 'عمليات سفن موثوقة' : 'Reliable Vessel Operations' }}</h4>
                  <p class="text-[11px] text-slate-500 mt-0.5">{{ isRtl() ? 'دقة متناهية في مواعيد الإبحار وجداول الرسو.' : 'Rigorous adherence to fixed-day sailing schedules and berth windows.' }}</p>
                </div>
              </div>

              <!-- Pillar 3 -->
              <div class="flex items-start gap-3 p-3 rounded-xl bg-white border border-slate-200/80 shadow-xs hover:border-[#df0003]/40 transition-colors">
                <span class="w-7 h-7 rounded-lg bg-red-50 text-[#df0003] font-mono text-xs font-black flex items-center justify-center shrink-0">03</span>
                <div>
                  <h4 class="text-xs sm:text-sm font-bold text-[#02194b]">{{ isRtl() ? 'شراكات قوية مع الموانئ والوكلاء' : 'Strong Port & Agency Partnerships' }}</h4>
                  <p class="text-[11px] text-slate-500 mt-0.5">{{ isRtl() ? 'تعاون وثيق مع مشغلي المحطات لضمان الأولوية التشغيلية.' : 'Seamless terminal collaboration at Sohar, Nhava Sheva, Mundra, and Karachi.' }}</p>
                </div>
              </div>

              <!-- Pillar 4 -->
              <div class="flex items-start gap-3 p-3 rounded-xl bg-white border border-slate-200/80 shadow-xs hover:border-[#df0003]/40 transition-colors">
                <span class="w-7 h-7 rounded-lg bg-red-50 text-[#df0003] font-mono text-xs font-black flex items-center justify-center shrink-0">04</span>
                <div>
                  <h4 class="text-xs sm:text-sm font-bold text-[#02194b]">{{ isRtl() ? 'تواصل شفاف مع العملاء' : 'Transparent Customer Communication' }}</h4>
                  <p class="text-[11px] text-slate-500 mt-0.5">{{ isRtl() ? 'متابعة لحظية وتحديثات استباقية لمواقع الحاويات.' : 'Real-time cargo status reporting and proactive customer coordination.' }}</p>
                </div>
              </div>

              <!-- Pillar 5 -->
              <div class="flex items-start gap-3 p-3 rounded-xl bg-white border border-slate-200/80 shadow-xs hover:border-[#df0003]/40 transition-colors">
                <span class="w-7 h-7 rounded-lg bg-red-50 text-[#df0003] font-mono text-xs font-black flex items-center justify-center shrink-0">05</span>
                <div>
                  <h4 class="text-xs sm:text-sm font-bold text-[#02194b]">{{ isRtl() ? 'علاقات طويلة الأمد مع الشركاء' : 'Long-Term Relationships with Shipping Partners' }}</h4>
                  <p class="text-[11px] text-slate-500 mt-0.5">{{ isRtl() ? 'بناء شراكات مستدامة تدعم مصالح خطوط الشحن والوكلاء.' : 'Enduring commercial trust with mainline carriers, NVOCCs, and forwarders.' }}</p>
                </div>
              </div>

              <!-- Pillar 6 -->
              <div class="flex items-start gap-3 p-3 rounded-xl bg-white border border-slate-200/80 shadow-xs hover:border-[#df0003]/40 transition-colors">
                <span class="w-7 h-7 rounded-lg bg-red-50 text-[#df0003] font-mono text-xs font-black flex items-center justify-center shrink-0">06</span>
                <div>
                  <h4 class="text-xs sm:text-sm font-bold text-[#02194b]">{{ isRtl() ? 'نمو تجاري مستدام' : 'Sustainable Business Growth' }}</h4>
                  <p class="text-[11px] text-slate-500 mt-0.5">{{ isRtl() ? 'تطوير مستمر لشبكة النقل البحري وكفاءة استهلاك الطاقة.' : 'Eco-conscious fleet operations ensuring responsible long-term value.' }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- =========================================================
             2. WHY CHOOSE MAVERICK SHIPPING? (PICTURE CARDS MATCHING DEMO SITE)
             ========================================================= -->
        <div class="space-y-10">
          <div class="text-center max-w-3xl mx-auto space-y-3">
            <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-200 text-[#df0003] text-xs font-mono uppercase font-bold tracking-wider">
              <span class="w-2 h-2 rounded-full bg-[#df0003] animate-pulse"></span>
              <span>{{ isRtl() ? 'المزايا التنافسية' : 'COMPETITIVE ADVANTAGE' }}</span>
            </div>
            <h3 class="text-2xl sm:text-3xl lg:text-4xl font-black text-[#02194b] tracking-tight">
              <span>{{ isRtl() ? 'لماذا تختار' : 'Why Choose' }}</span> <span class="text-[#df0003]">Maverick Shipping</span>?
            </h3>
            <p class="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto">
              {{ isRtl()
                ? 'نقدم مزيجاً متكاملاً من التغطية الجغرافية الاستراتيجية والموثوقية العالية والمرونة التجارية لدعم تدفق بضائعك.'
                : 'A strategic combination of regional geographic coverage, schedule reliability, and dedicated customer commitment.' }}
            </p>
          </div>

          <!-- 6 Grid Cards with Authentic Photography & Floating Title Badges -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            
            <!-- Card 1: Strategic Connectivity -->
            <div class="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group flex flex-col">
              <div class="relative h-52 sm:h-56 w-full overflow-hidden bg-slate-100">
                <img 
                  src="images/demo/service-1.jpg" 
                  alt="Strategic Connectivity - Feeder Ship in Transit" 
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div class="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent pointer-events-none"></div>
                <!-- Floating Title Badge -->
                <div class="absolute -bottom-4 left-4 right-4 sm:left-5 sm:right-5 bg-white rounded-xl sm:rounded-2xl px-4 py-3 shadow-lg border border-slate-100 flex items-center justify-between gap-3 z-10">
                  <h4 class="text-sm sm:text-base font-extrabold text-[#02194b] tracking-tight">
                    {{ isRtl() ? 'الربط الاستراتيجي' : 'Strategic Connectivity' }}
                  </h4>
                  <span class="w-7 h-7 rounded-full bg-red-50 text-[#df0003] group-hover:bg-[#df0003] group-hover:text-white flex items-center justify-center text-xs font-bold transition-colors shrink-0">→</span>
                </div>
              </div>
              <div class="p-5 sm:p-6 pt-7 sm:pt-8 flex-1 flex flex-col justify-between space-y-3">
                <p class="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  {{ isRtl() 
                    ? 'ربط مباشر وسلس بين أهم وجهات ومراكز التجارة الإقليمية عبر عُمان والهند وباكستان.' 
                    : 'Connecting important regional trade destinations across Sohar, Nhava Sheva, Mundra, and Karachi.' }}
                </p>
                <div class="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-500">
                  <span>Corridor Network</span>
                  <span class="font-bold text-[#df0003]">4 Primary Hubs</span>
                </div>
              </div>
            </div>

            <!-- Card 2: Reliability -->
            <div class="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group flex flex-col">
              <div class="relative h-52 sm:h-56 w-full overflow-hidden bg-slate-100">
                <img 
                  src="images/demo/service-2.jpg" 
                  alt="Reliability - Port Quay Container Cranes" 
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div class="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent pointer-events-none"></div>
                <!-- Floating Title Badge -->
                <div class="absolute -bottom-4 left-4 right-4 sm:left-5 sm:right-5 bg-white rounded-xl sm:rounded-2xl px-4 py-3 shadow-lg border border-slate-100 flex items-center justify-between gap-3 z-10">
                  <h4 class="text-sm sm:text-base font-extrabold text-[#02194b] tracking-tight">
                    {{ isRtl() ? 'الموثوقية ودقة المواعيد' : 'Reliability' }}
                  </h4>
                  <span class="w-7 h-7 rounded-full bg-red-50 text-[#df0003] group-hover:bg-[#df0003] group-hover:text-white flex items-center justify-center text-xs font-bold transition-colors shrink-0">→</span>
                </div>
              </div>
              <div class="p-5 sm:p-6 pt-7 sm:pt-8 flex-1 flex flex-col justify-between space-y-3">
                <p class="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  {{ isRtl()
                    ? 'تركيز مطلق على تقديم خدمة متسقة وموثوقة بنسبة دقة مواعيد تصل إلى 99.4%.'
                    : 'Focus on consistent and dependable service delivery with fixed-day weekly sailing commitments.' }}
                </p>
                <div class="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-500">
                  <span>Schedule Accuracy</span>
                  <span class="font-bold text-emerald-600">99.4% On-Time</span>
                </div>
              </div>
            </div>

            <!-- Card 3: Customer Commitment -->
            <div class="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group flex flex-col">
              <div class="relative h-52 sm:h-56 w-full overflow-hidden bg-slate-100">
                <img 
                  src="images/demo/transportation-img-2.jpg" 
                  alt="Customer Commitment - Maritime Operations Team" 
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div class="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent pointer-events-none"></div>
                <!-- Floating Title Badge -->
                <div class="absolute -bottom-4 left-4 right-4 sm:left-5 sm:right-5 bg-white rounded-xl sm:rounded-2xl px-4 py-3 shadow-lg border border-slate-100 flex items-center justify-between gap-3 z-10">
                  <h4 class="text-sm sm:text-base font-extrabold text-[#02194b] tracking-tight">
                    {{ isRtl() ? 'الالتزام تجاه العميل' : 'Customer Commitment' }}
                  </h4>
                  <span class="w-7 h-7 rounded-full bg-red-50 text-[#df0003] group-hover:bg-[#df0003] group-hover:text-white flex items-center justify-center text-xs font-bold transition-colors shrink-0">→</span>
                </div>
              </div>
              <div class="p-5 sm:p-6 pt-7 sm:pt-8 flex-1 flex flex-col justify-between space-y-3">
                <p class="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  {{ isRtl()
                    ? 'تواصل سريع ودعم مخصص لتلبية كافة متطلبات خطوط الشحن والوكلاء بكفاءة.'
                    : 'Responsive communication, agile booking desks, and personalized customer support 24/7.' }}
                </p>
                <div class="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-500">
                  <span>Desk Support</span>
                  <span class="font-bold text-[#df0003]">24/7 Live Desk</span>
                </div>
              </div>
            </div>

            <!-- Card 4: Operational Efficiency -->
            <div class="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group flex flex-col">
              <div class="relative h-52 sm:h-56 w-full overflow-hidden bg-slate-100">
                <img 
                  src="images/demo/service-3.jpg" 
                  alt="Operational Efficiency - Modern Container Handling" 
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div class="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent pointer-events-none"></div>
                <!-- Floating Title Badge -->
                <div class="absolute -bottom-4 left-4 right-4 sm:left-5 sm:right-5 bg-white rounded-xl sm:rounded-2xl px-4 py-3 shadow-lg border border-slate-100 flex items-center justify-between gap-3 z-10">
                  <h4 class="text-sm sm:text-base font-extrabold text-[#02194b] tracking-tight">
                    {{ isRtl() ? 'الكفاءة التشغيلية' : 'Operational Efficiency' }}
                  </h4>
                  <span class="w-7 h-7 rounded-full bg-red-50 text-[#df0003] group-hover:bg-[#df0003] group-hover:text-white flex items-center justify-center text-xs font-bold transition-colors shrink-0">→</span>
                </div>
              </div>
              <div class="p-5 sm:p-6 pt-7 sm:pt-8 flex-1 flex flex-col justify-between space-y-3">
                <p class="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  {{ isRtl()
                    ? 'تحسين مستمر لعمليات الرسو في الموانئ وحركة الحاويات لتسريع زمن الترانزيت.'
                    : 'Focused on optimizing port calls, berthing turnaround, and rapid port-to-port container movement.' }}
                </p>
                <div class="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-500">
                  <span>Berth Window</span>
                  <span class="font-bold text-[#02194b]">Priority Access</span>
                </div>
              </div>
            </div>

            <!-- Card 5: Regional Expertise -->
            <div class="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group flex flex-col">
              <div class="relative h-52 sm:h-56 w-full overflow-hidden bg-slate-100">
                <img 
                  src="images/demo/project-1.jpg" 
                  alt="Regional Expertise - Cargo Vessel at Deep Sea Berth" 
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div class="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent pointer-events-none"></div>
                <!-- Floating Title Badge -->
                <div class="absolute -bottom-4 left-4 right-4 sm:left-5 sm:right-5 bg-white rounded-xl sm:rounded-2xl px-4 py-3 shadow-lg border border-slate-100 flex items-center justify-between gap-3 z-10">
                  <h4 class="text-sm sm:text-base font-extrabold text-[#02194b] tracking-tight">
                    {{ isRtl() ? 'الخبرة الإقليمية المتعمقة' : 'Regional Expertise' }}
                  </h4>
                  <span class="w-7 h-7 rounded-full bg-red-50 text-[#df0003] group-hover:bg-[#df0003] group-hover:text-white flex items-center justify-center text-xs font-bold transition-colors shrink-0">→</span>
                </div>
              </div>
              <div class="p-5 sm:p-6 pt-7 sm:pt-8 flex-1 flex flex-col justify-between space-y-3">
                <p class="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  {{ isRtl()
                    ? 'فهم عميق لأسواق الشحن في الخليج العربي وشبه القارة الهندية ومتطلبات الموانئ.'
                    : 'Deep commercial and operational understanding of Arabian Gulf, Indian, and Pakistani shipping markets.' }}
                </p>
                <div class="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-500">
                  <span>Domain Reach</span>
                  <span class="font-bold text-[#df0003]">Gulf & Subcontinent</span>
                </div>
              </div>
            </div>

            <!-- Card 6: Partnership Approach -->
            <div class="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group flex flex-col">
              <div class="relative h-52 sm:h-56 w-full overflow-hidden bg-slate-100">
                <img 
                  src="images/demo/project-2.jpg" 
                  alt="Partnership Approach - Container Terminal Infrastructure" 
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div class="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent pointer-events-none"></div>
                <!-- Floating Title Badge -->
                <div class="absolute -bottom-4 left-4 right-4 sm:left-5 sm:right-5 bg-white rounded-xl sm:rounded-2xl px-4 py-3 shadow-lg border border-slate-100 flex items-center justify-between gap-3 z-10">
                  <h4 class="text-sm sm:text-base font-extrabold text-[#02194b] tracking-tight">
                    {{ isRtl() ? 'منهجية الشراكة الاستراتيجية' : 'Partnership Approach' }}
                  </h4>
                  <span class="w-7 h-7 rounded-full bg-red-50 text-[#df0003] group-hover:bg-[#df0003] group-hover:text-white flex items-center justify-center text-xs font-bold transition-colors shrink-0">→</span>
                </div>
              </div>
              <div class="p-5 sm:p-6 pt-7 sm:pt-8 flex-1 flex flex-col justify-between space-y-3">
                <p class="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  {{ isRtl()
                    ? 'بناء علاقات متينة ومثمرة مع خطوط الشحن العالمية ووكلاء الشحن ومزودي الخدمات اللوجستية.'
                    : 'Building strong relationships with shipping lines, freight forwarders, and logistics providers.' }}
                </p>
                <div class="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-500">
                  <span>Alliance Trust</span>
                  <span class="font-bold text-emerald-600">Carrier Trust</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        <!-- =========================================================
             3. PORTS COVERED SHOWCASE (4 STRATEGIC REGIONAL GATEWAYS WITH REAL PHOTOS)
             ========================================================= -->
        <div class="space-y-8">
          <div class="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <span class="text-xs font-mono font-bold uppercase tracking-wider text-[#df0003]">
                {{ isRtl() ? 'تغطية الموانئ' : 'STRATEGIC PORT COVERAGE' }}
              </span>
              <h3 class="text-xl sm:text-3xl font-black text-[#02194b] mt-1">
                {{ isRtl() ? 'الموانئ المشمولة في مسار الخدمة' : 'Ports Covered Across Key Trade Markets' }}
              </h3>
            </div>
            <div class="text-xs font-mono text-slate-500">
              Corridor: <span class="text-[#02194b] font-bold">Sohar ⇄ Nhava Sheva ⇄ Mundra ⇄ Karachi</span>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <!-- Port 1: Sohar -->
            <div class="bg-white rounded-2xl border border-slate-200 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group flex flex-col">
              <div class="relative h-44 w-full overflow-hidden bg-slate-100">
                <img 
                  src="images/demo/cargo-shipment-bg-img-1.jpg" 
                  alt="Sohar Port Oman" 
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div class="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent pointer-events-none"></div>
                <div class="absolute top-3 right-3 px-2 py-0.5 rounded bg-[#02194b]/85 backdrop-blur-md text-white border border-white/20 text-[10px] font-mono font-bold">
                  OMSOH
                </div>
                <div class="absolute bottom-2.5 left-3 text-white">
                  <div class="text-base font-black leading-tight">Sohar, Oman</div>
                  <div class="text-[10px] text-slate-300 font-mono">Arabian Gulf Hub</div>
                </div>
              </div>
              <div class="p-4 flex-1 flex flex-col justify-between">
                <p class="text-xs text-slate-600 leading-relaxed font-normal">
                  {{ isRtl() ? 'البوابة الاستراتيجية إلى الخليج العربي مع بنية تحتية متطورة لمناولة الحاويات.' : 'Strategic gateway to the Arabian Gulf with deep-water container berths and high-speed cargo throughput.' }}
                </p>
                <div class="mt-3 pt-2 border-t border-slate-100 text-[10px] font-mono font-bold text-[#df0003] uppercase">
                  Service Origin / Destination
                </div>
              </div>
            </div>

            <!-- Port 2: Nhava Sheva -->
            <div class="bg-white rounded-2xl border border-slate-200 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group flex flex-col">
              <div class="relative h-44 w-full overflow-hidden bg-slate-100">
                <img 
                  src="images/demo/cargo-shipment-bg-img-2.jpg" 
                  alt="Nhava Sheva Port India" 
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div class="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent pointer-events-none"></div>
                <div class="absolute top-3 right-3 px-2 py-0.5 rounded bg-[#02194b]/85 backdrop-blur-md text-white border border-white/20 text-[10px] font-mono font-bold">
                  INNSA
                </div>
                <div class="absolute bottom-2.5 left-3 text-white">
                  <div class="text-base font-black leading-tight">Nhava Sheva, India</div>
                  <div class="text-[10px] text-slate-300 font-mono">JNPT Gateway</div>
                </div>
              </div>
              <div class="p-4 flex-1 flex flex-col justify-between">
                <p class="text-xs text-slate-600 leading-relaxed font-normal">
                  <span *ngIf="!isRtl()">Major container gateway for India&apos;s western coast, connecting industrial hinterlands with premier regional feeder corridors.</span>
                  <span *ngIf="isRtl()">بوابة الحاويات الرئيسية للساحل الغربي للهند وتربط المناطق الصناعية الحيوية.</span>
                </p>
                <div class="mt-3 pt-2 border-t border-slate-100 text-[10px] font-mono font-bold text-[#df0003] uppercase">
                  India West Coast Call
                </div>
              </div>
            </div>

            <!-- Port 3: Mundra -->
            <div class="bg-white rounded-2xl border border-slate-200 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group flex flex-col">
              <div class="relative h-44 w-full overflow-hidden bg-slate-100">
                <img 
                  src="images/demo/cargo-shipment-bg-img-3.jpg" 
                  alt="Mundra Port India" 
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div class="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent pointer-events-none"></div>
                <div class="absolute top-3 right-3 px-2 py-0.5 rounded bg-[#02194b]/85 backdrop-blur-md text-white border border-white/20 text-[10px] font-mono font-bold">
                  INMUN
                </div>
                <div class="absolute bottom-2.5 left-3 text-white">
                  <div class="text-base font-black leading-tight">Mundra, India</div>
                  <div class="text-[10px] text-slate-300 font-mono">Commercial Hub</div>
                </div>
              </div>
              <div class="p-4 flex-1 flex flex-col justify-between">
                <p class="text-xs text-slate-600 leading-relaxed font-normal">
                  {{ isRtl() ? 'مركز تجاري وبحري هام للحاويات مع ربط سككي مباشر ومعدلات دوران عالية.' : 'Important commercial and container hub offering rapid turnaround speeds and direct rail-to-vessel intermodal links.' }}
                </p>
                <div class="mt-3 pt-2 border-t border-slate-100 text-[10px] font-mono font-bold text-[#df0003] uppercase">
                  Direct Intermodal Link
                </div>
              </div>
            </div>

            <!-- Port 4: Karachi -->
            <div class="bg-white rounded-2xl border border-slate-200 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group flex flex-col">
              <div class="relative h-44 w-full overflow-hidden bg-slate-100">
                <img 
                  src="images/demo/project-3.jpg" 
                  alt="Karachi Port Pakistan" 
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div class="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent pointer-events-none"></div>
                <div class="absolute top-3 right-3 px-2 py-0.5 rounded bg-[#02194b]/85 backdrop-blur-md text-white border border-white/20 text-[10px] font-mono font-bold">
                  PKKHI
                </div>
                <div class="absolute bottom-2.5 left-3 text-white">
                  <div class="text-base font-black leading-tight">Karachi, Pakistan</div>
                  <div class="text-[10px] text-slate-300 font-mono">International Trade</div>
                </div>
              </div>
              <div class="p-4 flex-1 flex flex-col justify-between">
                <p class="text-xs text-slate-600 leading-relaxed font-normal">
                  <span *ngIf="!isRtl()">Key gateway for Pakistan&apos;s international trade, ensuring smooth customs clearances and reliable scheduled rotations.</span>
                  <span *ngIf="isRtl()">البوابة الرئيسية للتجارة الدولية لباكستان مع كفاءة جمركية عالية وجداول ثابتة.</span>
                </p>
                <div class="mt-3 pt-2 border-t border-slate-100 text-[10px] font-mono font-bold text-[#df0003] uppercase">
                  Pakistan Gateway Call
                </div>
              </div>
            </div>

          </div>
        </div>

        <!-- =========================================================
             4. TRADE & COMMERCIAL ENQUIRIES ("LET'S MOVE YOUR CARGO TOGETHER")
             ========================================================= -->
        <div class="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#02194b] via-[#032363] to-[#02194b] border border-slate-700 shadow-2xl relative overflow-hidden text-white">
          <div class="absolute -right-20 -bottom-20 w-80 h-80 bg-[#df0003]/15 rounded-full blur-3xl pointer-events-none"></div>

          <div class="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div class="lg:col-span-8 space-y-4">
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-xs font-mono font-bold uppercase">
                <span class="w-2 h-2 rounded-full bg-[#df0003] animate-pulse"></span>
                <span>{{ isRtl() ? 'الاستفسارات التجارية والشحن' : 'TRADE & COMMERCIAL ENQUIRIES' }}</span>
              </div>

              <h3 class="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
                {{ isRtl() ? 'لننقل بضائعكم معاً' : "Let's Move Your Cargo Together." }}
              </h3>

              <p class="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl font-normal">
                {{ isRtl()
                  ? 'ترحب مافريك للشحن بالاستفسارات من خطوط الشحن العالمية، ووكلاء الشحن، ومشغلي NVOCC، والمستوردين والمصدرين، وشركات الخدمات اللوجستية، ومشغلي الموانئ والمحطات.'
                  : 'Maverick Shipping LLC welcomes enquiries from international shipping lines, freight forwarders, NVOCC operators, importers and exporters, logistics companies, and port & terminal operators.' }}
              </p>

              <!-- Who Welcomes Chips -->
              <div class="flex flex-wrap items-center gap-2 pt-1">
                <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 border border-white/15 text-[11.5px] font-semibold text-slate-100">
                  <span class="w-1.5 h-1.5 rounded-full bg-[#df0003]"></span>
                  International Shipping Lines
                </span>
                <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 border border-white/15 text-[11.5px] font-semibold text-slate-100">
                  <span class="w-1.5 h-1.5 rounded-full bg-[#df0003]"></span>
                  Freight Forwarders
                </span>
                <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 border border-white/15 text-[11.5px] font-semibold text-slate-100">
                  <span class="w-1.5 h-1.5 rounded-full bg-[#df0003]"></span>
                  NVOCC Operators
                </span>
                <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 border border-white/15 text-[11.5px] font-semibold text-slate-100">
                  <span class="w-1.5 h-1.5 rounded-full bg-[#df0003]"></span>
                  Importers &amp; Exporters
                </span>
                <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 border border-white/15 text-[11.5px] font-semibold text-slate-100">
                  <span class="w-1.5 h-1.5 rounded-full bg-[#df0003]"></span>
                  Logistics Companies
                </span>
                <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 border border-white/15 text-[11.5px] font-semibold text-slate-100">
                  <span class="w-1.5 h-1.5 rounded-full bg-[#df0003]"></span>
                  Port &amp; Terminal Operators
                </span>
              </div>
            </div>

            <!-- Action Column (4 cols) -->
            <div class="lg:col-span-4 flex flex-col items-start lg:items-end justify-center gap-3">
              <button
                (click)="service.toggleBookingModal(true)"
                class="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#df0003] hover:bg-[#b80002] text-white font-extrabold text-xs sm:text-sm tracking-wide shadow-xl shadow-red-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer whitespace-nowrap">
                {{ isRtl() ? 'طلب تسعيرة أو حجز' : 'Request Commercial Booking' }}
              </button>

              <a
                href="tel:+97142105105"
                class="w-full sm:w-auto px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/20 transition-all flex items-center justify-center gap-2 whitespace-nowrap">
                <svg class="w-4 h-4 text-[#df0003]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>+971 4 210 51 05</span>
              </a>

              <span class="text-[10.5px] font-mono text-slate-400 text-left lg:text-right">
                {{ isRtl() ? 'تواصل معنا لجداول الرحلات واستفسارات الإبحار وحجز الحاويات' : 'Contact us for vessel schedules, sailing enquiries & container bookings' }}
              </span>
            </div>
          </div>
        </div>

      </div>
    </section>
  `
})
export class SustainabilityComponent {
  service = inject(MaritimeService);
  isRtl = this.service.isRtl;
}
