import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  usn: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  branch: { type: String, required: true },
  semester: { type: Number, required: true },
  section: { type: String, required: true }
}, { timestamps: true });

const Student = mongoose.models.Student || mongoose.model("Student", studentSchema);
export default Student as any;
