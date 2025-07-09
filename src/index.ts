import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.route";
import { postRoutes } from "./routes/post.route";
import { categoryRoutes } from "./routes/category.route";
import { adminRoute } from "./routes/admin.routes";
import cors from "cors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",  // your Vite frontend
    credentials: true,               // allow cookies/auth headers if needed
  })
);

const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || "/api/v1";

app.get(BASE_URL, (req, res) => {
  res.send("Welcome to the API!");
});

app.use(`${BASE_URL}/auth`, authRouter);
app.use(`${BASE_URL}`, postRoutes);
app.use(`${BASE_URL}`, categoryRoutes);
app.use(`${BASE_URL}/admin/posts`, adminRoute);
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}${BASE_URL}`);
});
