import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { PredictionService } from '../../core/api/prediction.service';
import { PredictionResponse } from '../../shared/models/prediction.model';

@Component({
  selector: 'app-prediction',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  templateUrl: './prediction.html',
  styleUrl: './prediction.scss'
})
export class Prediction implements OnInit {
  predictionForm: FormGroup;
  predictionResult: PredictionResponse | null = null;
  loading = false;
  apiConnected = false;

  months = [
    { name: 'Janvier', value: 1 },
    { name: 'Février', value: 2 },
    { name: 'Mars', value: 3 },
    { name: 'Avril', value: 4 },
    { name: 'Mai', value: 5 },
    { name: 'Juin', value: 6 },
    { name: 'Juillet', value: 7 },
    { name: 'Août', value: 8 },
    { name: 'Septembre', value: 9 },
    { name: 'Octobre', value: 10 },
    { name: 'Novembre', value: 11 },
    { name: 'Décembre', value: 12 }
  ];

  years: number[] = [];

  constructor(
    private fb: FormBuilder,
    private predictionService: PredictionService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.predictionForm = this.fb.group({
      month: [new Date().getMonth() + 1, Validators.required],
      year: [new Date().getFullYear() + 1, Validators.required],
      periods: [6, [Validators.required, Validators.min(1), Validators.max(24)]]
    });

    // Generate years from current year to current year + 5
    const currentYear = new Date().getFullYear();
    for (let i = currentYear; i <= currentYear + 5; i++) {
      this.years.push(i);
    }
  }

  ngOnInit(): void {
    // Try to connect to API on component init
    this.checkApiConnection();
  }

  checkApiConnection(): void {
    // In a real implementation, you'd ping the API here
    // For demo purposes, we'll simulate API unavailability
    this.apiConnected = false;
  }

  onPredict(): void {
    if (this.predictionForm.valid) {
      this.loading = true;
      
      const formValue = this.predictionForm.value;
      const request = {
        periods: formValue.periods,
        start_date: `${formValue.year}-${formValue.month.toString().padStart(2, '0')}-01`
      };

      if (this.apiConnected) {
        this.predictionService.getCustomPrediction(request).subscribe({
          next: (response) => {
            this.predictionResult = response;
            this.loading = false;
            this.snackBar.open('Prédiction calculée avec succès!', 'Fermer', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
          },
          error: (error) => {
            this.loading = false;
            this.snackBar.open('Erreur lors du calcul de la prédiction.', 'Fermer', {
              duration: 5000,
              panelClass: ['error-snackbar']
            });
          }
        });
      } else {
        // Simulate prediction for demo
        this.simulatePrediction(request);
      }
    }
  }

  getDefaultPrediction(): void {
    this.loading = true;
    
    if (this.apiConnected) {
      this.predictionService.getDefaultPrediction().subscribe({
        next: (response) => {
          this.predictionResult = response;
          this.loading = false;
          this.snackBar.open('Prédiction par défaut obtenue!', 'Fermer', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
        },
        error: (error) => {
          this.loading = false;
          this.snackBar.open('Erreur lors de l\'obtention de la prédiction par défaut.', 'Fermer', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      });
    } else {
      // Simulate default prediction
      this.simulateDefaultPrediction();
    }
  }

  private simulatePrediction(request: any): void {
    setTimeout(() => {
      const baseAmount = 1500000 + Math.random() * 500000;
      const seasonalFactor = 1 + 0.2 * Math.sin((request.periods / 12) * 2 * Math.PI);
      const prediction = baseAmount * seasonalFactor;
      
      this.predictionResult = {
        prediction: Math.round(prediction),
        confidence_interval: {
          lower: Math.round(prediction * 0.85),
          upper: Math.round(prediction * 1.15)
        },
        period: `${request.start_date} (${request.periods} mois)`,
        graph_data: []
      };
      
      this.loading = false;
      this.snackBar.open('Prédiction simulée calculée!', 'Fermer', {
        duration: 3000,
        panelClass: ['success-snackbar']
      });
    }, 2000);
  }

  private simulateDefaultPrediction(): void {
    setTimeout(() => {
      this.predictionResult = {
        prediction: 1750000,
        confidence_interval: {
          lower: 1487500,
          upper: 2012500
        },
        period: '2025-2026 (Moyenne)',
        graph_data: []
      };
      
      this.loading = false;
      this.snackBar.open('Prédiction par défaut obtenue!', 'Fermer', {
        duration: 3000,
        panelClass: ['success-snackbar']
      });
    }, 1500);
  }

  showGraph(): void {
    this.snackBar.open('Fonctionnalité de graphique en cours de développement', 'Fermer', {
      duration: 3000,
      panelClass: ['info-snackbar']
    });
  }

  exportResults(): void {
    if (this.predictionResult) {
      const data = {
        prediction: this.predictionResult.prediction,
        period: this.predictionResult.period,
        confidence_interval: this.predictionResult.confidence_interval,
        exported_at: new Date().toISOString()
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `prediction_${Date.now()}.json`;
      link.click();
      window.URL.revokeObjectURL(url);
      
      this.snackBar.open('Résultats exportés avec succès!', 'Fermer', {
        duration: 3000,
        panelClass: ['success-snackbar']
      });
    }
  }
}
