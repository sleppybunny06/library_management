import { Menu, Search, Bell, User } from "lucide-react";
import { useLocation } from "react-router-dom";

export default function Navbar({ onMenuClick }: { onMenuClick: () => void }) {
  const location = useLocation();
  const rawRole = localStorage.getItem("authRole") || "student";
  const role = rawRole === "admin" ? "Administrator" : rawRole === "librarian" ? "Librarian" : "Student";

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/") return "Dashboard";
    if (path.startsWith("/books")) return "Book Management";
    if (path.startsWith("/students")) return "Student Management";
    if (path.startsWith("/issues")) return "Issue Books";
    if (path.startsWith("/returns")) return "Process Returns";
    if (path.startsWith("/reports")) return "Library Reports";
    if (path.startsWith("/settings")) return "Settings";
    if (path.startsWith("/student-dashboard")) return "Library Catalog";
    return "";
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-4 flex-1">
        <button 
          onClick={onMenuClick}
          className="lg:hidden text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="relative w-full max-w-md hidden md:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search books, USN, or transactions..." 
            className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all dark:bg-slate-700 dark:border-slate-600 dark:text-white"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <h1 className="text-sm font-bold text-slate-900 dark:text-white hidden sm:block mr-4">
          {getPageTitle()}
        </h1>
        <button className="relative p-2 text-slate-500 hover:text-blue-600 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-800"></span>
        </button>
        
        <div className="flex items-center gap-3 border-l border-slate-200 dark:border-slate-700 pl-4">
          <div className="bg-blue-100 dark:bg-blue-900/50 p-1.5 rounded-full">
            <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="hidden sm:block text-sm">
            <p className="font-medium text-slate-700 dark:text-slate-200">
              {rawRole === 'admin' ? 'Admin User' : rawRole === 'librarian' ? 'Librarian User' : 'Student Demo'}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
