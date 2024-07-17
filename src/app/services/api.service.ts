import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, delay, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { County } from '../models/county.model';

interface ApiResponse {
  statusCode: number;
  headers: {
    'Content-Type': string;
    'Access-Control-Allow-Origin': string;
  };
  body: string;
}

interface ResultItem {
  content: string;
  score: number;
  location: string;
}

interface ParsedBody {
  body_content: string;
  results: ResultItem[];
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl =
    'https://aaba0ce5v2.execute-api.us-east-1.amazonaws.com/test/query'; // Replace with your actual API URL
  private mockResponses: string[] = [
    'Based on the zoning regulations in {county}, {state}, residential construction is generally allowed in areas zoned for residential use. However, specific requirements may vary depending on the exact location and type of construction.',
    "In {county}, {state}, commercial development is typically permitted in areas zoned for business or mixed-use. You would need to check the specific zoning map for the exact location you're interested in.",
    'Zoning laws in {county}, {state} usually restrict industrial activities to designated industrial zones. These are often located away from residential areas to minimize impact on residents.',
    'Agricultural zoning in {county}, {state} is designed to protect farmland and rural character. Typically, this zoning allows for farming activities and may have restrictions on non-agricultural development.',
    'For detailed information about zoning in a specific area of {county}, {state}, I recommend contacting the local planning department or checking their online resources. They can provide the most up-to-date and accurate information.',
  ];

  constructor(private http: HttpClient) {}

  sendChatMessage(
    message: string,
    county: County
  ): Observable<any> {
    if (environment.useMockApi) {
      return this.getMockResponse(message, county);
    } else {
      return this.getRealApiResponse(message, county);
    }
  }

  private getMockResponse(
    message: string,
    county: County
  ): Observable<any> {
    const randomResponse =
      this.mockResponses[Math.floor(Math.random() * this.mockResponses.length)];
    const formattedResponse = randomResponse
      .replace('{county}', county.name);

    // Simulate network delay
    return of({ message: formattedResponse }).pipe(delay(1000));
  }

  private getRealApiResponse(
    message: string,
    county: County
  ): Observable<string> {
    //const query = `${message}`;
    const query = `For state: ${county.name}. ${message}`;

    return this.http
      .post<ApiResponse>(this.apiUrl, { query: query })
      .pipe(
        map((response) => this.parseApiResponse(response)),
        catchError((error) => {
          console.error('Error calling API:', error);
          return of('Error: Failed to get a response. Please try again.');
        })
      );
  }

  private parseApiResponse(response: ApiResponse): string {
    if (response.statusCode !== 200) {
      return 'Error: Received non-200 status code from the server.';
    }

    try {
      const parsedBody: ParsedBody = JSON.parse(response.body);
      if (parsedBody.body_content) {
        // Return the content of the first result
        return parsedBody.body_content;
      } else {
        return 'No results found in the response.';
      }
    } catch (error) {
      console.error('Error parsing API response:', error);
      return 'Error: Failed to parse the server response.';
    }
  }
}
