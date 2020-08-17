import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient } from '@angular/common/http';
import { LoadingService } from '../components/loading/loading.service';
import { tap } from 'rxjs/operators';
import { Author } from '../model/author';

@Injectable({
  providedIn: 'root'
})
export class AuthorStoreService {
  private subject$ = new BehaviorSubject<Author[]>([]);
  public authors$: Observable<Author[]> = this.subject$.asObservable();

  constructor(private http: HttpClient, private loading: LoadingService) {
    this.loadAllAuthors();
  }

  public loadAllAuthors() {
    const loadAuthors$ = this.http
      .get<Author[]>('/api/authors')
      .pipe(tap((authors: Author[]) => this.subject$.next(authors)));

    this.loading.showLoaderUntilCompleted(loadAuthors$).subscribe();
  }
}
