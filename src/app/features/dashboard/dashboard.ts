import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { API_CONFIG } from '../../core/constants/app.constants';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard {
  powerBiUrl: SafeResourceUrl;
  currentMonth: string;
  currentYear: number;

  constructor(private sanitizer: DomSanitizer) {
    this.powerBiUrl = this.sanitizer.bypassSecurityTrustResourceUrl(API_CONFIG.POWER_BI_URL);
    
    const now = new Date();
    this.currentMonth = now.toLocaleDateString('fr-FR', { month: 'long' });
    this.currentYear = now.getFullYear();
  }
}
