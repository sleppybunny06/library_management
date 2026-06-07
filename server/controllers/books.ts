import { Request, Response } from "express";
import Book from "../models/Book.js";
import IssueRecord from "../models/IssueRecord.js";

export const getBooks = async (_req: Request, res: Response) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.json(books);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getBook = async (req: Request, res: Response) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ error: "Book not found" });
    res.json(book);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const createBook = async (req: Request, res: Response) => {
  try {
    const quantity = Number(req.body.quantity);
    if (!Number.isInteger(quantity) || quantity < 0) {
      return res.status(400).json({ error: "Quantity must be a non-negative whole number" });
    }

    const newBook = new Book({ ...req.body, quantity, availableQuantity: quantity });
    await newBook.save();
    res.status(201).json(newBook);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const updateBook = async (req: Request, res: Response) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ error: "Book not found" });

    const quantity = Number(req.body.quantity);
    if (!Number.isInteger(quantity) || quantity < 0) {
      return res.status(400).json({ error: "Quantity must be a non-negative whole number" });
    }

    const activeLoans = await IssueRecord.countDocuments({ bookId: book._id, status: "ISSUED" });
    if (quantity < activeLoans) {
      return res.status(400).json({ error: `Quantity cannot be lower than ${activeLoans} currently issued copies` });
    }

    Object.assign(book, req.body, { quantity, availableQuantity: quantity - activeLoans });
    await book.save();
    res.json(book);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteBook = async (req: Request, res: Response) => {
  try {
    const activeLoan = await IssueRecord.exists({ bookId: req.params.id, status: "ISSUED" });
    if (activeLoan) return res.status(409).json({ error: "Return all issued copies before deleting this book" });

    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    if (!deletedBook) return res.status(404).json({ error: "Book not found" });
    res.json({ message: "Book deleted" });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
