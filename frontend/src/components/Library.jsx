import { useState, useEffect } from 'react';
import Book from './Book';
import booksData from '../data/book.json';
import Header from '../partials/Header';
import Footer from '../partials/Footer';
import LeftComponent from './LeftComponent';
import RightComponent from './RightComponent';
import ReactPaginate from 'react-paginate';

const Library = () => {
  const [books, setBooks] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const booksPerPage = 10;

  useEffect(() => {
    setBooks(booksData);
  }, []);

  const pageCount = Math.ceil(books.length / booksPerPage);

  const handlePageClick = ({ selected }) => {
    setPageNumber(selected);
  };

  const displayedBooks = books.slice(pageNumber * booksPerPage, (pageNumber + 1) * booksPerPage);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <div className="flex flex-col lg:flex-row">
        <div className="w-full lg:w-1/6 mt-16 hidden md:block">
          <LeftComponent />
        </div>

        <div className="w-full lg:w-2/3 p-4">
          <h1 className="text-3xl font-bold text-center mb-8 py-10">Welcome to the E-Library</h1>
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            {displayedBooks.map((book, index) => (
              <Book
                key={index}
                imageUrl={book.imageUrl}
                bookName={book.bookName}
                authorName={book.authorName}
                url={book.url}
              />
            ))}
          </div>

          {pageCount > 1 && (
            <div className="flex justify-center mt-8">
              <ReactPaginate
                previousLabel={'Previous'}
                nextLabel={'Next'}
                breakLabel={'...'}
                pageCount={pageCount}
                onPageChange={handlePageClick}
                containerClassName={'pagination flex'}
                previousLinkClassName={'bg-gray-200 rounded-l px-3 py-1 hover:bg-gray-300 mr-1'}
                nextLinkClassName={'bg-gray-200 rounded-r px-3 py-1 hover:bg-gray-300 ml-1'}
                disabledClassName={'text-gray-400 pointer-events-none'}
                activeClassName={'bg-blue-500 text-black px-3 py-1 rounded'}
                pageClassName={'inline-block'}
                pageLinkClassName={'bg-gray-200 px-3 py-1 hover:bg-gray-300 mx-1'}
              />
            </div>
          )}
        </div>

        <div className="w-full lg:w-1/6 mt-16 hidden md:block">
          <RightComponent />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Library;