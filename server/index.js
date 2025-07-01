import express from "express";
import dotenv from "dotenv";

import cors from "cors";
import connectDB from "./database/db.js";
import userRoute from "./routes/user.route.js";
import cookieParser from "cookie-parser";
import courseRoute from "./routes/course.route.js"
import mediaRoute from "./routes/media.route.js";
import purchaseRoute from "./routes/purchaseCourse.route.js";
import courseProgressRoute from "./routes/courseProgress.route.js";
import { stripeWebhook } from "./controllers/coursePurchase.controller.js";

dotenv.config({});
connectDB();// ... previous imports

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cookieParser());
app.use(
  cors({
    origin: ["https://learning-management-system-4-0rf2.onrender.com"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Define raw body route BEFORE express.json()
app.post(
  "/api/v1/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

// ✅ Only parse JSON AFTER webhook
app.use(express.json());

// ✅ Remaining routes
app.use("/api/v1/media", mediaRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/course", courseRoute);
app.use("/api/v1/purchase", purchaseRoute);
app.use("/api/v1/progress", courseProgressRoute);

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
