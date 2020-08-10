import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  ViewChildren,
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControlName,
} from '@angular/forms';
import { Author } from 'src/app/model/author';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import { AuthorService } from 'src/app/service/author.service';
import { GenericValidator } from 'src/app/shared/generic-validator';
import { Observable, fromEvent, merge } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-edit-author',
  templateUrl: './edit-author.component.html',
  styleUrls: ['./edit-author.component.css'],
})
export class EditAuthorComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren(FormControlName, { read: ElementRef })
  formInputElements: ElementRef[];

  authorForm: FormGroup;
  author: Author;
  pageTitle: string;
  errorMessage: string;
  private sub: Subscription;

  // Use with the generic validation message class
  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [id: string]: { [id: string]: string } };
  private genericValidator: GenericValidator;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authorService: AuthorService
  ) {
    // Defines all of the validation messages for the form.
    // These could instead be retrieved from a file or database.
    this.validationMessages = {
      name: {
        required: 'Name is required.',
        minlength: 'Name must be at least three characters.',
        maxlength: 'Name cannot exceed 50 characters.',
      },
    };

    // Define an instance of the validator for use with this form,
    // passing in this form's set of validation messages.
    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  ngOnInit(): void {
    this.authorForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      ],
    });

    // Read the author Id from the route parameter
    this.sub = this.route.paramMap.subscribe((params) => {
      const id = +params.get('id');
      this.getAuthor(id);
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  ngAfterViewInit(): void {
    // Watch for the blur event from any input element on the form.
    // This is required because the valueChanges does not provide notification on blur
    const controlBlurs: Observable<
      any
    >[] = this.formInputElements.map((formControl: ElementRef) =>
      fromEvent(formControl.nativeElement, 'blur')
    );

    // Merge the blur event observable with the valueChanges observable
    // so we only need to subscribe once.
    merge(this.authorForm.valueChanges, ...controlBlurs)
      .pipe(debounceTime(800))
      .subscribe((value) => {
        this.displayMessage = this.genericValidator.processMessages(
          this.authorForm
        );
      });
  }

  getAuthor(id: number): void {
    this.authorService.getAuthor(id).subscribe({
      next: (author: Author) => this.displayBook(author),
      error: err => this.errorMessage = err
    });
  }

  displayBook(author: Author): void {
    if (this.authorForm) {
      this.authorForm.reset();
    }
    this.author = author;

    if (this.author.id === 0) {
      this.pageTitle = `Add Author`;
    } else {
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
          this.authorService.createAuthor(b).subscribe({
            next: () => this.onSaveComplete(),
            error: err => this.errorMessage = err
          });
        } else {
          this.authorService.updateAuthor(b).subscribe({
            next: () => this.onSaveComplete(),
            error: err => this.errorMessage = err
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
        this.authorService.deleteAuthor(this.author.id).subscribe({
          next: () => this.onSaveComplete(),
          error: err => this.errorMessage = err
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
