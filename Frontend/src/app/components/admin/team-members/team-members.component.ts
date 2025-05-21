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
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TaskCreationFormComponent } from '../task-creation-form/task-creation-form.component';

@Component({
  selector: 'app-team-members',
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
  providers: [ConfirmationService, MessageService, DialogService],
  templateUrl: './team-members.component.html',
  styleUrls: ['./team-members.component.css']
})
export class TeamMembersComponent implements OnInit {
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  searchTerm: string = '';
  searchType: 'name' | 'id' = 'name';
  isLoading: boolean = false;
  errorMessage: string = '';
  selectedTeam: string = '';
  pageTitle: string = 'Team Members';
  ref: DynamicDialogRef | undefined;

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
    private dialogService: DialogService,
    public router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
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

    this.employeeService.getEmployees().subscribe({
      next: (data) => {
        this.employees = data;
        this.filteredEmployees = this.selectedTeam
          ? this.employees.filter(emp => emp.department_Id === this.selectedTeam)
          : [...this.employees];
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
    const term = this.searchTerm.trim().toLowerCase();
    this.filteredEmployees = this.employees.filter(employee => {
      const matchesSearch = this.searchType === 'id'
        ? employee.id?.toString() === this.searchTerm
        : (`${employee.firstname} ${employee.lastname}`).toLowerCase().includes(term);

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

  getRoleName(roleId: string): string {
    return this.roles[roleId] || 'Unknown Role';
  }

  getInitials(employee: Employee): string {
    return `${employee.firstname?.[0] || ''}${employee.lastname?.[0] || ''}`;
  }

  openTaskCreationForm(employee: Employee): void {
    this.ref = this.dialogService.open(TaskCreationFormComponent, {
      width: '30%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: -1,
      data: {
        employee: employee,
        teamId: this.selectedTeam
      }
    });

    this.ref.onClose.subscribe((result) => {
      if (result) {
        this.messageService.add({
          severity: 'success',
          summary: 'Task Created',
          detail: 'Task has been created successfully'
        });
      }
    });
  }

  // navigateToAddEmployee(): void {
  //   this.router.navigate(['/admin/emplist'], {
  //     queryParams: {
  //       departmentId: this.selectedTeam,
  //       title: this.pageTitle
  //     }
  //   });
  // }
 navigateToAddEmployee(): void {
    this.router.navigate(['/admin/empadd']);
  }
  confirmDelete(employee: Employee, event: Event): void {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `Are you sure you want to remove ${employee.firstname} ${employee.lastname} from the team?`,
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

    this.employeeService.deleteEmployee(employee.id).subscribe({
      next: () => {
        this.employees = this.employees.filter(emp => emp.id !== employee.id);
        this.filteredEmployees = this.filteredEmployees.filter(emp => emp.id !== employee.id);
        this.messageService.add({
          severity: 'success',
          summary: 'Employee Removed',
          detail: `${employee.firstname} ${employee.lastname} has been removed from the team`
        });
      },
      error: (error) => {
        console.error('Error deleting employee:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Remove Failed',
          detail: 'There was a problem removing the employee. Please try again.'
        });
      }
    });
  }

  refreshList(): void {
    this.loadEmployees();
  }
}
