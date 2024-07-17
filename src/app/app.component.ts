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

  onCountySelected(county: County) {
    this.selectedCounty = county;
  }
}
