import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export interface Employee {
  id?: number;
  firstname: string;
  lastname: string;
  email: string;
  department_Id: string;
  role_Id: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  status: string; // 'TODO', 'IN_PROGRESS', 'COMPLETED'
  priority: string; // 'LOW', 'MEDIUM', 'HIGH'
  assignedTo: number;
  assigneeEmail?: string;
  assigneeName?: string;
  dueDate: string;
  createdDate: string;
  updatedDate: string;
  progress?: number;
}

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = 'http://localhost:8082/emp-controller';
  private taskApiUrl = 'http://localhost:8084/api/tasks';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  private getUserIdFromToken(): string | null {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found in localStorage');
      return null;
    }

    try {
      // Split the JWT token
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) {
        console.error('Invalid token format');
        return null;
      }

      // Decode the payload (second part)
      const payload = JSON.parse(atob(tokenParts[1]));
      console.log('Token payload:', payload);

      // Try different possible user ID fields
      const userId = payload.userId || payload.id || payload.sub || payload.user_id || payload.employeeId;
      
      if (!userId) {
        console.error('User ID not found in token payload. Available fields:', Object.keys(payload));
        return null;
      }

      console.log('Extracted user ID:', userId);
      return userId.toString();
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  // Get all tasks for the logged-in user
  getTasksByUser(): Observable<Task[]> {
    const userId = this.getUserIdFromToken();
    if (!userId) {
      const errorMsg = 'User ID not found in token. Please login again.';
      console.error(errorMsg);
      return throwError(() => new Error(errorMsg));
    }

    const url = `${this.taskApiUrl}/user/${userId}`;
    console.log('Fetching tasks from URL:', url);
    console.log(`User ID from token: ${userId}`);

    return this.http.get<Task[]>(url, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(tasks => {
        console.log(`Successfully fetched ${tasks.length} tasks for user ${userId}:`, tasks);
        
        // Log task distribution for debugging
        const tasksByStatus = {
          TODO: tasks.filter(t => t.status === 'TODO').length,
          IN_PROGRESS: tasks.filter(t => t.status === 'IN_PROGRESS').length,
          COMPLETED: tasks.filter(t => t.status === 'COMPLETED').length
        };
        console.log('Task distribution:', tasksByStatus);
      }),
      catchError(error => {
        console.error('Error fetching user tasks:', error);
        if (error.status === 401) {
          console.error('Unauthorized access. Token may be expired or invalid.');
        } else if (error.status === 404) {
          console.error('Tasks endpoint not found or user has no tasks.');
        }
        return this.handleError(error);
      })
    );
  }

  // Get tasks by user and status
  getTasksByUserAndStatus(status: string): Observable<Task[]> {
    const userId = this.getUserIdFromToken();
    if (!userId) {
      return throwError(() => new Error('User ID not found in token'));
    }

    const url = `${this.taskApiUrl}/user/${userId}/status/${status}`;
    console.log(`Fetching ${status} tasks from URL:`, url);

    return this.http.get<Task[]>(url, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(tasks => console.log(`Fetched ${tasks.length} ${status} tasks for user ${userId}`)),
      catchError(this.handleError)
    );
  }

  // Get task count by status
  getTaskCountByStatus(status: string): Observable<number> {
    const userId = this.getUserIdFromToken();
    if (!userId) {
      return throwError(() => new Error('User ID not found in token'));
    }

    return this.http.get<number>(`${this.taskApiUrl}/User/${userId}/status/${status}/count`, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(count => console.log(`User ${userId} has ${count} ${status} tasks`)),
      catchError(this.handleError)
    );
  }

  // Get all task counts
  getAllTaskCounts(): Observable<{ completed: number; inProgress: number; pending: number }> {
    const completed$ = this.getTaskCountByStatus('COMPLETED');
    const inProgress$ = this.getTaskCountByStatus('IN_PROGRESS');
    const pending$ = this.getTaskCountByStatus('TODO');

    return new Observable(observer => {
      let completed = 0, inProgress = 0, pending = 0;
      let done = 0;

      const check = () => {
        if (++done === 3) {
          observer.next({ completed, inProgress, pending });
          observer.complete();
        }
      };

      completed$.subscribe({ 
        next: c => { completed = c; check(); }, 
        error: e => {
          console.error('Error getting completed count:', e);
          completed = 0;
          check();
        }
      });
      
      inProgress$.subscribe({ 
        next: p => { inProgress = p; check(); }, 
        error: e => {
          console.error('Error getting in progress count:', e);
          inProgress = 0;
          check();
        }
      });
      
      pending$.subscribe({ 
        next: t => { pending = t; check(); }, 
        error: e => {
          console.error('Error getting pending count:', e);
          pending = 0;
          check();
        }
      });
    });
  }

  // Update task status
  updateTaskStatus(taskId: number, status: string): Observable<any> {
    const url = `${this.taskApiUrl}/${taskId}`;
    console.log(`Updating task ${taskId} status to ${status} at URL: ${url}`);
    
    const updateData = {
      status: status
    };

    return this.http.put<any>(url, updateData, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(res => {
        console.log(`Task ${taskId} status successfully updated to ${status}:`, res);
      }),
      catchError(error => {
        console.error(`Error updating task ${taskId} status:`, error);
        if (error.status === 404) {
          console.error(`Task with ID ${taskId} not found`);
        } else if (error.status === 400) {
          console.error(`Invalid status value: ${status}`);
        }
        return this.handleError(error);
      })
    );
  }

  // Employee CRUD operations
  addEmployee(employee: Employee): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/add-employee`, employee, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(res => console.log('Employee added:', res)),
      catchError(this.handleError)
    );
  }

  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.apiUrl}/get-all`, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(employees => console.log(`Fetched ${employees.length} employees`)),
      catchError(this.handleError)
    );
  }

  getEmployeesByDepartment(departmentId: string): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.apiUrl}/getAllByDepartment/${departmentId}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(emp => console.log(`Fetched ${emp.length} employees in department ${departmentId}`)),
      catchError(this.handleError)
    );
  }

  getMemberCountByDepartment(departmentId: string): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count-by-department/${departmentId}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(count => console.log(`Department ${departmentId} has ${count} members`)),
      catchError(this.handleError)
    );
  }

  deleteEmployee(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete-emp/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(res => console.log(`Deleted employee ${id}`)),
      catchError(this.handleError)
    );
  }

  updateEmployee(employee: Employee): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update-emp`, employee, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(res => console.log('Employee updated:', res)),
      catchError(this.handleError)
    );
  }

  findEmployeeById(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/find-by-id/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(emp => console.log('Found employee:', emp)),
      catchError(this.handleError)
    );
  }

  findEmployeeByFirstname(firstname: string): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/find-by-name/${firstname}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(emp => console.log('Found employee by firstname:', emp)),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let message = 'An error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      message = `Client error: ${error.error.message}`;
    } else {
      // Server-side error
      message = `Server error: ${error.status} - ${error.message}`;
      
      if (error.status === 401) {
        message += '\nUnauthorized access. Please check your authentication token.';
      } else if (error.status === 404) {
        message += '\nResource not found. Please check the API endpoint.';
      } else if (error.status === 403) {
        message += '\nForbidden access. You may not have permission to access this resource.';
      }
      
      if (error.error && typeof error.error === 'string') {
        message += `\nDetails: ${error.error}`;
      } else if (error.error && typeof error.error === 'object') {
        message += `\nDetails: ${JSON.stringify(error.error)}`;
      }
    }
    
    console.error('HTTP Error Details:', {
      status: error.status,
      statusText: error.statusText,
      url: error.url,
      error: error.error,
      message: message
    });
    
    return throwError(() => new Error(message));
  }

  updateTask(taskId: number, taskData: Partial<Task>): Observable<any> {
    return this.http.put<any>(`${this.taskApiUrl}/${taskId}`, taskData, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(res => console.log(`Task ${taskId} updated successfully:`, res)),
      catchError(this.handleError)
    );
  }
}
