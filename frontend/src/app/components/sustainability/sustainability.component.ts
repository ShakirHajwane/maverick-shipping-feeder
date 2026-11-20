import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaritimeService } from '../../services/maritime.service';

@Component({
  selector: 'app-sustainability',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="services-section" class="py-16 sm:py-20 relative bg-slate-900/60 backdrop-blur-md border-b border-white/10 text-white overflow-hidden">
      <!-- Ambient Nautical Grid Background Glow -->
      <div class="absolute inset-0 bg-radial-gradient from-slate-900/40 via-slate-950 to-slate-950 pointer-events-none"></div>

      <div class="max-w-7xl mx-auto px-4 sm:px-8 relative z-10 space-y-16">
        
        <!-- =========================================================
             1. ABOUT MAVERICK SHIPPING LLC & OUR PRIORITIES
             ========================================================= -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <!-- Left Column: Corporate Profile (7 cols) -->
          <div class="lg:col-span-7 space-y-5">
            <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-bold font-mono uppercase tracking-wider">
              <span class="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              <span>{{ isRtl() ? 'عن مافريك للشحن البحري' : 'ABOUT MAVERICK SHIPPING LLC' }}</span>
            </div>

            <h2 class="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              {{ isRtl() ? 'شريكك الموثوق في النقل الملاحي والخطوط المغذية' : 'Your Trusted Partner in Regional Feeder Shipping' }}
            </h2>

            <p class="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              {{ isRtl() 
                ? 'مافريك للشحن ش.ذ.م.م هي شركة شحن إقليمية صاعدة تأسست برؤية واضحة لتقديم خدمات تغذية حاويات موثوقة وعالية الكفاءة وتنافسية تجارياً. ينصب تركيزنا على تعزيز الربط البحري بين الموانئ الإقليمية الرئيسية، ودعم خطوط الشحن العالمية، وتزويد العملاء بحلول نقل مرنة ومبتكرة للبضائع.'
                : 'Maverick Shipping LLC is an emerging regional shipping company established with a vision to provide dependable, efficient, and commercially competitive container feeder services. Our focus is to strengthen maritime connectivity between major regional ports, support international shipping lines, and provide customers with flexible cargo transportation solutions.' }}
            </p>

            <!-- Corporate Positioning Highlight Box -->
            <div class="p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-white/10 space-y-3">
              <div class="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 font-mono">
                <span>🚢</span>
                <span>{{ isRtl() ? 'شبكة خطوط التغذية الإقليمية' : 'REGIONAL FEEDER SERVICE NETWORK' }}</span>
              </div>
              <p class="text-xs sm:text-sm text-slate-300 leading-snug">
                {{ isRtl()
                  ? 'خدمة مكوكية مخصصة تربط الموانئ الإقليمية الرئيسية عبر الخليج العربي وباكستان والهند عبر مسار الدوران الأولي: صحار ← نهافا شيفا ← موندرا ← كراتشي ← صحار.'
                  : 'Dedicated feeder shipping service connecting key regional ports across the Arabian Gulf, Pakistan, and India with initial service rotation: Sohar → Nhava Sheva → Mundra → Karachi → Sohar.' }}
              </p>
            </div>
          </div>

          <!-- Right Column: Our 6 Priorities (5 cols) -->
          <div class="lg:col-span-5 bg-slate-950/70 border border-white/10 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5">
            <div class="flex items-center justify-between pb-3 border-b border-white/10">
              <span class="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
                {{ isRtl() ? 'أولوياتنا التشغيلية والتجارية' : 'OUR PRIORITIES' }}
              </span>
              <span class="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                6 Core Pillars
              </span>
            </div>

            <div class="space-y-3">
              <div class="flex items-start gap-3 p-2.5 rounded-xl bg-slate-900/60 border border-white/5 hover:border-amber-400/40 transition-colors">
                <span class="text-amber-400 font-mono text-xs font-bold pt-0.5">01</span>
                <div>
                  <h4 class="text-xs sm:text-sm font-bold text-white">{{ isRtl() ? 'التميز التشغيلي' : 'Operational Excellence' }}</h4>
                  <p class="text-[11px] text-slate-400 mt-0.5">{{ isRtl() ? 'أعلى معايير الإبحار وإدارة الأسطول والمناولة السريعة.' : 'Highest maritime standards across voyage planning and rapid cargo turnaround.' }}</p>
                </div>
              </div>

              <div class="flex items-start gap-3 p-2.5 rounded-xl bg-slate-900/60 border border-white/5 hover:border-amber-400/40 transition-colors">
                <span class="text-amber-400 font-mono text-xs font-bold pt-0.5">02</span>
                <div>
                  <h4 class="text-xs sm:text-sm font-bold text-white">{{ isRtl() ? 'عمليات سفن موثوقة' : 'Reliable Vessel Operations' }}</h4>
                  <p class="text-[11px] text-slate-400 mt-0.5">{{ isRtl() ? 'دقة متناهية في مواعيد الإبحار وجداول الرسو.' : 'Rigorous adherence to fixed-day sailing schedules and berth windows.' }}</p>
                </div>
              </div>

              <div class="flex items-start gap-3 p-2.5 rounded-xl bg-slate-900/60 border border-white/5 hover:border-amber-400/40 transition-colors">
                <span class="text-amber-400 font-mono text-xs font-bold pt-0.5">03</span>
                <div>
                  <h4 class="text-xs sm:text-sm font-bold text-white">{{ isRtl() ? 'شراكات قوية مع الموانئ والوكلاء' : 'Strong Port & Agency Partnerships' }}</h4>
                  <p class="text-[11px] text-slate-400 mt-0.5">{{ isRtl() ? 'تعاون وثيق مع مشغلي المحطات لضمان الأولوية التشغيلية.' : 'Seamless terminal collaboration at Sohar, Nhava Sheva, Mundra, and Karachi.' }}</p>
                </div>
              </div>

              <div class="flex items-start gap-3 p-2.5 rounded-xl bg-slate-900/60 border border-white/5 hover:border-amber-400/40 transition-colors">
                <span class="text-amber-400 font-mono text-xs font-bold pt-0.5">04</span>
                <div>
                  <h4 class="text-xs sm:text-sm font-bold text-white">{{ isRtl() ? 'تواصل شفاف مع العملاء' : 'Transparent Customer Communication' }}</h4>
                  <p class="text-[11px] text-slate-400 mt-0.5">{{ isRtl() ? 'متابعة لحظية وتحديثات استباقية لمواقع الحاويات.' : 'Real-time cargo status reporting and proactive customer coordination.' }}</p>
                </div>
              </div>

              <div class="flex items-start gap-3 p-2.5 rounded-xl bg-slate-900/60 border border-white/5 hover:border-amber-400/40 transition-colors">
                <span class="text-amber-400 font-mono text-xs font-bold pt-0.5">05</span>
                <div>
                  <h4 class="text-xs sm:text-sm font-bold text-white">{{ isRtl() ? 'علاقات طويلة الأمد مع الشركاء' : 'Long-Term Relationships with Shipping Partners' }}</h4>
                  <p class="text-[11px] text-slate-400 mt-0.5">{{ isRtl() ? 'بناء شراكات مستدامة تدعم مصالح خطوط الشحن والوكلاء.' : 'Enduring commercial trust with mainline carriers, NVOCCs, and forwarders.' }}</p>
                </div>
              </div>

              <div class="flex items-start gap-3 p-2.5 rounded-xl bg-slate-900/60 border border-white/5 hover:border-amber-400/40 transition-colors">
                <span class="text-amber-400 font-mono text-xs font-bold pt-0.5">06</span>
                <div>
                  <h4 class="text-xs sm:text-sm font-bold text-white">{{ isRtl() ? 'نمو تجاري مستدام' : 'Sustainable Business Growth' }}</h4>
                  <p class="text-[11px] text-slate-400 mt-0.5">{{ isRtl() ? 'تطوير مستمر لشبكة النقل البحري وكفاءة استهلاك الطاقة.' : 'Eco-conscious fleet operations ensuring responsible long-term value.' }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- =========================================================
             2. WHY CHOOSE MAVERICK SHIPPING? (6 KEY DIFFERENTIATORS)
             ========================================================= -->
        <div class="space-y-8">
          <div class="text-center max-w-3xl mx-auto space-y-3">
            <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono uppercase font-bold tracking-wider">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{{ isRtl() ? 'المزايا التنافسية' : 'COMPETITIVE ADVANTAGE' }}</span>
            </div>
            <h3 class="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
              {{ isRtl() ? 'لماذا تختار مافريك للشحن البحري؟' : 'Why Choose Maverick Shipping?' }}
            </h3>
            <p class="text-xs sm:text-sm text-slate-300">
              {{ isRtl()
                ? 'نقدم مزيجاً متكاملاً من التغطية الجغرافية الاستراتيجية والموثوقية العالية والمرونة التجارية لدعم تدفق بضائعك.'
                : 'A strategic combination of regional geographic coverage, schedule reliability, and dedicated customer commitment.' }}
            </p>
          </div>

          <!-- 6 Grid Cards -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <!-- Card 1 -->
            <div class="p-6 rounded-2xl bg-slate-950/70 border border-white/10 hover:border-amber-400/50 transition-all shadow-xl group">
              <div class="w-10 h-10 rounded-xl bg-amber-400/10 text-amber-400 border border-amber-400/20 flex items-center justify-center font-bold text-base mb-4 group-hover:scale-110 transition-transform">
                🌐
              </div>
              <h4 class="text-base font-black text-white group-hover:text-amber-400 transition-colors">
                {{ isRtl() ? 'الربط الاستراتيجي' : 'Strategic Connectivity' }}
              </h4>
              <p class="text-xs text-slate-300 mt-2 leading-relaxed">
                {{ isRtl() 
                  ? 'ربط مباشر وسلس بين أهم وجهات ومراكز التجارة الإقليمية عبر عُمان والهند وباكستان.' 
                  : 'Connecting important regional trade destinations across Sohar, Nhava Sheva, Mundra, and Karachi.' }}
              </p>
            </div>

            <!-- Card 2 -->
            <div class="p-6 rounded-2xl bg-slate-950/70 border border-white/10 hover:border-emerald-400/50 transition-all shadow-xl group">
              <div class="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold text-base mb-4 group-hover:scale-110 transition-transform">
                ⚓
              </div>
              <h4 class="text-base font-black text-white group-hover:text-emerald-400 transition-colors">
                {{ isRtl() ? 'الموثوقية ودقة المواعيد' : 'Reliability' }}
              </h4>
              <p class="text-xs text-slate-300 mt-2 leading-relaxed">
                {{ isRtl()
                  ? 'تركيز مطلق على تقديم خدمة متسقة وموثوقة بنسبة دقة مواعيد تصل إلى 99.4%.'
                  : 'Focus on consistent and dependable service delivery with fixed-day weekly sailing commitments.' }}
              </p>
            </div>

            <!-- Card 3 -->
            <div class="p-6 rounded-2xl bg-slate-950/70 border border-white/10 hover:border-sky-400/50 transition-all shadow-xl group">
              <div class="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center justify-center font-bold text-base mb-4 group-hover:scale-110 transition-transform">
                🤝
              </div>
              <h4 class="text-base font-black text-white group-hover:text-sky-400 transition-colors">
                {{ isRtl() ? 'الالتزام تجاه العميل' : 'Customer Commitment' }}
              </h4>
              <p class="text-xs text-slate-300 mt-2 leading-relaxed">
                {{ isRtl()
                  ? 'تواصل سريع ودعم مخصص لتلبية كافة متطلبات خطوط الشحن والوكلاء بكفاءة.'
                  : 'Responsive communication, agile booking desks, and personalized customer support 24/7.' }}
              </p>
            </div>

            <!-- Card 4 -->
            <div class="p-6 rounded-2xl bg-slate-950/70 border border-white/10 hover:border-amber-400/50 transition-all shadow-xl group">
              <div class="w-10 h-10 rounded-xl bg-amber-400/10 text-amber-400 border border-amber-400/20 flex items-center justify-center font-bold text-base mb-4 group-hover:scale-110 transition-transform">
                ⚡
              </div>
              <h4 class="text-base font-black text-white group-hover:text-amber-400 transition-colors">
                {{ isRtl() ? 'الكفاءة التشغيلية' : 'Operational Efficiency' }}
              </h4>
              <p class="text-xs text-slate-300 mt-2 leading-relaxed">
                {{ isRtl()
                  ? 'تحسين مستمر لعمليات الرسو في الموانئ وحركة الحاويات لتسريع زمن الترانزيت.'
                  : 'Focused on optimizing port calls, berthing turnaround, and rapid port-to-port container movement.' }}
              </p>
            </div>

            <!-- Card 5 -->
            <div class="p-6 rounded-2xl bg-slate-950/70 border border-white/10 hover:border-emerald-400/50 transition-all shadow-xl group">
              <div class="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold text-base mb-4 group-hover:scale-110 transition-transform">
                🧭
              </div>
              <h4 class="text-base font-black text-white group-hover:text-emerald-400 transition-colors">
                {{ isRtl() ? 'الخبرة الإقليمية المتعمقة' : 'Regional Expertise' }}
              </h4>
              <p class="text-xs text-slate-300 mt-2 leading-relaxed">
                {{ isRtl()
                  ? 'فهم عميق لأسواق الشحن في الخليج العربي وشبه القارة الهندية ومتطلبات الموانئ.'
                  : 'Deep commercial and operational understanding of Arabian Gulf, Indian, and Pakistani shipping markets.' }}
              </p>
            </div>

            <!-- Card 6 -->
            <div class="p-6 rounded-2xl bg-slate-950/70 border border-white/10 hover:border-sky-400/50 transition-all shadow-xl group">
              <div class="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center justify-center font-bold text-base mb-4 group-hover:scale-110 transition-transform">
                🔗
              </div>
              <h4 class="text-base font-black text-white group-hover:text-sky-400 transition-colors">
                {{ isRtl() ? 'منهجية الشراكة الاستراتيجية' : 'Partnership Approach' }}
              </h4>
              <p class="text-xs text-slate-300 mt-2 leading-relaxed">
                {{ isRtl()
                  ? 'بناء علاقات متينة ومثمرة مع خطوط الشحن العالمية ووكلاء الشحن ومزودي الخدمات اللوجستية.'
                  : 'Building strong relationships with shipping lines, freight forwarders, and logistics providers.' }}
              </p>
            </div>
          </div>
        </div>

        <!-- =========================================================
             3. PORTS COVERED SHOWCASE (4 STRATEGIC REGIONAL GATEWAYS)
             ========================================================= -->
        <div class="space-y-6">
          <div class="flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <span class="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
                {{ isRtl() ? 'تغطية الموانئ' : 'STRATEGIC PORT COVERAGE' }}
              </span>
              <h3 class="text-xl sm:text-2xl font-black text-white mt-1">
                {{ isRtl() ? 'الموانئ المشمولة في مسار الخدمة' : 'Ports Covered Across Key Trade Markets' }}
              </h3>
            </div>
            <div class="text-xs font-mono text-slate-400">
              Corridor: <span class="text-amber-400 font-bold">Sohar ⇄ Nhava Sheva ⇄ Mundra ⇄ Karachi</span>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="p-5 rounded-2xl bg-slate-950/80 border border-white/10 hover:border-amber-400/40 transition-all">
              <div class="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
                <span class="font-bold text-white text-base">Sohar, Oman</span>
                <span class="px-2 py-0.5 rounded bg-amber-400/10 text-amber-300 border border-amber-400/30 text-[10px]">OMSOH</span>
              </div>
              <p class="text-xs text-slate-300 leading-relaxed font-medium">
                {{ isRtl() ? 'البوابة الاستراتيجية إلى الخليج العربي.' : 'Strategic gateway to the Arabian Gulf.' }}
              </p>
            </div>

            <div class="p-5 rounded-2xl bg-slate-950/80 border border-white/10 hover:border-amber-400/40 transition-all">
              <div class="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
                <span class="font-bold text-white text-base">Nhava Sheva, India</span>
                <span class="px-2 py-0.5 rounded bg-amber-400/10 text-amber-300 border border-amber-400/30 text-[10px]">INNSA</span>
              </div>
              <p class="text-xs text-slate-300 leading-relaxed font-medium">
                <span *ngIf="!isRtl()">Major container gateway for India&apos;s western coast.</span>
                <span *ngIf="isRtl()">بوابة الحاويات الرئيسية للساحل الغربي للهند.</span>
              </p>
            </div>

            <div class="p-5 rounded-2xl bg-slate-950/80 border border-white/10 hover:border-amber-400/40 transition-all">
              <div class="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
                <span class="font-bold text-white text-base">Mundra, India</span>
                <span class="px-2 py-0.5 rounded bg-amber-400/10 text-amber-300 border border-amber-400/30 text-[10px]">INMUN</span>
              </div>
              <p class="text-xs text-slate-300 leading-relaxed font-medium">
                {{ isRtl() ? 'مركز تجاري وبحري هام للحاويات.' : 'Important commercial and container hub.' }}
              </p>
            </div>

            <div class="p-5 rounded-2xl bg-slate-950/80 border border-white/10 hover:border-amber-400/40 transition-all">
              <div class="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
                <span class="font-bold text-white text-base">Karachi, Pakistan</span>
                <span class="px-2 py-0.5 rounded bg-amber-400/10 text-amber-300 border border-amber-400/30 text-[10px]">PKKHI</span>
              </div>
              <p class="text-xs text-slate-300 leading-relaxed font-medium">
                <span *ngIf="!isRtl()">Key gateway for Pakistan&apos;s international trade.</span>
                <span *ngIf="isRtl()">البوابة الرئيسية للتجارة الدولية لباكستان.</span>
              </p>
            </div>
          </div>
        </div>

        <!-- =========================================================
             4. TRADE & COMMERCIAL ENQUIRIES ("LET'S MOVE YOUR CARGO TOGETHER")
             ========================================================= -->
        <div class="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-amber-500/30 shadow-2xl relative overflow-hidden">
          <div class="absolute -right-20 -bottom-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div class="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div class="lg:col-span-8 space-y-4">
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-mono font-bold uppercase">
                <span>📦</span>
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
                <span class="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-[11px] font-semibold text-slate-300">
                  ✓ International Shipping Lines
                </span>
                <span class="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-[11px] font-semibold text-slate-300">
                  ✓ Freight Forwarders
                </span>
                <span class="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-[11px] font-semibold text-slate-300">
                  ✓ NVOCC Operators
                </span>
                <span class="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-[11px] font-semibold text-slate-300">
                  ✓ Importers & Exporters
                </span>
                <span class="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-[11px] font-semibold text-slate-300">
                  ✓ Logistics Companies
                </span>
                <span class="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-[11px] font-semibold text-slate-300">
                  ✓ Port & Terminal Operators
                </span>
              </div>
            </div>

            <!-- Action Column (4 cols) -->
            <div class="lg:col-span-4 flex flex-col items-start lg:items-end justify-center gap-3">
              <button
                (click)="service.toggleBookingModal(true)"
                class="w-full sm:w-auto px-7 py-3.5 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs sm:text-sm tracking-wide shadow-xl shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer whitespace-nowrap">
                {{ isRtl() ? 'طلب تسعيرة أو حجز' : 'Request Commercial Booking' }}
              </button>

              <a
                href="tel:+97142105105"
                class="w-full sm:w-auto px-6 py-3 rounded-full bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm border border-slate-700 transition-all flex items-center justify-center gap-2 whitespace-nowrap">
                <svg class="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>+971 4 210 51 05</span>
              </a>

              <span class="text-[10px] font-mono text-slate-400 text-right">
                {{ isRtl() ? 'تواصل معنا لجداول الرحلات واستفسارات الإبحار وحجز الحاويات' : 'Contact us for vessel schedules, sailing enquiries & partnerships' }}
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
