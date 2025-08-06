import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

import { User, LoginRequest, LoginResponse, ForgotPasswordRequest } from '../../shared/models/auth.model';
import { LOCAL_STORAGE_KEYS, ROUTES } from '../constants/app.constants';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const token = localStorage.getItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
    const userData = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_DATA);
    
    if (token && userData) {
      try {
        const user: User = JSON.parse(userData);
        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);
      } catch (error) {
        this.logout();
      }
    }
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    // For demo purposes, we'll simulate a login
    // In a real app, this would call your backend API
    return this.simulateLogin(credentials).pipe(
      tap(response => {
        localStorage.setItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN, response.token);
        localStorage.setItem(LOCAL_STORAGE_KEYS.USER_DATA, JSON.stringify(response.user));
        this.currentUserSubject.next(response.user);
        this.isAuthenticatedSubject.next(true);
      })
    );
  }

  private simulateLogin(credentials: LoginRequest): Observable<LoginResponse> {
    return new Observable(observer => {
      setTimeout(() => {
        try {
          // Simple validation for demo
          if (credentials.email === 'admin@sndp-agil.com' && credentials.password === 'admin123') {
            observer.next({
              user: {
                id: '1',
                email: credentials.email,
                firstName: 'Admin',
                lastName: 'SNDP AGIL',
                role: 'admin'
              },
              token: 'mock-jwt-token-' + Date.now(),
              expiresIn: 3600
            });
            observer.complete();
          } else {
            observer.error(new Error('Invalid credentials'));
          }
        } catch (error) {
          observer.error(error);
        }
      }, 1000);
    });
  }

  logout(): void {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.USER_DATA);
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    this.router.navigate([ROUTES.HOME]);
  }

  forgotPassword(request: ForgotPasswordRequest): Observable<{ message: string }> {
    // Simulate forgot password API call
    return of({ message: 'Un email de récupération a été envoyé à votre adresse.' });
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  getToken(): string | null {
    return localStorage.getItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}