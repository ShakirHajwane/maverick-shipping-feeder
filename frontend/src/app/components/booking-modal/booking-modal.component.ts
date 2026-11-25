import { Component, inject, signal, effect, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaritimeService } from '../../services/maritime.service';

@Component({
  selector: 'app-booking-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div
      *ngIf="isOpen()"
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
      
      <!-- Backdrop click -->
      <div (click)="close()" class="absolute inset-0"></div>

      <!-- Modal Card -->
      <div class="relative w-full max-w-xl bg-white border border-slate-200 rounded-3xl shadow-2xl z-10 overflow-hidden">
        
        <!-- Header -->
        <div class="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-[#dd0103] shadow-sm shrink-0">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h3 id="booking-modal-title" class="text-lg sm:text-xl font-black text-[#02194b]">
                {{ isRtl() ? 'طلب تسعيرة وحجز مساحة حاويات' : 'Request Feeder Slot / Rate Quote' }}
              </h3>
              <p class="text-xs text-slate-500 mt-0.5">
                {{ isRtl() ? 'الخليج العربي والهند وباكستان (خدمة SMNK)' : 'Arabian Gulf, India & Pakistan Corridor (SMNK)' }}
              </p>
            </div>
          </div>

          <button
            type="button"
            aria-label="Close modal"
            (click)="close()"
            class="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-500 hover:text-[#02194b] border border-slate-200 shadow-xs transition-colors cursor-pointer">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Form Body -->
        <div class="p-6 space-y-4">
          <div *ngIf="submitted()" class="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs shadow-sm">
            <div class="flex items-center gap-2 font-bold text-emerald-700 mb-1">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>{{ isRtl() ? 'تم استلام طلب الحجز بنجاح!' : 'Inquiry Received Successfully!' }}</span>
            </div>
            <p>{{ isRtl() ? 'سيقوم مسؤول العمليات التجارية بالتواصل معك خلال ساعتين برقم التسعيرة وتأكيد المساحة.' : 'Our commercial liner desk will respond within 2 hours with validated slot allocation and tariff confirmation.' }}</p>
          </div>

          <form *ngIf="!submitted()" (submit)="submitBooking($event)" class="space-y-4 text-xs">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div class="space-y-1">
                <label class="block font-bold text-slate-600 uppercase tracking-wider">
                  {{ isRtl() ? 'ميناء الشحن (POL)' : 'Port of Loading (POL)' }}
                </label>
                <select [(ngModel)]="bookingData.pol" name="pol" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-[#02194b] font-semibold focus:bg-white focus:border-[#dd0103] focus:outline-none shadow-xs cursor-pointer">
                  <option value="Sohar (OMSOH)">Sohar, Oman (OMSOH)</option>
                  <option value="Nhava Sheva (INNSA)">Nhava Sheva, India (INNSA)</option>
                  <option value="Mundra (INMUN)">Mundra, India (INMUN)</option>
                  <option value="Karachi (PKKHI)">Karachi, Pakistan (PKKHI)</option>
                </select>
              </div>

              <div class="space-y-1">
                <label class="block font-bold text-slate-600 uppercase tracking-wider">
                  {{ isRtl() ? 'ميناء التفريغ (POD)' : 'Port of Discharge (POD)' }}
                </label>
                <select [(ngModel)]="bookingData.pod" name="pod" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-[#02194b] font-semibold focus:bg-white focus:border-[#dd0103] focus:outline-none shadow-xs cursor-pointer">
                  <option value="Nhava Sheva (INNSA)">Nhava Sheva, India (INNSA)</option>
                  <option value="Mundra (INMUN)">Mundra, India (INMUN)</option>
                  <option value="Karachi (PKKHI)">Karachi, Pakistan (PKKHI)</option>
                  <option value="Sohar (OMSOH)">Sohar, Oman (OMSOH)</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div class="space-y-1">
                <label class="block font-bold text-slate-600 uppercase tracking-wider">
                  {{ isRtl() ? 'نوع الحاوية' : 'Container Type' }}
                </label>
                <select [(ngModel)]="bookingData.containerType" name="containerType" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-[#02194b] font-semibold focus:bg-white focus:border-[#dd0103] focus:outline-none shadow-xs cursor-pointer">
                  <option value="20GP">20' Dry Standard (20GP)</option>
                  <option value="40HC">40' High Cube (40HC)</option>
                  <option value="40RF">40' Reefer Temperature Controlled (40RF)</option>
                  <option value="SOC">Shipper Owned Container (SOC)</option>
                </select>
              </div>

              <div class="space-y-1">
                <label class="block font-bold text-slate-600 uppercase tracking-wider">
                  {{ isRtl() ? 'الكمية (TEU)' : 'Volume (TEU Quantity)' }}
                </label>
                <input [(ngModel)]="bookingData.quantity" name="quantity" type="number" min="1" max="500" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-[#02194b] font-semibold focus:bg-white focus:border-[#dd0103] focus:outline-none shadow-xs" />
              </div>
            </div>

            <div class="space-y-1">
              <label class="block font-bold text-slate-600 uppercase tracking-wider">
                {{ isRtl() ? 'الشركة / خط الملاحة' : 'Company / Line Operator' }}
              </label>
              <input [(ngModel)]="bookingData.company" name="company" type="text" placeholder="e.g., Shipping Line, NVOCC, Freight Forwarder..." class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-[#02194b] focus:bg-white focus:border-[#dd0103] focus:outline-none shadow-xs" required />
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div class="space-y-1">
                <label class="block font-bold text-slate-600 uppercase tracking-wider">
                  {{ isRtl() ? 'البريد الإلكتروني للعمل' : 'Work Email' }}
                </label>
                <input [(ngModel)]="bookingData.email" name="email" type="email" placeholder="commercial@company.com" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-[#02194b] focus:bg-white focus:border-[#dd0103] focus:outline-none shadow-xs" required />
              </div>

              <div class="space-y-1">
                <label class="block font-bold text-slate-600 uppercase tracking-wider">
                  {{ isRtl() ? 'الهاتف / واتساب' : 'Phone / WhatsApp' }}
                </label>
                <input [(ngModel)]="bookingData.phone" name="phone" type="text" placeholder="+971 50 123 4567" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-[#02194b] focus:bg-white focus:border-[#dd0103] focus:outline-none shadow-xs" required />
              </div>
            </div>

            <div class="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button (click)="close()" type="button" class="px-5 py-2.5 rounded-full bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs border border-slate-300 shadow-xs cursor-pointer transition-colors">
                {{ isRtl() ? 'إلغاء' : 'Cancel' }}
              </button>
              <button type="submit" class="px-6 py-2.5 rounded-full bg-[#dd0103] hover:bg-[#b50102] text-white font-extrabold text-xs shadow-md shadow-red-600/25 hover:scale-[1.02] transition-all cursor-pointer">
                {{ isRtl() ? 'إرسال طلب الحجز' : 'Submit Slot Booking' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class BookingModalComponent {
  service = inject(MaritimeService);
  isOpen = this.service.isBookingModalOpen;
  isRtl = this.service.isRtl;

  submitted = signal(false);

  bookingData = {
    pol: 'Sohar (OMSOH)',
    pod: 'Nhava Sheva (INNSA)',
    containerType: '40HC',
    quantity: 10,
    company: '',
    email: '',
    phone: ''
  };

  constructor() {
    effect(() => {
      const draft = this.service.bookingDraft();
      if (draft.pol) this.bookingData.pol = draft.pol;
      if (draft.pod) this.bookingData.pod = draft.pod;
      if (draft.containerType) this.bookingData.containerType = draft.containerType;
    });
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    if (this.isOpen()) {
      this.close();
    }
  }

  close() {
    this.service.toggleBookingModal(false);
    this.submitted.set(false);
  }

  submitBooking(e: Event) {
    e.preventDefault();
    this.submitted.set(true);
    setTimeout(() => {
      this.close();
    }, 3000);
  }
}
