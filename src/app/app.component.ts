import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatWindowComponent } from './chat-window/chat-window.component';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { SuggestionsModalComponent } from './suggestions-modal/suggestions-modal.component';
import { LocationSelectorComponent } from './location-selector/location-selector.component';

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
  selectedCounty: any = null;

  constructor(public dialog: MatDialog) {}

  onCountySelected(county: any) {
    this.selectedCounty = county;
  }

  openSuggestionsModal() {
    this.dialog.open(SuggestionsModalComponent);
  }
}
