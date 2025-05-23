import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Task {
  id?: number;
  title: string;
  description?: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  category: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  deadline?: Date;
  created_at?: Date;
  updated_at?: Date;
  user_id?: number;
  duration: string;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:8084/api/tasks';

  constructor(private http: HttpClient) {}

  createTask(task: Task): Observable<Task> {
    return this.http.post<Task>(`${this.apiUrl}/createTask`, task);
  }

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl);
  }

  getTaskById(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`);
  }

  updateTask(id: number, task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, task);
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getTaskCountByStatus(status: string): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/status/${status}/count`);
  }

  getTotalTaskCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count`);
  }

  getCountByTeam(departmentId: string): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/team/${departmentId}/count`);
  }

  // New method to get tasks by team and priority
  getTasksByTeamAndPriority(team: string, priority: 'HIGH' | 'MEDIUM' | 'LOW'): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/getAllTasks/team/${team}/priority/${priority}`);
  }

  // Method to get task count by team and priority
  getTaskCountByTeamAndPriority(team: string, priority: 'HIGH' | 'MEDIUM' | 'LOW'): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/team/${team}/priority/${priority}/count`);
  }

  // Helper method to get all priority counts for a specific team
  getAllPriorityCountsForTeam(team: string): Observable<{high: number, medium: number, low: number}> {
    return new Observable(observer => {
      const priorityCounts = { high: 0, medium: 0, low: 0 };
      let completedRequests = 0;

      // Get HIGH priority count
      this.getTaskCountByTeamAndPriority(team, 'HIGH').subscribe(count => {
        priorityCounts.high = count;
        completedRequests++;
        if (completedRequests === 3) {
          observer.next(priorityCounts);
          observer.complete();
        }
      });

      // Get MEDIUM priority count
      this.getTaskCountByTeamAndPriority(team, 'MEDIUM').subscribe(count => {
        priorityCounts.medium = count;
        completedRequests++;
        if (completedRequests === 3) {
          observer.next(priorityCounts);
          observer.complete();
        }
      });

      // Get LOW priority count
      this.getTaskCountByTeamAndPriority(team, 'LOW').subscribe(count => {
        priorityCounts.low = count;
        completedRequests++;
        if (completedRequests === 3) {
          observer.next(priorityCounts);
          observer.complete();
        }
      });
    });
  }

  // Get all tasks for a specific team/department
  getTasksByTeam(departmentId: string): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/getAllTasks/team/${departmentId}`);
  }
}