import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';

@Component({
  selector: 'app-employee-dashboard',
  templateUrl: './employee-dashboard.component.html',
  styleUrls: ['./employee-dashboard.component.css'],
  standalone: true,
  imports: [CommonModule, CardModule, ChartModule, ButtonModule, ProgressBarModule]
})
export class EmployeeDashboardComponent implements OnInit {
  performanceScore = 85;
  starRating = 4;
  
  completedTasks = 15;
  pendingTasks = 5;
  inProgressTasks = 3;
  totalTasks = 23;
  
  // Additional metrics from the image
  tasksCompleted = 24;
  tasksCompletedChange = -9;
  newTasksAssigned = 4;
  newTasksAssignedChange = 17;
  projectsCompleted = 28;
  projectsCompletedChange = 23;
  objectivesCompleted = 28;
  objectivesCompletedChange = -12;
  
  // Resource metrics
  accessCredits = 55;
  members = 20;
  attachments = 32;
  
  // Chart data
  successRateData: any;
  projectStatisticsData: any;
  chartOptions: any;
  
  recentActivities = [
    {
      type: 'success',
      icon: 'pi pi-check-circle',
      title: 'Task Completed',
      description: 'Successfully completed the project documentation',
      time: '2 hours ago'
    },
    {
      type: 'warning',
      icon: 'pi pi-clock',
      title: 'Task Deadline',
      description: 'Code review deadline approaching',
      time: '4 hours ago'
    },
    {
      type: 'info',
      icon: 'pi pi-info-circle',
      title: 'New Task Assigned',
      description: 'You have been assigned a new task',
      time: '1 day ago'
    }
  ];

  constructor(private router: Router) { }

  ngOnInit() {
    this.initializeCharts();
  }

  initializeCharts() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
    
    // Success Rate Chart
    this.successRateData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr'],
      datasets: [
        {
          label: 'Success Rate',
          data: [70, 55, 85, 75],
          backgroundColor: '#3B82F6',
          borderRadius: 6
        }
      ]
    };
    
    // Project Statistics Chart
    this.projectStatisticsData = {
      labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      datasets: [
        {
          label: 'Tasks',
          data: [15, 14, 16, 18, 15, 14, 17],
          backgroundColor: '#3B82F6',
          borderRadius: 6
        },
        {
          label: 'Progress',
          data: [28, 29, 23, 27, 25, 26, 28],
          backgroundColor: '#F59E0B',
          borderRadius: 6
        }
      ]
    };
    
    // Chart Options
    this.chartOptions = {
      maintainAspectRatio: false,
      aspectRatio: 1.5,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            display: false
          }
        },
        y: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: '#f3f4f6',
            drawBorder: false
          },
          display: true
        }
      }
    };
  }

  navigateToProfile() {
    this.router.navigate(['/employee/profile']);
  }

  showNotifications() {
    // Implement notification panel logic here
    console.log('Show notifications');
  }

  getChangeClass(value: number): string {
    return value >= 0 ? 'positive-change' : 'negative-change';
  }

  getChangePrefix(value: number): string {
    return value >= 0 ? '+' : '';
  }
}