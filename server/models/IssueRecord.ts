import mongoose from "mongoose";

const issueRecordSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
  issueDate: { type: Date, required: true, default: Date.now },
  dueDate: { type: Date, required: true },
  returnDate: { type: Date },
  status: { type: String, enum: ["ISSUED", "RETURNED", "OVERDUE"], default: "ISSUED" },
  fine: { type: Number, default: 0 }
}, { timestamps: true });

const IssueRecord = mongoose.models.IssueRecord || mongoose.model("IssueRecord", issueRecordSchema);
export default IssueRecord as any;
