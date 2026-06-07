import { Request, Response } from "express";
import Book from "../models/Book.js";
import Student from "../models/Student.js";
import IssueRecord from "../models/IssueRecord.js";

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const inventory = await Book.aggregate([{ $group: { _id: null, total: { $sum: "$quantity" }, available: { $sum: "$availableQuantity" } } }]);
    const totalBooks = inventory[0]?.total || 0;
    const availableBooks = inventory[0]?.available || 0;
    
    const issuedBooksCount = await IssueRecord.countDocuments({ status: "ISSUED" });
    const overdueBooksCount = await IssueRecord.countDocuments({ 
      status: "ISSUED", 
      dueDate: { $lt: new Date() } 
    });
    const registeredStudents = await Student.countDocuments();

    const monthStart = new Date();
    monthStart.setUTCDate(1);
    monthStart.setUTCHours(0, 0, 0, 0);
    monthStart.setUTCMonth(monthStart.getUTCMonth() - 5);
    const issueTrend = await IssueRecord.aggregate([
      { $match: { issueDate: { $gte: monthStart } } },
      { $group: { _id: { year: { $year: "$issueDate" }, month: { $month: "$issueDate" } }, issues: { $sum: 1 } } },
    ]);
    const monthlyIssueTrend = Array.from({ length: 6 }, (_, index) => {
      const date = new Date(monthStart);
      date.setUTCMonth(monthStart.getUTCMonth() + index);
      const match = issueTrend.find(item => item._id.year === date.getUTCFullYear() && item._id.month === date.getUTCMonth() + 1);
      return { name: date.toLocaleString("en-US", { month: "short", timeZone: "UTC" }), issues: match?.issues || 0 };
    });

    // Books by category
    const categoryDist = await Book.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } }
    ]);
    const bookCategoryDistribution = categoryDist.map(c => ({ name: c._id, value: c.count }));

    // Recent activity
    const recentIssues = await IssueRecord.find().sort({ createdAt: -1 }).limit(5).populate("studentId").populate("bookId");

    res.json({
      summary: { totalBooks, availableBooks, issuedBooksCount, overdueBooksCount, registeredStudents },
      charts: { monthlyIssueTrend, bookCategoryDistribution },
      recentIssues
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getOverdueBooks = async (req: Request, res: Response) => {
  try {
    const overdue = await IssueRecord.find({ 
      status: "ISSUED", 
      dueDate: { $lt: new Date() } 
    }).populate("studentId").populate("bookId");
    res.json(overdue);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getMostBorrowedBooks = async (req: Request, res: Response) => {
  try {
    const mostBorrowed = await IssueRecord.aggregate([
      { $group: { _id: "$bookId", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    
    // Populate
    const populated = await Book.populate(mostBorrowed, { path: "_id" });
    const formatted = populated.map(p => ({
        book: p._id,
        count: p.count
    })).filter(p => p.book); // Remove nulls

    res.json(formatted);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
