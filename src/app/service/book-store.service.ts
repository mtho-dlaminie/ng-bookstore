import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { Book } from '../model/book';
import { HttpClient } from '@angular/common/http';
import { tap, shareReplay, catchError } from 'rxjs/operators';
import { LoadingService } from '../components/loading/loading.service';
import { MessagesService } from '../components/messages/messages.service';

@Injectable({
  providedIn: 'root',
})
export class BookStoreService {
  private subject$ = new BehaviorSubject<Book[]>([]);
  public books$: Observable<Book[]> = this.subject$.asObservable();

  constructor(private http: HttpClient, private loading: LoadingService,
    private messages: MessagesService) {
   this.loadAllBooks();
  }

  public loadAllBooks() {
    const loadBooks$ = this.http.get<Book[]>('/api/books').pipe(
      tap((books: Book[]) => {
        this.subject$.next(books);
        console.log('books ', books)
      }),
      shareReplay(1),
      catchError( (err) =>{
        const message = "Could not load books";
        this.messages.showErrors(message);
        return throwError(err);
      })
    );

    this.loading.showLoaderUntilCompleted(loadBooks$).subscribe();
  }
}
