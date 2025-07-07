import jwt, { JwtPayload } from "jsonwebtoken";
import { db } from "../libs/db.js";
import { Request, Response, NextFunction } from "express";
import { UserRequest } from "../types/types.js";

declare global {
  namespace Express {
    interface Request {
      user?: UserRequest;
    }
  }
}

const verifyUser = async (req: Request, res: Response, next: NextFunction) => {
  const accesstoken = req.cookies.accesstoken;
  console.log(`access token :${accesstoken}`);
  try {
    if (!accesstoken) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decoded = jwt.verify(
      accesstoken,
      process.env.JWT_SECRET!
    ) as JwtPayload;

    console.log(`decoded :${JSON.stringify(decoded)}`)
    req.user = decoded as UserRequest;
    console.log("user :",req.user)
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export const verifyAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    console.log("accoutROle", req.user.role);
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Forbidden" });
    }
    console.log("Permission granted");
    next();
  } catch (error) {
    console.error("Error in validating user :", error);
  }
};

export default verifyUser;
