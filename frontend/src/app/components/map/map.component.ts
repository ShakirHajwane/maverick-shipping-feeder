import { Component, inject, OnInit, AfterViewInit, OnDestroy, ElementRef, ViewChild, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import { MaritimeService } from '../../services/maritime.service';
import { FeederService, Vessel } from '../../models/maritime.models';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="interactive-map-section" class="py-16 bg-navy-900 border-b border-navy-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-8">
        <!-- Section Header -->
        <div class="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ocean-500/10 border border-ocean-500/30 text-ocean-400 text-xs font-semibold tracking-wide uppercase mb-2">
              <span class="w-2 h-2 rounded-full bg-ocean-400 animate-pulse"></span>
              <span>{{ isRtl() ? 'خريطة الخطوط الملاحية والأسطول' : 'Interactive Maritime Geonavigator' }}</span>
            </div>
            <h2 class="text-2xl sm:text-4xl font-black text-white">
              {{ isRtl() ? 'مسارات الخطوط وتمركز الأسطول البحري' : 'Trade Routes & Live Vessel Fleet' }}
            </h2>
            <p class="text-sm text-slate-400 mt-1 max-w-2xl">
              {{ isRtl() 
                ? 'استكشف شبكة الخطوط البحرية المتصلة بميناء جبل علي، وتتبع مواقع السفن الحية عبر الشرق الأوسط وآسيا.' 
                : 'Explore feeder corridors connecting our primary hub at Jebel Ali (Dubai) with Red Sea, India, Gulf, and Southeast Asian ports with real-time AIS vessel telemetry.' }}
            </p>
          </div>

          <!-- Controls: Fleet Toggle -->
          <div class="flex items-center gap-3">
            <button
              (click)="toggleVesselLayer()"
              [class]="showVessels 
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30' 
                : 'bg-navy-800 text-slate-400 border-navy-700 hover:text-white'"
              class="px-3.5 py-2 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer">
              <span [class]="showVessels ? 'bg-emerald-400' : 'bg-slate-500'" class="w-2 h-2 rounded-full"></span>
              <span>{{ isRtl() ? 'إظهار الأسطول الحي (AIS)' : 'Live Fleet AIS Layer' }}</span>
            </button>
            <button
              (click)="resetMapView()"
              class="px-3.5 py-2 rounded-xl bg-navy-800 hover:bg-navy-700 text-slate-300 border border-navy-700 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer">
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
              <span>{{ isRtl() ? 'إعادة ضبط الخريطة' : 'Reset View' }}</span>
            </button>
          </div>
        </div>

        <!-- Feeder Service Selector Pills -->
        <div class="flex flex-wrap items-center gap-2 mb-6">
          <span class="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">{{ isRtl() ? 'الخدمة النشطة:' : 'Feeder Route:' }}</span>
          <button
            *ngFor="let s of service.services()"
            (click)="selectService(s)"
            [class]="activeService()?.code === s.code 
              ? 'bg-ocean-500 text-navy-950 font-bold border-ocean-400 shadow-lg shadow-ocean-500/20' 
              : 'bg-navy-950 hover:bg-navy-800 text-slate-300 font-medium border-navy-800 hover:border-navy-700'"
            class="px-3.5 py-1.5 rounded-lg text-xs font-mono border transition-all cursor-pointer">
            {{ s.code }} <span class="font-sans text-[11px] opacity-80">({{ s.transit_days }}d)</span>
          </button>
        </div>

        <!-- Map & Route Rotation Details Split -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Leaflet Map Container (2 Cols) -->
          <div class="lg:col-span-2 relative rounded-2xl overflow-hidden border border-navy-700/80 shadow-2xl bg-[#0d1f38]">
            <div #mapContainer class="w-full h-[520px] z-10"></div>

            <!-- Map Floating Badge Overlay -->
            <div class="absolute bottom-4 left-4 z-20 pointer-events-none bg-navy-950/85 backdrop-blur-md px-3 py-2 rounded-xl border border-navy-700/60 text-xs space-y-1">
              <div class="flex items-center gap-2 text-ocean-400 font-bold">
                <span class="w-2 h-2 rounded-full bg-ocean-400"></span>
                <span>CartoDB Voyager • OpenStreetMap Layer</span>
              </div>
              <div class="text-[11px] text-slate-400">Active Service: <span class="text-white font-mono font-semibold">{{ activeService()?.code }}</span></div>
            </div>
          </div>

          <!-- Active Rotation & Hubs Timeline (1 Col) -->
          <div class="bg-navy-950/90 rounded-2xl p-6 border border-navy-800 flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between pb-4 border-b border-navy-800 mb-5">
                <div>
                  <span class="text-[10px] uppercase font-bold tracking-wider text-ocean-400">Selected Corridor</span>
                  <h3 class="text-lg font-black text-white">{{ activeService()?.name }}</h3>
                </div>
                <span class="text-xs px-2.5 py-1 rounded-md bg-navy-900 border border-navy-700 font-mono text-ocean-300 font-bold">
                  {{ activeService()?.code }}
                </span>
              </div>

              <!-- Ports Sequence Stepper -->
              <div class="space-y-4 max-h-[360px] overflow-y-auto pr-1">
                <div *ngFor="let port of activeService()?.port_rotation; let i = index; let last = last" class="relative flex items-start gap-3">
                  <!-- Stepper Dot & Line -->
                  <div class="flex flex-col items-center">
                    <button
                      (click)="focusPort(port.lat, port.lng, port.port_name)"
                      class="w-6 h-6 rounded-full bg-navy-900 border-2 border-ocean-400 text-ocean-400 hover:bg-ocean-500 hover:text-navy-950 text-xs font-bold flex items-center justify-center transition-all cursor-pointer">
                      {{ i + 1 }}
                    </button>
                    <div *ngIf="!last" class="w-0.5 h-10 bg-gradient-to-b from-ocean-400 to-navy-700 my-1"></div>
                  </div>

                  <!-- Port Details -->
                  <div class="flex-1 pb-2">
                    <div class="flex items-center justify-between">
                      <button
                        (click)="focusPort(port.lat, port.lng, port.port_name)"
                        class="text-xs font-bold text-white hover:text-ocean-400 text-left transition-colors cursor-pointer">
                        {{ port.port_name }}
                      </button>
                      <span class="text-[10px] font-mono text-slate-400 bg-navy-900 px-1.5 py-0.5 rounded">
                        {{ port.unlocode }}
                      </span>
                    </div>
                    <div class="text-[11px] text-slate-400 mt-0.5">
                      {{ port.terminal || 'Container Terminal' }}
                    </div>
                    <div *ngIf="port.day_of_week" class="text-[10px] text-amber-accent font-medium mt-0.5">
                      Call Day: {{ port.day_of_week }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Rotation Metrics Footer -->
            <div class="pt-4 border-t border-navy-800 mt-6 grid grid-cols-2 gap-3 text-center">
              <div class="bg-navy-900/60 p-2.5 rounded-xl border border-navy-800">
                <span class="text-[10px] text-slate-400 uppercase font-semibold">Round Transit</span>
                <p class="text-sm font-bold text-white font-mono">{{ activeService()?.transit_days }} Days</p>
              </div>
              <div class="bg-navy-900/60 p-2.5 rounded-xl border border-navy-800">
                <span class="text-[10px] text-slate-400 uppercase font-semibold">Frequency</span>
                <p class="text-sm font-bold text-ocean-400 font-mono">{{ activeService()?.frequency }}</p>
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
  private vesselMarkers: L.Marker[] = [];

  showVessels = true;

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

    // React to vessels changes
    effect(() => {
      const vessels = this.service.vessels();
      if (this.map && this.showVessels && vessels.length > 0) {
        this.renderVesselMarkers();
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

    // Free CartoDB Voyager tiles - zero API key required
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(this.map);

    setTimeout(() => {
      if (this.map) {
        this.map.invalidateSize();
        if (this.activeService()) {
          this.renderServiceRoute(this.activeService()!);
        }
        if (this.showVessels) {
          this.renderVesselMarkers();
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

    const latLngs: [number, number][] = ports.map(p => [p.lat, p.lng]);
    // Close the loop back to the initial hub
    if (ports.length > 1) {
      latLngs.push([ports[0].lat, ports[0].lng]);
    }

    // Draw glowing feeder polyline
    this.routePolyline = L.polyline(latLngs, {
      color: '#00B4D8',
      weight: 3.5,
      opacity: 0.85,
      dashArray: '8, 8',
      lineCap: 'round',
      lineJoin: 'round'
    }).addTo(this.map);

    // Create custom port markers
    ports.forEach((p, idx) => {
      const isHub = p.unlocode === 'AEJEA';
      const iconHtml = `
        <div style="
          width: ${isHub ? '28px' : '22px'};
          height: ${isHub ? '28px' : '22px'};
          background: ${isHub ? '#00B4D8' : '#112240'};
          border: 2px solid ${isHub ? '#FFFFFF' : '#00B4D8'};
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: ${isHub ? '#0A192F' : '#FFFFFF'};
          font-weight: 800;
          font-size: ${isHub ? '12px' : '10px'};
          box-shadow: 0 0 10px rgba(0, 180, 216, 0.6);
        ">
          ${idx + 1}
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'port-marker-icon',
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      const popupHtml = `
        <div style="font-family: inherit; padding: 4px;">
          <div style="font-weight: 800; font-size: 13px; color: #00B4D8;">${p.port_name}</div>
          <div style="font-size: 11px; color: #94A3B8; margin-bottom: 4px;">UN/LOCODE: <b>${p.unlocode}</b></div>
          <div style="font-size: 12px; color: #F8FAFC;">Terminal: ${p.terminal || 'Container Quay'}</div>
          ${p.day_of_week ? `<div style="font-size: 11px; color: #F59E0B; margin-top: 2px;">Call: ${p.day_of_week}</div>` : ''}
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
        padding: [40, 40],
        maxZoom: 7
      });
    }
  }

  renderVesselMarkers() {
    if (!this.map) return;

    this.vesselMarkers.forEach(m => this.map?.removeLayer(m));
    this.vesselMarkers = [];

    const vessels = this.service.vessels();
    vessels.forEach(v => {
      const isUnderway = v.current_status.toLowerCase().includes('underway');
      const vesselIconHtml = `
        <div style="
          width: 32px;
          height: 32px;
          background: ${isUnderway ? '#10B981' : '#F59E0B'};
          border: 2px solid #FFFFFF;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0,0,0,0.4);
          transform: rotate(45deg);
        ">
          <svg style="width: 18px; height: 18px; color: #FFFFFF; transform: rotate(-45deg);" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" />
          </svg>
        </div>
      `;

      const customIcon = L.divIcon({
        html: vesselIconHtml,
        className: 'vessel-marker-icon',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const popupHtml = `
        <div style="font-family: inherit; padding: 4px; min-width: 180px;">
          <div style="font-weight: 800; font-size: 13px; color: #00B4D8;">${v.name}</div>
          <div style="font-size: 11px; color: #94A3B8;">IMO: ${v.imo} | Flag: ${v.flag}</div>
          <div style="font-size: 11px; color: #F8FAFC; margin-top: 4px;">Cap: <b>${v.nominal_cap_teu} TEU</b></div>
          <div style="font-size: 11px; color: #F8FAFC;">Service: <b>${v.service_code || 'Spot Feeder'}</b></div>
          <div style="font-size: 11px; color: #10B981; margin-top: 4px;"><b>AIS:</b> ${v.current_status}</div>
        </div>
      `;

      const marker = L.marker([v.current_lat, v.current_lng], { icon: customIcon })
        .bindPopup(popupHtml)
        .addTo(this.map!);

      this.vesselMarkers.push(marker);
    });
  }

  toggleVesselLayer() {
    this.showVessels = !this.showVessels;
    if (this.showVessels) {
      this.renderVesselMarkers();
    } else {
      this.vesselMarkers.forEach(m => this.map?.removeLayer(m));
      this.vesselMarkers = [];
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
