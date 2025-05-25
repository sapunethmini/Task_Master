import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { CheckboxModule } from 'primeng/checkbox';
import { TooltipModule } from 'primeng/tooltip';
import { EmployeeService, Task } from '../../../services/employee-service';
import { EmployeeTasksListComponent } from '../tasks-emp/emp-tasks.component';

@Component({
  selector: 'app-employee-dashboard',
  templateUrl: './employee-dashboard.component.html',
  styleUrls: ['./employee-dashboard.component.css'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    CardModule, 
    ChartModule, 
    ButtonModule, 
    ProgressBarModule,
    AvatarModule,
    BadgeModule,
    CheckboxModule,
    TooltipModule,
    EmployeeTasksListComponent
  ]
})
export class EmployeeDashboardComponent implements OnInit {
  
  // Performance data
  performanceScore = 87;
  starRating = 4.2;
  isLoading = true;
  error: string | null = null;
  
  // Task statistics - will be updated from backend
  completedTasks = 0;
  pendingTasks = 0;
  inProgressTasksCount = 0;
  totalTasks = 0;
  
  // Loading state
  isLoadingTaskData = true;
  
  // Chart data
  performanceChartData: any;
  taskCompletionChartData: any;
  chartOptions: any;
  pieChartOptions: any;
  
  // User's actual tasks from backend
  userTasks: Task[] = [];
  
  // Task lists (these will be populated from userTasks)
  todayTasks: any[] = [];
  inProgressTasks: any[] = [];

  // User profile data
  userProfile = {
    name: '',
    role: 'Employee',
    avatar: '',
    notifications: 0,
    department: '',
    joinDate: ''
  };

  constructor(
    private router: Router,
    private employeeService: EmployeeService
  ) { }

  ngOnInit() {
    console.log('Dashboard component initializing...');
    this.updateUserProfileFromToken();
    this.initializeCharts();
    this.loadUserTasks();
  }

  // Load all tasks for the logged-in user
  loadUserTasks() {
    console.log('Starting to load user tasks...');
    this.isLoadingTaskData = true;
    this.error = null;
    
    this.employeeService.getTasksByUser().subscribe({
      next: (tasks: Task[]) => {
        console.log('✅ User tasks loaded successfully:', tasks);
        
        // Store the raw tasks
        this.userTasks = tasks;
        
        // Process and categorize tasks
        this.processUserTasks(tasks);
        
        // Update task statistics
        this.updateTaskStatisticsFromTasks(tasks);
        
        // Reinitialize charts with new data
        this.initializeCharts();
        
        this.isLoadingTaskData = false;
        this.isLoading = false;
        
        console.log('✅ Task processing completed successfully');
      },
      error: (error) => {
        console.error('❌ Error loading user tasks:', error);
        this.error = error.message || 'Failed to load tasks';
        this.isLoadingTaskData = false;
        this.isLoading = false;
        
        // Try fallback method
        console.log('🔄 Attempting fallback task loading method...');
        this.loadTaskDataFallback();
      }
    });
  }

  // Fallback method to load task data
  loadTaskDataFallback() {
    console.log('Using fallback method to load task counts...');
    
    this.employeeService.getAllTaskCounts().subscribe({
      next: (taskCounts) => {
        console.log('✅ Task counts loaded via fallback:', taskCounts);
        
        this.completedTasks = taskCounts.completed;
        this.inProgressTasksCount = taskCounts.inProgress;
        this.pendingTasks = taskCounts.pending;
        this.totalTasks = this.completedTasks + this.inProgressTasksCount + this.pendingTasks;
        
        // Initialize charts with count data
        this.initializeCharts();
        
        // Create placeholder tasks for display
        this.createPlaceholderTasks();
        
        this.isLoadingTaskData = false;
        console.log('✅ Fallback task loading completed');
      },
      error: (error) => {
        console.error('❌ Fallback method also failed:', error);
        this.error = 'Unable to load task data. Please check your connection and try again.';
        this.isLoadingTaskData = false;
        
        // Load individual counts as last resort
        this.loadTaskCountsIndividually();
      }
    });
  }

