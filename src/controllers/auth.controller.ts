import { db } from "../libs/db";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import {
  userRegisterSchema,
  userLoginSchema,
} from "../utils/schema/user.schema";
import { validator } from "../utils/validator";
import { Request, Response, CookieOptions } from "express";
import { Role } from "@prisma/client";
import { nanoid } from "nanoid";
export const COOKIE_EXPIRY = 1000 * 60 * 60 * 24 * 7;
// Register User
export const registerUser = async (req: Request, res: Response) => {
  const validation = validator(userRegisterSchema, req.body);
  if (validation.error) {
    return res.status(400).json({ error: validation.error, success: false });
  }

  const { name, password, confirmPassword, email } = req.body;
  console.log(`name :${name} password : ${password} email : ${email}`);

  if (password !== confirmPassword) {
    return res.status(400).json({
      error: "Password and Confirm Password don't match",
      success: false,
    });
  }

  try {
    const existingUser = await db.user.findFirst({
      where: {
        OR: [{ email: req.body.email }, { username: req.body.username }],
      },
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User already exists", success: false });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const options: CookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: COOKIE_EXPIRY,
    };
    const newUser = await db.user.create({
      data: {
        username: name,
        email,
        password: hashedPassword,
        role: Role.USER,
        is_active: true,
      },
    });

    const token = jwt.sign(
      {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
      process.env.JWT_SECRET || "",
      {
        expiresIn: "7d",
      }
    );

    res.cookie("accesstoken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
      success: true,
    });
  } catch (error) {
    console.error("Error in creating user:", error);
    return res
      .status(500)
      .json({ error: "Internal Server Error", success: false });
  }
};

// Login User
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const validation = validator(userLoginSchema, req.body);
  if (validation.error) {
    return res.status(400).json({ error: validation.error, success: false });
  }

  try {
    const existingUser = await db.user.findUnique({ where: { email } });

    if (!existingUser) {
      return res
        .status(404)
        .json({ message: "User doesn't exist", success: false });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ message: "Invalid email or password", success: false });
    }

    const token = jwt.sign(
      {
        id: existingUser.id,
        username: existingUser.username,
        email: existingUser.email,
        role: existingUser.role,
      },
      process.env.JWT_SECRET || "",
      {
        expiresIn: "7d",
      }
    );

    res.cookie("accesstoken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: existingUser.id,
        username: existingUser.username,
        email: existingUser.email,
        role: existingUser.role,
      },
      success: true,
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res
      .status(500)
      .json({ error: "Internal Server Error", success: false });
  }
};

// Logout User
export const logoutUser = (req: Request, res: Response) => {
  try {
    res.clearCookie("accesstoken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({
      message: "User logged out successfully",
      success: false,
    });
  } catch (error) {
    console.error("Error logging out user:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      success: false,
    });
  }
};

// API Key Login (stub)
export const apiKeyLogin = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        message: "Unauthorised Access",
        success: false,
      });
    }

    const userId = req.user.id;
    const rawApiKey = nanoid(32);
    const hashedApiKey = await bcrypt.hash(rawApiKey, 10);

    const permissions = {}; // You can define default or user-specific permissions here
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await db.apiKey.create({
      data: {
        user_id: userId,
        name: "Web Browser",
        key_hash: hashedApiKey,
        permissions: permissions,
        rate_limit: 10000,
        last_used_at: new Date(),
        expires_at: expiresAt,
        is_active: true,
      },
    });

    // DO NOT STORE IN COOKIES — return raw key once
    return res.status(201).json({
      message: "API Key generated successfully",
      apiKey: rawApiKey, // show only once
      success: true,
    });

  } catch (error) {
    console.error("Error generating API key:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      success: false,
    });
  }
};


// Profile (stub)
export const getProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Invalid Access",
      });
    }

    const user = await db.user.findUnique({
      where: {
        id: req.user.id,
      },
    });

    return res.status(201).json({
      user: user,
      message: "Profile Fetched successfully",
    });
  } catch (error) {
    console.error("Error Fetching user profile:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      success: false,
    });
  }
};
