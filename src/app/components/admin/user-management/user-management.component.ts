// user-management.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { UserService } from '../../../services/user-service';

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
  isLoading = true;

  constructor(
    private router: Router,
    private http: HttpClient,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    // Initialize team data structure first
    this.teams = [
      {
        id: 1,
        name: 'Development Team',
        memberCount: 0, // Will be updated with actual count
        color: '#4CAF50',
        departmentId: '002'
      },
      {
        id: 2,
        name: 'Marketing Team',
        memberCount: 0,
        color: '#2196F3',
        departmentId: '003'
      },
      {
        id: 3,
        name: 'Sales Team',
        memberCount: 0,
        color: '#9C27B0',
        departmentId: '004'
      },
      {
        id: 4,
        name: 'Operation Team',
        memberCount: 0,
        color: '#FF5722',
        departmentId: '005'
      },
      {
        id: 5,
        name: 'Design Team',
        memberCount: 0,
        color: '#FFC107',
        departmentId: '006'
      },
      {
        id: 6,
        name: 'HR Team',
        memberCount: 0,
        color: '#607D8B',
        departmentId: '007'
      }
    ];
    
    // Fetch actual member counts for each team
    this.loadTeamMemberCounts();
  }

  loadTeamMemberCounts(): void {
    // Create an array of observables, one for each team's member count request
    const countRequests = this.teams.map(team => 
      this.userService.getAllDepartments(team.departmentId)
    );
    
    // Execute all requests in parallel
    forkJoin(countRequests).subscribe({
      next: (counts) => {
        // Update each team with its actual member count
        this.teams.forEach((team, index) => {
          team.memberCount = Array.isArray(counts[index]) ? counts[index].length : 0;
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching team member counts:', error);
        this.isLoading = false;
      }
    });
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