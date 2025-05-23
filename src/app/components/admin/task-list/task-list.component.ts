import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TaskService } from '../../../services/task.service';

export interface Task {
  id: string;
  title: string;
  status: string;
  team: string;
  priority: string;
  user_id: string;
  duration: string;
  createdUpdated: string;
  updated_at: Date;
  created_at: Date;
}

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
  standalone: true,
  imports: [
    CommonModule, 
    TagModule, 
    TableModule, 
    DropdownModule, 
    FormsModule
  ]
})
export class TaskListComponent implements OnInit {
  
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  
  // Variables to store query parameters
  departmentId: string | null = null;
  selectedPriorityFromRoute: string | null = null;
  teamName: string | null = null;

  // Filter options
  statusOptions = [
    { label: 'All Statuses', value: null },
    { label: 'To Do', value: 'To Do' },
    { label: 'In Progress', value: 'In Progress' },
    { label: 'Completed', value: 'Completed' }
  ];

  teamOptions = [
    { label: 'All Teams', value: null },
    { label: 'Design', value: 'Design' },
    { label: 'Development', value: 'Development' },
    { label: 'Documentation', value: 'Documentation' },
    { label: 'QA', value: 'QA' },
    { label: 'DevOps', value: 'DevOps' }
  ];

  priorityOptions = [
    { label: 'All Priorities', value: null },
    { label: 'High', value: 'HIGH' },
    { label: 'Medium', value: 'MEDIUM' },
    { label: 'Low', value: 'LOW' }
  ];

  // Selected filter values
  selectedStatus: string | null = null;
  selectedTeam: string | null = null;
  selectedPriority: string | null = null;

  constructor(private route: ActivatedRoute, private taskService: TaskService) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.departmentId = params['departmentId'];
      this.selectedPriorityFromRoute = params['priority'];
      this.teamName = params['teamName'];
      
      console.log('Query params:', {
        departmentId: this.departmentId,
        priority: this.selectedPriorityFromRoute,
        teamName: this.teamName
      });

      // Set the priority filter based on route parameter
      if (this.selectedPriorityFromRoute) {
        this.selectedPriority = this.selectedPriorityFromRoute;
      }

      this.loadTasks();
    });
  }

  loadTasks() {
    if (this.departmentId && this.selectedPriorityFromRoute) {
      // Load tasks by team and priority
      this.taskService.getTasksByTeamAndPriority(this.departmentId, this.selectedPriorityFromRoute as 'HIGH' | 'MEDIUM' | 'LOW')
        .subscribe({
          next: (tasks: any[]) => {
            this.tasks = tasks;
            this.filteredTasks = [...this.tasks];
            console.log('Tasks loaded by team and priority:', tasks);
          },
          error: (error) => {
            console.error('Error loading tasks by team and priority:', error);
            // Fallback to load all tasks for the team
            this.loadTasksByTeam();
          }
        });
    } else if (this.departmentId) {
      // Load all tasks for the team
      this.loadTasksByTeam();
    } else {
      // Fallback: load all tasks
      this.taskService.getTasks().subscribe({
        next: (tasks: any[]) => {
          this.tasks = tasks;
          this.filteredTasks = [...this.tasks];
          console.log('All tasks loaded:', tasks);
        },
        error: (error) => {
          console.error('Error loading all tasks:', error);
        }
      });
    }
  }

  loadTasksByTeam() {
    if (this.departmentId) {
      this.taskService.getTasksByTeam(this.departmentId).subscribe({
        next: (tasks: any[]) => {
          this.tasks = tasks;
          this.filteredTasks = [...this.tasks];
          console.log('Tasks loaded by team:', tasks);
        },
        error: (error) => {
          console.error('Error loading tasks by team:', error);
        }
      });
    }
  }

  applyFilters() {
    this.filteredTasks = this.tasks.filter(task => {
      return (!this.selectedStatus || task.status === this.selectedStatus) &&
             (!this.selectedTeam || task.team === this.selectedTeam) &&
             (!this.selectedPriority || task.priority === this.selectedPriority);
    });
  }

  onStatusChange() {
    this.applyFilters();
  }

  onTeamChange() {
    this.applyFilters();
  }

  onPriorityChange() {
    this.applyFilters();
  }

  getStatusSeverity(status: string): string {
    switch (status) {
      case 'COMPLETED':
      case 'Completed':
        return 'status-completed';
      case 'IN_PROGRESS':
      case 'In Progress':
        return 'status-in-progress';
      case 'PENDING':
      case 'To Do':
        return 'status-todo';
      default:
        return 'status-default';
    }
  }

  getPrioritySeverity(priority: string): string {
    switch (priority) {
      case 'HIGH':
      case 'High':
        return 'priority-high';
      case 'MEDIUM':
      case 'Medium':
        return 'priority-medium';
      case 'LOW':
      case 'Low':
        return 'priority-low';
      default:
        return 'priority-default';
    }
  }

  getTeamColor(team: string): string {
    const colors: { [key: string]: string } = {
      'Design': '#3b82f6',
      'Development': '#10b981',
      'Documentation': '#f59e0b',
      'QA': '#8b5cf6',
      'DevOps': '#ef4444'
    };
    return colors[team] || '#6b7280';
  }

  // Method to get display text for priority
  getPriorityDisplayText(priority: string): string {
    switch (priority) {
      case 'HIGH':
        return 'High';
      case 'MEDIUM':
        return 'Medium';
      case 'LOW':
        return 'Low';
      default:
        return priority;
    }
  }

  // Method to get display text for status
  getStatusDisplayText(status: string): string {
    switch (status) {
      case 'PENDING':
        return 'To Do';
      case 'IN_PROGRESS':
        return 'In Progress';
      case 'COMPLETED':
        return 'Completed';
      default:
        return status;
    }
  }
}