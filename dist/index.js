import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.route";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });
const app = express();
app.use(express.json());
app.use(cookieParser());
const PORT = process.env.PORT || 3000;
let BASE_URL = process.env.BASE_URL || "";
if (BASE_URL.endsWith("/")) {
    BASE_URL = BASE_URL.slice(0, -1);
}
console.log(`base url : ${BASE_URL}`);
app.get(BASE_URL, (req, res) => {
    res.send("Welcome to the API!");
});
app._router.stack.forEach((r) => {
    if (r.route && r.route.path) {
        console.log(`Route registered: ${r.route.path}`);
    }
});
app.use(`${BASE_URL}/auth`, authRouter);
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}${BASE_URL}`);
});
