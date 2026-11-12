import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaritimeService } from './services/maritime.service';
import { HeaderComponent } from './components/header/header.component';
import { HeroSearchComponent } from './components/hero-search/hero-search.component';
import { StatsStripComponent } from './components/stats-strip/stats-strip.component';
import { InteractiveMapComponent } from './components/map/map.component';
import { ServicesListComponent } from './components/services-list/services-list.component';
import { FleetDirectoryComponent } from './components/fleet/fleet.component';
import { SustainabilityComponent } from './components/sustainability/sustainability.component';
import { AgentsDirectoryComponent } from './components/agents/agents.component';
import { VesselModalComponent } from './components/vessel-modal/vessel-modal.component';
import { BookingModalComponent } from './components/booking-modal/booking-modal.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    HeroSearchComponent,
    StatsStripComponent,
    InteractiveMapComponent,
    ServicesListComponent,
    FleetDirectoryComponent,
    SustainabilityComponent,
    AgentsDirectoryComponent,
    VesselModalComponent,
    BookingModalComponent,
    FooterComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private service = inject(MaritimeService);
  isRtl = this.service.isRtl;

  ngOnInit() {
    // Initial fetch of API data
    this.service.loadStats().subscribe();
    this.service.loadServices().subscribe();
    this.service.loadVessels().subscribe();
    this.service.loadSchedules().subscribe();
    this.service.loadAgents().subscribe();
  }
}
