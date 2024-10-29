import { Request, NextFunction } from "express";
import { validationResult } from "express-validator";
import { CustomError } from "../middleware/errorHandler";

export const handleValidationErrors = (req: Request, next: NextFunction): boolean => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessage = errors
      .array()
      .map((err) => err.msg)
      .join(", ");
    const error = new Error(errorMessage) as CustomError;
    error.statusCode = 400;
    next(error);
    return true;
  }
  return false;
};
