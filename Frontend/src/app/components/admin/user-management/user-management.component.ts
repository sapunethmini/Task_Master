import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface TeamData {
  id: number;
  name: string;
  memberCount: number;
  color: string;
  departmentId: string;
}

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css'],
  standalone: true,
  imports: [CommonModule, CardModule]
})
export class UserManagementComponent implements OnInit {
  teams: TeamData[] = [];

  constructor(
    private router: Router,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    // Initialize team data
    this.teams = [
      {
        id: 1,
        name: 'Development Team',
        memberCount: 8,
        color: '#4CAF50',
        departmentId: '002'
      },
      {
        id: 2,
        name: 'Marketing Team',
        memberCount: 5,
        color: '#2196F3',
        departmentId: '003'
      },
      {
        id: 3,
        name: 'Sales Team',
        memberCount: 6,
        color: '#9C27B0',
        departmentId: '004'
      },
      {
        id: 4,
        name: 'Operation Team',
        memberCount: 4,
        color: '#FF5722',
        departmentId: '005'
      },
      {
        id: 5,
        name: 'Design Team',
        memberCount: 4,
        color: '#FFC107',
        departmentId: '006'
      },
      {
        id: 6,
        name: 'HR Team',
        memberCount: 3,
        color: '#607D8B',
        departmentId: '007'
      }
    ];
  }

  viewTeamMembers(team: TeamData): void {
    // Navigate to employee list with department ID
    this.router.navigate(['/admin/emplist'], {
      queryParams: {
        departmentId: team.departmentId,
        title: team.name
      }
    });
  }
} 