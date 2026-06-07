import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  isbn: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  publisher: { type: String },
  publishedYear: { type: Number },
  quantity: { type: Number, required: true, min: 0 },
  availableQuantity: { type: Number, required: true, min: 0, validate: { validator(this: any, value: number) { return value <= this.quantity; }, message: "Available quantity cannot exceed total quantity" } },
  rackNumber: { type: String },
  description: { type: String },
  coverImage: { type: String, default: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=600&auto=format&fit=crop" }
}, { timestamps: true });

const Book = mongoose.models.Book || mongoose.model("Book", bookSchema);
export default Book as any;
