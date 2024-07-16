import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeographyService } from '../services/geography.service';
import { SearchableSelectComponent } from '../searchable-select/searchable-select.component';

@Component({
  selector: 'app-county-selector',
  standalone: true,
  imports: [CommonModule, SearchableSelectComponent],
  templateUrl: './county-selector.component.html',
  styleUrls: ['./county-selector.component.css']
})
export class CountySelectorComponent implements OnChanges {
  @Input() selectedState: string = '';
  @Output() countySelected = new EventEmitter<string>();
  counties: string[] = [];
  errorMessage: string = '';
  isLoading: boolean = false;
  isDisabled: boolean = true;

  constructor(private geographyService: GeographyService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedState']) {
      if (this.selectedState) {
        this.updateCounties();
      } else {
        this.counties = [];
        this.isDisabled = true;
      }
    }
  }

  updateCounties() {
    this.errorMessage = '';
    this.isLoading = true;
    this.isDisabled = true;
    this.geographyService.getCounties(this.selectedState).subscribe({
      next: (counties: string[]) => {
        this.counties = counties;
        this.isLoading = false;
        this.isDisabled = false;
      },
      error: (error: Error) => {
        console.error('Error fetching counties:', error);
        this.errorMessage = 'Failed to load counties. Please try again later.';
        this.counties = [];
        this.isLoading = false;
        this.isDisabled = true;
      }
    });
  }

  onCountyChange(county: string) {
    this.countySelected.emit(county);
  }
}