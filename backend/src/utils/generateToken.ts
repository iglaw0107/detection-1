import jwt from "jsonwebtoken";

export const generateToken = (id: string, role: string) => {
  return jwt.sign({ userId: id, role }, process.env.JWT_SECRET as string, {
    expiresIn: "7d"
  });
};