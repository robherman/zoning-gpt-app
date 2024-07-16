import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, tap, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GeographyService {
  private baseUrl = 'https://api.census.gov/data';
  private year = '2020';
  private dataSet = 'dec/pl';

  constructor(private http: HttpClient) { }

  getStates(): Observable<string[]> {
    const url = `${this.baseUrl}/${this.year}/${this.dataSet}?get=NAME&for=state:*`;
    return this.http.get<any[]>(url).pipe(
      tap(response => console.log('API Response for States:', response)),
      map((response: any[]): string[] => {
        if (!response || !Array.isArray(response) || response.length < 2) {
          throw new Error('Invalid response format for states');
        }
        return response.slice(1).map(state => state[0]);
      }),
      catchError(this.handleError)
    );
  }

  getCounties(stateName: string): Observable<string[]> {
    return this.getStateFips(stateName).pipe(
      switchMap(fips => this.getCountiesForState(fips))
    );
  }

  private getStateFips(stateName: string): Observable<string> {
    const url = `${this.baseUrl}/${this.year}/${this.dataSet}?get=NAME&for=state:*`;
    return this.http.get<any[]>(url).pipe(
      map((response: any[]): string => {
        const stateData = response.find(row => row[0].toLowerCase() === stateName.toLowerCase());
        if (!stateData) {
          throw new Error(`State "${stateName}" not found`);
        }
        return stateData[1]; // FIPS code
      }),
      catchError(this.handleError)
    );
  }

  private getCountiesForState(stateFips: string): Observable<string[]> {
    const url = `${this.baseUrl}/${this.year}/${this.dataSet}?get=NAME&for=county:*&in=state:${stateFips}`;
    return this.http.get<any[]>(url).pipe(
      tap(response => console.log(`API Response for Counties (State FIPS ${stateFips}):`, response)),
      map((response: any[]): string[] => {
        if (!response || !Array.isArray(response) || response.length < 2) {
          throw new Error('Invalid response format for counties');
        }
        // The county name is in the first column (index 0)
        return response.slice(1).map(county => county[0].replace(' County', '').trim());
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}