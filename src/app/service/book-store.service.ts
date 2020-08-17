import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Book } from '../model/book';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { LoadingService } from '../components/loading/loading.service';

@Injectable({
  providedIn: 'root',
})
export class BookStoreService {
  private subject$ = new BehaviorSubject<Book[]>([]);
  public courses$: Observable<Book[]> = this.subject$.asObservable();

  constructor(private http: HttpClient, private loading: LoadingService) {
    this.loadAllBooks();
  }

  public loadAllBooks() {
    const loadBooks$ = this.http
      .get<Book[]>('/api/books')
      .pipe(tap((books: Book[]) => this.subject$.next(books)));

    this.loading.showLoaderUntilCompleted(loadBooks$).subscribe();
  }
}
