import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { ChatWindowComponent } from './chat-window/chat-window.component';
import { CountySelectorComponent } from './county-selector/county-selector.component';
import { StateSelectorComponent } from './state-selector/state-selector.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, StateSelectorComponent, CountySelectorComponent, ChatWindowComponent, MatCardModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  selectedState: string = '';
  selectedCounty: string = '';

  onStateSelected(state: string) {
    this.selectedState = state;
  }

  onCountySelected(county: string) {
    this.selectedCounty = county;
  }
}