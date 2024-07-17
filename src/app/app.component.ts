import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatWindowComponent } from './chat-window/chat-window.component';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { SuggestionsModalComponent } from './suggestions-modal/suggestions-modal.component';
import { LocationSelectorComponent } from './location-selector/location-selector.component';
import { County } from './models/county.model';

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
  @ViewChild(ChatWindowComponent) chatWindow!: ChatWindowComponent;
  selectedCounty: County | undefined;

  constructor(public dialog: MatDialog) {}

  onCountySelected(county: any) {
    this.selectedCounty = county;
  }

  openSuggestionsModal() {
    this.dialog.open(SuggestionsModalComponent);
  }

  onSendMessage() {
    if (this.selectedCounty) {
      this.chatWindow.sendMessage();
    }
  }
}
