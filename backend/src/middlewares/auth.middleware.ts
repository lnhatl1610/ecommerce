import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { sendError } from "../lib/response.js";
import type { JwtPayload } from "../types/jwt.types.js";

const ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_SECRET || "your-access-secret";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return sendError(res, "No token provided", 401);
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET) as JwtPayload;

    req.user = decoded;
    next();
  } catch (error) {
    return sendError(res, "Invalid or expired token", 401);
  }
};

export const requireRole = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return sendError(res, "Authentication required", 401);
    }

    if (!allowedRoles.includes(req.user.role)) {
      return sendError(res, "Insufficient permissions", 403);
    }

    next();
  };
};
