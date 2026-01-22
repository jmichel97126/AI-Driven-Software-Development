import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatCardModule],
  template: `
    <div class="dashboard-container">
      <h2>Employee Dashboard</h2>
      <mat-card>
        <mat-card-header>
          <mat-card-title>Welcome to the Employee Portal</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p>Manage your documents and access company resources.</p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 2rem;
    }
  `]
})
export class DashboardComponent {}