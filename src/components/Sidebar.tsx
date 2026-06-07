import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Book, Users, ArrowRightLeft, Undo2, FileBarChart, Settings, LogOut, Library } from "lucide-react";
import clsx from "clsx";

export default function Sidebar({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();

  const role = localStorage.getItem("authRole") || "student";
  
  const allNavItems = [
    { path: "/", name: "Dashboard", icon: LayoutDashboard, roles: ["admin", "librarian"] },
    { path: "/books", name: "Books", icon: Book, roles: ["admin", "librarian"] },
    { path: "/students", name: "Students", icon: Users, roles: ["admin", "librarian"] },
    { path: "/issues", name: "Issue Books", icon: ArrowRightLeft, roles: ["admin", "librarian"] },
    { path: "/returns", name: "Returns", icon: Undo2, roles: ["admin", "librarian"] },
    { path: "/reports", name: "Reports", icon: FileBarChart, roles: ["admin", "librarian"] },
    { path: "/settings", name: "Settings", icon: Settings, roles: ["admin", "librarian"] },
    
    // Student routes
    { path: "/student-dashboard", name: "Library Catalog", icon: Book, roles: ["student"] },
  ];

  const navItems = allNavItems.filter(item => item.roles.includes(role));

  const handleLogout = () => {
    localStorage.removeItem("authRole");
    navigate("/login");
  };

  return (
    <div className="flex flex-col h-full bg-[#0F172A] text-slate-300 border-r border-slate-800 shrink-0">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
          <Library className="w-5 h-5 text-white" />
        </div>
        <span className="font-semibold text-white tracking-tight">SmartLib VTU</span>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={({ isActive }) => clsx(
              "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
              isActive 
                ? "bg-blue-600/10 text-blue-400 border-r-2 border-blue-500" 
                : "hover:bg-slate-800 hover:text-white"
            )}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto p-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 w-full text-sm font-medium hover:bg-slate-800 transition-colors rounded-md text-red-400 hover:text-red-300"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          Logout
        </button>
        <div className="mt-4 bg-slate-800/50 rounded-lg p-3 border border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">
              {role === 'admin' ? 'AD' : role === 'librarian' ? 'LI' : 'ST'}
            </div>
            <div>
              <p className="text-xs font-semibold text-white capitalize">{role}</p>
              <p className="text-[10px] text-slate-400">
                {role === 'admin' ? 'vtu-admin-01' : role === 'librarian' ? 'vtu-lib-01' : '1BI21CS001'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
