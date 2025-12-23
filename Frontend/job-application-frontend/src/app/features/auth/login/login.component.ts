import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { LoaderService } from '../../../core/services/loader.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    RouterLink  
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  hidePassword = true;
  loading = false; // Add this property
  returnUrl: string = '/candidates';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private loaderService: LoaderService
  ) {}

  ngOnInit(): void {
    // Initialize form with rememberMe control
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(2)]],
      rememberMe: [false]
    });

    // Check for saved credentials if rememberMe was enabled
    const savedUsername = localStorage.getItem('rememberedUsername');
    if (savedUsername) {
      this.loginForm.patchValue({
        username: savedUsername,
        rememberMe: true
      });
    }

    // Get return url from route parameters or default to '/candidates'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/candidates';

    // Redirect to candidates if already logged in
    if (this.authService.isAuthenticated()) {
      this.router.navigate([this.returnUrl]);
    }
  }

  /**
   * Handle form submission
   */
  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true; // Set loading to true
    
    // Save username if rememberMe is checked
    if (this.loginForm.value.rememberMe) {
      localStorage.setItem('rememberedUsername', this.loginForm.value.username);
    } else {
      localStorage.removeItem('rememberedUsername');
    }

    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        this.loading = false; // Reset loading state
        this.toastService.success('Login successful!');
        this.router.navigate([this.returnUrl]);
      },
      error: (error) => {
        this.loading = false; // Reset loading state
        // Error is handled by error interceptor
      }
    });
  }

  /**
   * Get form control for validation
   */
  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }

  /**
   * Handle social login (optional implementation)
   */
  onSocialLogin(provider: string): void {
    this.loading = true;
    // Implement social login logic here
    setTimeout(() => {
      this.loading = false;
      this.toastService.info(`${provider} login integration would go here`);
    }, 1500);
  }
}