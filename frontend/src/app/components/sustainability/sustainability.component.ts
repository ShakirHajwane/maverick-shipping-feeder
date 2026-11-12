import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaritimeService } from '../../services/maritime.service';

@Component({
  selector: 'app-sustainability',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="sustainability-section" class="py-16 bg-navy-900 border-b border-navy-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <!-- Text Content -->
          <div>
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold tracking-wide uppercase mb-3">
              <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>{{ isRtl() ? 'الاستدامة والحياد الكربوني 2050' : 'GREEN FEEDER INITIATIVE' }}</span>
            </div>

            <h2 class="text-3xl sm:text-4xl font-black text-white leading-tight">
              {{ isRtl() 
                ? 'قيادة التحول الأخضر في النقل البحري الإقليمي' 
                : 'Pioneering Decarbonized Feeder Shipping' }}
            </h2>

            <p class="text-sm sm:text-base text-slate-300 mt-4 leading-relaxed">
              {{ isRtl()
                ? 'ملتزمون بخفض البصمة الكربونية لكل ميل بحري لحاوية، من خلال تبني وقود الميثانول الحيوي، وتوصيل السفن بالكهرباء الشاطئية في ميناء جبل علي، ومسارات الإبحار الذكية.'
                : 'Aligned with IMO 2030 and 2050 decarbonization mandates, our next-generation feeder fleet integrates alternative fuel flexibility, shore-power cold ironing at Jebel Ali, and hydrodynamic hull retrofits to minimize emissions per TEU-mile.' }}
            </p>

            <!-- 3 Key Pillars -->
            <div class="mt-8 space-y-4">
              <div class="flex items-start gap-3.5 p-4 rounded-xl bg-navy-950/70 border border-navy-800">
                <div class="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h4 class="text-xs font-bold text-white uppercase tracking-wider">
                    {{ isRtl() ? 'الكهرباء الشاطئية في الموانئ (Cold Ironing)' : 'Cold Ironing & Shore Power Ready' }}
                  </h4>
                  <p class="text-xs text-slate-400 mt-0.5">
                    {{ isRtl() ? 'إيقاف مولدات الديزل أثناء الرسو في موانئ جبل علي والسخنة واستخدام الكهرباء المتجددة.' : 'Zero-emission port stays by plugging directly into clean shore power at DP World Jebel Ali & Sokhna quays.' }}
                  </p>
                </div>
              </div>

              <div class="flex items-start gap-3.5 p-4 rounded-xl bg-navy-950/70 border border-navy-800">
                <div class="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h4 class="text-xs font-bold text-white uppercase tracking-wider">
                    {{ isRtl() ? 'جاهزية وقود الميثانول الأخضر والبيوديزل' : 'Bio-Methanol & B24 Biofuel Prepared' }}
                  </h4>
                  <p class="text-xs text-slate-400 mt-0.5">
                    {{ isRtl() ? 'تجارب تشغيلية مستمرة لخليط B24 لتخفيض انبعاثات ثاني أكسيد الكربون بنسبة 20%.' : 'Fleet bunkering trials utilizing ISCC-certified B24 biofuel blends with up to 20% GHG reduction.' }}
                  </p>
                </div>
              </div>

              <div class="flex items-start gap-3.5 p-4 rounded-xl bg-navy-950/70 border border-navy-800">
                <div class="w-8 h-8 rounded-lg bg-amber-400/10 text-amber-400 flex items-center justify-center shrink-0">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h4 class="text-xs font-bold text-white uppercase tracking-wider">
                    {{ isRtl() ? 'توجيه المسارات بالذكاء الاصطناعي والطقس' : 'AI Weather & Trim Optimization' }}
                  </h4>
                  <p class="text-xs text-slate-400 mt-0.5">
                    {{ isRtl() ? 'خوارزميات تحسين السرعة واستهلاك الوقود حسب التيارات البحرية والرياح في المحيط الهندي.' : 'Digital twins and hydrodynamic trim monitoring shaving 7-12% off propulsion fuel demands.' }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Infographic Card -->
          <div class="relative bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 rounded-2xl border border-navy-700/80 p-8 shadow-2xl overflow-hidden">
            <div class="absolute -right-20 -top-20 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div class="flex items-center justify-between border-b border-navy-800 pb-4 mb-6">
              <span class="text-xs font-mono text-amber-400 uppercase font-bold">IMO CII RATING COMPLIANCE</span>
              <span class="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">Rating: A / B Certified</span>
            </div>

            <!-- Visual Bar Metrics -->
            <div class="space-y-6">
              <div>
                <div class="flex justify-between text-xs font-semibold mb-1.5">
                  <span class="text-slate-300">Fleet Shore-Power Compatibility</span>
                  <span class="text-amber-400 font-mono font-bold">85%</span>
                </div>
                <div class="w-full h-2 rounded-full bg-navy-800 overflow-hidden">
                  <div class="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full" style="width: 85%"></div>
                </div>
              </div>

              <div>
                <div class="flex justify-between text-xs font-semibold mb-1.5">
                  <span class="text-slate-300">Carbon Intensity Indicator (CII) Reduction</span>
                  <span class="text-emerald-400 font-mono font-bold">-22.4%</span>
                </div>
                <div class="w-full h-2 rounded-full bg-navy-800 overflow-hidden">
                  <div class="h-full bg-emerald-500 rounded-full" style="width: 72%"></div>
                </div>
              </div>

              <div>
                <div class="flex justify-between text-xs font-semibold mb-1.5">
                  <span class="text-slate-300">Biofuel Blend Readiness</span>
                  <span class="text-amber-400 font-mono font-bold">100%</span>
                </div>
                <div class="w-full h-2 rounded-full bg-navy-800 overflow-hidden">
                  <div class="h-full bg-amber-400 rounded-full" style="width: 100%"></div>
                </div>
              </div>
            </div>

            <!-- Quote badge -->
            <div class="mt-8 p-4 rounded-xl bg-navy-900/90 border border-navy-800 text-xs text-slate-300 italic">
              "Feeder shipping is the indispensable artery linking world trade hubs with regional economies. Our responsibility is delivering speed and sustainability simultaneously."
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
