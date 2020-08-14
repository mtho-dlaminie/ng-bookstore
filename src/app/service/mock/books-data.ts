import { Book } from '../../model/book';

export class BooksData {
    static books: Book[] = [
        {
            id: 1,
            title: "Everyday Italian",
            year: 2005,
            price: 50,
            authors: [
              {
                id: 1,
                name: "Giada De Laurentiis"
              },
              {
                id: 2,
                name: "Sam T. Bruce"
              }
            ]
          },
          {
            id: 2,
            title: "Harry Potter",
            year: 2005,
            price: 29.99,
            authors: [
              {
                id: 3,
                name: "J K. Rowling"
              },
              {
                id: 4,
                name: "Erik T. Ray"
              }
            ]
          },
          {
            id: 3,
            title: "Learning XML",
            year: 2003,
            price: 39.95,
            authors: [
              {
                id: 4,
                name: "Erik T. Ray"
              }
            ]           
        }
    ]
}