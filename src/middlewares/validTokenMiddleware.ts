import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { TOKEN_SECRET_KEY } from "@config/constants.ts";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  
  try {
    const token = req.headers.authorization;
  
    if (!token) res.status(401).json({ error: "Unauthorized" });
  
    jwt.verify(token as string, TOKEN_SECRET_KEY);
    
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};