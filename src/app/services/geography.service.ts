import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class GeographyService {
  private baseUrl = 'https://api.census.gov/data';
  private year = '2020';
  private dataSet = 'dec/pl';

  constructor(private http: HttpClient) {}

  getStates(): Observable<string[]> {
    const url = `${this.baseUrl}/${this.year}/${this.dataSet}?get=NAME&for=state:*`;
    return this.http.get<any[]>(url).pipe(
      map((response: any[]): string[] => {
        if (!response || !Array.isArray(response) || response.length < 2) {
          throw new Error('Invalid response format for states');
        }
        return response.slice(1).map((state) => state[0]);
      })
    );
  }

  getCounties(state: string): Observable<string[]> {
    return this.getStateFips(state).pipe(
      switchMap((fips) => this.getCountiesForState(fips))
    );
  }

  private getStateFips(stateName: string): Observable<string> {
    const url = `${this.baseUrl}/${this.year}/${this.dataSet}?get=NAME&for=state:*`;
    return this.http.get<any[]>(url).pipe(
      map((response: any[]): string => {
        const stateData = response.find(
          (row) => row[0].toLowerCase() === stateName.toLowerCase()
        );
        if (!stateData) {
          throw new Error(`State "${stateName}" not found`);
        }
        return stateData[1]; // FIPS code
      })
    );
  }

  private getCountiesForState(stateFips: string): Observable<string[]> {
    const url = `${this.baseUrl}/${this.year}/${this.dataSet}?get=NAME&for=county:*&in=state:${stateFips}`;
    return this.http.get<any[]>(url).pipe(
      map((response: any[]): string[] => {
        if (!response || !Array.isArray(response) || response.length < 2) {
          throw new Error('Invalid response format for counties');
        }
        return response
          .slice(1)
          .map((county) => county[0].replace(' County', '').trim());
      })
    );
  }
}
