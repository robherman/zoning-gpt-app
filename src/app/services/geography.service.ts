import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, forkJoin } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { County } from '../models/county.model';

@Injectable({
  providedIn: 'root'
})
export class GeographyService {
  private baseUrl = 'https://api.census.gov/data';
  private year = '2020';
  private dataSet = 'dec/pl';
  private floridaFips = '12';
  private californiaFips = '06';

  constructor(private http: HttpClient) { }

  getCounties(): Observable<County[]> {
    return forkJoin([
      this.getCountiesForState(this.floridaFips, 'Florida'),
      this.getCountiesForState(this.californiaFips, 'California', '043')
    ]).pipe(
      map(([floridaCounties, californiaCounties]) => [...floridaCounties, ...californiaCounties]),
      catchError(error => {
        console.error('Error fetching counties:', error);
        return of([]);
      })
    );
  }

  private getCountiesForState(stateFips: string, stateName: string, countyFips?: string): Observable<County[]> {
    let url = `${this.baseUrl}/${this.year}/${this.dataSet}?get=NAME&for=county:${countyFips || '*'}&in=state:${stateFips}`;
    return this.http.get<any[]>(url).pipe(
      map((response: any[]): County[] => {
        if (!response || !Array.isArray(response) || response.length < 2) {
          throw new Error(`Invalid response format for ${stateName} counties`);
        }
        return response.slice(1).map(county => ({
          name: county[0].replace(' County', '').trim(),
          state: stateName
        }));
      }),
      catchError(() => of([]))
    );
  }
}