import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, FormControl, Validators, FormControlName } from '@angular/forms';
import { Book } from 'src/app/model/book';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import { BookService } from 'src/app/service/book.service';
import { Author } from 'src/app/model/author';
import { error } from 'protractor';

@Component({
  selector: 'app-edit-book',
  templateUrl: './edit-book.component.html',
  styleUrls: ['./edit-book.component.css']
})
export class EditBookComponent implements OnInit {

  bookForm: FormGroup;
  book: Book;
  pageTitle: string;

  private sub: Subscription;

  get authors(): FormArray {
    return this.bookForm.get('authors') as FormArray;
  }

  constructor(private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private bookService: BookService) {

  }

  ngOnInit(): void {
    this.bookForm = this.fb.group({
      id: [''],
      title: ['', Validators.required],
      price: ['', Validators.required],
      year: ['', Validators.required],
      authors: this.fb.array([]),
    });

    // Read the product Id from the route parameter
    this.sub = this.route.paramMap.subscribe(
      params => {
        const id = +params.get('id');
        this.getBook(id);
      }
    );

    // this.addAuthor();
  }

  addAuthor(): void {
    this.authors.push(this.newAuthor());
  }

  newAuthor(): FormGroup {
    return this.fb.group({
      id: [''],
      name: ['']
    });
  }

  deleteAuthor(index: number): void {
    this.authors.removeAt(index);
    this.authors.markAsDirty();
  }

  getBook(id: number): void {
    this.bookService.getBook(id)
      .subscribe({
        next: (book: Book) => this.displayBook(book),
        error: err => console.log(err)
      })
  }

  displayBook(book: Book): void {
    if (this.bookForm) {
      this.bookForm.reset();
    }
    this.book = book;

    if (this.book.id === 0) {
      this.pageTitle = `Add Book`;
    }
    else {
      this.pageTitle = `Edit Book: ${this.book.title}`;
    }

    // Update the data on the form
    this.bookForm.patchValue({
      id: this.book.id,
      title: this.book.title,
      price: this.book.price,
      year: this.book.year
    });

    this.bookForm.setControl('authors', this.setAuthors(book.authors));
  }

  setAuthors(authors: Author[]): FormArray {

    const formArray = new FormArray([]);

    if (authors.length > 0) {

      authors.forEach(a => {
        formArray.push(
          this.fb.group({
            id: a.id,
            name: a.name
          }))
      })
    }
    else {
      formArray.push(
        this.fb.group({
          id: [''],
          name: ['']
        }));
    }

    return formArray;
  }

  saveBook(): void {
    if (this.bookForm.valid) {
      if (this.bookForm.dirty) {
        const b = { ...this.book, ...this.bookForm.value };

        if (b.id === 0) {
          this.bookService.createBook(b)
            .subscribe({
              next: () => this.onSaveComplete(),
              error: err => console.log(err)
            });
        } else {
          console.log('Updated Book Sent ', b)
          this.bookService.updateBook(b)
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

  deleteBook() {
    if (this.book.id === 0) {
      // Don't delete, it was never saved.
      this.onSaveComplete();
    } else {
      if (confirm(`Really delete the book: ${this.book.title}?`)) {
        this.bookService.deleteBook(this.book.id)
          .subscribe(
            (res) => this.onSaveComplete()),
            (error) => (console.log(error))
      }
    }
  }

  onSaveComplete(): void {
    // Reset the form to clear the flags
    this.bookForm.reset();
    this.router.navigate(['/books']);
  }
}
