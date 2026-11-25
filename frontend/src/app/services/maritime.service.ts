import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap, catchError, of } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  FeederService,
  Vessel,
  VoyageSchedule,
  RegionalAgent,
  MaritimeStats
} from '../models/maritime.models';

export const SOHAR_KARACHI_SERVICE: FeederService = {
  id: 999,
  code: 'SMNK',
  name: 'Sohar - Nhava Sheva - Mundra - Karachi Dedicated Feeder Loop',
  description: 'Dedicated regional container feeder service linking Sohar Gateway with Nhava Sheva, Mundra, and Karachi, connecting key trade markets across the Arabian Gulf, India, and Pakistan.',
  transit_days: 11,
  frequency: 'Weekly Fixed Day',
  port_rotation_json: '',
  port_rotation: [
    {
      port_name: 'Sohar',
      unlocode: 'OMSOH',
      lat: 24.498,
      lng: 56.628,
      day_of_week: 'Day 1 (Mon)',
      terminal: 'Oman International Container Terminal (OICT) – Strategic gateway to the Arabian Gulf'
    },
    {
      port_name: 'Nhava Sheva (JNPT)',
      unlocode: 'INNSA',
      lat: 18.950,
      lng: 72.951,
      day_of_week: 'Day 4 (Thu)',
      terminal: 'Gateway Terminals India (GTI / BMCT) – Major container gateway for India\'s western coast'
    },
    {
      port_name: 'Mundra',
      unlocode: 'INMUN',
      lat: 22.842,
      lng: 69.712,
      day_of_week: 'Day 6 (Sat)',
      terminal: 'Adani Mundra Container Terminal (MICT) – Important commercial and container hub'
    },
    {
      port_name: 'Karachi',
      unlocode: 'PKKHI',
      lat: 24.805,
      lng: 66.975,
      day_of_week: 'Day 8 (Mon)',
      terminal: 'South Asia Pakistan Terminals (SAPT) – Key gateway for Pakistan\'s international trade'
    },
    {
      port_name: 'Sohar',
      unlocode: 'OMSOH',
      lat: 24.498,
      lng: 56.628,
      day_of_week: 'Day 11 (Thu)',
      terminal: 'Oman International Container Terminal (OICT) – Return Gateway'
    }
  ]
};

export const MAVERICK_SOHAR_VESSEL: Vessel = {
  id: 1,
  name: 'MAVERICK SOHAR',
  imo: '9418298',
  call_sign: 'A6MAV',
  flag: 'UAE',
  built_year: 2021,
  port_of_registry: 'Dubai',
  nominal_cap_teu: 1850,
  effective_cap_teu: 1520,
  reefer_plugs: 260,
  gear: false,
  bow_thruster: true,
  grt: 16800.0,
  nrt: 7950.0,
  dwt: 22400.0,
  loa: 172.0,
  breadth: 27.4,
  summer_draft: 8.5,
  current_lat: 22.420,
  current_lng: 64.850,
  current_status: 'SMNK Corridor — Weekly Scheduled Service',
  service_code: 'SMNK'
};

export const MAVERICK_HQ_OFFICE: RegionalAgent = {
  id: 1,
  country: 'UAE',
  city: 'Dubai',
  office_name: 'Maverick Shipping Hub HQ',
  address: 'Level 14, Tower 3, JAFZA One, Jebel Ali Free Zone, Dubai, UAE',
  phone: '+971 4 210 51 05',
  email: 'commercial.uae@maverickshipping.com',
  lat: 24.996,
  lng: 55.086
};

export const MAVERICK_DEFAULT_STATS: MaritimeStats = {
  port_calls: '1.2K',
  teus_per_year: '96K',
  vessels_count: 1,
  ports_served: 4,
  countries: 3,
  feeder_services: 1
};

