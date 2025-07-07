import express from "express";
import { apiKeyLogin, getProfile, loginUser, logoutUser, registerUser } from "../controllers/auth.controller";

import verifyUser from "../utils/verifyUser";
const authRouter = express.Router();

authRouter.post("/register",registerUser);
authRouter.post("/login",loginUser);
authRouter.post("/api_key",verifyUser,apiKeyLogin);
authRouter.post("/logout",verifyUser ,logoutUser);
authRouter.get("/me",verifyUser,getProfile);

export default authRouter;