  // Last resort: Load task counts individually
  loadTaskCountsIndividually() {
    console.log('Loading task counts individually as last resort...');
    
    let loadedCount = 0;
    const totalToLoad = 3;
    
    const checkComplete = () => {
      loadedCount++;
      if (loadedCount === totalToLoad) {
        this.totalTasks = this.completedTasks + this.inProgressTasksCount + this.pendingTasks;
        this.initializeCharts();
        this.createPlaceholderTasks();
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

  // Create placeholder tasks when real task data is not available
  createPlaceholderTasks() {
    console.log('Creating placeholder tasks for display...');
    
    this.todayTasks = [];
    this.inProgressTasks = [];
    
    // Create some placeholder tasks based on counts
    for (let i = 0; i < Math.min(4, this.pendingTasks + this.completedTasks); i++) {
      this.todayTasks.push({
        id: i + 1,
        title: `Task ${i + 1}`,
        priority: ['high', 'medium', 'low'][i % 3],
        completed: i < this.completedTasks,
        dueTime: 'Today',
        progress: i < this.completedTasks ? 100 : 0
      });
    }
    
    for (let i = 0; i < Math.min(3, this.inProgressTasksCount); i++) {
      this.inProgressTasks.push({
        id: i + 100,
        title: `In Progress Task ${i + 1}`,
        progress: Math.floor(Math.random() * 50) + 25,
        deadline: '2024-03-20',
        assignee: 'Development Team',
        priority: 'medium'
      });
    }
  }

  // Process user tasks and categorize them
  processUserTasks(tasks: Task[]) {
    console.log('Processing user tasks:', tasks);
    
    // Convert backend tasks to display format for today's tasks
    this.todayTasks = tasks
      .filter(task => task.status === 'TODO' || task.status === 'COMPLETED')
      .slice(0, 6) // Limit to first 6 tasks
      .map(task => ({
        id: task.id,
        title: task.title,
        priority: (task.priority || 'MEDIUM').toLowerCase(),
        completed: task.status === 'COMPLETED',
        dueTime: this.formatDueTime(task.dueDate),
        progress: task.status === 'COMPLETED' ? 100 : 0,
        originalTask: task // Keep reference to original task
      }));

    // Convert backend tasks to display format for in-progress tasks
    this.inProgressTasks = tasks
      .filter(task => task.status === 'IN_PROGRESS')
      .slice(0, 4) // Limit to first 4 tasks
      .map(task => ({
        id: task.id,
        title: task.title,
        progress: this.calculateTaskProgress(task),
        deadline: task.dueDate || '2024-03-20',
        assignee: task.assigneeName || 'Development Team',
        priority: (task.priority || 'MEDIUM').toLowerCase(),
        originalTask: task // Keep reference to original task
      }));

    console.log('Processed today tasks:', this.todayTasks);
    console.log('Processed in-progress tasks:', this.inProgressTasks);
  }

  // Update task statistics from actual tasks
  updateTaskStatisticsFromTasks(tasks: Task[]) {
    this.completedTasks = tasks.filter(task => task.status === 'COMPLETED').length;
    this.inProgressTasksCount = tasks.filter(task => task.status === 'IN_PROGRESS').length;
    this.pendingTasks = tasks.filter(task => task.status === 'TODO').length;
    this.totalTasks = tasks.length;
    
    // Update star rating
    this.starRating = this.calculateStarRating();
    
    console.log('📊 Task statistics updated:', {
      completed: this.completedTasks,
      inProgress: this.inProgressTasksCount,
      pending: this.pendingTasks,
      total: this.totalTasks
    });
  }

  // Calculate task progress (you can customize this logic)
  calculateTaskProgress(task: Task): number {
    if (task.status === 'COMPLETED') return 100;
    if (task.status === 'TODO') return 0;
    
    // For IN_PROGRESS tasks, you can implement custom logic
    // Check if task has a progress field, otherwise calculate based on time
    if (task.progress !== undefined && task.progress !== null) {
      return task.progress;
    }
    
    // Default progress for in-progress tasks
    return Math.floor(Math.random() * 50) + 25;
  }

  // Format due time for display
  formatDueTime(dueDate?: string): string {
    if (!dueDate) return 'No due date';
    
    try {
      const date = new Date(dueDate);
      const today = new Date();
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return 'Invalid date';
      }
      
      // If it's today, show time
      if (date.toDateString() === today.toDateString()) {
        return date.toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit', 
          hour12: true 
        });
      }
      
      // Otherwise show date
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    } catch (error) {
      console.error('Error formatting due time:', error);
      return 'Invalid date';
    }
  }

