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
        const errors = err.issues.map((e: any) => ({
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
      req.query = await schema.parseAsync(req.query) as any;
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const errors = err.issues.map((e: any) => ({
          field: e.path.join("."),
          message: e.message,
        }));
        return sendError(res, "Invalid query parameters", 400, errors);
      }
      return sendError(res, "Invalid query parameters", 400);
    }
  };
};
