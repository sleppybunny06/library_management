import React, { useState, useEffect } from "react";
import { Moon, Sun, Save } from "lucide-react";
import toast from "react-hot-toast";

export default function Settings() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [libData, setLibData] = useState({
      name: "Central Library",
      college: "VTU Main Campus",
      address: "Jnana Sangama, Belagavi, Karnataka 590018"
  });

  useEffect(() => {
    if (theme === "dark") {
        document.documentElement.classList.add("dark");
    } else {
        document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleSave = (e: React.FormEvent) => {
      e.preventDefault();
      toast.success("Settings saved successfully!");
  };

  return (
    <div className="max-w-3xl space-y-6">
      
      {/* Theme Settings */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 dark:bg-slate-800 dark:border-slate-700">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Appearance</h3>
          <div className="flex items-center gap-4">
              <button 
                  onClick={() => setTheme("light")}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${theme === 'light' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'}`}
              >
                  <Sun className="w-8 h-8 text-amber-500 mb-2" />
                  <span className="text-sm font-semibold dark:text-slate-300">Light Mode</span>
              </button>
              <button 
                  onClick={() => setTheme("dark")}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${theme === 'dark' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'}`}
              >
                  <Moon className="w-8 h-8 text-blue-500 mb-2" />
                  <span className="text-sm font-semibold dark:text-slate-300">Dark Mode</span>
              </button>
          </div>
      </div>

      {/* Library Info */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 dark:bg-slate-800 dark:border-slate-700">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Library Details</h3>
          <form onSubmit={handleSave} className="space-y-4">
              <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Library Name</label>
                  <input type="text" value={libData.name} onChange={e => setLibData({...libData, name: e.target.value})} className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm" />
              </div>
              <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">College / Institution</label>
                  <input type="text" value={libData.college} onChange={e => setLibData({...libData, college: e.target.value})} className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm" />
              </div>
              <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Address</label>
                  <textarea rows={3} value={libData.address} onChange={e => setLibData({...libData, address: e.target.value})} className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none transition-all text-sm"></textarea>
              </div>

              <div className="pt-4 flex justify-end">
                  <button type="submit" className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors text-sm">
                      <Save className="w-4 h-4" />
                      Save Changes
                  </button>
              </div>
          </form>
      </div>

    </div>
  );
}
