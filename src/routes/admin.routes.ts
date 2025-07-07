import { Router } from "express";
import verifyUser, { verifyAdmin } from "../utils/verifyUser";
import { approvePost, fetchAllPendingPost, rejectPost } from "../controllers/admin.controller";

export const adminRoute= Router();

adminRoute.get('/',verifyUser,verifyAdmin,fetchAllPendingPost);
adminRoute.put('/:id/approve',verifyUser,verifyAdmin,approvePost);
adminRoute.put('/:id/reject',verifyUser,verifyAdmin,rejectPost);