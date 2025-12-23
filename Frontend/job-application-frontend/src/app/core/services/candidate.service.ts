import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Candidate, CandidateResponse, CandidateStatus } from '../models/candidate.model';

@Injectable({
  providedIn: 'root'
})
export class CandidateService {
  private apiUrl = `${environment.apiUrl}/candidates`;

  constructor(private http: HttpClient) {}

  /**
   * Get paginated list of candidates with optional filters
   */
  getCandidates(
    page: number = 1,
    search: string = '',
    status: string = ''
  ): Observable<CandidateResponse> {
    let params = new HttpParams().set('page', page.toString());
    
    if (search) {
      params = params.set('search', search);
    }
    
    if (status && status !== 'All') {
      params = params.set('status', status);
    }
    
    return this.http.get<CandidateResponse>(`${this.apiUrl}/`, { params });
  }

  /**
   * Get single candidate by ID
   */
  getCandidate(id: number): Observable<Candidate> {
    return this.http.get<Candidate>(`${this.apiUrl}/${id}/`);
  }

  /**
   * Create new candidate
   */
  createCandidate(candidate: Candidate): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/`, candidate);
  }

  /**
   * Update existing candidate (full update)
   */
  updateCandidate(id: number, candidate: Candidate): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}/`, candidate);
  }

  /**
   * Update only the status of a candidate
   */
  updateCandidateStatus(id: number, status: CandidateStatus): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}/status/`, { status });
  }

  /**
   * Delete candidate
   */
  deleteCandidate(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}/`);
  }
}