import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { InputGroupModule } from 'primeng/inputgroup';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterModule } from '@angular/router';
import { EmployeeService, Employee } from '../../../services/employee-service';

@Component({
  selector: 'app-emp-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    InputTextModule,
    ButtonModule, 
    ConfirmDialogModule,
    ToastModule,
    InputGroupModule,
    RouterModule
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './emp-list.component.html',
  styleUrls: ['./emp-list.component.css']
})
export class EmpListComponent implements OnInit {
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  searchTerm: string = '';
  searchType: 'name' | 'id' = 'name';
  isLoading: boolean = false;
  errorMessage: string = '';
  selectedTeam: string = '';
  pageTitle: string = 'All Employees';
  memberCount: number = 0;
  
  Teams: { [key: string]: string } = {
    '001': 'Human Resources',
    '002': 'Development Team',
    '003': 'Marketing Team',
    '004': 'Sales Team',
    '005': 'Operation Team',
    '006': 'Design Team',
    '007': 'HR Team'
  };
  
  roles: { [key: string]: string } = {
    '11': 'Manager',
    '12': 'Senior Manager',
    '13': 'Team Lead',
    '14': 'Senior Team Lead',
    '15': 'Director',
    '16': 'Senior Director',
    '21': 'Developer',
    '31': 'Senior Developer'
  };

  constructor(
    private employeeService: EmployeeService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    public router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // Get query parameters from the URL
    this.route.queryParams.subscribe(params => {
      console.log('Route parameters:', params);
      
      if (params['departmentId']) {
        this.selectedTeam = params['departmentId'];
        this.pageTitle = params['title'] || this.Teams[params['departmentId']] || 'Team Members';
        console.log(`Loading employees for department: ${this.selectedTeam}`);
      } else {
        this.pageTitle = 'All Employees';
        console.log('Loading all employees');
      }
    });
    
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    if (this.selectedTeam) {
      // Load employees for specific department
      console.log(`Fetching employees for department: ${this.selectedTeam}`);
      
      this.employeeService.getEmployeesByDepartment(this.selectedTeam)
        .subscribe({
          next: (data) => {
            console.log('Received department employees:', data);
            this.employees = data;
            this.filteredEmployees = [...this.employees];
            this.memberCount = this.employees.length;
            this.isLoading = false;
            
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: `Loaded ${this.memberCount} employees from ${this.pageTitle}`
            });
          },
          error: (error) => {
            console.error('Error fetching department employees:', error);
            this.errorMessage = `Failed to load employees for ${this.pageTitle}. Please try again later.`;
            this.isLoading = false;
            
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: this.errorMessage
            });
          }
        });
    } else {
      // Load all employees
      console.log('Fetching all employees');
      
      this.employeeService.getEmployees()
        .subscribe({
          next: (data) => {
            console.log('Received all employees:', data);
            this.employees = data;
            this.filteredEmployees = [...this.employees];
            this.memberCount = this.employees.length;
            this.isLoading = false;
            
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: `Loaded ${this.memberCount} employees`
            });
          },
          error: (error) => {
            console.error('Error fetching all employees:', error);
            this.errorMessage = 'Failed to load employees. Please try again later.';
            this.isLoading = false;
            
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: this.errorMessage
            });
          }
        });
    }
  }

  filterEmployees(): void {
    if (!this.searchTerm.trim()) {
      this.filteredEmployees = [...this.employees];
      return;
    }

    this.filteredEmployees = this.employees.filter(employee => {
      const matchesSearch = this.searchType === 'id' 
        ? employee.id?.toString() === this.searchTerm
        : `${employee.firstname} ${employee.lastname}`.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      return matchesSearch;
    });
  }

  onSearchChange(): void {
    this.filterEmployees();
  }

  setSearchType(type: 'name' | 'id'): void {
    this.searchType = type;
    this.searchTerm = '';
    this.filterEmployees();
  }

  getFullName(employee: Employee): string {
    return `${employee.firstname} ${employee.lastname}`;
  }

  getTeamName(departmentId: string): string {
    return this.Teams[departmentId] || departmentId || 'Unknown Team';
  }

  getRoleName(roleId: string): string {
    return this.roles[roleId] || 'Unknown Role';
  }

  getInitials(employee: Employee): string {
    return `${employee.firstname?.[0] || ''}${employee.lastname?.[0] || ''}`;
  }

  updateEmployee(employee: Employee): void {
    this.router.navigate(['/admin/empupdate'], { queryParams: { id: employee.id } });
  }

  navigateToAddEmployee(): void {
    this.router.navigate(['/admin/empadd']);
  }

  // Navigate back to user management
  navigateBack(): void {
    this.router.navigate(['/admin/usermanagement']);
  }

  confirmDelete(employee: Employee, event: Event): void {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `Are you sure you want to delete ${employee.firstname} ${employee.lastname}?`,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteEmployee(employee);
      }
    });
  }

  deleteEmployee(employee: Employee): void {
    if (!employee.id) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Cannot delete employee without ID'
      });
      return;
    }
    
    this.employeeService.deleteEmployee(employee.id)
      .subscribe({
        next: (response) => {
          // Remove the employee from both arrays
          this.employees = this.employees.filter(emp => emp.id !== employee.id);
          this.filteredEmployees = this.filteredEmployees.filter(emp => emp.id !== employee.id);
          this.memberCount = this.employees.length;
          
          this.messageService.add({
            severity: 'success',
            summary: 'Employee Deleted',
            detail: `${employee.firstname} ${employee.lastname} has been removed`
          });
        },
        error: (error) => {
          console.error('Error deleting employee:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Delete Failed',
            detail: 'There was a problem deleting the employee. Please try again.'
          });
        }
      });
  }

  refreshList(): void {
    this.loadEmployees();
  }

  // Clear filters and show all results for current view
  clearSearch(): void {
    this.searchTerm = '';
    this.filteredEmployees = [...this.employees];
  }
}