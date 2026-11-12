import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaritimeService } from './services/maritime.service';
import { HeaderComponent } from './components/header/header.component';
import { HeroSearchComponent } from './components/hero-search/hero-search.component';
import { InteractiveMapComponent } from './components/map/map.component';
import { FleetDirectoryComponent } from './components/fleet/fleet.component';
import { SustainabilityComponent } from './components/sustainability/sustainability.component';
import { AgentsDirectoryComponent } from './components/agents/agents.component';
import { MaritimeJourneyComponent } from './components/maritime-journey/maritime-journey.component';
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
    MaritimeJourneyComponent,
    InteractiveMapComponent,
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
