import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8082';
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser = this.currentUserSubject.asObservable();
  
  constructor(private http: HttpClient) {
    // Check if user is already logged in on service initialization
    const token = localStorage.getItem('token');
    if (token) {
      this.decodeAndSetUserFromToken(token);
    }
  }
  
  signup(userData: any): Observable<any> {
    console.log('UserService: Preparing to send signup request', userData);
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    return this.http.post<any>(`${this.apiUrl}/auth/signup`, userData, { 
      headers,
      responseType: 'text' as 'json'
    })
    .pipe(
      tap(response => console.log('UserService: Signup successful', response)),
      catchError(this.handleError)
    );
  }

  login(credentials: any): Observable<any> {
    console.log('UserService: Preparing to send login request', credentials);
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    return this.http.post<any>(`${this.apiUrl}/auth/login`, credentials, { headers })
      .pipe(
        tap(response => {
          console.log('UserService: Login successful');
          // Store the JWT token in localStorage for future requests
          localStorage.setItem('token', response.token);
          this.decodeAndSetUserFromToken(response.token);
        }),
        catchError(this.handleError)
      );
  }
  
 // In user-service.ts
private decodeAndSetUserFromToken(token: string): void {
  try {
    const decodedToken: any = jwtDecode(token);
    console.log('Decoded token:', decodedToken);
    
    const user = {
      username: decodedToken.sub,
      role: decodedToken.role // Use the role directly from the token
    };
    
    this.currentUserSubject.next(user);
    console.log('User decoded from token:', user);
  } catch (error) {
    console.error('Error decoding token:', error);
    this.logout();
  }
}
  
  // Check if user is logged in
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
  
  // Check if user has admin role
  isAdmin(): boolean {
    const currentUser = this.currentUserSubject.value;
    return currentUser && currentUser.role === 'ROLE_ADMIN';
  }
  
  // Check if user has employee role
  isEmployee(): boolean {
    const currentUser = this.currentUserSubject.value;
    return currentUser && currentUser.role === 'ROLE_EMPLOYEE';
  }
  
  // Get current user info
  getCurrentUser(): any {
    return this.currentUserSubject.value;
  }
  
  // Logout user
  logout(): void {
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(() => error);
  }

 getTeamMemberCount(departmentId: string): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/emp-controller/count?departmentId=${departmentId}`)
      .pipe(catchError(this.handleError));
  }

  getAllDepartments(departmentId: string): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/emp-controller/getAllByDepartment/${departmentId}`)
    .pipe(
      map((response: any) => response.data),
      catchError(this.handleError)
    );
}

}