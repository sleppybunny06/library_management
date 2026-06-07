/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "./pages/Login.js";
import DashboardLayout from "./layouts/DashboardLayout.js";
import Dashboard from "./pages/Dashboard.js";
import Books from "./pages/Books.js";
import Students from "./pages/Students.js";
import IssueBooks from "./pages/IssueBooks.js";
import Returns from "./pages/Returns.js";
import Reports from "./pages/Reports.js";
import Settings from "./pages/Settings.js";
import StudentDashboard from "./pages/StudentDashboard.js";
import { useEffect } from "react";

export default function App() {
  // Check theme on mount
  useEffect(() => {
    if (localStorage.getItem("theme") === "dark" || 
       (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/books" element={<Books />} />
          <Route path="/students" element={<Students />} />
          <Route path="/issues" element={<IssueBooks />} />
          <Route path="/returns" element={<Returns />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

