import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      userId?: number;
    }
  }
}

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET is not set in environment variables");
    return res.status(500).json({ error: "Internal server error" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("JWT verification failed:", err.message);
      return res.status(403).json({ error: "Forbidden" });
    }

    const decodedToken = decoded as jwt.JwtPayload;

    if (!decodedToken.userId) {
      console.error("userId not found in token payload");
      return res.status(403).json({ error: "Forbidden" });
    }

    req.userId = decodedToken.userId;
    next();
  });
};