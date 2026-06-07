import { Request, Response } from "express";
import IssueRecord from "../models/IssueRecord.js";
import Book from "../models/Book.js";

export const getIssues = async (req: Request, res: Response) => {
  try {
    const issues = await IssueRecord.find()
      .populate("studentId")
      .populate("bookId")
      .sort({ createdAt: -1 });
    res.json(issues);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const issueBook = async (req: Request, res: Response) => {
  try {
    const { studentId, bookId, dueDate } = req.body;

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ error: "Book not found" });
    if (book.availableQuantity <= 0) return res.status(400).json({ error: "Book not available" });

    const newIssue = new IssueRecord({
      studentId,
      bookId,
      dueDate,
      status: "ISSUED"
    });

    await newIssue.save();

    // Decrease available quantity
    book.availableQuantity -= 1;
    await book.save();

    res.status(201).json(newIssue);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const returnBook = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const issue = await IssueRecord.findById(id).populate("bookId");
    if (!issue) return res.status(404).json({ error: "Issue record not found" });
    if (issue.status === "RETURNED") return res.status(400).json({ error: "Book already returned" });

    issue.returnDate = new Date();
    issue.status = "RETURNED";

    // Calculate fine: ₹5 x Late Days
    const lateDays = Math.max(0, Math.floor((issue.returnDate.getTime() - issue.dueDate.getTime()) / (1000 * 60 * 60 * 24)));
    issue.fine = lateDays * 5;

    await issue.save();

    // Increase available quantity
    const book = await Book.findById(issue.bookId);
    if (book) {
      book.availableQuantity += 1;
      await book.save();
    }

    res.json(issue);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
