import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import bookRoutes from "./routes/books.js";
import studentRoutes from "./routes/students.js";
import issueRoutes from "./routes/issues.js";
import reportRoutes from "./routes/reports.js";
import { connectDB } from "./db.js";

interface CreateAppOptions {
  connectOnRequest?: boolean;
}

export function createApp({ connectOnRequest = false }: CreateAppOptions = {}) {
  const app = express();

  app.use(cors());
  app.use(express.json());

  if (connectOnRequest) {
    app.use("/api", async (_req, res, next) => {
      try {
        await connectDB();
        next();
      } catch (error) {
        console.error("API database connection failed:", error);
        res.status(503).json({ error: "Database connection is not available. Please check the server configuration." });
      }
    });
  }

  app.use("/api/books", bookRoutes);
  app.use("/api/students", studentRoutes);
  app.use("/api/issues", issueRoutes);
  app.use("/api/reports", reportRoutes);

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", dbConnected: mongoose.connection.readyState === 1 });
  });

  return app;
}
