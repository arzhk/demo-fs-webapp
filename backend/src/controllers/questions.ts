import { NextFunction, Request, Response } from "express";
import base from "../airtable";
import { handleValidationErrors } from "../utils/validationHandler";
import { CustomError } from "../middleware/errorHandler";

interface QuestionFields {
  _recordId: string;
  companyName: string;
  _companyId: number;
  question: string;
  answer?: string;
  answeredBy?: string;
  answeredAt?: string;
  createdAt: string;
  createdBy: string;
  updatedAt?: string;
  updatedBy?: string;
  assignedTo?: string | null;
  properties?: string;
  description: string;
}

interface AirtableRecord {
  id: string;
  fields: QuestionFields;
}

export const formatAirtableRecord = (record: any): AirtableRecord => {
  return {
    id: record.id,
    fields: record.fields,
  };
};

export const createQuestion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (handleValidationErrors(req, next)) return;

    const { question, createdBy, description } = req.body;

    const assignedTo = req.body.assignedTo || null;
    const properties = req.body.properties || "";

    const [record] = (await base("questions").create([
      {
        fields: {
          companyName: "Test Company Limited",
          _companyId: "63297b55665e8a001366a547",
          question,
          createdBy,
          updatedBy: createdBy,
          assignedTo,
          properties,
          description,
          createdAt: new Date().toISOString(),
        },
      },
    ])) as unknown as AirtableRecord[];

    res.status(201).json(record);
  } catch (error) {
    console.error("Error creating question:", error);
    next(error);
  }
};

export const getQuestions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const records = (await base("questions").select().all()) as unknown as AirtableRecord[];

    const questions = records.map((record) => ({
      id: record.id,
      ...record.fields,
    }));

    res.status(200).json(questions);
  } catch (error) {
    console.error("Error fetching questions:", error);
    next(error);
  }
};

/* export const getQuestionById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const record = await base("questions").find(id);

    if (!record) {
      const error = new Error("Question not found") as CustomError;
      error.statusCode = 404;
      next(error);
    }

    res.status(200).json({
      id: record.id,
      ...record.fields,
    });
  } catch (error) {
    next(error);
  }
}; */

export const getFilteredQuestions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { assignedTo, properties } = req.query;

    const records = (await base("questions").select().all()) as unknown as AirtableRecord[];

    const filteredRecords = records.map(formatAirtableRecord).filter((record) => {
      const isAssignedToMatch = assignedTo ? record.fields.assignedTo === assignedTo : true;

      let isPropertiesMatch = true;
      if (properties) {
        const filterProperties = (properties as string).split(",").map((prop) => prop.trim());
        const recordProperties = (record.fields.properties || "").split(",").map((prop) => prop.trim());

        isPropertiesMatch = filterProperties.every((filterProp) => recordProperties.includes(filterProp));
      }

      return isAssignedToMatch && isPropertiesMatch;
    });

    res.status(200).json(filteredRecords);
  } catch (error) {
    console.error("Error fetching filtered questions:", error);
    next(error);
  }
};

export const updateQuestion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (handleValidationErrors(req, next)) return;

    const { id } = req.params;
    const { answer, answeredBy, answeredAt, updatedBy, assignedTo } = req.body;

    const [updatedRecord] = (await base("questions").update([
      {
        id: id,
        fields: {
          answer,
          answeredBy,
          answeredAt,
          updatedAt: new Date().toISOString(),
          updatedBy,
          assignedTo,
        },
      },
    ])) as unknown as AirtableRecord[];

    res.status(200).json(updatedRecord);
  } catch (error) {
    console.error("Error updating question:", error);
    next(error);
  }
};

export const deleteQuestion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await base("questions").destroy(id);
    res.status(200).json({ message: `Question ${id} deleted successfully.` });
  } catch (error) {
    console.error("Error deleting question:", error);
    next(error);
  }
};

export const searchQuestions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { q } = req.query;
    const searchQuery = (q as string).toLowerCase();

    const records = await base("questions").select().all();
    const filteredRecords = records.filter((record) => {
      const questionText = typeof record.fields.Question === "string" ? record.fields.Question.toLowerCase() : "";
      const answerText = typeof record.fields.Answer === "string" ? record.fields.Answer.toLowerCase() : "";
      return questionText.includes(searchQuery) || answerText.includes(searchQuery);
    });

    res.status(200).json(filteredRecords);
  } catch (error) {
    console.error("Error searching questions:", error);
    next(error);
  }
};
