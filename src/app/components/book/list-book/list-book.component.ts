import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Book } from 'src/app/model/book';
import { Author } from 'src/app/model/author';
import { BookStoreService } from 'src/app/service/book-store.service';
import { MessagesService } from '../../messages/messages.service';

@Component({
  selector: 'app-list-book',
  templateUrl: './list-book.component.html',
  styleUrls: ['./list-book.component.css'],
})
export class ListBookComponent implements OnInit {
  pageTitle = 'Book List';
  books$: Observable<Book[]>;
  errorMessage = '';

  constructor(public bookStoreService: BookStoreService, private messages: MessagesService) {}

  ngOnInit(): void {
   this.books$ = this.bookStoreService.books$;
  }

  transformAuthor(authors: Author[]): string[] {
    if (authors === undefined || authors.length == 0) {
      return [];
    }

    const _authors = authors.map((val: Author) => {
      return val.name;
    });

    return _authors;
  }
}
