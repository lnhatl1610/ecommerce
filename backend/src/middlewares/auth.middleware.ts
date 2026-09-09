import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { sendError } from "../lib/response.js";
import type { Role } from "@prisma/client";
import type { JwtPayload } from "../types/jwt.types.js";
import { requiredEnv } from "../config/env.js";

const ACCESS_TOKEN_SECRET = requiredEnv("JWT_ACCESS_SECRET", "development-access-secret");

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

/** Populate req.user when a valid bearer token is present, while keeping guest requests public. */
export const optionalAuth = (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    try {
      req.user = jwt.verify(authHeader.substring(7), ACCESS_TOKEN_SECRET) as JwtPayload;
    } catch {
      // Expired/invalid optional credentials fall back to the guest cart.
    }
  }
  next();
};

export const requireRole = (...allowedRoles: Role[]) => {
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
