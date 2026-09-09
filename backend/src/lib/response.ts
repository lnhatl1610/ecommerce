import type { Response } from "express";

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: unknown;
}

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message = "Operation successful",
  statusCode = 200
): Response => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  } satisfies ApiResponse<T>);
};

export const sendError = (
  res: Response,
  message = "An error occurred",
  statusCode = 500,
  error: unknown = null
): Response => {
  return res.status(statusCode).json({
    success: false,
    message,
    error,
  } satisfies ApiResponse);
};
