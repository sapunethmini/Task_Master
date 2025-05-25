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
  createdAt?: Date;
  updatedAt?: Date;
  userId?: number;
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
} 