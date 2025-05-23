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
import { EmployeeService, Employee } from '../../../services/employee-service'; // Ensure the path is correct

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
  
  Teams: { [key: string]: string } = {
    '001': 'Human Resources',
    '002': 'Engineering',
    '003': 'Marketing',
    '004': 'Finance',
    '005': 'Sales'
  };
  
  roles: { [key: string]: string } = {
    '11': 'Manager',
    '21': 'Team Lead',
    '31': 'Developer',
    '41': 'Designer',
    '51': 'Analyst'
  };

  constructor(
    private employeeService: EmployeeService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    public router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // Get query parameters
    this.route.queryParams.subscribe(params => {
      if (params['departmentId']) {
        this.selectedTeam = params['departmentId'];
        this.pageTitle = params['title'] || 'Team Members';
      }
    });
    
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.employeeService.getEmployees()
      .subscribe({
        next: (data) => {
          this.employees = data;
          // Filter by team if selected
          if (this.selectedTeam) {
            this.filteredEmployees = this.employees.filter(emp => 
              emp.department_Id === this.selectedTeam
            );
          } else {
            this.filteredEmployees = [...this.employees];
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error fetching employees:', error);
          this.errorMessage = 'Failed to load employees. Please try again later.';
          this.isLoading = false;
        }
      });
  }

  filterEmployees(): void {
    if (!this.searchTerm.trim()) {
      // If there's a selected team, filter by team first
      if (this.selectedTeam) {
        this.filteredEmployees = this.employees.filter(emp => 
          emp.department_Id === this.selectedTeam
        );
      } else {
        this.filteredEmployees = [...this.employees];
      }
      return;
    }

    this.filteredEmployees = this.employees.filter(employee => {
      const matchesSearch = this.searchType === 'id' 
        ? employee.id?.toString() === this.searchTerm
        : `${employee.firstname} ${employee.lastname}`.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      // If there's a selected team, also filter by team
      return this.selectedTeam 
        ? matchesSearch && employee.department_Id === this.selectedTeam
        : matchesSearch;
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
    return departmentId || 'Unknown Team';
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
}