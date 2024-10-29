import express from "express";
import {
  createQuestion,
  getQuestions,
  updateQuestion,
  deleteQuestion,
  searchQuestions,
  getFilteredQuestions,
} from "../controllers/questions";
import { check } from "express-validator";

const router = express.Router();

router.post(
  "/",
  [
    check("question").notEmpty().withMessage("Question is required"),
    check("createdBy").isEmail().withMessage("A valid email is required for createdBy"),
  ],
  createQuestion
);
router.get("/", getQuestions);
router.put(
  "/:id",
  [
    check("answer").notEmpty().withMessage("Answer is required"),
    check("updatedBy").isEmail().withMessage("A valid email is required for updatedBy"),
  ],
  updateQuestion
);
router.delete("/:id", deleteQuestion);
router.get("/search", searchQuestions);
router.get("/filter", getFilteredQuestions);

export default router;
