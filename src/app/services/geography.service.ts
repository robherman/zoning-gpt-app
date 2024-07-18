import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { County } from '../models/county.model';

@Injectable({
  providedIn: 'root'
})
export class GeographyService {
  private counties: County[] = [
    { name: 'Brevard', state: 'Florida' },
    { name: 'Broward', state: 'Florida' },
    { name: 'Clearwater', state: 'Florida' },
    { name: 'Hillsborough', state: 'Florida' },
    { name: 'Jacksonville', state: 'Florida' },
    { name: 'Lee', state: 'Florida' },
    { name: 'Miami', state: 'Florida' },
    { name: 'Miami-Dade', state: 'Florida' },
    { name: 'Monroe', state: 'Florida' },
    { name: 'Orange', state: 'Florida' },
    { name: 'Orlando', state: 'Florida' },
    { name: 'Palm Beach', state: 'Florida' },
    { name: 'Pinellas Park', state: 'Florida' },
    { name: 'Polk', state: 'Florida' },
    { name: 'Sarasota', state: 'Florida' },
    { name: 'St Petersburg', state: 'Florida' },
    { name: 'Tampa', state: 'Florida' },
    { name: 'Volusia', state: 'Florida' },
    { name: 'Mariposa', state: 'California' }
  ];

  getCounties(): Observable<County[]> {
    return of(this.counties);
  }
}