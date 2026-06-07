import { Request, Response } from "express";
import IssueRecord from "../models/IssueRecord.js";
import Book from "../models/Book.js";
import Student from "../models/Student.js";

export const getIssues = async (_req: Request, res: Response) => {
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
  let reservedBook: any = null;
  try {
    const { studentId, bookId, dueDate } = req.body;
    const parsedDueDate = new Date(dueDate);
    if (!studentId || !bookId || !dueDate || Number.isNaN(parsedDueDate.getTime())) {
      return res.status(400).json({ error: "Student, book, and a valid due date are required" });
    }
    if (parsedDueDate <= new Date()) {
      return res.status(400).json({ error: "Due date must be in the future" });
    }

    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ error: "Student not found" });

    const existingIssue = await IssueRecord.exists({ studentId, bookId, status: "ISSUED" });
    if (existingIssue) return res.status(409).json({ error: "This student already has an active issue for this book" });

    reservedBook = await Book.findOneAndUpdate(
      { _id: bookId, availableQuantity: { $gt: 0 } },
      { $inc: { availableQuantity: -1 } },
      { returnDocument: "after" },
    );
    if (!reservedBook) {
      const exists = await Book.exists({ _id: bookId });
      return res.status(exists ? 409 : 404).json({ error: exists ? "Book not available" : "Book not found" });
    }

    const newIssue = await IssueRecord.create({ studentId, bookId, dueDate: parsedDueDate, status: "ISSUED" });
    await newIssue.populate(["studentId", "bookId"]);
    res.status(201).json(newIssue);
  } catch (err: any) {
    if (reservedBook) await Book.updateOne({ _id: reservedBook._id }, { $inc: { availableQuantity: 1 } });
    if (err?.code === 11000) return res.status(409).json({ error: "This student already has an active issue for this book" });
    res.status(400).json({ error: err.message });
  }
};

export const returnBook = async (req: Request, res: Response) => {
  try {
    const returnDate = new Date();
    const issue = await IssueRecord.findOneAndUpdate(
      { _id: req.params.id, status: "ISSUED" },
      [{
        $set: {
          returnDate,
          status: "RETURNED",
          fine: { $multiply: [5, { $max: [0, { $floor: { $divide: [{ $subtract: [returnDate, "$dueDate"] }, 86_400_000] } }] }] },
        },
      }],
      { returnDocument: "after", updatePipeline: true },
    );

    if (!issue) {
      const exists = await IssueRecord.exists({ _id: req.params.id });
      return res.status(exists ? 409 : 404).json({ error: exists ? "Book already returned" : "Issue record not found" });
    }

    await Book.updateOne(
      { _id: issue.bookId, $expr: { $lt: ["$availableQuantity", "$quantity"] } },
      { $inc: { availableQuantity: 1 } },
    );
    await issue.populate(["studentId", "bookId"]);
    res.json(issue);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
