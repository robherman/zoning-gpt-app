import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-searchable-select',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatSelectModule, MatInputModule, MatAutocompleteModule],
  templateUrl: './searchable-select.component.html',
  styleUrls: ['./searchable-select.component.css']
})
export class SearchableSelectComponent implements OnInit {
  @Input() options: string[] = [];
  @Input() placeholder: string = 'Select an option';
  @Input() disabled: boolean = false;
  @Input() storageKey: string = '';
  @Output() selectionChange = new EventEmitter<string>();

  searchTerm: string = '';
  selectedOption: string = '';
  filteredOptions: string[] = [];

  ngOnInit() {
    this.filteredOptions = this.options;
    if (this.storageKey) {
      const savedOption = localStorage.getItem(this.storageKey);
      if (savedOption && this.options.includes(savedOption)) {
        this.selectedOption = savedOption;
        this.selectionChange.emit(this.selectedOption);
      }
    }
  }

  onSearchChange() {
    this.filteredOptions = this.options.filter(option =>
      option.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  onOptionSelected(event: MatAutocompleteSelectedEvent) {
    this.selectionChange.emit(event.option.viewValue);
    if (this.storageKey) {
      localStorage.setItem(this.storageKey, this.selectedOption);
    }
  }
}