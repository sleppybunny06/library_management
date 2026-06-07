import { Request, Response } from "express";
import Student from "../models/Student.js";

export const getStudents = async (req: Request, res: Response) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.json(students);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getStudent = async (req: Request, res: Response) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ error: "Student not found" });
    res.json(student);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const createStudent = async (req: Request, res: Response) => {
  try {
    const newStudent = new Student(req.body);
    await newStudent.save();
    res.status(201).json(newStudent);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const updateStudent = async (req: Request, res: Response) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedStudent) return res.status(404).json({ error: "Student not found" });
    res.json(updatedStudent);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteStudent = async (req: Request, res: Response) => {
  try {
    const deletedStudent = await Student.findByIdAndDelete(req.params.id);
    if (!deletedStudent) return res.status(404).json({ error: "Student not found" });
    res.json({ message: "Student deleted" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
