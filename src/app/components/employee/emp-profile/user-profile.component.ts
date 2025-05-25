import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { ProgressBarModule } from 'primeng/progressbar';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextarea } from 'primeng/inputtextarea';
import { CalendarModule } from 'primeng/calendar';
import { InputNumberModule } from 'primeng/inputnumber';
import { Router } from '@angular/router';
import { EmployeeService, Task as BaseTask } from '../../../../app/services/employee-service';
import { ChartModule } from 'primeng/chart';

// Extended Task interface with additional properties
interface Task extends BaseTask {
  dueTime?: string;
  estimatedHours?: number;
}

interface LocalTask {
  id: number;
  title: string;
  description: string;
  dueDate: Date;
  dueTime: string;
  estimatedHours: number;
  status: 'pending' | 'completed';
  priority: 'high' | 'medium' | 'low';
  category?: string;
  assignee?: string;
}

interface TaskCounts {
  completed: number;
  inProgress: number;
  pending: number;
}

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    BadgeModule,
    ProgressBarModule,
    DialogModule,
    FormsModule,
    InputTextModule,
    InputTextarea,
    CalendarModule,
    InputNumberModule,
    ChartModule
  ],
  providers: [EmployeeService]
})
export class UserProfileComponent implements OnInit {
  user = {
    name: '',
    email: '',
    phone: '',
    role: '',
    department: '',
    avatar: '',
    location: '',
    joinDate: ''
  };

  // Task count properties
  completedTasks: number = 0;
  inProgressTasksCount: number = 0;
  pendingTasks: number = 0;
  totalTasks: number = 0;
  isLoadingTaskData: boolean = true;
  error: string | null = null;

  // Additional metrics
  avgTasksPerDay: number = 3.2;
  onTimeDelivery: string = '94%';
  efficiencyScore: string = '8.7/10';
  focusTime: string = '6.2h';
  taskQuality: string = '9.1/10';
  overdueTasks: number = 2;
  todayTasks: number = 5;
  totalHours: number = 127;
  avgCompletion: number = 2.3;

  // Chart data
  chartData: any;
  chartOptions: any;
  priorityChartData: any;
  doughnutOptions: any;
  statusChartData: any;
  barOptions: any;

  // Dialog controls
  showAddTaskDialog: boolean = false;
  showAnalyticsDialog: boolean = false;
  showAllCompleted: boolean = false;

  // User's actual tasks from backend
  userTasks: Task[] = [];

  // Local tasks for UI
  localTasks: LocalTask[] = [];
  newTask: Partial<LocalTask> = {
    title: '',
    description: '',
    dueDate: new Date(),
    dueTime: '09:00',
    estimatedHours: 1,
    priority: 'medium',
    category: '',
    assignee: ''
  };

