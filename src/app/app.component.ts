import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  LocationSelectorComponent,
  County,
} from './location-selector/location-selector.component';
import { ChatWindowComponent } from './chat-window/chat-window.component';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    LocationSelectorComponent,
    ChatWindowComponent,
    MatCardModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  selectedCounty: County | null = null;
  suggestions = [
    { icon: '🏘️', text: 'Zoning regulations for residential areas' },
    { icon: '🏢', text: 'Commercial property restrictions' },
    { icon: '🌳', text: 'Green space requirements' },
    { icon: '🚗', text: 'Parking regulations in urban areas' },
    { icon: '🏗️', text: 'Building height limitations' },
    { icon: '🏭', text: 'Industrial zone regulations' },
    { icon: '🚧', text: 'Construction permit process' },
    { icon: '🏠', text: 'Accessory dwelling unit rules' },
  ];
  onCountySelected(county: County) {
    this.selectedCounty = county;
  }
}
