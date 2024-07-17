import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { GeographyService } from '../services/geography.service';
import { County } from '../models/county.model';

@Component({
  selector: 'app-location-selector',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule
  ],
  templateUrl: './location-selector.component.html',
  styleUrls: ['./location-selector.component.css']
})
export class LocationSelectorComponent implements OnInit {
  @Output() countySelected = new EventEmitter<County>();
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger!: MatAutocompleteTrigger;

  countyCtrl = new FormControl<string | County>('');
  filteredCounties: Observable<County[]>;
  allCounties: County[] = [];

  private readonly STORAGE_KEY = 'lastSelectedCounty';

  constructor(private geographyService: GeographyService) {
    this.filteredCounties = this.countyCtrl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  ngOnInit() {
    this.geographyService.getCounties().subscribe(counties => {
      this.allCounties = counties;
      this.loadLastSelectedCounty();
    });
  }

  private _filter(value: string | County | null): County[] {
    const filterValue = typeof value === 'string' ? value.toLowerCase() : '';
    return this.allCounties.filter(county => 
      county.name.toLowerCase().includes(filterValue) ||
      county.state.toLowerCase().includes(filterValue)
    );
  }

  displayFn(county: County): string {
    return county ? `${county.name}` : '';
  }

  onSelectionChange(event: MatAutocompleteSelectedEvent) {
    const selectedCounty = event.option.value as County;
    this.countySelected.emit(selectedCounty);
    this.saveLastSelectedCounty(selectedCounty);
  }

  onFocus() {
    if (!this.countyCtrl.value) {
      this.countyCtrl.setValue('');
      this.autocompleteTrigger.openPanel();
    }
  }

  private saveLastSelectedCounty(county: County) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(county));
  }

  private loadLastSelectedCounty() {
    const storedCounty = localStorage.getItem(this.STORAGE_KEY);
    if (storedCounty) {
      const county: County = JSON.parse(storedCounty);
      const foundCounty = this.allCounties.find(c => c.name === county.name && c.state === county.state);
      if (foundCounty) {
        this.countyCtrl.setValue(foundCounty);
        this.countySelected.emit(foundCounty);
      }
    }
  }
}