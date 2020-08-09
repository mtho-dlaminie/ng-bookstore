import { InMemoryDbService } from 'angular-in-memory-web-api';

import { AuthorData } from './service/mock/authors-data';
import { BooksData } from './service/mock/books-data';

export class AppData implements InMemoryDbService {

    createDb() {
        const authors = AuthorData.authors;
        const books = BooksData.books;

        return { authors, books}
    }
}