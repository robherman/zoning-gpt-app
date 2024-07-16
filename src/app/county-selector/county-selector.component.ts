import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeographyService } from '../services/geography.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-county-selector',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatSelectModule, FormsModule, MatProgressSpinnerModule],
  templateUrl: './county-selector.component.html',
  styleUrls: ['./county-selector.component.css']
})
export class CountySelectorComponent implements OnChanges {
  @Input() selectedState: string = '';
  @Output() countySelected = new EventEmitter<string>();
  counties: string[] = [];
  selectedCounty: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(private geographyService: GeographyService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedState'] && this.selectedState) {
      this.updateCounties();
    }
  }

  updateCounties() {
    this.errorMessage = '';
    this.isLoading = true;
    this.geographyService.getCounties(this.selectedState).subscribe({
      next: (counties: string[]) => {
        this.counties = counties;
        this.isLoading = false;
      },
      error: (error: Error) => {
        console.error('Error fetching counties:', error);
        this.errorMessage = 'Failed to load counties. Please try again later.';
        this.counties = [];
        this.isLoading = false;
      }
    });
  }

  onCountyChange() {
    this.countySelected.emit(this.selectedCounty);
  }
}