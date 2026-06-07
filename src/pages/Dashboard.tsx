import { useState, useEffect } from "react";
import { Book, CheckCircle, Users, AlertTriangle, ArrowRightLeft } from "lucide-react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("authRole");
    if (role === "student") {
      navigate("/student-dashboard");
      return;
    }
    fetchDashboardData();
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/reports/dashboard");
      setStats(data);
      setError("");
    } catch (err: any) {
      console.error(err);
      setError("Unable to load dashboard data. Assuming disconnected DB for demo.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
         {[...Array(5)].map((_, i) => (
           <div key={i} className="bg-white dark:bg-gray-800 h-32 rounded-xl animate-pulse"></div>
         ))}
      </div>
    );
  }

  const summary = stats?.summary || { totalBooks: 0, availableBooks: 0, issuedBooksCount: 0, overdueBooksCount: 0, registeredStudents: 0 };
  const charts = stats?.charts || { 
      monthlyIssueTrend: [{ name: 'A', issues: 0 }, { name: 'B', issues: 0 }], 
      bookCategoryDistribution: [] 
  };
  const recentIssues = stats?.recentIssues || [];

  const statCards = [
    { label: "Total Books", value: summary.totalBooks, icon: Book, color: "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400" },
    { label: "Available Books", value: summary.availableBooks, icon: CheckCircle, color: "bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400" },
    { label: "Issued Books", value: summary.issuedBooksCount, icon: ArrowRightLeft, color: "bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-400" },
    { label: "Overdue Books", value: summary.overdueBooksCount, icon: AlertTriangle, color: "bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400" },
    { label: "Registered Students", value: summary.registeredStudents, icon: Users, color: "bg-orange-100 text-orange-600 dark:bg-orange-900/50 dark:text-orange-400" },
  ];

  return (
    <div className="flex flex-col gap-6 shrink-0">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center gap-2">
           <AlertTriangle className="w-5 h-5" />
           {error}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 shrink-0">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm dark:bg-slate-800 dark:border-slate-700">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider dark:text-slate-400">Total Books</p>
          <div className="flex items-end justify-between mt-2">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{summary.totalBooks}</h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm dark:bg-slate-800 dark:border-slate-700">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider dark:text-slate-400">Available</p>
          <div className="mt-2">
            <h3 className="text-2xl font-bold text-blue-600">{summary.availableBooks}</h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm dark:bg-slate-800 dark:border-slate-700">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider dark:text-slate-400">Issued</p>
          <div className="mt-2">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{summary.issuedBooksCount}</h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm border-l-4 border-l-red-500 dark:bg-slate-800 dark:border-slate-700">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider dark:text-slate-400">Overdue</p>
          <div className="flex items-end justify-between mt-2">
            <h3 className="text-2xl font-bold text-red-600">{summary.overdueBooksCount}</h3>
            {summary.overdueBooksCount > 0 && (
              <span className="text-[10px] text-red-600 font-medium px-1.5 py-0.5 bg-red-50 rounded border border-red-100 dark:bg-red-900/30 dark:border-red-800/50 dark:text-red-400">Action required</span>
            )}
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm dark:bg-slate-800 dark:border-slate-700">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider dark:text-slate-400">Total Students</p>
          <div className="mt-2">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{summary.registeredStudents}</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 shrink-0">
          {/* Chart placeholder */}
          <div className="col-span-1 lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6 dark:bg-slate-800 dark:border-slate-700 flex flex-col">
             <div className="flex items-center justify-between mb-6">
                <h4 className="font-bold text-slate-800 dark:text-white">Weekly Book Issue Trends</h4>
                <select className="text-xs border border-slate-200 rounded px-2 py-1 bg-slate-50 outline-none dark:bg-slate-700 dark:border-slate-600 dark:text-slate-300">
                  <option>Last 30 Days</option>
                  <option>Last 7 Days</option>
                </select>
             </div>
             <div className="h-40 w-full flex-1">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={charts.monthlyIssueTrend}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#CBD5E1" opacity={0.5} />
                        <XAxis dataKey="name" tick={{fill: '#64748B', fontSize: 10}} tickLine={false} axisLine={false} />
                        <YAxis tick={{fill: '#64748B', fontSize: 10}} tickLine={false} axisLine={false} />
                        <Tooltip cursor={{fill: 'rgba(0,0,0,0.05)'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)'}}/>
                        <Bar dataKey="issues" fill="#2563EB" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
             </div>
          </div>

          {/* Activity Placeholder */}
          <div className="col-span-1 bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col dark:bg-slate-800 dark:border-slate-700">
             <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-2 dark:border-slate-700">
                <h4 className="font-bold text-slate-800 dark:text-white">Recent Transactions</h4>
             </div>
             <div className="flex-1 overflow-y-auto space-y-4">
                {recentIssues.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-40 text-slate-400">
                        <ArrowRightLeft className="w-8 h-8 mb-2 opacity-20" />
                        <p className="text-sm">No recent activity</p>
                    </div>
                ) : (
                    recentIssues.map((issue: any, i: number) => (
                        <div key={i} className="flex flex-col pb-3 border-b border-slate-50 last:border-0 dark:border-slate-700">
                            <div className="flex items-center justify-between mb-1">
                                <p className="font-medium text-sm text-slate-900 dark:text-white truncate pr-2">{issue.bookId?.title || "Unknown Book"}</p>
                                <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${issue.status === 'RETURNED' ? 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'}`}>
                                   {issue.status}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                                <p>To: {issue.studentId?.name || "Unknown Student"}</p>
                                <p>{new Date(issue.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                    ))
                )}
             </div>
          </div>
      </div>
    </div>
  );
}
