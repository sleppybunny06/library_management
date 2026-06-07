import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, Book as BookIcon } from "lucide-react";
import toast from "react-hot-toast";

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

export default function StudentDashboard() {
  const [books, setBooks] = useState<BookData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const { data } = await axios.get("/api/books");
      setBooks(data);
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to load catalog");
    } finally {
      setLoading(false);
    }
  };

  const filteredBooks = books.filter(b => 
    b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.category.toLowerCase().includes(searchTerm.toLowerCase())
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
