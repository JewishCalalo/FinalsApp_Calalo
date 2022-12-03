import { Injectable } from '@angular/core';
//step one for syncronous operations
import {User} from './user';
import {USERS} from './mock-accounts';
import {MessageService} from './message.service';
//interface for asychronous 
import {from, Observable, of} from 'rxjs'; // simulate data fetching from  a server
//adding the Httpclinet and HttpHeaders
import { HttpClient, HttpHeaders } from '@angular/common/http';
//for error handling
import {catchError, map, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {
  
  

  private usersUrl = 'api/users'; // URL to web API
  httpOptions ={
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };


//view-list component
  getUsers(): Observable <User[]> {
    const users = of (USERS); 
    return this.http.get<User[]>(this.usersUrl)
      .pipe(
        tap(_=> this.log('fetched users')),
        catchError(this.handleError<User[]>('getUsers',[])) //for error handling
      );
  }
  
//View-details component -> return 404 if 'id' is not found
  getUser(id: number): Observable <User> {
    //  const user = USERS.find(u => u.id === id)!; -> from mock lists
    const url = `${this.usersUrl}/${id}`;
     // return of(user); -> using mock list
     return this.http.get<User>(url)
        .pipe(
          tap(_ => this.log(`fetched user id = ${id}`)),
          catchError(this.handleError<User>(`getUser id=${id}`))
        );
  }

  updateUser(user: User): Observable <any> {
    return this.http.put(this.usersUrl, user, this.httpOptions).pipe(
      tap(_ => this.log(`updated user id = ${user.id}`)),
      catchError(this.handleError<any>('updateUser'))
    )
  }

  addUser(email: User): Observable <User> {
    return this.http.post<User>(this.usersUrl, email, this.httpOptions).pipe(
      tap((newUser: User) => this.log(`added user w/ id=${newUser.id}`)),
      catchError(this.handleError<User>('addedUser'))
    );
  }

  //Destroy user from Server
  deleteUser(id: number): Observable <User> {
    const url = `${this.usersUrl}/${id}`;

    return this.http.delete<User>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted user id=${id}`)),
      catchError(this.handleError<User>('deleteHero'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T){
    return (error:any):Observable<T> => {
      console.error(error); // error shown on the browser Log
      this.log(`$(operation} failed): ${error.message}`);
      

      return of(result as T);
    }
  }

  private log(message: string): void {
    this.messageService.add(`UserServic: ${message}`)
  }


  constructor(
    private http: HttpClient,
    private messageService:MessageService
  ) { }
}
