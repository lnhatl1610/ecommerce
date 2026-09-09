import type { Request, Response, NextFunction } from "express";
import { type ZodTypeAny, ZodError } from "zod";
import { sendError } from "../lib/response.js";

export const validateBody = (schema: ZodTypeAny) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const errors = err.issues.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        }));
        return sendError(res, "Validation failed", 400, errors);
      }
      return sendError(res, "Invalid request payload", 400);
    }
  };
};

export const validateQuery = (schema: ZodTypeAny) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsedQuery = await schema.parseAsync(req.query) as Request["query"];
      Object.keys(req.query).forEach((key) => delete req.query[key]);
      Object.assign(req.query, parsedQuery);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const errors = err.issues.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        }));
        return sendError(res, "Invalid query parameters", 400, errors);
      }
      return sendError(res, "Invalid query parameters", 400);
    }
  };
};
