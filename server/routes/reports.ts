import express from "express";
import { getDashboardStats, getOverdueBooks, getMostBorrowedBooks } from "../controllers/reports.js";

const router = express.Router();

router.get("/dashboard", getDashboardStats);
router.get("/overdue", getOverdueBooks);
router.get("/most-borrowed", getMostBorrowedBooks);

export default router;
