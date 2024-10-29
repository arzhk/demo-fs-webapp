import express from "express";
import {
  createQuestion,
  getQuestions,
  updateQuestion,
  deleteQuestion,
  searchQuestions,
  getFilteredQuestions,
  assignQuestions,
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
router.patch("/assign", assignQuestions);
router.put(
  "/:id",
  [
    check("answer").notEmpty().withMessage("Answer is required"),
    check("updatedBy").isEmail().withMessage("A valid email is required for updatedBy"),
    check("answeredBy").isEmail().withMessage("A valid email is required for answeredBy"),
    check("answeredAt").isISO8601().withMessage("AnsweredAt must be a valid date"),
  ],
  updateQuestion
);
router.delete("/:id", deleteQuestion);
router.get("/search", searchQuestions);
router.get("/filter", getFilteredQuestions);

export default router;
