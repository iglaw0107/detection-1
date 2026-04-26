import "express";

declare global {
  namespace Express {
    interface UserPayload {
      userId: string;
      role: "admin" | "police";
      email?: string;
    }

    interface Request {
      user?: UserPayload;
    }
  }
}