  timeOptions = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00',
    '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30'
  ];

  constructor(
    private router: Router,
    private employeeService: EmployeeService
  ) { }

  ngOnInit(): void {
    console.log('Profile component initializing...');
    this.loadUserProfileFromToken();
    this.loadUserTasks();
    this.initializeCharts();
  }

  initializeCharts() {
    // Line chart for task trends
    this.chartData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          label: 'Completed Tasks',
          data: [12, 15, 18, 14, 20, 25],
          borderColor: '#10b981',
          tension: 0.4
        }
      ]
    };

    this.chartOptions = {
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    };

    // Doughnut chart for task priorities
    this.priorityChartData = {
      labels: ['High', 'Medium', 'Low'],
      datasets: [{
        data: [30, 50, 20],
        backgroundColor: ['#ef4444', '#f59e0b', '#10b981']
      }]
    };

    this.doughnutOptions = {
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    };

    // Bar chart for task status
    this.statusChartData = {
      labels: ['Completed', 'In Progress', 'Pending'],
      datasets: [{
        label: 'Tasks',
        data: [25, 15, 10],
        backgroundColor: ['#10b981', '#f59e0b', '#ef4444']
      }]
    };

    this.barOptions = {
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    };
  }

  loadUserProfileFromToken() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        this.router.navigate(['/login']);
        return;
      }

      const payload = JSON.parse(atob(token.split('.')[1]));
      
      // Format role to remove 'role_' prefix
      const formattedRole = payload.role ? payload.role.replace('role_', '') : 'Employee';
      
      // Update user profile with token data
      this.user = {
        name: payload.sub || 'User',
        email: payload.email || '',
        phone: payload.phone || '',
        role: formattedRole.charAt(0).toUpperCase() + formattedRole.slice(1).toLowerCase(),
        department: payload.department || 'General',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(payload.sub || 'User')}&background=random`,
        location: payload.location || '',
        joinDate: payload.joinDate || ''
      };

      console.log('User profile loaded from token:', this.user);
    } catch (error) {
      console.error('Error loading user profile from token:', error);
      this.router.navigate(['/login']);
    }
  }

  // EXACT SAME LOGIC AS DASHBOARD - Load all tasks for the logged-in user
  loadUserTasks() {
    console.log('Starting to load user tasks...');
    this.isLoadingTaskData = true;
    this.error = null;
    
    this.employeeService.getTasksByUser().subscribe({
      next: (tasks: Task[]) => {
        console.log('✅ User tasks loaded successfully:', tasks);
        
        // Store the raw tasks
        this.userTasks = tasks;
        
        // Update task statistics from actual tasks
        this.updateTaskStatisticsFromTasks(tasks);
        
        this.isLoadingTaskData = false;
        
        console.log('✅ Task processing completed successfully');
      },
      error: (error) => {
        console.error('❌ Error loading user tasks:', error);
        this.error = error.message || 'Failed to load tasks';
        this.isLoadingTaskData = false;
        
        // Try fallback method (same as dashboard)
        console.log('🔄 Attempting fallback task loading method...');
        this.loadTaskDataFallback();
      }
    });
  }

  // EXACT SAME FALLBACK METHOD AS DASHBOARD
  loadTaskDataFallback() {
    console.log('Using fallback method to load task counts...');
    
    this.employeeService.getAllTaskCounts().subscribe({
      next: (taskCounts) => {
        console.log('✅ Task counts loaded via fallback:', taskCounts);
        
        this.completedTasks = taskCounts.completed;
        this.inProgressTasksCount = taskCounts.inProgress;
        this.pendingTasks = taskCounts.pending;
        this.totalTasks = this.completedTasks + this.inProgressTasksCount + this.pendingTasks;
        
        this.isLoadingTaskData = false;
        console.log('✅ Fallback task loading completed');
      },
      error: (error) => {
        console.error('❌ Fallback method also failed:', error);
        this.error = 'Unable to load task data. Please check your connection and try again.';
        this.isLoadingTaskData = false;
        
        // Load individual counts as last resort (same as dashboard)
        this.loadTaskCountsIndividually();
      }
    });
  }

  // EXACT SAME LAST RESORT METHOD AS DASHBOARD
  loadTaskCountsIndividually() {
    console.log('Loading task counts individually as last resort...');
    
    let loadedCount = 0;
    const totalToLoad = 3;
    
    const checkComplete = () => {
      loadedCount++;
      if (loadedCount === totalToLoad) {
        this.totalTasks = this.completedTasks + this.inProgressTasksCount + this.pendingTasks;
        this.isLoadingTaskData = false;
        console.log('✅ Individual task counts loaded');
      }
    };

    // Load COMPLETED tasks
    this.employeeService.getTaskCountByStatus('COMPLETED').subscribe({
      next: (count) => {
        this.completedTasks = count;
        console.log('Completed tasks count:', count);
        checkComplete();
      },
      error: (error) => {
        console.error('Error loading COMPLETED tasks:', error);
        this.completedTasks = 0;
        checkComplete();
      }
    });

    // Load IN_PROGRESS tasks
    this.employeeService.getTaskCountByStatus('IN_PROGRESS').subscribe({
      next: (count) => {
        this.inProgressTasksCount = count;
        console.log('In Progress tasks count:', count);
        checkComplete();
      },
      error: (error) => {
        console.error('Error loading IN_PROGRESS tasks:', error);
        this.inProgressTasksCount = 0;
        checkComplete();
      }
    });

    // Load TODO tasks
    this.employeeService.getTaskCountByStatus('TODO').subscribe({
      next: (count) => {
        this.pendingTasks = count;
        console.log('Pending tasks count:', count);
        checkComplete();
      },
      error: (error) => {
        console.error('Error loading TODO tasks:', error);
        this.pendingTasks = 0;
        checkComplete();
      }
    });
  }

  // SAME METHOD AS DASHBOARD - Update task statistics from actual tasks
  updateTaskStatisticsFromTasks(tasks: Task[]) {
    this.completedTasks = tasks.filter(task => task.status === 'COMPLETED').length;
    this.inProgressTasksCount = tasks.filter(task => task.status === 'IN_PROGRESS').length;
    this.pendingTasks = tasks.filter(task => task.status === 'TODO').length;
    this.totalTasks = tasks.length;
    
    console.log('📊 Task statistics updated:', {
      completed: this.completedTasks,
      inProgress: this.inProgressTasksCount,
      pending: this.pendingTasks,
      total: this.totalTasks
    });
  }

  // SAME HELPER METHODS AS DASHBOARD
  getCompletionPercentage(): number {
    if (this.totalTasks === 0) return 0;
    return Math.round((this.completedTasks / this.totalTasks) * 100);
  }

  get completionPercentage() {
    return this.getCompletionPercentage();
  }

  // Clear error message
  clearError() {
    this.error = null;
  }

  // Retry loading tasks
  retryLoadingTasks() {
    this.clearError();
    this.loadUserTasks();
  }

  // Refresh task data from backend
  refreshTaskData() {
    console.log('🔄 Refreshing task data...');
    this.loadUserTasks();
  }

  // Get overdue tasks count (same logic as dashboard)
  getOverdueTasksCount(): number {
    return this.userTasks.filter(task => 
      task.status !== 'COMPLETED' && 
      task.dueDate && 
      this.isTaskOverdue(task.dueDate)
    ).length;
  }

  // Check if task is overdue (same logic as dashboard)
  isTaskOverdue(dueDate: string): boolean {
    try {
      const due = new Date(dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return due < today;
    } catch (error) {
      return false;
    }
  }

  // Get upcoming tasks (due in next 3 days) - same logic as dashboard
  getUpcomingTasksCount(): number {
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
    
    return this.userTasks.filter(task => 
      task.status !== 'COMPLETED' && 
      task.dueDate && 
      !this.isTaskOverdue(task.dueDate) &&
      new Date(task.dueDate) <= threeDaysFromNow
    ).length;
  }

  // Get task distribution for display (same as dashboard)
  getTaskDistribution() {
    return {
      completed: this.completedTasks,
      inProgress: this.inProgressTasksCount,
      pending: this.pendingTasks,
      total: this.totalTasks,
      completionRate: this.getCompletionPercentage()
    };
  }

  // LOCAL TASK MANAGEMENT (for UI only - separate from backend tasks)
  addTask() {
    if (this.newTask.title && this.newTask.description) {
      const task: LocalTask = {
        id: this.localTasks.length + 1,
        title: this.newTask.title!,
        description: this.newTask.description!,
        dueDate: this.newTask.dueDate!,
        dueTime: this.newTask.dueTime!,
        estimatedHours: this.newTask.estimatedHours!,
        status: 'pending',
        priority: this.newTask.priority as 'high' | 'medium' | 'low',
        category: this.newTask.category || '',
        assignee: this.newTask.assignee || ''
      };
      this.localTasks.push(task);
      this.showAddTaskDialog = false;
      this.resetNewTask();
    }
  }

  resetNewTask() {
    this.newTask = {
      title: '',
      description: '',
      dueDate: new Date(),
      dueTime: '09:00',
      estimatedHours: 1,
      priority: 'medium',
      category: '',
      assignee: ''
    };
  }

  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'high':
        return '#ef4444';
      case 'medium':
        return '#f59e0b';
      case 'low':
        return '#10b981';
      default:
        return '#6b7280';
    }
  }

  getStatusColor(status: string): string {
    return status === 'completed' ? '#10b981' : '#f59e0b';
  }

  formatTime(time: string): string {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  }

  // Navigation methods (optional - for consistency with dashboard)
  viewAllTasks() {
    this.router.navigate(['/employee/tasks']);
  }

  viewCompletedTasks() {
    this.router.navigate(['/employee/tasks'], { queryParams: { status: 'completed' } });
  }

  viewPendingTasks() {
    this.router.navigate(['/employee/tasks'], { queryParams: { status: 'pending' } });
  }

  viewInProgressTasks() {
    this.router.navigate(['/employee/tasks'], { queryParams: { status: 'in-progress' } });
  }

  saveDraft() {
    // Implement draft saving logic
    console.log('Saving draft...');
  }

  exportAnalytics() {
    // Implement analytics export logic
    console.log('Exporting analytics...');
  }

  // Helper methods for template
  get pendingTasksList() {
    return this.userTasks?.filter(t => t.status === 'TODO') || [];
  }

  get completedTasksList() {
    return this.userTasks?.filter(t => t.status === 'COMPLETED') || [];
  }

  get hasNoPendingTasks() {
    return !this.userTasks || this.pendingTasksList.length === 0;
  }

  get hasCompletedTasks() {
    return this.userTasks && this.completedTasksList.length > 0;
  }

  get hasMoreThanThreeCompletedTasks() {
    return this.userTasks && this.completedTasksList.length > 3;
  }

  get displayedCompletedTasks() {
    return this.showAllCompleted ? 
      this.completedTasksList : 
      this.completedTasksList.slice(0, 3);
  }
} 