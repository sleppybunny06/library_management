import dotenv from "dotenv";
import { createApp } from "../server/app.js";

dotenv.config();

const app = createApp({ connectOnRequest: true });

export default function handler(req: any, res: any) {
  // Vercel invokes this catch-all for /api/* requests. Keep Express routes
  // stable even if the serverless adapter passes a path without the /api prefix.
  if (typeof req.url === "string" && !req.url.startsWith("/api")) {
    req.url = `/api${req.url.startsWith("/") ? "" : "/"}${req.url}`;
  }

  return app(req, res);
}
