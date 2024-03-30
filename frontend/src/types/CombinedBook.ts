import {Book} from "./Book.ts";
import {GoogleBook} from "./GoogleBook.ts";

export type CombinedBook = Book & GoogleBook;
