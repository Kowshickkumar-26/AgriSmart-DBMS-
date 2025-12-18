import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export function authRequired(req, res, next) {
  // Allow preflight OPTIONS requests to pass through
  if (req.method === "OPTIONS") {
    return res.sendStatus(204); // No Content
  }

  const authHeader = req.headers.authorization;

  // Check if header is present and starts with "Bearer "
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Authorization header missing or invalid format" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token is missing" });
  }

  try {
    // Validate and decode the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // e.g. { id, username, iat, exp }
    next(); // Move to next middleware/route
  } catch (err) {
    console.error("JWT Verification Error:", err.message);
    return res.status(401).json({
      message: "Invalid or expired token",
      error: err.message, // optional for debugging
    });
  }
}
