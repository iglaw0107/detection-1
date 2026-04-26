import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// ✅ JWT Payload Type
export interface JwtPayload {
  userId: string;
  role: "admin" | "police";
  email?: string;
  iat?: number;
  exp?: number;
}

// ✅ Type guard
function isJwtPayload(obj: any): obj is JwtPayload {
  return obj && typeof obj.userId === "string" && typeof obj.role === "string";
}

// 🔐 PROTECT MIDDLEWARE
export const protect = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        success: false,
        message: "No token provided",
      });
      return;
    }

    const token = authHeader.split(" ")[1];

    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET not set");

    const decoded = jwt.verify(token as string, secret);

    if (!isJwtPayload(decoded)) {
      throw new Error("Invalid token structure");
    }

    // 🔥 IMPORTANT FIX
    (req as any).user = decoded;

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

// 🔐 ROLE AUTHORIZATION
export const authorize = (...roles: ("admin" | "police")[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = (req as any).user;

    if (!user) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    if (!roles.includes(user.role)) {
      res.status(403).json({
        success: false,
        message: `Role '${user.role}' is not allowed`,
      });
      return;
    }

    next();
  };
};