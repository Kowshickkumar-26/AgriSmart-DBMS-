import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import crudRoutes from "./routes/crud.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(cors({ origin: process.env.CORS_ORIGIN === "*" ? true : process.env.CORS_ORIGIN }));

// Health
app.get("/health", (_req, res) => res.json({ ok: true, service: "AgriSmart API" }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", crudRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ API running on http://localhost:${PORT}`));
