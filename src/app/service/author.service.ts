import { Injectable } from '@angular/core';
import { Author } from '../model/author';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthorService {
  private mockUrl = 'api/authors';

  constructor(private http: HttpClient) {}

  authors$ = this.http.get<Author[]>(this.mockUrl).pipe(
    tap((data) => console.log(JSON.stringify(data))),
    catchError(this.handleError)
  );

  getAuthor(id: number): Observable<Author> {
    if (id === 0) {
      return of(this.initializeAuthor());
    }
    const url = `${this.mockUrl}/${id}`;
    return this.http.get<Author>(url).pipe(
      tap((data) => console.log('getAuthor: ' + JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  createAuthor(author: Author): Observable<Author> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    author.id = null;
    return this.http
      .post<Author>(this.mockUrl, author, { headers })
      .pipe(
        tap((data) => console.log('createAuthor: ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  deleteAuthor(authorId: number): Observable<{}> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.mockUrl}/${authorId}`;
    return this.http
      .delete<Author>(url, { headers })
      .pipe(
        tap((data) => console.log('deleteAuthor: ' + authorId)),
        catchError(this.handleError)
      );
  }

  updateAuthor(author: Author): Observable<Author> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.mockUrl}/${author.id}`;
    return this.http
      .put<Author>(url, author, { headers })
      .pipe(
        tap(() => console.log('updateAuthor: ' + author.id)),
        // Return the author on an update
        map(() => author),
        catchError(this.handleError)
      );
  }

  private handleError(err): Observable<never> {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Backend returned code ${err.status}: ${err.body.error}`;
    }
    console.error(err);
    return throwError(errorMessage);
  }

  private initializeAuthor(): Author {
    // Return an initialized object
    return {
      id: 0,
      name: null,
    };
  }
}
