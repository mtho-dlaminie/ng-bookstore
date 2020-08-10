import { Component, OnInit } from '@angular/core';
import { AuthorService } from 'src/app/service/author.service';
import { Observable } from 'rxjs';
import { Author } from 'src/app/model/author';

@Component({
  selector: 'app-list-author',
  templateUrl: './list-author.component.html',
  styleUrls: ['./list-author.component.css']
})
export class ListAuthorComponent implements OnInit {

  pageTitle = 'List Authors';
  authors: Author[];
  errorMessage = '';

  constructor(private authorService: AuthorService) { }

  ngOnInit(): void {
    this.authorService.getAuthors().subscribe( {
      next: authors => {
        this.authors = authors;
      },
      error: err => this.errorMessage = err
    })
  }
}
