import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Author } from 'src/app/model/author';
import { AuthorStoreService } from 'src/app/service/author-store.service';

@Component({
  selector: 'app-list-author',
  templateUrl: './list-author.component.html',
  styleUrls: ['./list-author.component.css'],
})
export class ListAuthorComponent implements OnInit {
  pageTitle = 'List Authors';
  authors$: Observable<Author[]>;
  errorMessage = '';

  constructor(private authorStorService: AuthorStoreService) {}

  ngOnInit(): void {
    this.authors$ = this.authorStorService.authors$;
  }
}
