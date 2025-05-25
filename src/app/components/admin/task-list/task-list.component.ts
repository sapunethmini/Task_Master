import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TagModule } from 'primeng/tag';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';

export interface Task {
  id: string;
  title: string;
  status: string;
  team: string;
  priority: string;
  userId: string;
  duration: string;
  createdUpdated: string;
}

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, TagModule, TableModule, DropdownModule]
})
export class TaskListComponent implements OnInit {
  
  tasks: Task[] = [
    {
      id: '1',
      title: 'Design landing page',
      status: 'In Progress',
      team: 'Design',
      priority: 'High',
      userId: 'user123',
      duration: '2 days',
      createdUpdated: '2023-09-15 10:00'
    },
    {
      id: '2',
      title: 'Implement user authentication',
      status: 'Completed',
      team: 'Development',
      priority: 'High',
      userId: 'user456',
      duration: '3 days',
      createdUpdated: '2023-09-14 14:30'
    },
    {
      id: '3',
      title: 'Write documentation',
      status: 'To Do',
      team: 'Documentation',
      priority: 'Medium',
      userId: 'user789',
      duration: '1 day',
      createdUpdated: '2023-09-16 09:00'
    },
    {
      id: '4',
      title: 'Test application',
      status: 'In Progress',
      team: 'QA',
      priority: 'Medium',
      userId: 'user101',
      duration: '2 days',
      createdUpdated: '2023-09-15 12:00'
    },
    {
      id: '5',
      title: 'Deploy to production',
      status: 'To Do',
      team: 'DevOps',
      priority: 'High',
      userId: 'user202',
      duration: '1 day',
      createdUpdated: '2023-09-17 11:00'
    }
  ];

  filteredTasks: Task[] = [];

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
    { label: 'High', value: 'High' },
    { label: 'Medium', value: 'Medium' },
    { label: 'Low', value: 'Low' }
  ];

  // Selected filter values
  selectedStatus: string | null = null;
  selectedTeam: string | null = null;
  selectedPriority: string | null = null;

  ngOnInit() {
    this.filteredTasks = [...this.tasks];
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
      case 'Completed':
        return 'status-completed';
      case 'In Progress':
        return 'status-in-progress';
      case 'To Do':
        return 'status-todo';
      default:
        return 'status-default';
    }
  }

  getPrioritySeverity(priority: string): string {
    switch (priority) {
      case 'High':
        return 'priority-high';
      case 'Medium':
        return 'priority-medium';
      case 'Low':
        return 'priority-low';
      default:
        return 'priority-default';
    }
  }

  getTeamColor(team: string): string {
    // All teams will have the same blue color
    return '#3b82f6';
  }
}