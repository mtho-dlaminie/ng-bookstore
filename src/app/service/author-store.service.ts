import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient } from '@angular/common/http';
import { LoadingService } from '../components/loading/loading.service';
import { tap, shareReplay, catchError } from 'rxjs/operators';
import { Author } from '../model/author';
import { throwError } from 'rxjs';
import { MessagesService } from '../components/messages/messages.service';

@Injectable({
  providedIn: 'root',
})
export class AuthorStoreService {
  private subject$ = new BehaviorSubject<Author[]>([]);
  public authors$: Observable<Author[]> = this.subject$.asObservable();

  constructor(private http: HttpClient, private loading: LoadingService,
    private message: MessagesService) {
    this.loadAllAuthors();
  }

  public loadAllAuthors() {
    const loadAuthors$ = this.http.get<Author[]>('/api/authors').pipe(
      tap((authors: Author[]) => {
        this.subject$.next(authors);
        console.log('Authors ', authors)
      }),
      shareReplay(1),
      catchError( (err: Response) =>{
        const message = 'Could not load authors'
        this.message.showErrors(message)
        return throwError(err)
      })
    );

    this.loading.showLoaderUntilCompleted(loadAuthors$).subscribe();
  }
}
