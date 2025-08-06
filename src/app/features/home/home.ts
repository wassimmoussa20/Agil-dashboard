import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { AuthService } from '../../core/auth/auth.service';
import { User } from '../../shared/models/auth.model';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {
  @ViewChild('loginSection') loginSection!: ElementRef;

  loginForm: FormGroup;
  hidePassword = true;
  loading = false;
  
  isAuthenticated$: Observable<boolean>;
  currentUser$: Observable<User | null>;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.isAuthenticated$ = this.authService.isAuthenticated$;
    this.currentUser$ = this.authService.currentUser$;
  }

  scrollToLogin(): void {
    this.loginSection?.nativeElement.scrollIntoView({ 
      behavior: 'smooth' 
    });
  }

  onLogin(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          this.loading = false;
          this.snackBar.open('Connexion réussie!', 'Fermer', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
        },
        error: (error) => {
          this.loading = false;
          this.snackBar.open('Erreur de connexion. Vérifiez vos identifiants.', 'Fermer', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }

  onForgotPassword(): void {
    const email = this.loginForm.get('email')?.value;
    if (email) {
      this.authService.forgotPassword({ email }).subscribe({
        next: (response) => {
          this.snackBar.open(response.message, 'Fermer', {
            duration: 5000,
            panelClass: ['success-snackbar']
          });
        },
        error: (error) => {
          this.snackBar.open('Erreur lors de l\'envoi de l\'email.', 'Fermer', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      });
    } else {
      this.snackBar.open('Veuillez entrer votre email d\'abord.', 'Fermer', {
        duration: 3000,
        panelClass: ['warning-snackbar']
      });
    }
  }
}
