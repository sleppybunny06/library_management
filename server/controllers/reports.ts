import { Request, Response } from "express";
import Book from "../models/Book.js";
import Student from "../models/Student.js";
import IssueRecord from "../models/IssueRecord.js";

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const totalBooks = await Book.countDocuments();
    const availableBooksAggregate = await Book.aggregate([{ $group: { _id: null, total: { $sum: "$availableQuantity" } } }]);
    const availableBooks = availableBooksAggregate[0]?.total || 0;
    
    const issuedBooksCount = await IssueRecord.countDocuments({ status: "ISSUED" });
    const overdueBooksCount = await IssueRecord.countDocuments({ 
      status: "ISSUED", 
      dueDate: { $lt: new Date() } 
    });
    const registeredStudents = await Student.countDocuments();

    // Chart Data (Mock trend)
    const monthlyIssueTrend = [
        { name: 'Jan', issues: 40 },
        { name: 'Feb', issues: 55 },
        { name: 'Mar', issues: 35 },
        { name: 'Apr', issues: 70 },
        { name: 'May', issues: 45 },
        { name: 'Jun', issues: 60 }
    ];

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
