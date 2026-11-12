import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  FeederService,
  Vessel,
  VoyageSchedule,
  RegionalAgent,
  MaritimeStats
} from '../models/maritime.models';

@Injectable({
  providedIn: 'root'
})
export class MaritimeService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  // Angular Signals for reactive state
  stats = signal<MaritimeStats | null>(null);
  services = signal<FeederService[]>([]);
  vessels = signal<Vessel[]>([]);
  schedules = signal<VoyageSchedule[]>([]);
  agents = signal<RegionalAgent[]>([]);

  // Active UI Selections
  selectedService = signal<FeederService | null>(null);
  selectedVessel = signal<Vessel | null>(null);
  focusedMapLocation = signal<{ lat: number; lng: number; zoom?: number; title?: string; popupHtml?: string } | null>(null);

  // App-wide state
  isRtl = signal<boolean>(false);
  isBookingModalOpen = signal<boolean>(false);
  isLoadingVessels = signal<boolean>(false);
  isLoadingSchedules = signal<boolean>(false);

  // Computed state
  serviceCodes = computed(() => this.services().map(s => s.code));
  availableFlags = computed(() => {
    const flags = new Set(this.vessels().map(v => v.flag));
    return Array.from(flags);
  });

  loadStats(): Observable<MaritimeStats> {
    return this.http.get<MaritimeStats>(`${this.apiUrl}/stats`).pipe(
      tap(data => this.stats.set(data))
    );
  }

  loadServices(code?: string): Observable<FeederService[]> {
    let params = new HttpParams();
    if (code) params = params.set('code', code);
    return this.http.get<FeederService[]>(`${this.apiUrl}/services`, { params }).pipe(
      tap(data => {
        this.services.set(data);
        if (data.length > 0 && !this.selectedService()) {
          this.selectedService.set(data[0]);
        }
      })
    );
  }

  loadVessels(search?: string, flag?: string, capacityTier: string = 'all'): Observable<Vessel[]> {
    this.isLoadingVessels.set(true);
    let params = new HttpParams().set('capacity_tier', capacityTier);
    if (search && search.trim()) params = params.set('search', search.trim());
    if (flag && flag.trim() && flag !== 'all') params = params.set('flag', flag.trim());

    return this.http.get<Vessel[]>(`${this.apiUrl}/vessels`, { params }).pipe(
      tap({
        next: (data) => {
          this.vessels.set(data);
          this.isLoadingVessels.set(false);
        },
        error: () => this.isLoadingVessels.set(false)
      })
    );
  }

  loadVesselById(id: number): Observable<Vessel> {
    return this.http.get<Vessel>(`${this.apiUrl}/vessels/${id}`).pipe(
      tap(data => this.selectedVessel.set(data))
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
      tap({
        next: (data) => {
          this.schedules.set(data);
          this.isLoadingSchedules.set(false);
        },
        error: () => this.isLoadingSchedules.set(false)
      })
    );
  }

  loadAgents(country?: string): Observable<RegionalAgent[]> {
    let params = new HttpParams();
    if (country && country !== 'all') params = params.set('country', country);
    return this.http.get<RegionalAgent[]>(`${this.apiUrl}/agents`, { params }).pipe(
      tap(data => this.agents.set(data))
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

  openVesselModal(vessel: Vessel) {
    this.selectedVessel.set(vessel);
  }

  closeVesselModal() {
    this.selectedVessel.set(null);
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
}
