import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeographyService } from '../services/geography.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-state-selector',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatSelectModule, FormsModule],
  templateUrl: './state-selector.component.html',
  styleUrls: ['./state-selector.component.css']
})
export class StateSelectorComponent implements OnInit {
  @Output() stateSelected = new EventEmitter<string>();
  states: string[] = [];
  selectedState: string = '';

  constructor(private geographyService: GeographyService) {}

  ngOnInit() {
    this.geographyService.getStates().subscribe({
      next: (states: string[]) => {
        this.states = states;
      },
      error: (error: any) => console.error('Error fetching states:', error)
    });
  }

  onStateChange() {
    this.stateSelected.emit(this.selectedState);
  }
}