import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ProgressBarModule } from 'primeng/progressbar';
import { Router } from '@angular/router';
import { TaskService } from '../../../services/task.service';

interface TeamData {
  id: number;
  name: string;
  progress: number;
  tasksCompleted: number;
  totalTasks: number;
  members: number;
  color: string;
  departmentId: string;
}

@Component({
  selector: 'app-team-management',
  templateUrl: './team-management.component.html',
  styleUrls: ['./team-management.component.css'],
  standalone: true,
  imports: [CommonModule, CardModule, ProgressBarModule]
})
export class TeamManagementComponent implements OnInit {
  teams: TeamData[] = [
    { id: 1, name: 'Development Team', progress: 0, tasksCompleted: 0, totalTasks: 0, members: 8, color: '#4CAF50', departmentId: '001' },
    { id: 2, name: 'Marketing Team', progress: 0, tasksCompleted: 0, totalTasks: 0, members: 5, color: '#2196F3', departmentId: '002' },
    { id: 3, name: 'Sales Team', progress: 0, tasksCompleted: 0, totalTasks: 0, members: 6, color: '#9C27B0', departmentId: '003' },
    { id: 4, name: 'Operation Team', progress: 0, tasksCompleted: 0, totalTasks: 0, members: 4, color: '#FF5722', departmentId: '004' },
    { id: 5, name: 'Design Team', progress: 0, tasksCompleted: 0, totalTasks: 0, members: 4, color: '#FFC107', departmentId: '005' },
    { id: 6, name: 'HR Team', progress: 0, tasksCompleted: 0, totalTasks: 0, members: 3, color: '#607D8B', departmentId: '006' }
  ];

  constructor(private router: Router, private taskService: TaskService) {}

  ngOnInit(): void {
    this.teams.forEach((team) => {
      this.taskService.getCountByTeam(team.departmentId).subscribe(totalTasks => {
        team.totalTasks = totalTasks;
        this.taskService.getTaskCountByStatus('COMPLETED').subscribe(completedTasks => {
          team.tasksCompleted = completedTasks;
          team.progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
        });
      });
    });
  }

  getColorClass(progress: number): string {
    if (progress >= 80) {
      return 'progress-success';
    } else if (progress >= 60) {
      return 'progress-warning';
    } else {
      return 'progress-danger';
    }
  }

  viewTeamMembers(team: TeamData): void {
    this.router.navigate(['/admin/team-members'], {
      queryParams: {
        departmentId: team.departmentId,
        title: team.name
      }
    });
  }
}
