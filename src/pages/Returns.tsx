import { useState, useEffect } from "react";
import axios from "axios";
import { Undo2, Search, IndianRupee } from "lucide-react";
import toast from "react-hot-toast";

export default function Returns() {
  const [issues, setIssues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/issues");
      setIssues(data.filter((i: any) => i.status === "ISSUED")); // Only show active issues
    } catch (err) {
      toast.error("Failed to load active issues");
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (id: string) => {
    if (confirm("Process return for this book?")) {
      try {
        const res = await axios.put(`/api/issues/${id}/return`);
        const { fine } = res.data;
        if (fine > 0) {
            toast.error(`Book returned late! Fine collected: ₹${fine}`, { duration: 5000, icon: '⚠️' });
        } else {
            toast.success("Book returned successfully with no fine!");
        }
        fetchIssues();
      } catch (err: any) {
        toast.error(err.response?.data?.error || "Failed to process return");
      }
    }
  };

  // Safe search logic handling potentially null relationships
  const filteredIssues = issues.filter(i => {
    const term = searchTerm.toLowerCase();
    const studentMatch = i.studentId?.usn?.toLowerCase().includes(term) || i.studentId?.name?.toLowerCase().includes(term);
    const bookMatch = i.bookId?.title?.toLowerCase().includes(term);
    return studentMatch || bookMatch;
  });

  const getLateDays = (dueDate: string) => {
      const today = new Date();
      const due = new Date(dueDate);
      if (today <= due) return 0;
      return Math.floor((today.getTime() - due.getTime()) / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by student name, USN, or book..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full bg-white border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white transition-all outline-none"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col dark:bg-slate-800 dark:border-slate-700">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-300">
              <tr>
                <th className="px-6 py-3">Student</th>
                <th className="px-6 py-3">Book</th>
                <th className="px-6 py-3">Issue Date</th>
                <th className="px-6 py-3">Due Date</th>
                <th className="px-6 py-3">Late Days / Fine</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">Loading...</td></tr>
              ) : filteredIssues.length === 0 ? (
                <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center">
                            <Undo2 className="w-12 h-12 text-slate-300 mb-3" />
                            <p className="text-slate-500">No active book issues found.</p>
                        </div>
                    </td>
                </tr>
              ) : (
                filteredIssues.map((issue) => {
                  const lateDays = getLateDays(issue.dueDate);
                  const estimatedFine = lateDays * 5;

                  return (
                  <tr key={issue._id} className="hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors">
                    <td className="px-6 py-3">
                        <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-[10px] uppercase dark:bg-indigo-900/50 dark:text-indigo-300">
                                {issue.studentId?.name ? issue.studentId.name.substring(0, 2) : '?'}
                            </div>
                            <div>
                              <p className="font-medium text-slate-900 dark:text-white">{issue.studentId?.name || "Unknown"}</p>
                              <p className="text-[10px] text-slate-500 uppercase">{issue.studentId?.usn}</p>
                            </div>
                        </div>
                    </td>
                    <td className="px-6 py-3 font-medium text-slate-700 dark:text-white">{issue.bookId?.title || "Unknown Book"}</td>
                    <td className="px-6 py-3 text-slate-500 dark:text-slate-400">{new Date(issue.issueDate).toLocaleDateString()}</td>
                    <td className="px-6 py-3">
                        <span className={`${lateDays > 0 ? "text-red-500 font-medium" : "text-slate-600 dark:text-slate-400"}`}>
                            {new Date(issue.dueDate).toLocaleDateString()}
                        </span>
                    </td>
                    <td className="px-6 py-3">
                        {lateDays > 0 ? (
                            <span className="inline-flex items-center gap-1 text-red-600 bg-red-50 dark:bg-red-900/30 px-2.5 py-1 rounded-md text-xs font-semibold">
                                {lateDays} Days (₹{estimatedFine})
                            </span>
                        ) : (
                            <span className="text-green-600 text-xs font-medium dark:text-green-400">On Track</span>
                        )}
                    </td>
                    <td className="px-6 py-3 text-right">
                        <button 
                            onClick={() => handleReturn(issue._id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50 rounded-lg text-sm font-semibold transition-colors"
                        >
                            <Undo2 className="w-4 h-4" />
                            Return
                        </button>
                    </td>
                  </tr>
                )})
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
