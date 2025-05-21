import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user-service'; // Ensure path is correct

@Component({
  selector: 'app-user-signup',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './user-signup.component.html',
  styleUrl: './user-signup.component.css'
})
export class UserSignupComponent implements OnInit {
  signupForm!: FormGroup;
  submitted = false;
  loading = false;
  errorMessage = '';
  
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    console.log('UserSignupComponent: Constructor initialized');
  }
  
  ngOnInit() {
    console.log('UserSignupComponent: ngOnInit called');
    this.initForm();
  }
  
  initForm() {
    this.signupForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],  
      confirmPassword: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator
    });
    
    console.log('UserSignupComponent: Form initialized', this.signupForm);
  }
  
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    
    if (password === confirmPassword) {
      return null;
    }
    
    return { passwordMismatch: true };
  }
  
  get f() {
    return this.signupForm.controls;
  }
  
  onSubmit() {
    console.log('UserSignupComponent: onSubmit called');
    this.submitted = true;
    this.errorMessage = '';
    
    if (this.signupForm.invalid) {
      // Your existing form validation code...
      return;
    }
    
    this.loading = true;
    
    // Prepare the data
    const userData = {
      username: this.signupForm.value.username,
      password: this.signupForm.value.password
    };
    
    console.log('UserSignupComponent: Submitting user data', userData);
    
    this.userService.signup(userData).subscribe({
      next: (response) => {
        console.log('Signup successful, redirecting to login');
        this.loading = false;
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Signup error:', error);
        this.loading = false;
        
        // Check if the error is actually a successful response (status 201)
        if (error.status === 201) {
          console.log('Error is actually a successful response. Redirecting to login.');
          this.router.navigate(['/login']);
        } else {
          this.errorMessage = error.error?.message || 'Signup failed. Please try again.';
        }
      }
    });
  }
}