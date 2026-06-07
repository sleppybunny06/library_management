import express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import mongoose from "mongoose";

// Load routes
import bookRoutes from "./server/routes/books.js";
import studentRoutes from "./server/routes/students.js";
import issueRoutes from "./server/routes/issues.js";
import reportRoutes from "./server/routes/reports.js";
import { connectDB } from "./server/db.js";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/books", bookRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/issues", issueRoutes);
app.use("/api/reports", reportRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", dbConnected: mongoose.connection.readyState === 1 });
});

async function startServer() {
  await connectDB();

  if (process.env.NODE_ENV !== "production") {
    // Vite middleware for development
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production: serve static files
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
