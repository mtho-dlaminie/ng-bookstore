import { Book } from '../../model/book';

export class BooksData {
    static books: Book[] = [
        {
            id: 1,
            title: "Learning Java",
            year: 2018,
            price: 500,
            authors: [
                {
                    id: 3,
                    name: "Jack Y. Johnson"
                },
                {
                    id: 1,
                    name: "James K. Jackson"
                }
            ]
        },
        {
            id: 2,
            title: "Fundamentals of Programming",
            year: 2017,
            price: 450,
            authors: []
        },
        {
            id: 3,
            title: "Learning English",
            year: 2015,
            price: 250,
            authors: [
                {
                    id: 3,
                    name: "Jack Y. Johnson"
                }
            ]
        }
    ]
}