  initializeCharts() {
    const documentStyle = getComputedStyle(document.documentElement);
    
    // Performance Pie Chart with real data
    this.performanceChartData = {
      labels: ['Completed', 'In Progress', 'Pending'],
      datasets: [
        {
          data: [this.completedTasks, this.inProgressTasksCount, this.pendingTasks],
          backgroundColor: [
            '#10B981', // Green for completed
            '#F59E0B', // Orange for in progress  
            '#EF4444'  // Red for pending
          ],
          borderWidth: 0,
          hoverOffset: 8
        }
      ]
    };

    // Task Completion Bar Chart - Weekly data
    this.taskCompletionChartData = {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [
        {
          label: 'Completed',
          data: [12, 15, 8, 10, 14, 6, 9],
          backgroundColor: '#10B981',
          borderRadius: 8,
          borderSkipped: false
        },
        {
          label: 'In Progress',
          data: [3, 2, 5, 4, 2, 3, 4],
          backgroundColor: '#F59E0B',
          borderRadius: 8,
          borderSkipped: false
        },
        {
          label: 'Pending',
          data: [2, 3, 1, 2, 1, 4, 2],
          backgroundColor: '#EF4444',
          borderRadius: 8,
          borderSkipped: false
        }
      ]
    };

    // Pie Chart Options
    this.pieChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: {
          top: 20,
          bottom: 20,
          left: 40,
          right: 40
        }
      },
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            usePointStyle: true,
            padding: 25,
            font: {
              size: 13,
              family: 'Inter'
            },
            color: '#374151'
          }
        },
        tooltip: {
          backgroundColor: '#1F2937',
          titleColor: '#F9FAFB',
          bodyColor: '#F9FAFB',
          borderColor: '#374151',
          borderWidth: 1,
          cornerRadius: 12,
          displayColors: true,
          callbacks: {
            label: function(context: any) {
              const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
              const percentage = total > 0 ? ((context.raw / total) * 100).toFixed(1) : '0';
              return `${context.label}: ${context.raw} (${percentage}%)`;
            }
          }
        }
      },
      elements: {
        arc: {
          radius: '50%'
        }
      },
      animation: {
        animateRotate: true,
        duration: 1500
      }
    };

    // Bar Chart Options
    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            usePointStyle: true,
            padding: 20,
            font: {
              size: 13,
              family: 'Inter'
            },
            color: '#374151'
          }
        },
        tooltip: {
          backgroundColor: '#1F2937',
          titleColor: '#F9FAFB',
          bodyColor: '#F9FAFB',
          borderColor: '#374151',
          borderWidth: 1,
          cornerRadius: 12
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          },
          ticks: {
            font: {
              size: 12,
              family: 'Inter'
            },
            color: '#6B7280'
          }
        },
        y: {
          beginAtZero: true,
          grid: {
            color: '#F3F4F6',
            lineWidth: 1
          },
          ticks: {
            font: {
              size: 12,
              family: 'Inter'
            },
            color: '#6B7280'
          }
        }
      },
      animation: {
        duration: 1500,
        easing: 'easeInOutQuart'
      }
    };

    console.log('📈 Charts initialized with data:', {
      pieData: this.performanceChartData.datasets[0].data,
      totalTasks: this.totalTasks
    });
  }

  // Navigation methods
  navigateToProfile() {
    this.router.navigate(['/employee/profile']);
  }

  showNotifications() {
    console.log('Show notifications panel');
  }

 // Updated toggleTaskCompletion method for direct userTasks integration