@Injectable({
  providedIn: 'root'
})
export class MaritimeService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  // Angular Signals for reactive state
  stats = signal<MaritimeStats | null>(MAVERICK_DEFAULT_STATS);
  services = signal<FeederService[]>([SOHAR_KARACHI_SERVICE]);
  vessels = signal<Vessel[]>([MAVERICK_SOHAR_VESSEL]);
  schedules = signal<VoyageSchedule[]>([]);
  agents = signal<RegionalAgent[]>([MAVERICK_HQ_OFFICE]);

  // Active UI Selections
  selectedService = signal<FeederService | null>(SOHAR_KARACHI_SERVICE);
  focusedMapLocation = signal<{ lat: number; lng: number; zoom?: number; title?: string; popupHtml?: string } | null>(null);

  // App-wide state
  isRtl = signal<boolean>(false);
  isBookingModalOpen = signal<boolean>(false);
  bookingDraft = signal<{ pol?: string; pod?: string; containerType?: string }>({});
  isLoadingSchedules = signal<boolean>(false);

  // Computed state
  serviceCodes = computed(() => this.services().map(s => s.code));

  loadStats(): Observable<MaritimeStats> {
    return this.http.get<MaritimeStats>(`${this.apiUrl}/stats`).pipe(
      tap(data => this.stats.set(data || MAVERICK_DEFAULT_STATS)),
      catchError(() => {
        this.stats.set(MAVERICK_DEFAULT_STATS);
        return of(MAVERICK_DEFAULT_STATS);
      })
    );
  }

  loadServices(code?: string): Observable<FeederService[]> {
    let params = new HttpParams();
    if (code) params = params.set('code', code);
    return this.http.get<FeederService[]>(`${this.apiUrl}/services`, { params }).pipe(
      tap(data => {
        const hasSMNK = data.some(s => s.code === 'SMNK');
        const merged = hasSMNK ? data : [SOHAR_KARACHI_SERVICE, ...data];
        this.services.set(merged);
        const smnk = merged.find(s => s.code === 'SMNK') || merged[0] || SOHAR_KARACHI_SERVICE;
        this.selectedService.set(smnk);
      }),
      catchError(() => {
        this.services.set([SOHAR_KARACHI_SERVICE]);
        this.selectedService.set(SOHAR_KARACHI_SERVICE);
        return of([SOHAR_KARACHI_SERVICE]);
      })
    );
  }

  loadVessels(search?: string, flag?: string, capacityTier: string = 'all'): Observable<Vessel[]> {
    let params = new HttpParams().set('capacity_tier', capacityTier);
    if (search && search.trim()) params = params.set('search', search.trim());
    if (flag && flag.trim() && flag !== 'all') params = params.set('flag', flag.trim());

    return this.http.get<Vessel[]>(`${this.apiUrl}/vessels`, { params }).pipe(
      tap(data => {
        this.vessels.set(data && data.length > 0 ? data : [MAVERICK_SOHAR_VESSEL]);
      }),
      catchError(() => {
        this.vessels.set([MAVERICK_SOHAR_VESSEL]);
        return of([MAVERICK_SOHAR_VESSEL]);
      })
    );
  }

  loadSchedules(filters: {
    pol?: string;
    pod?: string;
    service_code?: string;
    vessel_name?: string;
    voyage_no?: string;
  } = {}): Observable<VoyageSchedule[]> {
    this.isLoadingSchedules.set(true);
    let params = new HttpParams();
    if (filters.pol) params = params.set('pol', filters.pol);
    if (filters.pod) params = params.set('pod', filters.pod);
    if (filters.service_code) params = params.set('service_code', filters.service_code);
    if (filters.vessel_name) params = params.set('vessel_name', filters.vessel_name);
    if (filters.voyage_no) params = params.set('voyage_no', filters.voyage_no);

    return this.http.get<VoyageSchedule[]>(`${this.apiUrl}/schedules`, { params }).pipe(
      tap(data => {
        this.schedules.set(data);
        this.isLoadingSchedules.set(false);
      }),
      catchError(() => {
        this.isLoadingSchedules.set(false);
        return of([]);
      })
    );
  }

  loadAgents(country?: string): Observable<RegionalAgent[]> {
    let params = new HttpParams();
    if (country && country !== 'all') params = params.set('country', country);
    return this.http.get<RegionalAgent[]>(`${this.apiUrl}/agents`, { params }).pipe(
      tap(data => {
        this.agents.set(data && data.length > 0 ? data : [MAVERICK_HQ_OFFICE]);
      }),
      catchError(() => {
        this.agents.set([MAVERICK_HQ_OFFICE]);
        return of([MAVERICK_HQ_OFFICE]);
      })
    );
  }

  selectService(service: FeederService) {
    this.selectedService.set(service);
  }

  selectServiceByCode(code: string) {
    const found = this.services().find(s => s.code.toUpperCase() === code.toUpperCase());
    if (found) {
      this.selectedService.set(found);
    }
  }

  focusLocationOnMap(lat: number, lng: number, zoom: number = 7, title?: string, popupHtml?: string) {
    this.focusedMapLocation.set({ lat, lng, zoom, title, popupHtml });
    // Smoothly scroll to map section
    const mapElement = document.getElementById('interactive-map-section');
    if (mapElement) {
      mapElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  toggleRtl() {
    const newVal = !this.isRtl();
    this.isRtl.set(newVal);
    document.documentElement.setAttribute('dir', newVal ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', newVal ? 'ar' : 'en');
  }

  toggleBookingModal(open?: boolean) {
    if (open !== undefined) {
      this.isBookingModalOpen.set(open);
    } else {
      this.isBookingModalOpen.set(!this.isBookingModalOpen());
    }
  }

  openBookingWithDraft(draft: { pol?: string; pod?: string; containerType?: string }) {
    this.bookingDraft.set(draft);
    this.isBookingModalOpen.set(true);
  }
}
