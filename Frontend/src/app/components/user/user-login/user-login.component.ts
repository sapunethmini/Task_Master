import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { MessageModule } from 'primeng/message';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user-service'; // Make sure this path is correct

@Component({
  selector: 'app-user-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    CheckboxModule,
    MessageModule,
    RouterModule  
  ],
  templateUrl: './user-login.component.html',
  styleUrl: './user-login.component.css'
})
export class UserLoginComponent {
  loginForm: FormGroup;
  submitted = false;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      rememberMe: [false]
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    this.errorMessage = '';
    
    if (this.loginForm.invalid) {
      return;
    }
    
    this.loading = true;
    
    const credentials = {
      username: this.loginForm.value.username,
      password: this.loginForm.value.password
    };
    
    console.log('Login form submitted:', credentials);
    
   // In user-login.component.ts
this.userService.login(credentials).subscribe({
  next: (response) => {
    console.log('Login successful, response:', response);
    this.loading = false;
    
    // If remember me is checked, store this preference
    if (this.loginForm.value.rememberMe) {
      localStorage.setItem('rememberMe', 'true');
    }
    
    // Navigate based on user role from response
    if (response.role === 'ROLE_ADMIN') {
      this.router.navigate(['/admin/dashboard']);
    } else if (response.role === 'ROLE_EMPLOYEE') {
      this.router.navigate(['/employee/dashboard']);
    } else {
      console.error('Unknown role:', response.role);
      this.errorMessage = 'Invalid user role';
    }
  },
  error: (error) => {
    console.error('Login error:', error);
    this.loading = false;
    this.errorMessage = error.error?.message || 'Invalid username or password';
  }
});
  }
}