toggleTaskCompletion(task: Task) {
  console.log('Toggling task completion for:', task);
  
  const originalStatus = task.status;
  const newStatus = task.status === 'COMPLETED' ? 'TODO' : 'COMPLETED';
  
  console.log(`Updating task ${task.id} status from ${originalStatus} to ${newStatus}`);
  
  this.employeeService.updateTaskStatus(task.id, newStatus).subscribe({
    next: (response) => {
      console.log('✅ Task status updated successfully:', response);
      
      // Update the task status locally
      task.status = newStatus;
      
      // Update statistics
      this.updateTaskStatisticsFromTasks(this.userTasks);
      
      // Reinitialize charts with new data
      this.initializeCharts();
      
      console.log('✅ Task status and statistics updated');
    },
    error: (error) => {
      console.error('❌ Error updating task status:', error);
      this.error = 'Failed to update task status. Please try again.';
      
      // Don't revert the status since we're working directly with the Task object
      // The UI will show the original status until the page is refreshed
    }
  });
}

  // Refresh task data from backend
  refreshTaskData() {
    console.log('🔄 Refreshing task data...');
    this.loadUserTasks();
  }

  updateTaskStatistics() {
    this.loadUserTasks();
  }

 getPriorityClass(priority: string): string {
    const priorityClasses = {
      'high': 'priority-high',
      'medium': 'priority-medium',
      'low': 'priority-low'
    };
    return priorityClasses[priority as keyof typeof priorityClasses] || 'priority-medium';
  }

  getPriorityLabel(priority: string): string {
    const priorityLabels = {
      'high': 'High',
      'medium': 'Medium', 
      'low': 'Low'
    };
    return priorityLabels[priority as keyof typeof priorityLabels] || 'Medium';
  }

  getTaskStatusClass(status: string): string {
    const statusClasses = {
      'COMPLETED': 'status-completed',
      'IN_PROGRESS': 'status-in-progress',
      'TODO': 'status-pending'
    };
    return statusClasses[status as keyof typeof statusClasses] || 'status-pending';
  }

  // View task details
  viewTaskDetails(task: any) {
    console.log('Viewing task details:', task);
    // You can implement a modal or navigate to task details page
    if (task.originalTask) {
      console.log('Original task data:', task.originalTask);
    }
  }

  // Edit task
  editTask(task: any) {
    console.log('Editing task:', task);
    // Navigate to edit task page or open edit modal
    if (task.originalTask) {
      this.router.navigate(['/employee/tasks/edit', task.originalTask.id]);
    }
  }

  // Get progress bar color based on progress value
  getProgressColor(progress: number): string {
    if (progress >= 80) return '#10B981'; // Green
    if (progress >= 50) return '#F59E0B'; // Orange
    if (progress >= 25) return '#3B82F6'; // Blue
    return '#EF4444'; // Red
  }

  // Calculate completion percentage
  getCompletionPercentage(): number {
    if (this.totalTasks === 0) return 0;
    return Math.round((this.completedTasks / this.totalTasks) * 100);
  }

  // Get task distribution for display
  getTaskDistribution() {
    return {
      completed: this.completedTasks,
      inProgress: this.inProgressTasksCount,
      pending: this.pendingTasks,
      total: this.totalTasks,
      completionRate: this.getCompletionPercentage()
    };
  }

  // Format date for display
  formatDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Date';
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  }

  // Check if task is overdue
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

  // Get overdue tasks count
  getOverdueTasksCount(): number {
    return this.userTasks.filter(task => 
      task.status !== 'COMPLETED' && 
      task.dueDate && 
      this.isTaskOverdue(task.dueDate)
    ).length;
  }

  // Get upcoming tasks (due in next 3 days)
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

  // Handle task priority change
  updateTaskPriority(task: any, newPriority: string) {
    console.log(`Updating task ${task.id} priority to ${newPriority}`);
    
    if (task.originalTask) {
      // Update via API
      const updatedTask = { ...task.originalTask, priority: newPriority.toUpperCase() };
      
      this.employeeService.updateEmployee(updatedTask).subscribe({
        next: (response) => {
          console.log('✅ Task priority updated successfully:', response);
          task.priority = newPriority;
          this.loadUserTasks(); // Refresh data
        },
        error: (error) => {
          console.error('❌ Error updating task priority:', error);
          this.error = 'Failed to update task priority. Please try again.';
        }
      });
    } else {
      // Update locally for placeholder tasks
      task.priority = newPriority;
    }
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

  // Get user info from token
  getUserInfoFromToken(): any {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;

      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        userId: payload.userId || payload.id || payload.sub,
        username: payload.sub, // Using 'sub' as the username
        email: payload.email,
        role: payload.role
      };
    } catch (error) {
      console.error('Error extracting user info from token:', error);
      return null;
    }
  }

  // Update user profile with token data
  updateUserProfileFromToken() {
    const userInfo = this.getUserInfoFromToken();
    if (userInfo) {
      this.userProfile.name = userInfo.username || 'User';
      this.userProfile.avatar = userInfo.username?.charAt(0).toUpperCase() || 'U';
      // You can update other profile fields as needed
      console.log('User profile updated from token:', this.userProfile);
    }
  }

  // Handle logout
  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  // Navigate to specific task views
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

  // Additional lifecycle methods
  ngOnDestroy() {
    // Clean up any subscriptions if needed
    console.log('Dashboard component destroyed');
  }

  // Calculate star rating based on task completion and performance
  calculateStarRating(): number {
    const completionRate = this.getCompletionPercentage();
    const baseRating = (completionRate / 100) * 5; // Convert percentage to 5-star scale
    
    // Add bonus points for high completion rates
    let bonus = 0;
    if (completionRate >= 90) {
      bonus = 0.5;
    } else if (completionRate >= 75) {
      bonus = 0.3;
    } else if (completionRate >= 60) {
      bonus = 0.1;
    }
    
    // Ensure rating is between 0 and 5
    return Math.min(5, Math.max(0, baseRating + bonus));
  }

  // Get motivational message based on performance
  getMotivationalMessage(): string {
    const completionRate = this.getCompletionPercentage();
    const messages = [
      {
        threshold: 90,
        messages: [
          "Outstanding work! You're setting the bar high!",
          "You're crushing it! Keep up the amazing work!",
          "Perfect performance! You're a role model!"
        ]
      },
      {
        threshold: 75,
        messages: [
          "Great job! You're making excellent progress!",
          "You're doing really well! Keep pushing forward!",
          "Impressive work! You're on the right track!"
        ]
      },
      {
        threshold: 60,
        messages: [
          "Good progress! Keep up the momentum!",
          "You're getting there! Stay focused!",
          "Nice work! Every task completed is a step forward!"
        ]
      },
      {
        threshold: 0,
        messages: [
          "Every journey starts with a single step!",
          "You've got this! Take it one task at a time!",
          "Small progress is still progress! Keep going!"
        ]
      }
    ];

    // Find the appropriate message group
    const group = messages.find(g => completionRate >= g.threshold) || messages[messages.length - 1];
    
    // Pick a random message from the group
    return group.messages[Math.floor(Math.random() * group.messages.length)];
  }
}