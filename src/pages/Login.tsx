import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Library, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    if (username === "admin" && password === "admin123") {
      localStorage.setItem("authRole", "admin");
      toast.success("Welcome back, Admin!");
      navigate("/");
    } else if (username === "librarian" && password === "lib123") {
      localStorage.setItem("authRole", "librarian");
      toast.success("Welcome back, Librarian!");
      navigate("/");
    } else if (username === "student" && password === "student123") {
      localStorage.setItem("authRole", "student");
      toast.success("Welcome, Student!");
      navigate("/student-dashboard");
    } else {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-slate-800 p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="text-center flex flex-col items-center">
          <div className="bg-blue-600 p-3 rounded-xl shadow-sm mb-4 inline-flex items-center justify-center">
             <Library className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">SmartLib VTU</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Library Management System</p>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 dark:bg-red-900/30 dark:text-red-400 p-3 rounded-lg">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Username
              </label>
              <input
                type="text"
                required
                className="appearance-none block w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-slate-50 dark:bg-slate-700 dark:text-white transition-all outline-none"
                placeholder="admin / librarian"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                className="appearance-none block w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-slate-50 dark:bg-slate-700 dark:text-white transition-all outline-none"
                placeholder="admin123 / lib123"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Sign in
          </button>
        </form>
        
        <div className="pt-6 mt-6 border-t border-slate-200 dark:border-slate-700 space-y-2">
            <p className="text-xs text-slate-500 dark:text-slate-400 text-center font-medium">Demo Credentials:</p>
            <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 gap-2">
                <span><span className="font-semibold text-slate-700 dark:text-slate-300">Admin:</span> admin / admin123</span>
                <span><span className="font-semibold text-slate-700 dark:text-slate-300">Librarian:</span> librarian / lib123</span>
                <span><span className="font-semibold text-slate-700 dark:text-slate-300">Student:</span> student / student123</span>
            </div>
        </div>
      </div>
    </div>
  );
}
