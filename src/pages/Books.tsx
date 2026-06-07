import React, { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Search, Edit2, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

export default function Books() {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  // Form state
  const [formData, setFormData] = useState({ title: '', author: '', isbn: '', category: '', quantity: 1, availableQuantity: 1 });
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/books");
      setBooks(data);
    } catch (err) {
      toast.error("Failed to fetch books");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`/api/books/${editId}`, formData);
        toast.success("Book updated!");
      } else {
        await axios.post("/api/books", formData);
        toast.success("Book added!");
      }
      setIsModalOpen(false);
      fetchBooks();
      setFormData({ title: '', author: '', isbn: '', category: '', quantity: 1, availableQuantity: 1 });
      setEditId(null);
    } catch (err: any) {
      toast.error(err.response?.data?.error || "An error occurred");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this book?")) {
      try {
        await axios.delete(`/api/books/${id}`);
        toast.success("Book deleted!");
        fetchBooks();
      } catch (err) {
        toast.error("Failed to delete");
      }
    }
  };

  const openEditDialog = (book: any) => {
    setEditId(book._id);
    setFormData({ title: book.title, author: book.author, isbn: book.isbn, category: book.category, quantity: book.quantity, availableQuantity: book.availableQuantity });
    setIsModalOpen(true);
  };

  const filteredBooks = books.filter(b => 
    b.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.isbn.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search books..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full bg-white border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white transition-all outline-none"
          />
        </div>
        <button 
          onClick={() => {
            setEditId(null);
            setFormData({ title: '', author: '', isbn: '', category: '', quantity: 1, availableQuantity: 1 });
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add Book
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col dark:bg-slate-800 dark:border-slate-700">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-300">
              <tr>
                <th className="px-6 py-3">Title</th>
                <th className="px-6 py-3">Author</th>
                <th className="px-6 py-3">ISBN</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Stock (Avail/Total)</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">Loading...</td></tr>
              ) : filteredBooks.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">No books found.</td></tr>
              ) : (
                filteredBooks.map((book) => (
                  <tr key={book._id} className="hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors">
                    <td className="px-6 py-3 font-medium text-slate-900 dark:text-white">{book.title}</td>
                    <td className="px-6 py-3 text-slate-600 dark:text-slate-400">{book.author}</td>
                    <td className="px-6 py-3 text-slate-600 dark:text-slate-400">{book.isbn}</td>
                    <td className="px-6 py-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                            {book.category}
                        </span>
                    </td>
                    <td className="px-6 py-3">
                      <span className={`font-medium ${book.availableQuantity === 0 ? 'text-red-500' : 'text-green-600 dark:text-green-400'}`}>
                        {book.availableQuantity}
                      </span>
                      <span className="text-slate-400 mx-1">/</span>
                      <span className="text-slate-600 dark:text-slate-400">{book.quantity}</span>
                    </td>
                    <td className="px-6 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEditDialog(book)} className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-md transition-colors">
                            <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(book._id)} className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-md transition-colors">
                            <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {editId ? "Edit Book" : "Add New Book"}
              </h3>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                  <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Author</label>
                  <input type="text" required value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ISBN</label>
                    <input type="text" required value={formData.isbn} onChange={e => setFormData({...formData, isbn: e.target.value})} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                    <input type="text" required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Total Quantity</label>
                  <input type="number" min="0" required value={formData.quantity} onChange={e => setFormData({...formData, quantity: parseInt(e.target.value)})} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100 dark:border-gray-700 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">{editId ? "Update" : "Save"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
