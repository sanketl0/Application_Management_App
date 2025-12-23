import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { CandidateService } from '../../../core/services/candidate.service';
import { ToastService } from '../../../core/services/toast.service';
import { LoaderService } from '../../../core/services/loader.service';
import { Candidate, CandidateStatus } from '../../../core/models/candidate.model';

@Component({
  selector: 'app-candidate-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './candidate-form.component.html',
  styleUrls: ['./candidate-form.component.scss']
})
export class CandidateFormComponent implements OnInit {
  candidateForm!: FormGroup;
  isEditMode = false;
  statusOptions: CandidateStatus[] = ['Applied', 'Interview', 'Selected', 'Rejected'];

  constructor(
    private fb: FormBuilder,
    private candidateService: CandidateService,
    private toastService: ToastService,
    private loaderService: LoaderService,
    public dialogRef: MatDialogRef<CandidateFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.isEditMode = data?.mode === 'edit';
  }

  ngOnInit(): void {
    this.initializeForm();
    
    // Pre-fill form if editing
    if (this.isEditMode && this.data.candidate) {
      this.candidateForm.patchValue(this.data.candidate);
    }
  }

  /**
   * Initialize the form with validators
   */
  initializeForm(): void {
    this.candidateForm = this.fb.group({
      name: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(255)
      ]],
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      phone: ['', [
        Validators.required,
        Validators.pattern(/^\d{10}$/),
        Validators.minLength(10),
        Validators.maxLength(10)
      ]],
      position_applied: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(255)
      ]],
      status: ['Applied', Validators.required]
    });
  }

  /**
   * Submit form
   */
  onSubmit(): void {
    if (this.candidateForm.invalid) {
      this.candidateForm.markAllAsTouched();
      return;
    }

    this.loaderService.show();
    const formData = this.candidateForm.value;

    const request$ = this.isEditMode
      ? this.candidateService.updateCandidate(this.data.candidate.id, formData)
      : this.candidateService.createCandidate(formData);

    request$.subscribe({
      next: (response) => {
        this.loaderService.hide();
        const successMessage = this.isEditMode
          ? 'Candidate updated successfully'
          : 'Candidate created successfully';
        this.toastService.success(response.message || successMessage);
        this.dialogRef.close(true);
      },
      error: (error) => {
        this.loaderService.hide();
        // Handle specific validation errors from backend
        if (error.error?.details) {
          const details = error.error.details;
          Object.keys(details).forEach(key => {
            const control = this.candidateForm.get(key);
            if (control) {
              control.setErrors({ serverError: details[key][0] });
            }
          });
        }
      }
    });
  }

  /**
   * Cancel and close dialog
   */
  onCancel(): void {
    this.dialogRef.close(false);
  }

  /**
   * Get form control for validation
   */
  get name() { return this.candidateForm.get('name'); }
  get email() { return this.candidateForm.get('email'); }
  get phone() { return this.candidateForm.get('phone'); }
  get position_applied() { return this.candidateForm.get('position_applied'); }
  get status() { return this.candidateForm.get('status'); }

  /**
   * Get error message for form fields
   */
  getErrorMessage(field: string): string {
    const control = this.candidateForm.get(field);
    if (!control) return '';

    if (control.hasError('required')) {
      return `${this.getFieldLabel(field)} is required`;
    }
    if (control.hasError('email')) {
      return 'Please enter a valid email address';
    }
    if (control.hasError('pattern')) {
      return 'Phone number must be exactly 10 digits';
    }
    if (control.hasError('minlength')) {
      const minLength = control.errors?.['minlength'].requiredLength;
      return `Minimum ${minLength} characters required`;
    }
    if (control.hasError('maxlength')) {
      const maxLength = control.errors?.['maxlength'].requiredLength;
      return `Maximum ${maxLength} characters allowed`;
    }
    if (control.hasError('serverError')) {
      return control.errors?.['serverError'];
    }
    return '';
  }

  /**
   * Get field label for error messages
   */
  private getFieldLabel(field: string): string {
    const labels: { [key: string]: string } = {
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      position_applied: 'Position',
      status: 'Status'
    };
    return labels[field] || field;
  }
}