import { Request, Response } from "express";
import Book from "../models/Book.js";

export const getBooks = async (req: Request, res: Response) => {
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
    res.status(500).json({ error: err.message });
  }
};

export const createBook = async (req: Request, res: Response) => {
  try {
    const newBook = new Book({ ...req.body, availableQuantity: req.body.quantity });
    await newBook.save();
    res.status(201).json(newBook);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const updateBook = async (req: Request, res: Response) => {
  try {
    // If quantity is updated, we might need to adjust availableQuantity.  For simplicity, we'll just let them update it.
    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedBook) return res.status(404).json({ error: "Book not found" });
    res.json(updatedBook);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteBook = async (req: Request, res: Response) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    if (!deletedBook) return res.status(404).json({ error: "Book not found" });
    res.json({ message: "Book deleted" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
