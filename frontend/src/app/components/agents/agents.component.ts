import { Component, ElementRef, ViewChild, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaritimeService } from '../../services/maritime.service';
import { RegionalAgent } from '../../models/maritime.models';

@Component({
  selector: 'app-agents',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="agents-section" class="py-16 bg-white border-b border-slate-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-8">
        <!-- Section Header -->
        <div class="flex flex-wrap items-end justify-between gap-4 mb-6">
          <div>
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-[#dd0103] text-xs font-semibold tracking-wide uppercase mb-2">
              <span class="w-2 h-2 rounded-full bg-[#dd0103]"></span>
              <span>{{ isRtl() ? 'المكاتب الإقليمية والوكلاء' : 'GLOBAL COMMERCIAL PRESENCE' }}</span>
            </div>
            <h2 class="text-2xl sm:text-4xl font-black text-[#02194b]">
              {{ isRtl() ? 'شبكة الوكلاء والمكاتب الإقليمية' : 'Regional Offices & Dedicated Agents' }}
            </h2>
            <p class="text-sm text-slate-600 mt-1 max-w-2xl">
              {{ isRtl()
                ? 'فريق عمل متمرس في موانئ دبي وأبوظبي وجدة ومومباي وسنغافورة وشنغهاي لخدمة جميع احتياجات الشحن والمناولة.'
                : 'Local expertise across primary shipping corridors with dedicated operations desks, documentation teams, and 24/7 port agency support.' }}
            </p>
          </div>

          <!-- View Mode Switcher & Offices Count -->
          <div class="flex flex-wrap items-center gap-3">
            <div class="inline-flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-inner">
              <button
                (click)="setViewMode('carousel')"
                [class]="viewMode() === 'carousel' ? 'bg-white text-[#02194b] font-bold shadow-sm' : 'text-slate-600 hover:text-slate-900'"
                class="px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-all cursor-pointer">
                <svg class="w-3.5 h-3.5 text-[#dd0103]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                </svg>
                <span>{{ isRtl() ? 'عرض المنزلق' : 'Carousel Slider' }}</span>
              </button>
              <button
                (click)="setViewMode('grid')"
                [class]="viewMode() === 'grid' ? 'bg-white text-[#02194b] font-bold shadow-sm' : 'text-slate-600 hover:text-slate-900'"
                class="px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-all cursor-pointer">
                <svg class="w-3.5 h-3.5 text-[#dd0103]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                <span>{{ isRtl() ? 'شبكة مدمجة' : 'Compact Grid' }}</span>
              </button>
              <button
                (click)="setViewMode('list')"
                [class]="viewMode() === 'list' ? 'bg-white text-[#02194b] font-bold shadow-sm' : 'text-slate-600 hover:text-slate-900'"
                class="hidden sm:flex px-3 py-1.5 rounded-lg text-xs items-center gap-1.5 transition-all cursor-pointer">
                <svg class="w-3.5 h-3.5 text-[#dd0103]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <span>{{ isRtl() ? 'قائمة المكاتب' : 'Directory List' }}</span>
              </button>
            </div>

            <!-- Total Count Badge -->
            <div class="text-xs font-mono text-slate-600 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl shadow-xs">
              {{ isRtl() ? 'المكاتب:' : 'Offices:' }} <span class="text-[#dd0103] font-bold">{{ filteredAgents().length }}</span> / {{ service.agents().length }}
            </div>
          </div>
        </div>

        <!-- Country Filter Pills Bar -->
        <div class="flex flex-wrap items-center gap-2 mb-6">
          <button
            *ngFor="let country of countries"
            (click)="filterCountry(country.val)"
            [class]="selectedCountry === country.val 
              ? 'bg-[#dd0103] text-white font-bold border-[#dd0103] shadow-md shadow-red-600/20' 
              : 'bg-slate-50 text-slate-700 border-slate-300 hover:border-[#dd0103] hover:text-[#02194b] shadow-xs'"
            class="px-3.5 py-1.5 rounded-xl text-xs border transition-all cursor-pointer">
            {{ country.label }}
          </button>
        </div>

        <!-- =========================================================
             VIEW 1: CAROUSEL SLIDER (DEFAULT • ZERO SCROLL CLUTTER)
             ========================================================= -->
        <div *ngIf="viewMode() === 'carousel'" class="relative space-y-4">
          <!-- Slider Navigation Header -->
          <div class="flex items-center justify-between px-1">
            <div class="flex items-center gap-2">
              <span class="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                {{ isRtl() ? 'المكتب' : 'Office' }} <span class="text-[#dd0103]">{{ activeCarouselIndex() + 1 }}</span> / {{ filteredAgents().length }}
              </span>
              <span class="hidden sm:inline-block text-[11px] text-slate-500">
                {{ isRtl() ? 'مرر أفقياً أو اضغط الأسهم للوصول للمكتب المطلوب' : 'Swipe horizontally or use arrows to navigate regional desks' }}
              </span>
            </div>

            <div class="flex items-center gap-2">
              <button
                (click)="scrollPrev()"
                [disabled]="activeCarouselIndex() === 0"
                class="w-8 h-8 rounded-full bg-white hover:bg-slate-50 disabled:opacity-35 disabled:cursor-not-allowed border border-slate-300 shadow-sm flex items-center justify-center text-[#02194b] hover:text-[#dd0103] transition-all cursor-pointer"
                [attr.aria-label]="isRtl() ? 'السابق' : 'Previous office'">
                <svg class="w-4 h-4" [class.rotate-180]="isRtl()" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                (click)="scrollNext()"
                [disabled]="activeCarouselIndex() >= filteredAgents().length - 1"
                class="w-8 h-8 rounded-full bg-white hover:bg-slate-50 disabled:opacity-35 disabled:cursor-not-allowed border border-slate-300 shadow-sm flex items-center justify-center text-[#02194b] hover:text-[#dd0103] transition-all cursor-pointer"
                [attr.aria-label]="isRtl() ? 'التالي' : 'Next office'">
                <svg class="w-4 h-4" [class.rotate-180]="isRtl()" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Horizontal Smooth Snap Carousel Track -->
          <div
            #agentSlider
            (scroll)="onSliderScroll($event)"
            class="flex overflow-x-auto snap-x snap-mandatory scrollbar-none gap-4 sm:gap-6 pb-4 pt-1 px-1 scroll-smooth">
            <div
              *ngFor="let agent of filteredAgents()"
              class="w-[85vw] sm:w-[340px] lg:w-[360px] shrink-0 snap-start bg-white border border-slate-200 hover:border-[#dd0103]/80 rounded-2xl p-5 transition-all hover:-translate-y-1 group flex flex-col justify-between shadow-md hover:shadow-xl">
              <ng-container *ngTemplateOutlet="agentCard; context: { agent: agent }" />
            </div>
          </div>

          <!-- Mobile Swipe Indicator Hint -->
          <div class="sm:hidden flex items-center justify-center gap-1.5 text-[11px] font-mono text-slate-600 pt-1">
            <span class="text-[#dd0103]">←</span>
            <span>{{ isRtl() ? 'مرر أفقياً لتصفح جميع المكاتب' : 'Swipe horizontally to browse offices' }}</span>
            <span class="text-[#dd0103]">→</span>
          </div>
        </div>

        <!-- =========================================================
             VIEW 2: PAGINATED COMPACT GRID (6 PER PAGE • CLEAN HEIGHT)
             ========================================================= -->
        <div *ngIf="viewMode() === 'grid'" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              *ngFor="let agent of pagedAgents()"
              class="bg-white border border-slate-200 hover:border-[#dd0103]/80 rounded-2xl p-5 transition-all hover:-translate-y-1 group flex flex-col justify-between shadow-md hover:shadow-xl">
              <ng-container *ngTemplateOutlet="agentCard; context: { agent: agent }" />
            </div>
          </div>

          <!-- Pagination Bar -->
          <div class="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-200">
            <div class="text-xs text-slate-600 font-medium">
              {{ isRtl() ? 'عرض' : 'Showing' }} <span class="font-bold text-[#02194b]">{{ pagedAgents().length }}</span> {{ isRtl() ? 'من أصل' : 'of' }} <span class="font-bold text-[#dd0103]">{{ filteredAgents().length }}</span> {{ isRtl() ? 'مكاتب' : 'offices' }}
            </div>

            <div class="flex items-center gap-2">
              <button
                (click)="goToPage(currentPage() - 1)"
                [disabled]="currentPage() === 1"
                class="px-3 py-1.5 rounded-lg text-xs border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed font-medium text-slate-700 cursor-pointer">
                {{ isRtl() ? 'السابق' : 'Previous' }}
              </button>

              <button
                *ngFor="let p of pageNumbers()"
                (click)="goToPage(p)"
                [class]="currentPage() === p 
                  ? 'bg-[#dd0103] text-white font-bold border-[#dd0103]' 
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'"
                class="w-7 h-7 rounded-lg text-xs border flex items-center justify-center font-mono cursor-pointer transition-colors">
                {{ p }}
              </button>

              <button
                (click)="goToPage(currentPage() + 1)"
                [disabled]="currentPage() >= totalPages()"
                class="px-3 py-1.5 rounded-lg text-xs border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed font-medium text-slate-700 cursor-pointer">
                {{ isRtl() ? 'التالي' : 'Next' }}
              </button>

              <button
                (click)="toggleShowAllGrid()"
                class="ml-2 text-xs font-bold text-[#dd0103] hover:underline cursor-pointer">
                {{ showAllGrid() ? (isRtl() ? 'عرض بالصفحات' : 'Paginate (6/pg)') : (isRtl() ? 'عرض الكل (' + filteredAgents().length + ')' : 'Show All (' + filteredAgents().length + ')') }}
              </button>
            </div>
          </div>
        </div>

        <!-- =========================================================
             VIEW 3: HIGH-DENSITY DIRECTORY LIST VIEW
             ========================================================= -->
        <div *ngIf="viewMode() === 'list'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            *ngFor="let agent of filteredAgents()"
            class="bg-white border border-slate-200 hover:border-[#dd0103] rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex items-center justify-between gap-4 group">
            
            <div class="space-y-1 min-w-0">
              <div class="flex items-center gap-2">
                <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-[#dd0103] border border-red-200">
                  {{ agent.country }}
                </span>
                <span class="text-xs font-bold text-slate-500">{{ agent.city }}</span>
              </div>
              <h3 class="text-sm font-bold text-[#02194b] group-hover:text-[#dd0103] transition-colors truncate">
                {{ agent.office_name }}
              </h3>
              <p class="text-[11px] text-slate-500 truncate">{{ agent.address }}</p>
            </div>

            <!-- Direct Quick Action Buttons -->
            <div class="flex items-center gap-1.5 shrink-0">
              <a
                [href]="'tel:' + agent.phone"
                class="p-2 rounded-xl bg-slate-50 hover:bg-[#dd0103] text-slate-700 hover:text-white border border-slate-200 transition-colors"
                [title]="'Call: ' + agent.phone">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </a>

              <a
                [href]="'mailto:' + agent.email"
                class="p-2 rounded-xl bg-slate-50 hover:bg-[#dd0103] text-slate-700 hover:text-white border border-slate-200 transition-colors"
                [title]="'Email: ' + agent.email">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </a>

              <button
                (click)="locateAgent(agent)"
                class="p-2 rounded-xl bg-red-50 hover:bg-[#dd0103] text-[#dd0103] hover:text-white border border-red-200 transition-colors cursor-pointer"
                [title]="isRtl() ? 'تحديد الموقع على الخريطة' : 'Locate on Map'">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Zero Results Fallback -->
        <div *ngIf="filteredAgents().length === 0" class="p-12 text-center text-slate-500 bg-slate-50 rounded-2xl border border-slate-200 mt-6 shadow-sm">
          <p class="text-base font-medium">{{ isRtl() ? 'لا يوجد وكلاء في الدولة المحددة حالياً.' : 'No agents match the specified country.' }}</p>
          <button (click)="filterCountry('all')" class="mt-3 text-xs text-[#dd0103] font-semibold underline cursor-pointer">{{ isRtl() ? 'عرض جميع الدول' : 'Show all countries' }}</button>
        </div>

      </div>

      <!-- =========================================================
           REUSABLE AGENT CARD TEMPLATE
           ========================================================= -->
      <ng-template #agentCard let-agent="agent">
        <div>
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs px-2.5 py-0.5 rounded-full bg-red-50 text-[#dd0103] border border-red-200 font-bold">
              {{ agent.country }}
            </span>
            <span class="text-xs font-bold text-slate-500 flex items-center gap-1">
              <svg class="w-3.5 h-3.5 text-[#dd0103]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              <span>{{ agent.city }}</span>
            </span>
          </div>

          <h3 class="text-base font-bold text-[#02194b] group-hover:text-[#dd0103] transition-colors">
            {{ agent.office_name }}
          </h3>

          <p class="text-xs text-slate-500 mt-1.5 leading-relaxed line-clamp-2">
            {{ agent.address }}
          </p>

          <!-- Contact Info -->
          <div class="mt-3.5 pt-3 border-t border-slate-100 space-y-1.5 text-xs">
            <div class="flex items-center gap-2">
              <svg class="w-3.5 h-3.5 text-[#dd0103] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <a [href]="'tel:' + agent.phone" class="text-slate-700 hover:text-[#dd0103] font-mono transition-colors font-medium">
                {{ agent.phone }}
              </a>
            </div>

            <div class="flex items-center gap-2">
              <svg class="w-3.5 h-3.5 text-[#dd0103] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <a [href]="'mailto:' + agent.email" class="text-slate-700 hover:text-[#dd0103] transition-colors truncate">
                {{ agent.email }}
              </a>
            </div>
          </div>
        </div>

        <!-- Locate on Map Button -->
        <div class="mt-4 pt-3 border-t border-slate-100">
          <button
            (click)="locateAgent(agent)"
            class="w-full py-2 px-3 rounded-xl bg-slate-50 hover:bg-[#dd0103] hover:text-white text-slate-800 text-xs font-bold border border-slate-300 hover:border-[#dd0103] shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer">
            <svg class="w-3.5 h-3.5 text-[#dd0103] group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            <span>{{ isRtl() ? 'تحديد الموقع على الخريطة' : 'Locate on Map' }}</span>
          </button>
        </div>
      </ng-template>

    </section>
  `
})
export class AgentsDirectoryComponent {
  service = inject(MaritimeService);
  isRtl = this.service.isRtl;

  @ViewChild('agentSlider') sliderRef?: ElementRef<HTMLDivElement>;

  selectedCountry = 'all';
  viewMode = signal<'carousel' | 'grid' | 'list'>('carousel');
  activeCarouselIndex = signal<number>(0);
  currentPage = signal<number>(1);
  showAllGrid = signal<boolean>(false);
  readonly pageSize = 6;

  countries = [
    { label: 'All Countries', val: 'all' },
    { label: 'UAE', val: 'UAE' },
    { label: 'Saudi Arabia', val: 'Saudi Arabia' },
    { label: 'India', val: 'India' },
    { label: 'Singapore', val: 'Singapore' },
    { label: 'Egypt', val: 'Egypt' },
    { label: 'China', val: 'China' }
  ];

  filteredAgents = signal<RegionalAgent[]>([]);

  pagedAgents = computed(() => {
    const all = this.filteredAgents();
    if (this.showAllGrid()) return all;
    const start = (this.currentPage() - 1) * this.pageSize;
    return all.slice(start, start + this.pageSize);
  });

  totalPages = computed(() => {
    const total = this.filteredAgents().length;
    return Math.max(1, Math.ceil(total / this.pageSize));
  });

  pageNumbers = computed(() => {
    const count = this.totalPages();
    return Array.from({ length: count }, (_, i) => i + 1);
  });

  constructor() {
    this.loadAgents();
  }

  setViewMode(mode: 'carousel' | 'grid' | 'list') {
    this.viewMode.set(mode);
  }

  filterCountry(country: string) {
    this.selectedCountry = country;
    this.currentPage.set(1);
    this.activeCarouselIndex.set(0);
    this.loadAgents();
  }

  loadAgents() {
    this.service.loadAgents(this.selectedCountry).subscribe({
      next: (data) => {
        this.filteredAgents.set(data);
        this.currentPage.set(1);
        this.activeCarouselIndex.set(0);
      }
    });
  }

  scrollPrev() {
    if (this.sliderRef?.nativeElement) {
      const el = this.sliderRef.nativeElement;
      const cardWidth = el.firstElementChild ? (el.firstElementChild as HTMLElement).offsetWidth + 24 : 340;
      el.scrollBy({ left: -cardWidth, behavior: 'smooth' });
    }
  }

  scrollNext() {
    if (this.sliderRef?.nativeElement) {
      const el = this.sliderRef.nativeElement;
      const cardWidth = el.firstElementChild ? (el.firstElementChild as HTMLElement).offsetWidth + 24 : 340;
      el.scrollBy({ left: cardWidth, behavior: 'smooth' });
    }
  }

  onSliderScroll(event: Event) {
    const target = event.target as HTMLElement;
    if (!target) return;
    const cardWidth = target.firstElementChild ? (target.firstElementChild as HTMLElement).offsetWidth + 24 : 340;
    const idx = Math.round(target.scrollLeft / cardWidth);
    this.activeCarouselIndex.set(Math.max(0, Math.min(this.filteredAgents().length - 1, idx)));
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  toggleShowAllGrid() {
    this.showAllGrid.update(v => !v);
  }

  locateAgent(agent: RegionalAgent) {
    this.service.focusLocationOnMap(
      agent.lat,
      agent.lng,
      10,
      agent.office_name,
      `
        <div style="font-family: inherit; padding: 4px;">
          <div style="font-weight: 800; font-size: 13px; color: #DD0103;">${agent.office_name}</div>
          <div style="font-size: 11px; color: #64748B; margin-bottom: 4px;">${agent.city}, ${agent.country}</div>
          <div style="font-size: 11px; color: #1E293B;">${agent.address}</div>
          <div style="font-size: 11px; color: #DD0103; margin-top: 4px; font-weight: 600;"><b>Tel:</b> ${agent.phone}</div>
        </div>
      `
    );
  }
}
