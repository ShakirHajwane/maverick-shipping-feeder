export interface PortRotationItem {
  port_name: string;
  unlocode: string;
  lat: number;
  lng: number;
  day_of_week?: string;
  terminal?: string;
}

export interface FeederService {
  id: number;
  code: string;
  name: string;
  description?: string;
  transit_days: number;
  frequency: string;
  port_rotation_json: string;
  port_rotation?: PortRotationItem[];
}

export interface Vessel {
  id: number;
  name: string;
  imo: string;
  call_sign: string;
  flag: string;
  built_year: number;
  port_of_registry: string;
  nominal_cap_teu: number;
  effective_cap_teu: number;
  reefer_plugs: number;
  gear: boolean;
  bow_thruster: boolean;
  grt: number;
  nrt: number;
  dwt: number;
  loa: number;
  breadth: number;
  summer_draft: number;
  current_lat: number;
  current_lng: number;
  current_status: string;
  service_code?: string;
}

export interface VoyageSchedule {
  id: number;
  vessel_name: string;
  voyage_no: string;
  service_code: string;
  pol: string;
  pod: string;
  etd: string;
  eta: string;
  cutoff_date: string;
  status: string;
}

export interface RegionalAgent {
  id: number;
  country: string;
  city: string;
  office_name: string;
  address: string;
  phone: string;
  email: string;
  lat: number;
  lng: number;
}

export interface MaritimeStats {
  port_calls: string;
  teus_per_year: string;
  vessels_count: number;
  ports_served: number;
  countries: number;
  feeder_services: number;
}
