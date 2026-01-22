import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [MatCardModule, MatButtonModule],
  template: `
    <div class="documents-container">
      <h2>Document Management</h2>
      <mat-card>
        <mat-card-header>
          <mat-card-title>Your Documents</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p>Upload and manage your documents securely.</p>
          <button mat-raised-button color="primary">Upload Document</button>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .documents-container {
      padding: 2rem;
    }
  `]
})
export class DocumentsComponent {}