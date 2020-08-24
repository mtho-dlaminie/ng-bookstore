import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { filter } from 'rxjs/internal/operators/filter';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  private subject = new BehaviorSubject<string[]>([]);

  errors$: Observable<string[]> = this.subject.asObservable()
      .pipe(
          filter(messages => messages && messages.length > 0)
      );

  showErrors(...errors: string[]) {
      this.subject.next(errors);
  }

}
