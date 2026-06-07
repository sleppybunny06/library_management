import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, Book as BookIcon, RefreshCw, TriangleAlert } from "lucide-react";
import toast from "react-hot-toast";
import { getApiErrorMessage } from "../lib/apiErrors.js";

interface BookData {
  _id?: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  quantity: number;
  availableQuantity: number;
  description?: string;
}

function isBookData(value: unknown): value is BookData {
  if (!value || typeof value !== "object") return false;

  const book = value as Record<string, unknown>;
  return typeof book.title === "string"
    && typeof book.author === "string"
    && typeof book.isbn === "string"
    && typeof book.category === "string"
    && typeof book.quantity === "number"
    && typeof book.availableQuantity === "number";
}

export default function StudentDashboard() {
  const [books, setBooks] = useState<BookData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    setLoading(true);
    setError("");

    try {
      const { data } = await axios.get<unknown>("/api/books");

      // Some static hosts serve index.html for unknown /api routes. Do not put
      // that response into state: it would make books.filter throw and blank
      // the entire application.
      if (!Array.isArray(data) || !data.every(isBookData)) {
        throw new Error("The catalog service returned an invalid response.");
      }

      setBooks(data);
    } catch (err: unknown) {
      const message = getApiErrorMessage(err, "The catalog service is currently unavailable.");

      setBooks([]);
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const normalizedSearchTerm = searchTerm.trim().toLowerCase();
  const filteredBooks = books.filter((book) =>
    [book.title, book.author, book.category].some((value) =>
      value?.toLowerCase().includes(normalizedSearchTerm)
    )
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Library Catalog</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Browse our collection of available books</p>
        </div>
        
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search catalog..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all dark:text-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-full py-12 text-center text-slate-500">Loading catalog...</div>
        ) : error ? (
          <div className="col-span-full py-12 px-6 text-center flex flex-col items-center justify-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
            <div className="w-12 h-12 rounded-full bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center mb-3">
              <TriangleAlert className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <p className="text-slate-900 dark:text-white font-semibold">Unable to load the library catalog</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md">{error}</p>
            <button
              type="button"
              onClick={fetchBooks}
              className="mt-5 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white transition-colors font-medium text-sm rounded-lg"
            >
              <RefreshCw className="w-4 h-4" />
              Try again
            </button>
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="col-span-full py-12 text-center flex flex-col items-center justify-center">
            <BookIcon className="w-12 h-12 text-slate-300 mb-3" />
            <p className="text-slate-500 font-medium">No books found in the catalog.</p>
          </div>
        ) : (
          filteredBooks.map((book) => (
            <div key={book._id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm flex flex-col hover:shadow-md transition-shadow">
              <div className="flex-1">
                <div className="flex justify-between items-start mb-3">
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-[10px] font-bold uppercase tracking-wider rounded-md">
                    {book.category}
                  </span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${book.availableQuantity > 0 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                    {book.availableQuantity > 0 ? `${book.availableQuantity} Available` : 'Out of Stock'}
                  </span>
                </div>
                
                <h3 className="font-bold text-slate-900 dark:text-white text-lg leading-tight mb-2">{book.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mb-1">by {book.author}</p>
                <div className="text-[11px] text-slate-400 mt-2 font-mono">ISBN: {book.isbn}</div>
                {book.description && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-4 line-clamp-3 leading-relaxed">
                    {book.description}
                  </p>
                )}
              </div>
              
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700">
                 <button 
                   className="w-full py-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-700/50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors font-medium text-sm rounded-lg"
                   onClick={() => toast("Visit the library counter to issue this book")}
                 >
                   Request Issue
                 </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
