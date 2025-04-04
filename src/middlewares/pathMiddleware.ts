import { Request, Response, NextFunction } from "express";

export const pathMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  const method = req.method;
  const url = req.url;

  res.on('finish', () => {
    const statusCode = res.statusCode;
    const ms = Date.now() - start;
    console.log(`[ROUTINE_PATH_SERVER]:[${method}] ${url} ${statusCode} - ${ms}ms`);
  });

  next();
}