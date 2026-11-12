import { Component, inject, signal } from '@angular/core';
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
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      
      <!-- Backdrop click -->
      <div (click)="close()" class="absolute inset-0"></div>

      <!-- Modal Card -->
      <div class="relative w-full max-w-xl bg-navy-900 border border-navy-700 rounded-2xl shadow-2xl z-10 overflow-hidden">
        
        <!-- Header -->
        <div class="p-6 border-b border-navy-800 flex items-center justify-between bg-navy-950/80">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-ocean-500/10 border border-ocean-500/30 flex items-center justify-center text-ocean-400">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h3 class="text-xl font-black text-white">{{ isRtl() ? 'طلب تسعيرة وحجز مساحة حاويات' : 'Request Feeder Slot / Rate Quote' }}</h3>
              <p class="text-xs text-slate-400 mt-0.5">Middle East, Red Sea & Indian Subcontinent Corridors</p>
            </div>
          </div>

          <button (click)="close()" class="p-2 rounded-lg bg-navy-800 text-slate-400 hover:text-white transition-colors cursor-pointer">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Form Body -->
        <div class="p-6 space-y-4">
          <div *ngIf="submitted()" class="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs">
            <div class="flex items-center gap-2 font-bold text-emerald-400 mb-1">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>{{ isRtl() ? 'تم استلام طلب الحجز بنجاح!' : 'Inquiry Received Successfully!' }}</span>
            </div>
            <p>{{ isRtl() ? 'سيقوم مسؤول العمليات التجارية بالتواصل معك خلال ساعتين برقم التسعيرة وتأكيد المساحة.' : 'Our commercial liner desk will respond within 2 hours with validated slot allocation and tariff confirmation.' }}</p>
          </div>

          <form *ngIf="!submitted()" (submit)="submitBooking($event)" class="space-y-4 text-xs">
            <div class="grid grid-cols-2 gap-3">
              <div class="space-y-1">
                <label class="block font-bold text-slate-400 uppercase tracking-wider">Port of Loading (POL)</label>
                <select [(ngModel)]="bookingData.pol" name="pol" class="w-full bg-navy-950 border border-navy-700 rounded-xl px-3 py-2.5 text-white">
                  <option value="Jebel Ali (AEJEA)">Jebel Ali (AEJEA)</option>
                  <option value="Mundra (INMUN)">Mundra (INMUN)</option>
                  <option value="Singapore (SGSIN)">Singapore (SGSIN)</option>
                  <option value="Jeddah (SAJED)">Jeddah (SAJED)</option>
                  <option value="Dammam (SADMN)">Dammam (SADMN)</option>
                </select>
              </div>

              <div class="space-y-1">
                <label class="block font-bold text-slate-400 uppercase tracking-wider">Port of Discharge (POD)</label>
                <select [(ngModel)]="bookingData.pod" name="pod" class="w-full bg-navy-950 border border-navy-700 rounded-xl px-3 py-2.5 text-white">
                  <option value="Sokhna (EGSOK)">Ain Sokhna (EGSOK)</option>
                  <option value="Singapore (SGSIN)">Singapore (SGSIN)</option>
                  <option value="Mundra (INMUN)">Mundra (INMUN)</option>
                  <option value="Colombo (LKCMB)">Colombo (LKCMB)</option>
                  <option value="Nhava Sheva (INNSA)">Nhava Sheva (INNSA)</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div class="space-y-1">
                <label class="block font-bold text-slate-400 uppercase tracking-wider">Container Type</label>
                <select [(ngModel)]="bookingData.containerType" name="containerType" class="w-full bg-navy-950 border border-navy-700 rounded-xl px-3 py-2.5 text-white">
                  <option value="20GP">20' Dry Standard (20GP)</option>
                  <option value="40HC">40' High Cube (40HC)</option>
                  <option value="40RF">40' Reefer Temperature Controlled (40RF)</option>
                  <option value="SOC">Shipper Owned Container (SOC)</option>
                </select>
              </div>

              <div class="space-y-1">
                <label class="block font-bold text-slate-400 uppercase tracking-wider">Volume (TEU Quantity)</label>
                <input [(ngModel)]="bookingData.quantity" name="quantity" type="number" min="1" max="500" class="w-full bg-navy-950 border border-navy-700 rounded-xl px-3 py-2 text-white" />
              </div>
            </div>

            <div class="space-y-1">
              <label class="block font-bold text-slate-400 uppercase tracking-wider">Company / Line Operator</label>
              <input [(ngModel)]="bookingData.company" name="company" type="text" placeholder="e.g., Maersk, CMA CGM, Hapag-Lloyd, NVOCC..." class="w-full bg-navy-950 border border-navy-700 rounded-xl px-3 py-2 text-white" required />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div class="space-y-1">
                <label class="block font-bold text-slate-400 uppercase tracking-wider">Work Email</label>
                <input [(ngModel)]="bookingData.email" name="email" type="email" placeholder="commercial@shipper.com" class="w-full bg-navy-950 border border-navy-700 rounded-xl px-3 py-2 text-white" required />
              </div>

              <div class="space-y-1">
                <label class="block font-bold text-slate-400 uppercase tracking-wider">Phone / WhatsApp</label>
                <input [(ngModel)]="bookingData.phone" name="phone" type="text" placeholder="+971 50 123 4567" class="w-full bg-navy-950 border border-navy-700 rounded-xl px-3 py-2 text-white" required />
              </div>
            </div>

            <div class="pt-4 flex items-center justify-end gap-3">
              <button (click)="close()" type="button" class="px-4 py-2 rounded-xl bg-navy-800 text-slate-300 font-semibold text-xs border border-navy-700">
                {{ isRtl() ? 'إلغاء' : 'Cancel' }}
              </button>
              <button type="submit" class="px-5 py-2 rounded-xl bg-ocean-500 hover:bg-ocean-400 text-navy-950 font-bold text-xs shadow-lg shadow-ocean-500/20 cursor-pointer">
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
    pol: 'Jebel Ali (AEJEA)',
    pod: 'Sokhna (EGSOK)',
    containerType: '40HC',
    quantity: 10,
    company: '',
    email: '',
    phone: ''
  };

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
