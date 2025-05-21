import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SelectButtonModule } from 'primeng/selectbutton';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { EmployeeService, Employee } from '../../../services/employee-service';

interface TeamOption {
  name: string;
}

interface RoleOption {
  name: string;
  id: string;
}

@Component({
  selector: 'app-emp-update',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    SelectButtonModule,
    CardModule,
    ToastModule,
    RouterModule
  ],
  providers: [MessageService],
  templateUrl: './emp-update.component.html',
  styleUrls: ['./emp-update.component.css']
})
export class EmpUpdateComponent implements OnInit {
  employeeForm!: FormGroup;
  employeeId!: number;
  isLoading: boolean = false;
  errorMessage: string = '';
  
  Teams: TeamOption[] = [
    { name: 'Human Resources' },
    { name: 'Engineering' },
    { name: 'Marketing' },
    { name: 'Finance' },
    { name: 'Sales' }
  ];
  
  roles: RoleOption[] = [
    { id: '11', name: 'Manager' },
    { id: '21', name: 'Team Lead' },
    { id: '31', name: 'Developer' },
    { id: '41', name: 'Designer' },
    { id: '51', name: 'Analyst' }
  ];
  
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private employeeService: EmployeeService
  ) { }

  ngOnInit(): void {
    this.initForm();
    
    this.route.queryParams.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.employeeId = parseInt(id);
        this.loadEmployee(this.employeeId);
      } else {
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Error', 
          detail: 'No employee ID provided' 
        });
        this.router.navigate(['/admin/emplist']);
      }
    });
  }

  initForm(employee?: Employee): void {
    this.employeeForm = this.fb.group({
      firstname: [employee?.firstname || '', Validators.required],
      lastname: [employee?.lastname || '', Validators.required],
      email: [employee?.email || '', [Validators.required, Validators.email]],
      department_Id: [employee?.department_Id || '', Validators.required],
      role_Id: [employee?.role_Id || '', Validators.required]
    });
  }

  loadEmployee(id: number): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.employeeService.findEmployeeById(id)
      .subscribe({
        next: (employee) => {
          this.initForm(employee);
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error fetching employee:', error);
          this.errorMessage = 'Failed to load employee details. Please try again.';
          this.isLoading = false;
          this.messageService.add({ 
            severity: 'error', 
            summary: 'Error', 
            detail: 'Employee not found or server error occurred' 
          });
        }
      });
  }

  onSubmit(): void {
    if (this.employeeForm.invalid) {
      Object.keys(this.employeeForm.controls).forEach(key => {
        const control = this.employeeForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    const updatedEmployee: Employee = {
      id: this.employeeId,
      ...this.employeeForm.value
    };

    this.isLoading = true;
    
    this.employeeService.updateEmployee(updatedEmployee)
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          this.messageService.add({ 
            severity: 'success', 
            summary: 'Success', 
            detail: 'Employee updated successfully' 
          });
          
          setTimeout(() => {
            this.router.navigate(['/admin/emplist']);
          }, 1500);
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error updating employee:', error);
          this.messageService.add({ 
            severity: 'error', 
            summary: 'Error', 
            detail: 'Failed to update employee. Please try again.' 
          });
        }
      });
  }

  cancel(): void {
    this.router.navigate(['/admin/emplist']);
  }

  get f() {
    return this.employeeForm.controls;
  }

  getRoleName(id: string): string {
    const role = this.roles.find(r => r.id === id);
    return role ? role.name : 'Unknown';
  }
}