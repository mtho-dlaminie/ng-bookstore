import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Author } from 'src/app/model/author';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import { AuthorService } from 'src/app/service/author.service';

@Component({
  selector: 'app-edit-author',
  templateUrl: './edit-author.component.html',
  styleUrls: ['./edit-author.component.css']
})
export class EditAuthorComponent implements OnInit {

  authorForm: FormGroup;
  author: Author;
  pageTitle: string;
  private sub: Subscription;

  constructor(private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authorService: AuthorService) {

  }
  ngOnInit(): void {
    this.authorForm = this.fb.group({
      name: ['', Validators.required]
    });

    // Read the product Id from the route parameter
    this.sub = this.route.paramMap.subscribe(
      params => {
        const id = +params.get('id');
        this.getAuthor(id);
      }
    );
  }

  getAuthor(id: number): void {
    this.authorService.getAuthor(id)
      .subscribe({
        next: (author: Author) => this.displayBook(author),
        error: err => console.log(err)
      })
  }

  displayBook(author: Author): void {
    if (this.authorForm) {
      this.authorForm.reset();
    }
    this.author = author;

    if (this.author.id === 0) {
      this.pageTitle = `Add Author`;
    }
    else {
      this.pageTitle = `Edit Author: ${this.author.name}`;
    }

    // Update the data on the form
    this.authorForm.patchValue({
      name: this.author.name,
    });
  }

  saveAuthor(): void {
    if (this.authorForm.valid) {
      if (this.authorForm.dirty) {
        const b = { ...this.author, ...this.authorForm.value };

        if (b.id === 0) {
          this.authorService.createAuthor(b)
            .subscribe({
              next: () => this.onSaveComplete(),
              error: err => console.log(err)
            });
        } else {
          this.authorService.updateAuthor(b)
            .subscribe({
              next: () => this.onSaveComplete(),
              error: err => console.log(err)
            });
        }
      } else {
        this.onSaveComplete();
      }
    } else {
      //TODO:Display validators
      //message:'Please correct the validation errors.';
    }
  }

  deleteAuthor() {
    if (this.author.id === 0) {
      // Don't delete, it was never saved.
      this.onSaveComplete();
    } else {
      if (confirm(`Really delete the author: ${this.author.name}?`)) {
        this.authorService.deleteAuthor(this.author.id)
          .subscribe({
            next: () => this.onSaveComplete(),
            error: err => console.log(err)
          });
      }
    }
  }

  onSaveComplete(): void {
    // Reset the form to clear the flags
    this.authorForm.reset();
    this.router.navigate(['/authors']);
  }
}
