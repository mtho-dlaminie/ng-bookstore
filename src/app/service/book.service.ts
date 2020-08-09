import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap, map, shareReplay } from 'rxjs/operators';
import { Book } from '../model/book';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  private mockUrl = 'api/books';
  private devUrl = 'http://localhost:8080/book-service-api/v1/books/';

  constructor(private http: HttpClient) { }

  getBooks(): Observable<Book[]> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get<Book[]>(this.mockUrl, {headers})
      .pipe(
        shareReplay(),
        tap(data => console.log(JSON.stringify(data))),
        catchError(this.handleError)
      );
  }
 
  getBook(id: number): Observable<Book> {
    if (id === 0) {
      return of(this.initializeBook());
    }
    const url = `${this.mockUrl}/${id}`;
    return this.http.get<Book>(url)
      .pipe(
        tap(data => console.log('getBook: ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  createBook(book: Book): Observable<Book> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    book.id = null;
    return this.http.post<Book>(this.mockUrl, book, { headers })
      .pipe(
        tap(data => console.log('createBook: ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  deleteBook(id: number): Observable<{}> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.mockUrl}/${id}`;
    return this.http.delete<Book>(url, { headers })
      .pipe(
        tap(data => console.log('deleteBook: ' + id)),
        catchError(this.handleError)
      );
  }

  updateBook(book: Book): Observable<Book> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.mockUrl}/${book.id}`;
    return this.http.put<Book>(url, book, { headers })
      .pipe(
        tap(() => console.log('updatebook: ' + book.id)),
        // Return the book on an update
        map(() => book),
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

  private initializeBook(): Book {
    // Return an initialized object
    return {
      id: 0,
      title: null,
      authors: [],
      price: null,
      year: null
    };
  }
}
