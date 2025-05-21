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

interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: Date;
  dueTime: string;
  estimatedHours: number;
  status: 'pending' | 'completed';
  priority: 'high' | 'medium' | 'low';
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
    InputNumberModule
  ]
})
export class UserProfileComponent implements OnInit {
  user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 234 567 8900',
    role: 'Senior Developer',
    department: 'Development Team',
    avatar: 'https://via.placeholder.com/150'
  };

  tasks: Task[] = [
    {
      id: 1,
      title: 'Implement User Authentication',
      description: 'Create login and registration functionality',
      dueDate: new Date('2024-03-25'),
      dueTime: '14:00',
      estimatedHours: 4,
      status: 'completed',
      priority: 'high'
    },
    {
      id: 2,
      title: 'Design Database Schema',
      description: 'Create ERD and implement database tables',
      dueDate: new Date('2024-03-28'),
      dueTime: '16:30',
      estimatedHours: 6,
      status: 'pending',
      priority: 'high'
    },
    {
      id: 3,
      title: 'API Documentation',
      description: 'Document all API endpoints',
      dueDate: new Date('2024-03-30'),
      dueTime: '11:00',
      estimatedHours: 3,
      status: 'pending',
      priority: 'medium'
    }
  ];

  showAddTaskDialog = false;
  newTask: Partial<Task> = {
    title: '',
    description: '',
    dueDate: new Date(),
    dueTime: '09:00',
    estimatedHours: 1,
    priority: 'medium'
  };

  timeOptions = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00',
    '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30'
  ];

  get completedTasks() {
    return this.tasks.filter(task => task.status === 'completed');
  }

  get pendingTasks() {
    return this.tasks.filter(task => task.status === 'pending');
  }

  get completionPercentage() {
    return (this.completedTasks.length / this.tasks.length) * 100;
  }

  constructor() { }

  ngOnInit(): void { }

  addTask() {
    if (this.newTask.title && this.newTask.description) {
      const task: Task = {
        id: this.tasks.length + 1,
        title: this.newTask.title!,
        description: this.newTask.description!,
        dueDate: this.newTask.dueDate!,
        dueTime: this.newTask.dueTime!,
        estimatedHours: this.newTask.estimatedHours!,
        status: 'pending',
        priority: this.newTask.priority as 'high' | 'medium' | 'low'
      };
      this.tasks.push(task);
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
      priority: 'medium'
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
} 