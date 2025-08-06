import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { PredictionRequest, PredictionResponse } from '../../shared/models/prediction.model';
import { API_CONFIG } from '../constants/app.constants';

@Injectable({
  providedIn: 'root'
})
export class PredictionService {
  private apiUrl = API_CONFIG.FLASK_API_BASE_URL;

  constructor(private http: HttpClient) {}

  getDefaultPrediction(): Observable<PredictionResponse> {
    return this.http.get<PredictionResponse>(`${this.apiUrl}/predict`);
  }

  getCustomPrediction(request: PredictionRequest): Observable<PredictionResponse> {
    return this.http.post<PredictionResponse>(`${this.apiUrl}/predict`, request);
  }
}