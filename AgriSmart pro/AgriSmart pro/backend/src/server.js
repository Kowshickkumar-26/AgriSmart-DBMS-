import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import crudRoutes from "./routes/crud.js";

dotenv.config();

const requiredEnv = ["DB_HOST", "DB_USER", "DB_PASSWORD", "DB_NAME", "JWT_SECRET"];
const missingEnv = requiredEnv.filter((key) => !process.env[key]);
if (missingEnv.length > 0) {
  console.error(`Missing required environment variables: ${missingEnv.join(", ")}`);
  process.exit(1);
}

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const frontendPath = path.resolve(__dirname, "../../frontend");

app.use(express.json());
app.use(morgan("dev"));
app.use(cors(process.env.CORS_ORIGIN ? { origin: process.env.CORS_ORIGIN === "*" ? true : process.env.CORS_ORIGIN } : {}));
app.use(express.static(frontendPath));

// Health
app.get("/health", (_req, res) => res.json({ ok: true, service: "AgriSmart API" }));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api", crudRoutes);

// Serve frontend assets from root
app.get(["/", "/index.html"], (_req, res) => res.sendFile(path.join(frontendPath, "index.html")));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ API running on http://localhost:${PORT}`));
