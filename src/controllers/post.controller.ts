import { postSchema } from "../utils/schema/post.schema";
import { validator } from "../utils/validator";
import { generateSlug, generateUniqueSlug } from "../utils/generateSlug";
import { db } from "../libs/db";
import { Request, Response } from "express";
import { Post } from "../generated/prisma";

export const createPost = async (req: Request, res: Response) => {
  console.log("entering validation");
  const validation = validator(postSchema, req.body);
  if (validation.error) {
    return res.status(400).json({
      error: validation.error,
      success: validation.success,
    });
  }
  console.log("Exited validation");
  const {
    title,
    content,
    excerpt,
    category_id,
    tags,
    meta_description,
    featured_image_url,
    custom_slug,
  } = req.body;
  console.log("hello");

  if (!title || !content)
    return res.status(400).json({
      error: "Enter title or content for post ",
      success: false,
    });

  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const includeOptions: any = {
    author: {
      select: {
        id: true,
        username: true,
        email: true,
      },
    },
  };
  if (category_id) {
    includeOptions.category = true;
  }
  const userId: number = req.user.id;
  try {
    const baseSlug = await (custom_slug
      ? generateUniqueSlug(custom_slug)
      : generateUniqueSlug(title));
    console.log("base slug :", baseSlug);

    const existingPost = await db.post.findUnique({
      where: {
        title_category_id: {
          title: title,
          category_id: category_id,
        },
      },
    });
    if (existingPost) {
      return res.status(409).json({
        success: false,
        error:
          "A post with this title already exists in the selected category.",
      });
    }
    const newPost = await db.post.create({
      data: {
        title,
        content,
        meta_description,
        category_id,
        tags,
        featured_image_url,
        slug: baseSlug,
        author_id: userId,
        excerpt,
      },
      include: includeOptions,
    });

    if (!newPost)
      return res.status(500).json({
        error: "Error while creating new Post ",
        success: false,
      });
    res.status(201).json({
      success: true,
      message: "Post created successfully",
      post: newPost,
      preview_url: `/posts/${baseSlug}`,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Error while creating new Post ",
      success: false,
    });
  }
};

export const fetchPosts = async (req: Request, res: Response) => {
  try {
    const posts = await db.post.findMany();
    console.log("posts :", JSON.stringify(posts, null, 2));

    return res.status(201).json({
      posts: posts,
      message: "Posts fetched successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error in finding posts`", error);
    return res.status(500).json({
      message: "Error in finding posts",
    });
  }
};
export const fetchPostById = async (req: Request, res: Response) => {
  const postId = req.params.postId;
  console.log(`id:${postId}`);
  if (!postId) {
    return res.status(401).json({
      message: "Post id is invalid ",
    });
  }
  try {
    const post = await db.post.findUnique({
      where: {
        id: Number(postId),
      },
    });
    console.log("post :", post);
    return res.status(201).json({
      post: post,
      message: "Post Found",
      success: true,
    });
  } catch (error) {
    console.error("Error in finding post", error);
    return res.status(500).json({
      message: "Error in finding post",
    });
  }
};

export const updatePost = async (req: Request, res: Response) => {
  if (!req.user)
    return res.status(400).json({
      message: "Invalid Access",
    });

  const postId = req.params.id;
  if (!postId) return res.status(401).json({ message: "Invalid id " });
  const { title, content, meta_description, slug, tags, status } = req.body;

  try {
    const updateData: Record<string, any> = {};

    if (title?.trim()) updateData.title = title.trim();
    if (content?.trim()) updateData.content = content.trim();
    if (meta_description?.trim())
      updateData.meta_description = meta_description.trim();
    if (slug?.trim()) updateData.slug = slug.trim();
    if (tags && Array.isArray(tags)) updateData.tags = tags;
    if (status) updateData.status = status;
    const post = await db.post.update({
      where: {
        id: Number(postId),
      },
      data: updateData,
    });

    return res
      .status(201)
      .json({ updatedPost: post, message: "Post updated", sucess: true });
  } catch (error) {
    console.error("Error in updating post", error);
    return res.status(500).json({
      message: "Error in updating post",
    });
  }
};

export const deletePost = async (req: Request, res: Response) => {
  const postId = req.params.id;
  console.log(`id:${postId}`);
  if (!postId) {
    return res.status(401).json({
      message: "Post id is invalid ",
    });
  }
  try {
    const post = await db.post.delete({
      where: {
        id: Number(postId),
      },
    });
    console.log("post :", post);
    return res.status(201).json({
      message: "Post Deleted",
      success: true,
    });
  } catch (error) {
    console.error("Error in deleting post", error);
    return res.status(500).json({
      message: "Error in deleting post",
    });
  }
};
