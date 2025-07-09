import { Router } from "express";
import verifyUser from "../utils/verifyUser";
import { createCategory, fetchCategory, fetchCategoryPosts } from "../controllers/category.controller";

export const categoryRoutes = Router();

categoryRoutes.post("/categories",verifyUser,createCategory);
categoryRoutes.get("/categories",verifyUser,fetchCategory);
categoryRoutes.get("/categories/:categoryId",fetchCategoryPosts)