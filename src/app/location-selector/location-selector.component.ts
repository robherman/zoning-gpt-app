import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  MatAutocompleteModule,
  MatAutocompleteTrigger,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { GeographyService } from '../services/geography.service';

export interface County {
  county: string;
  state: string;
}

@Component({
  selector: 'app-location-selector',
  templateUrl: './location-selector.component.html',
  styleUrls: ['./location-selector.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
  ],
})
export class LocationSelectorComponent implements OnInit, OnDestroy {
  @Output() countySelected = new EventEmitter<County>();
  @ViewChild(MatAutocompleteTrigger)
  autocompleteTrigger!: MatAutocompleteTrigger;

  countyCtrl = new FormControl<string | County>('');
  filteredCounties: Observable<County[]>;
  allCounties: County[] = [];
  private subscription: Subscription = new Subscription();

  constructor(private geographyService: GeographyService) {
    this.filteredCounties = this.countyCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );
  }

  ngOnInit() {
    this.loadCounties();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  loadCounties() {
    this.subscription.add(
      this.geographyService.getFloridaCounties().subscribe({
        next: (counties) => {
          this.allCounties = counties.map((county) => ({
            county,
            state: 'Florida',
          }));
        },
        error: (error) => console.error('Error loading counties:', error),
      })
    );
  }

  private _filter(value: string | County | null): County[] {
    if (!value) {
      return this.allCounties;
    }

    const filterValue =
      typeof value === 'string'
        ? value.toLowerCase()
        : value.county.toLowerCase();

    return this.allCounties.filter((county) =>
      county.county.toLowerCase().includes(filterValue)
    );
  }

  displayFn(county: County | null): string {
    return county ? `${county.county}` : '';
  }

  onSelectionChange(event: MatAutocompleteSelectedEvent) {
    this.countySelected.emit(event.option.value as County);
  }

  onFocus() {
    if (!this.countyCtrl.value) {
      this.countyCtrl.setValue('');
      this.autocompleteTrigger.openPanel();
    }
  }
}
