import { Component, inject, OnInit, AfterViewInit, OnDestroy, ElementRef, ViewChild, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import { MaritimeService } from '../../services/maritime.service';
import { FeederService } from '../../models/maritime.models';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="interactive-map-section" class="py-16 sm:py-24 bg-white border-y border-slate-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-8">
        <!-- Section Header -->
        <div class="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-[#dd0103] text-xs font-semibold tracking-wide uppercase mb-2">
              <span class="w-2 h-2 rounded-full bg-[#dd0103] animate-pulse"></span>
              <span>{{ isRtl() ? 'خريطة المسارات الملاحية الإقليمية' : 'Interactive Maritime Geonavigator' }}</span>
            </div>
            <h2 class="text-2xl sm:text-4xl font-black text-[#02194b]">
              {{ isRtl() ? 'مسارات الخدمة والموانئ الإقليمية' : 'Regional Feeder Network & Maritime Corridor' }}
            </h2>
            <p class="text-sm text-slate-600 mt-1 max-w-2xl">
              {{ isRtl() 
                ? 'استكشف مسار الدوران الأولي لخدمة التغذية: صحار ← نهافا شيفا ← موندرا ← كراتشي ← صحار عبر الخليج العربي وبحر العرب.' 
                : 'Explore our dedicated regional feeder service connecting Sohar, Nhava Sheva, Mundra, and Karachi across the Arabian Gulf and Indian Subcontinent.' }}
            </p>
          </div>

          <!-- Controls: Map Actions -->
          <div class="flex items-center gap-3">
            <button
              type="button"
              (click)="resetMapView()"
              class="px-4 py-2 rounded-full bg-white hover:bg-slate-50 text-[#02194b] border border-slate-300 hover:border-[#dd0103] shadow-sm text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer">
              <svg class="w-3.5 h-3.5 text-[#dd0103]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
              <span>{{ isRtl() ? 'إعادة ضبط الخريطة' : 'Reset Corridor View' }}</span>
            </button>
          </div>
        </div>

        <!-- Feeder Service Selector Pills -->
        <div class="flex flex-wrap items-center gap-2 mb-6">
          <span class="text-xs font-bold text-slate-500 uppercase tracking-wider me-1">{{ isRtl() ? 'الخدمة النشطة:' : 'Feeder Route:' }}</span>
          <button
            type="button"
            *ngFor="let s of service.services()"
            (click)="selectService(s)"
            [class]="activeService()?.code === s.code 
              ? 'bg-[#dd0103] text-white font-bold border-[#dd0103] shadow-md shadow-red-600/20' 
              : 'bg-white hover:bg-slate-50 text-[#02194b] font-semibold border-slate-300 hover:border-[#dd0103]'"
            class="px-3.5 py-1.5 rounded-full text-xs font-mono border transition-all cursor-pointer">
            {{ s.code }} <span class="font-sans text-[11px] opacity-85">({{ s.transit_days }}d)</span>
          </button>
        </div>

        <!-- Map & Route Rotation Details Split -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Leaflet Map Container (2 Cols) -->
          <div class="lg:col-span-2 relative rounded-3xl overflow-hidden border border-slate-200 shadow-xl bg-slate-100">
            <div #mapContainer class="w-full h-[360px] sm:h-[460px] lg:h-[520px] z-10"></div>

            <!-- Map Floating Badge Overlay -->
            <div class="absolute bottom-4 start-4 z-20 pointer-events-none bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-200 text-xs space-y-1 shadow-md">
              <div class="flex items-center gap-2 text-[#dd0103] font-bold">
                <span class="w-2 h-2 rounded-full bg-[#dd0103]"></span>
                <span>OpenStreetMap Maritime Layer</span>
              </div>
              <div class="text-[11px] text-slate-600">Active Service: <span class="text-[#02194b] font-mono font-semibold">{{ activeService()?.code }}</span></div>
            </div>
          </div>

          <!-- Active Rotation & Hubs Timeline (1 Col) -->
          <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-lg flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
                <div>
                  <span class="text-[10px] uppercase font-bold tracking-wider text-[#dd0103]">{{ isRtl() ? 'المسار المختار' : 'Selected Corridor' }}</span>
                  <h3 class="text-lg font-black text-[#02194b]">{{ activeService()?.name }}</h3>
                </div>
                <span class="text-xs px-2.5 py-1 rounded-full bg-red-50 border border-red-200 font-mono text-[#dd0103] font-bold shrink-0">
                  {{ activeService()?.code }}
                </span>
              </div>

              <!-- Ports Sequence Stepper -->
              <div class="space-y-4 max-h-[360px] overflow-y-auto pe-1">
                <div *ngFor="let port of activeService()?.port_rotation; let i = index; let last = last" class="relative flex items-start gap-3">
                  <!-- Stepper Dot & Line -->
                  <div class="flex flex-col items-center">
                    <button
                      type="button"
                      (click)="focusPort(port.lat, port.lng, port.port_name)"
                      class="w-6 h-6 rounded-full bg-slate-50 border-2 border-[#dd0103] text-[#dd0103] hover:bg-[#dd0103] hover:text-white text-xs font-bold flex items-center justify-center transition-all cursor-pointer shadow-sm">
                      {{ i + 1 }}
                    </button>
                    <div *ngIf="!last" class="w-0.5 h-10 bg-gradient-to-b from-[#dd0103] to-slate-200 my-1"></div>
                  </div>

                  <!-- Port Details -->
                  <div class="flex-1 pb-2">
                    <div class="flex items-center justify-between">
                      <button
                        type="button"
                        (click)="focusPort(port.lat, port.lng, port.port_name)"
                        class="text-xs font-bold text-[#02194b] hover:text-[#dd0103] text-start transition-colors cursor-pointer">
                        {{ port.port_name }}
                      </button>
                      <span class="text-[10px] font-mono text-slate-600 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded">
                        {{ port.unlocode }}
                      </span>
                    </div>
                    <div class="text-[11px] text-slate-500 mt-0.5">
                      {{ port.terminal || 'Container Terminal' }}
                    </div>
                    <div *ngIf="port.day_of_week" class="text-[10px] text-[#dd0103] font-medium mt-0.5">
                      Call Day: {{ port.day_of_week }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Rotation Metrics Footer -->
            <div class="pt-4 border-t border-slate-100 mt-6 grid grid-cols-2 gap-3 text-center">
              <div class="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span class="text-[10px] text-slate-500 uppercase font-semibold">{{ isRtl() ? 'مدة الدورة' : 'Round Transit' }}</span>
                <p class="text-sm font-bold text-[#02194b] font-mono">{{ activeService()?.transit_days }} Days</p>
              </div>
              <div class="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span class="text-[10px] text-slate-500 uppercase font-semibold">{{ isRtl() ? 'التواتر' : 'Frequency' }}</span>
                <p class="text-sm font-bold text-[#dd0103] font-mono">{{ activeService()?.frequency }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `
})
export class InteractiveMapComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;

  service = inject(MaritimeService);
  activeService = this.service.selectedService;
  isRtl = this.service.isRtl;

  private map: L.Map | null = null;
  private routePolyline: L.Polyline | null = null;
  private portMarkers: L.Marker[] = [];

  constructor() {
    // React to selected service changes
    effect(() => {
      const s = this.activeService();
      if (s && this.map) {
        this.renderServiceRoute(s);
      }
    });

    // React to map focus requests
    effect(() => {
      const loc = this.service.focusedMapLocation();
      if (loc && this.map) {
        this.map.flyTo([loc.lat, loc.lng], loc.zoom || 8, {
          duration: 1.5
        });
        if (loc.popupHtml) {
          L.popup()
            .setLatLng([loc.lat, loc.lng])
            .setContent(loc.popupHtml)
            .openOn(this.map);
        }
      }
    });
  }

  ngOnInit() {}

  ngAfterViewInit() {
    this.initMap();
  }

  ngOnDestroy() {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }

  private initMap() {
    if (!this.mapContainer) return;

    // Center between Middle East and Southeast Asia
    this.map = L.map(this.mapContainer.nativeElement, {
      center: [20.0, 68.0],
      zoom: 4,
      minZoom: 3,
      maxZoom: 14,
      scrollWheelZoom: true
    });

    // Free OpenStreetMap tiles - zero API key required, crisp maritime cartography
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(this.map);

    setTimeout(() => {
      if (this.map) {
        this.map.invalidateSize();
        if (this.activeService()) {
          this.renderServiceRoute(this.activeService()!);
        }
      }
    }, 250);
  }

  selectService(s: FeederService) {
    this.service.selectService(s);
  }

  renderServiceRoute(service: FeederService) {
    if (!this.map) return;

    // Clear existing route and port markers
    if (this.routePolyline) {
      this.map.removeLayer(this.routePolyline);
      this.routePolyline = null;
    }
    this.portMarkers.forEach(m => this.map?.removeLayer(m));
    this.portMarkers = [];

    const ports = service.port_rotation || [];
    if (ports.length === 0) return;

    // Realistic sea fairway waypoints for Sohar → Nhava Sheva → Mundra → Karachi → Sohar
    let latLngs: [number, number][] = [];
    if (service.code === 'SMNK') {
      latLngs = [
        [24.498, 56.628], // 1. Sohar Port (Oman – Strategic gateway to Arabian Gulf)
        [24.00, 59.00],   // Gulf of Oman passage outbound
        [22.00, 64.00],   // Arabian Sea direct SE fairway toward Mumbai
        [20.50, 68.50],   // Open deep-water transit
        [19.20, 72.50],   // Approach to Mumbai Fairway
        [18.950, 72.951], // 2. Nhava Sheva (JNPT Mumbai – Major container gateway)
        [19.20, 72.50],   // Departure heading north
        [20.40, 71.00],   // Off Diu Cape
        [21.20, 69.50],   // Off Porbandar
        [22.30, 68.80],   // Rounding Dwarka headland
        [22.50, 68.60],   // Entrance to Gulf of Kutch
        [22.842, 69.712], // 3. Mundra Port (India – Commercial & container hub)
        [22.50, 68.60],   // Departure Gulf of Kutch
        [23.20, 68.00],   // Rounding Kori Creek offshore
        [24.00, 67.20],   // Off Indus Delta NW channel
        [24.805, 66.975], // 4. Karachi Port (Pakistan – Key international gateway)
        [24.50, 64.00],   // Northern Arabian Sea west lane
        [24.40, 60.50],   // Off Gwadar offshore
        [24.40, 57.50],   // Gulf of Oman entrance
        [24.498, 56.628]  // 5. Sohar Port (Full Loop Closed)
      ];
    } else {
      latLngs = ports.map(p => [p.lat, p.lng]);
      if (ports.length > 1) {
        latLngs.push([ports[0].lat, ports[0].lng]);
      }
    }

    // Draw glowing feeder polyline
    this.routePolyline = L.polyline(latLngs, {
      color: '#DD0103',
      weight: 3.5,
      opacity: 0.9,
      dashArray: '8, 8',
      lineCap: 'round',
      lineJoin: 'round'
    }).addTo(this.map);

    // Create custom port markers (distinct by unlocode to avoid overlapping badges at Sohar)
    const distinctPorts = ports.filter((p, idx, arr) => 
      idx === arr.findIndex(t => t.unlocode === p.unlocode)
    );

    distinctPorts.forEach((p, idx) => {
      const isHub = p.unlocode === 'OMSOH' || p.unlocode === 'AEJEA';
      const iconHtml = `
        <div style="
          width: ${isHub ? '30px' : '24px'};
          height: ${isHub ? '30px' : '24px'};
          background: ${isHub ? '#DD0103' : '#02194B'};
          border: 2px solid #FFFFFF;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FFFFFF;
          font-weight: 800;
          font-size: ${isHub ? '13px' : '11px'};
          box-shadow: 0 0 12px rgba(221, 1, 3, 0.6);
        ">
          ${idx + 1}
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'port-marker-icon',
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      });

      const popupHtml = `
        <div style="font-family: inherit; padding: 6px; min-width: 170px;">
          <div style="display: flex; align-items: center; gap: 4px; margin-bottom: 2px;">
            <span style="background: #DD0103; color: white; font-size: 10px; font-weight: bold; padding: 1px 5px; border-radius: 4px;">STOP ${idx + 1}</span>
            <span style="font-size: 11px; color: #64748B; font-weight: 600;">${p.unlocode}</span>
          </div>
          <div style="font-weight: 800; font-size: 14px; color: #02194B;">${p.port_name}</div>
          <div style="font-size: 11px; color: #475569; margin-top: 2px;">${p.terminal || 'Container Terminal'}</div>
          ${p.day_of_week ? `<div style="font-size: 11px; color: #DD0103; margin-top: 4px; font-weight: 700;">Fixed Call: ${p.day_of_week}</div>` : ''}
        </div>
      `;

      const marker = L.marker([p.lat, p.lng], { icon: customIcon })
        .bindPopup(popupHtml)
        .addTo(this.map!);

      this.portMarkers.push(marker);
    });

    // Fit map bounds to show route
    if (latLngs.length > 0) {
      this.map.fitBounds(L.latLngBounds(latLngs), {
        padding: [45, 45],
        maxZoom: 7
      });
    }
  }

  resetMapView() {
    if (this.activeService()) {
      this.renderServiceRoute(this.activeService()!);
    } else if (this.map) {
      this.map.setView([20.0, 68.0], 4);
    }
  }

  focusPort(lat: number, lng: number, portName: string) {
    if (this.map) {
      this.map.flyTo([lat, lng], 8, { duration: 1 });
      const targetMarker = this.portMarkers.find(m => {
        const p = m.getLatLng();
        return Math.abs(p.lat - lat) < 0.01 && Math.abs(p.lng - lng) < 0.01;
      });
      if (targetMarker) {
        targetMarker.openPopup();
      }
    }
  }
}
