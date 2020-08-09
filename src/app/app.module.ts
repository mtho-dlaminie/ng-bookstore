import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

// Imports for loading & configuring the in-memory web api
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { AppData } from './app-data';


import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ListBookComponent } from './components/book/list-book/list-book.component';
import { EditBookComponent } from './components/book/edit-book/edit-book.component';
import { EditAuthorComponent } from './components/author/edit-author/edit-author.component';
import { ListAuthorComponent } from './components/author/list-author/list-author.component';

const routes: Routes = [
  {
    path: 'books',
    component: ListBookComponent
  },
  {
    path: 'books/:id/edit',
    component: EditBookComponent
  },
  {
    path: 'authors',
    component: ListAuthorComponent
  },
  {
    path: 'authors/:id/edit',
    component: EditAuthorComponent
  },
  {
    path: '**',
    redirectTo: 'books',
    pathMatch: 'full'
  },
  {
    path: '',
    redirectTo: 'books',
    pathMatch: 'full'
  },
];

@NgModule({
  declarations: [
    AppComponent,
    ListBookComponent,
    EditBookComponent,
    EditAuthorComponent,
    ListAuthorComponent
  ],
  imports: [
    BrowserModule,
    NgbModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    InMemoryWebApiModule.forRoot(AppData, { delay: 1000 }),
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
