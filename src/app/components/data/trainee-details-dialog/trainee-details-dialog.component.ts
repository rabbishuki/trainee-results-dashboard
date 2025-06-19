import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { TraineeResult } from '../../../models/trainee.model';

@Component({
  selector: 'biks-trainee-details-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatIconModule
  ],
  templateUrl: './trainee-details-dialog.component.html',
  styleUrl: './trainee-details-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TraineeDetailsDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<TraineeDetailsDialogComponent>);

  // Inject the trainee data (null for new trainee)
  data: TraineeResult | null = inject(MAT_DIALOG_DATA);

  traineeForm!: FormGroup;
  isEditMode = false;

  ngOnInit() {
    this.isEditMode = !!this.data;
    this.createForm();

    if (this.isEditMode && this.data) {
      this.populateForm(this.data);
    }
  }

  private createForm() {
    this.traineeForm = this.fb.group({
      id: ['', [Validators.required, Validators.min(1)]],
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      address: [''],
      city: [''],
      country: [''],
      zip: [''],
      subject: ['', [Validators.required]],
      grade: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      date: ['', [Validators.required]]
    });
  }

  private populateForm(trainee: TraineeResult) {
    this.traineeForm.patchValue({
      id: trainee.id,
      name: trainee.name,
      email: trainee.email,
      address: trainee.address,
      city: trainee.city,
      country: trainee.country,
      zip: trainee.zip,
      subject: trainee.subject,
      grade: trainee.grade,
      date: new Date(trainee.date)
    });
  }

  onSave() {
    if (this.traineeForm.valid) {
      const formValue = this.traineeForm.value;

      // Convert dates to ISO strings for consistency
      const traineeData: TraineeResult = {
        ...formValue,
        date: formValue.date.toISOString().split('T')[0]
      };

      this.dialogRef.close(traineeData);
    } else {
      this.traineeForm.markAllAsTouched();
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  // Component Helper Methods
  getMinLengthError(fieldName: string): string | null {
    const control = this.traineeForm.get(fieldName);
    const error = control?.errors?.['minlength'];
    if (error) {
      return `${fieldName} must be at least ${error.requiredLength} characters (currently ${error.actualLength})`;
    }
    return null;
  }

  getRequiredError(fieldName: string): string | null {
    const control = this.traineeForm.get(fieldName);
    if (control?.hasError('required')) {
      return `${fieldName} is required`;
    }
    return null;
  }
}
