import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { connectDatabase } from "./config/db.js";
import { ensureProductsSeeded } from "./lib/ensureProductsSeeded.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "API is running",
  });
});

app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use(notFound);
app.use(errorHandler);

connectDatabase()
  .then(async () => {
    const seeded = await ensureProductsSeeded();

    if (seeded) {
      console.log("Default products inserted");
    }

    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start server", error);
    process.exit(1);
  });
