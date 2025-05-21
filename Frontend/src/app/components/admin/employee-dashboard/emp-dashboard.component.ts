import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { BadgeModule } from 'primeng/badge';
import { TaskService } from '../../../services/task.service'; // Import the TaskService
import { forkJoin } from 'rxjs'; // Import forkJoin for parallel API calls
import { Router } from '@angular/router';

interface Task {
  name: string;
  status: string;
  priority: string;
  category: string;
  assignedTo: string;
  assigneeInitials: string;
  dueDate: string;
}

@Component({
  selector: 'app-emp-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    InputTextModule,
    TableModule,
    CardModule,
    BadgeModule
  ],
  templateUrl: './emp-dashboard.component.html',
  styleUrls: ['./emp-dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  tasks: Task[] = [];
  totalTasks: number = 0;
  completedTasks: number = 0;
  inProgressTasks: number = 0;
  pendingTasks: number = 0;
  
  totalTasksGrowth: number = 12; // Hardcoded growth percentages for now
  completedTasksGrowth: number = 8;
  inProgressTasksGrowth: number = 3;
  pendingTasksGrowth: number = 5;

  currentPage: number = 1;
  totalPages: number = 0;
  tasksPerPage: number = 4;
  
  // Status mapping for API calls
  private statusMap = {
    completed: 'COMPLETED',
    inProgress: 'IN_PROGRESS',
    pending: 'PENDING'
  };
  
  constructor(
    private taskService: TaskService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Load the task counts from the API
    this.loadTaskCounts();
    
    // Mock data for tasks table
    this.tasks = [
      {
        name: 'Website redesign',
        status: 'In Progress',
        priority: 'High',
        category: 'Design',
        assignedTo: 'John Doe',
        assigneeInitials: 'JD',
        dueDate: 'May 15, 2025'
      },
      {
        name: 'API integration',
        status: 'Pending',
        priority: 'Medium',
        category: 'Development',
        assignedTo: 'Alex Smith',
        assigneeInitials: 'AS',
        dueDate: 'May 20, 2025'
      },
      {
        name: 'User testing',
        status: 'Completed',
        priority: 'Low',
        category: 'Testing',
        assignedTo: 'Emma Johnson',
        assigneeInitials: 'EJ',
        dueDate: 'May 5, 2025'
      },
      {
        name: 'Content update',
        status: 'In Progress',
        priority: 'Medium',
        category: 'Content',
        assignedTo: 'Lisa Wong',
        assigneeInitials: 'LW',
        dueDate: 'May 25, 2025'
      }
    ];
  }

  /**
   * Load task counts from the API
   */
  loadTaskCounts(): void {
    console.log('Loading task counts from API...');
    
    // Get the total task count
    forkJoin({
      total: this.taskService.getTotalTaskCount(),
      completed: this.taskService.getTaskCountByStatus(this.statusMap.completed),
      inProgress: this.taskService.getTaskCountByStatus(this.statusMap.inProgress),
      pending: this.taskService.getTaskCountByStatus(this.statusMap.pending)
    }).subscribe({
      next: (response) => {
        console.log('Task counts response:', response);
        this.totalTasks = response.total;
        this.completedTasks = response.completed;
        this.inProgressTasks = response.inProgress;
        this.pendingTasks = response.pending;
        
        // Update total pages calculation after getting the real count
        this.totalPages = Math.ceil(this.totalTasks / this.tasksPerPage);
      },
      error: (error) => {
        console.error('Error loading task counts:', error);
        // Fallback to default values or show error message
      }
    });
  }

  getPriorityClass(priority: string): string {
    switch(priority.toLowerCase()) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return '';
    }
  }

  getStatusClass(status: string): string {
    switch(status.toLowerCase()) {
      case 'in progress': return 'status-progress';
      case 'completed': return 'status-completed';
      case 'pending': return 'status-pending';
      default: return '';
    }
  }

  getInitialsClass(initials: string): string {
    switch(initials) {
      case 'JD': return 'bg-blue';
      case 'AS': return 'bg-green';
      case 'EJ': return 'bg-purple';
      case 'LW': return 'bg-orange';
      default: return 'bg-gray';
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  addNewTask(): void {
    this.router.navigate(['/admin/task-creation-form']);
  }
}