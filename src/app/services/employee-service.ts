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

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = 'http://localhost:8082/emp-controller';

  constructor(private http: HttpClient) { }

  // Add a new employee
  addEmployee(employee: Employee): Observable<any> {
    console.log('EmployeeService: Adding new employee', employee);
    
    // Get token from local storage
    const token = localStorage.getItem('token');
    
    // Create headers with authorization
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
    
    return this.http.post<any>(`${this.apiUrl}/add-employee`, employee, { headers })
      .pipe(
        tap(response => console.log('EmployeeService: Employee added successfully', response)),
        catchError(this.handleError)
      );
  }

  // Get all employees
  getEmployees(): Observable<Employee[]> {
    console.log('EmployeeService: Fetching all employees');
    
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : ''
    });
    
    return this.http.get<Employee[]>(`${this.apiUrl}/get-all`, { headers })
      .pipe(
        tap(employees => console.log(`EmployeeService: Fetched ${employees.length} employees`)),
        catchError(this.handleError)
      );
  }

  // Delete an employee
  deleteEmployee(id: number): Observable<any> {
    console.log(`EmployeeService: Deleting employee with ID ${id}`);
    
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : ''
    });
    
    return this.http.delete<any>(`${this.apiUrl}/delete-emp/${id}`, { headers })
      .pipe(
        tap(response => console.log('EmployeeService: Employee deleted successfully', response)),
        catchError(this.handleError)
      );
  }

  // Update an employee
  updateEmployee(employee: Employee): Observable<any> {
    console.log('EmployeeService: Updating employee', employee);
    
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
    
    return this.http.put<any>(`${this.apiUrl}/update-emp`, employee, { headers })
      .pipe(
        tap(response => console.log('EmployeeService: Employee updated successfully', response)),
        catchError(this.handleError)
      );
  }

  // Find employee by ID
  findEmployeeById(id: number): Observable<Employee> {
    console.log(`EmployeeService: Finding employee with ID ${id}`);
    
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : ''
    });
    
    return this.http.get<Employee>(`${this.apiUrl}/find-by-id/${id}`, { headers })
      .pipe(
        tap(employee => console.log('EmployeeService: Found employee', employee)),
        catchError(this.handleError)
      );
  }

  // Find employee by firstname
  findEmployeeByFirstname(firstname: string): Observable<Employee> {
    console.log(`EmployeeService: Finding employee with firstname ${firstname}`);
    
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : ''
    });
    
    return this.http.get<Employee>(`${this.apiUrl}/find-by-name/${firstname}`, { headers })
      .pipe(
        tap(employee => console.log('EmployeeService: Found employee', employee)),
        catchError(this.handleError)
      );
  }

  // Handle API errors
  private handleError(error: HttpErrorResponse) {
    console.error('API Error:', error);
    let errorMessage = 'An error occurred while processing your request';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      
      // Add more context for debugging
      if (error.error && typeof error.error === 'string') {
        errorMessage += `\nDetails: ${error.error}`;
      }
    }
    
    return throwError(() => new Error(errorMessage));
  }



  getMemberCountByDepartment(departmentId: string): Observable<number> {
    // Replace the URL with your actual API endpoint
    return this.http.get<number>(`/api/departments/${departmentId}/memberCount`);
  }
}