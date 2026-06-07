import express from "express";
import { getIssues, issueBook, returnBook } from "../controllers/issues.js";

const router = express.Router();

router.get("/", getIssues);
router.post("/", issueBook);
router.put("/:id/return", returnBook);

export default router;
