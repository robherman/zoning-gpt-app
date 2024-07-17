import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';

@Component({
  selector: 'app-suggestions-modal',
  standalone: true,
  templateUrl: './suggestions-modal.component.html',
  styleUrls: ['./suggestions-modal.component.css'],
  imports: [MatDialogContent, MatDialogActions, CommonModule, MatButtonModule, MatDialogClose],
})
export class SuggestionsModalComponent {
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

  constructor(public dialogRef: MatDialogRef<SuggestionsModalComponent>) {}
}
