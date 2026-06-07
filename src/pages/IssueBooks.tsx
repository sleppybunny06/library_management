import React, { useState, useEffect } from "react";
import axios from "axios";
import { BookOpen } from "lucide-react";
import toast from "react-hot-toast";

export default function IssueBooks() {
  const [books, setBooks] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    studentId: '',
    bookId: '',
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 14 days from now
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [booksRes, studentsRes] = await Promise.all([
        axios.get("/api/books"),
        axios.get("/api/students")
      ]);
      setBooks(booksRes.data.filter((b: any) => b.availableQuantity > 0));
      setStudents(studentsRes.data);
    } catch (err) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("/api/issues", formData);
      toast.success("Book issued successfully!");
      setFormData({ studentId: '', bookId: '', dueDate: formData.dueDate });
      fetchData(); // Refresh available quantity
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to issue book");
    }
  };

  if (loading) return <div className="animate-pulse flex gap-4 p-4"><div className="w-1/2 h-64 bg-gray-200 dark:bg-gray-800 rounded-xl"></div></div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col dark:bg-slate-800 dark:border-slate-700">
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-700 flex items-center gap-3">
           <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-lg">
             <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
           </div>
           <h2 className="text-xl font-bold text-slate-900 dark:text-white">Issue Book</h2>
        </div>
        
        <form onSubmit={handleIssue} className="p-6 space-y-6">
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Select Student</label>
            <select 
              required
              value={formData.studentId}
              onChange={(e) => setFormData({...formData, studentId: e.target.value})}
              className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
            >
              <option value="">-- Choose a Student --</option>
              {students.map(s => (
                <option key={s._id} value={s._id}>{s.usn} - {s.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Select Book</label>
            <select 
              required
              value={formData.bookId}
              onChange={(e) => setFormData({...formData, bookId: e.target.value})}
              className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
            >
              <option value="">-- Choose a Book --</option>
              {books.map(b => (
                <option key={b._id} value={b._id}>{b.title} (Avail: {b.availableQuantity})</option>
              ))}
            </select>
            {books.length === 0 && <p className="text-sm text-red-500 mt-2">No books available for issue.</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Due Date</label>
            <input 
              type="date"
              min={new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
              required
              value={formData.dueDate}
              onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
              className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
            />
            <p className="text-xs text-slate-500 mt-2">Standard issue period is 14 days.</p>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
             <button 
                type="submit"
                disabled={!formData.bookId || !formData.studentId}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 text-sm"
             >
                Issue Book Now
             </button>
          </div>
        </form>
      </div>
    </div>
  );
}
