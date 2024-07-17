import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class GeographyService {
  private baseUrl = 'https://api.census.gov/data';
  private year = '2020';
  private dataSet = 'dec/pl';
  private floridaFips = '12'; // FIPS code for Florida

  constructor(private http: HttpClient) {}

  getFloridaCounties(): Observable<string[]> {
    const url = `${this.baseUrl}/${this.year}/${this.dataSet}?get=NAME&for=county:*&in=state:${this.floridaFips}`;
    return this.http.get<any[]>(url).pipe(
      map((response: any[]): string[] => {
        if (!response || !Array.isArray(response) || response.length < 2) {
          throw new Error('Invalid response format for counties');
        }
        return response
          .slice(1)
          .map((county) => county[0].replace(' County', '').trim());
      }),
      catchError(() => of([]))
    );
  }
}
