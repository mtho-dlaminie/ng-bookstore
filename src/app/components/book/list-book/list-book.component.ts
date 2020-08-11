import { Component, OnInit } from '@angular/core';
import { BookService } from 'src/app/service/book.service';
import { Observable } from 'rxjs';
import { Book } from 'src/app/model/book';
import { Author } from 'src/app/model/author';

@Component({
  selector: 'app-list-book',
  templateUrl: './list-book.component.html',
  styleUrls: ['./list-book.component.css']
})
export class ListBookComponent implements OnInit {

  pageTitle = 'Book List';
  books: Book[];
  errorMessage = '';

  constructor(public bookService: BookService) { }

  ngOnInit(): void {
    this.bookService.books$.subscribe( {
      next: books => {
        this.books = books;
      },
      error: err => this.errorMessage = err
    })
  }

  transformAuthor(authors: Author[]): string[] {
    if (authors === undefined || authors.length == 0) {
      return [];
    }

    const _authors = authors.map((val: Author) => {
      return val.name
    });

    return _authors;
  }
}
