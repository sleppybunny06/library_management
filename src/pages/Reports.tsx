import { useState, useEffect } from "react";
import axios from "axios";
import { AlertTriangle, TrendingUp, Download } from "lucide-react";
import toast from "react-hot-toast";
import { getApiErrorMessage } from "../lib/apiErrors.js";

export default function Reports() {
  const [activeTab, setActiveTab] = useState('overdue');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReportData(activeTab);
  }, [activeTab]);

  const fetchReportData = async (tab: string) => {
    try {
      setLoading(true);
      const endpoint = tab === 'overdue' ? "/api/reports/overdue" : "/api/reports/most-borrowed";
      const res = await axios.get(endpoint);
      if (!Array.isArray(res.data)) {
        throw new Error("The report service returned an invalid response.");
      }
      setData(res.data);
    } catch (err) {
      setData([]);
      toast.error(getApiErrorMessage(err, "Failed to load report data"));
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
      // Dummy export logic to simulate feature
      toast.success(`Exporting ${activeTab} report to Excel...`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
              <button 
                onClick={() => setActiveTab('overdue')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'overdue' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'}`}
              >
                  <AlertTriangle className="w-4 h-4" />
                  Overdue Books
              </button>
              <button 
                onClick={() => setActiveTab('most-borrowed')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'most-borrowed' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'}`}
              >
                  <TrendingUp className="w-4 h-4" />
                  Most Borrowed
              </button>
          </div>

          <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 rounded-lg text-sm font-semibold hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors">
              <Download className="w-4 h-4" />
              Export Excel
          </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col dark:bg-slate-800 dark:border-slate-700">
        {loading ? (
            <div className="p-8 text-center text-slate-500">Loading report data...</div>
        ) : activeTab === 'overdue' ? (
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-red-50 dark:bg-red-900/10 text-red-700 dark:text-red-400 font-medium border-b border-red-100 dark:border-red-900/20">
                        <tr>
                            <th className="px-6 py-3">Student</th>
                            <th className="px-6 py-3">Book</th>
                            <th className="px-6 py-3">Due Date</th>
                            <th className="px-6 py-3">Days Late</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                        {data.length === 0 ? <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-500">No overdue books. Excellent!</td></tr> : 
                        data.map(issue => {
                            const lateDays = Math.floor((new Date().getTime() - new Date(issue.dueDate).getTime()) / (1000 * 3600 * 24));
                            return (
                            <tr key={issue._id} className="hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors">
                                <td className="px-6 py-3 font-medium text-slate-900 dark:text-white">{issue.studentId?.name} ({issue.studentId?.usn})</td>
                                <td className="px-6 py-3 text-slate-700 dark:text-slate-300">{issue.bookId?.title}</td>
                                <td className="px-6 py-3 text-red-500">{new Date(issue.dueDate).toLocaleDateString()}</td>
                                <td className="px-6 py-3 font-bold text-red-600">{lateDays}</td>
                            </tr>
                        )})}
                    </tbody>
                </table>
            </div>
        ) : (
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-blue-50 dark:bg-blue-900/10 text-blue-700 dark:text-blue-400 font-medium border-b border-blue-100 dark:border-blue-900/20">
                        <tr>
                            <th className="px-6 py-3">Rank</th>
                            <th className="px-6 py-3">Book Title</th>
                            <th className="px-6 py-3">Category</th>
                            <th className="px-6 py-3">Total Borrows</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                        {data.length === 0 ? <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-500">No borrowing data available.</td></tr> : 
                        data.map((item, index) => (
                            <tr key={item.book?._id || index} className="hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors">
                                <td className="px-6 py-3 font-bold text-slate-400 dark:text-slate-500" width="80">#{index + 1}</td>
                                <td className="px-6 py-3 font-medium text-slate-900 dark:text-white">{item.book?.title || "Deleted Book"}</td>
                                <td className="px-6 py-3 text-slate-500 dark:text-slate-400">{item.book?.category || "-"}</td>
                                <td className="px-6 py-3 font-bold text-blue-600 dark:text-blue-400">{item.count}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
      </div>
    </div>
  );
}
