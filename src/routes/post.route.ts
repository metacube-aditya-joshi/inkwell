import express from "express";
import { createPost, deletePost, fetchPostById, fetchPosts, updatePost } from "../controllers/post.controller";
import verifyUser from "../utils/verifyUser";

export const postRoutes = express.Router();

postRoutes.post('/posts',verifyUser,createPost);
postRoutes.get('/posts',verifyUser,fetchPosts);
postRoutes.get('/posts/:postId',verifyUser,fetchPostById);
postRoutes.put('/posts/:id',verifyUser,updatePost);
postRoutes.delete('/posts/:id',verifyUser,deletePost);