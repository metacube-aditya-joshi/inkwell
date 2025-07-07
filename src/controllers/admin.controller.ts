import { db } from "../libs/db";
import { Request, Response } from "express";
import { updatePost } from "./post.controller";

export const fetchAllPendingPost = async (req: Request, res: Response) => {
  if (!req.user)
    return res.status(401).json({
      message: "Invalid Accesss",
    });

  if (req.user.role !== "ADMIN")
    return res.status(401).json({
      message: "Invalid Accesss",
    });
  try {
    const pendingPost = await db.post.findMany({
      where: {
        status: "PENDING",
      },
    });

    return res.status(201).json({
      message: "Post fetched successfully",
      pendingPost: pendingPost,
      success: true,
    });
  } catch (error) {
    console.error("Error in fetching post ", error);

    return res.status(500).json({
      message: "Post cannot be fetched ",

      success: false,
    });
  }
};

export const approvePost = async (req: Request, res: Response) => {
  const postId = req.params.id;

  if (!postId)
    return res.status(401).json({
      message: "Enter post id ",
    });

  try {
    const updatedPost = await db.post.update({
      where: {
        id: Number(postId),
      },
      data: {
        status: "APPROVED",
      },
    });
    if (!updatedPost) {
      return res.status(401).json({
        message: "Invalid updation of post  ",
      });
    }
    return res.status(201).json({
      message: "Post updated successfully",
      updatePost: updatedPost,
      success: true,
    });
  } catch (error) {
    console.error("Error in fetching post ", error);

    return res.status(500).json({
      message: "Post cannot be fetched ",

      success: false,
    });
  }
};

export const rejectPost = async (req: Request, res: Response) => {
  const postId = req.params.id;

  if (!postId)
    return res.status(401).json({
      message: "Enter post id ",
    });

  try {
    const updatedPost = await db.post.update({
      where: {
        id: Number(postId),
      },
      data: {
        status: "REJECTED",
      },
    });
    if (!updatedPost) {
      return res.status(401).json({
        message: "Invalid updation of post  ",
      });
    }
    return res.status(201).json({
      message: "Post updated successfully",
      updatePost: updatedPost,
      success: true,
    });
  } catch (error) {
    console.error("Error in fetching post ", error);

    return res.status(500).json({
      message: "Post cannot be fetched ",

      success: false,
    });
  }
};
