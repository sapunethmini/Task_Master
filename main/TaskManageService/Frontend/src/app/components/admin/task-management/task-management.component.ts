import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { TaskService } from '../../../services/task.service';

interface TeamTaskData {
  id: number;
  name: string;
  completedTasks: number;
  pendingTasks: number;
  totalTasks: number;
  color: string;
  departmentId: string;
}

@Component({
  selector: 'app-task-management',
  templateUrl: './task-management.component.html',
  styleUrls: ['./task-management.component.css'],
  standalone: true,
  imports: [CommonModule, CardModule]
})
export class TaskManagementComponent implements OnInit {
  teams: TeamTaskData[] = [
    { id: 1, name: 'Development Team', completedTasks: 0, pendingTasks: 0, totalTasks: 0, color: '#4CAF50', departmentId: '001' },
    { id: 2, name: 'Marketing Team', completedTasks: 0, pendingTasks: 0, totalTasks: 0, color: '#2196F3', departmentId: '002' },
    { id: 3, name: 'Sales Team', completedTasks: 0, pendingTasks: 0, totalTasks: 0, color: '#9C27B0', departmentId: '003' },
    { id: 4, name: 'Operation Team', completedTasks: 0, pendingTasks: 0, totalTasks: 0, color: '#FF5722', departmentId: '004' },
    { id: 5, name: 'Design Team', completedTasks: 0, pendingTasks: 0, totalTasks: 0, color: '#FFC107', departmentId: '005' },
    { id: 6, name: 'HR Team', completedTasks: 0, pendingTasks: 0, totalTasks: 0, color: '#607D8B', departmentId: '006' }
  ];
  

  constructor(
    private router: Router,
    private http: HttpClient,
    private taskService: TaskService
  ) { }

  ngOnInit(): void {
   this.teams.forEach((team) => {
      this.taskService.getCountByTeam(team.departmentId).subscribe(totalTasks => {
        team.totalTasks = totalTasks;
        this.taskService.getTaskCountByStatus('COMPLETED').subscribe(completedTasks => {
          team.completedTasks = completedTasks;  
          team.pendingTasks = totalTasks - completedTasks;});
      });
    });
  }
  getColorClass(completedTasks: number, totalTasks: number): string {
    const progress = (completedTasks / totalTasks) * 100;
    if (progress >= 80) {
      return 'progress-success';
    } else if (progress >= 60) {
      return 'progress-warning';
    } else {
      return 'progress-danger';
    }
  }
  viewTeamTasks(team: TeamTaskData): void {
    // Navigate to team overview with department ID and title
    this.router.navigate(['/admin/team-overview'], {
      queryParams: {
        departmentId: team.departmentId,
        title: team.name,
        completedTasks: team.completedTasks,
        pendingTasks: team.pendingTasks,
        totalTasks: team.totalTasks,
        color: team.color
      }
    });
  }

  getCompletionPercentage(team: TeamTaskData): number {
    return (team.completedTasks / team.totalTasks) * 100;
  }
} 