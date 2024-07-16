import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeographyService } from '../services/geography.service';
import { SearchableSelectComponent } from '../searchable-select/searchable-select.component';

@Component({
  selector: 'app-state-selector',
  standalone: true,
  imports: [CommonModule, SearchableSelectComponent],
  templateUrl: './state-selector.component.html',
  styleUrls: ['./state-selector.component.css']
})
export class StateSelectorComponent implements OnInit {
  @Output() stateSelected = new EventEmitter<string>();
  states: string[] = [];

  constructor(private geographyService: GeographyService) {}

  ngOnInit() {
    this.geographyService.getStates().subscribe({
      next: (states: string[]) => {
        this.states = states;
      },
      error: (error: any) => console.error('Error fetching states:', error)
    });
  }

  onStateChange(state: string) {
    this.stateSelected.emit(state);
  }
}