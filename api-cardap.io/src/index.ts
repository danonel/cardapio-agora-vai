import express, { Request, Response, NextFunction } from "express";
import { CardapioDatabase } from "./db";
import cors from "cors";

const app = express();
app.use(
  cors({
    allowedHeaders: "*",
  })
);
app.use(express.json());
const db = CardapioDatabase.getInstance();

// Route to get all tables
app.get("/tables", async (_, res, next) => {
  try {
    const tables = await db.getAllTables();
    res.json({ tables });
  } catch (error) {
    next(error); // Pass errors to the error handler
  }
});

// Route to get all menu items
app.get("/menu/items", async (_, res, next) => {
  try {
    const items = await db.getAllItems();
    res.json(items);
  } catch (error) {
    next(error); // Pass errors to the error handler
  }
});

// Route to create an order
app.post("/orders", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { tableId, items } = req.body;

    // Validate input
    if (
      !tableId ||
      !Array.isArray(items) ||
      items.some((item) => !item.id || !item.quantity)
    ) {
      res.status(400).json({ success: false, message: "Invalid order data." });
    }

    const orderId = await db.createOrder(tableId, items);
    res.status(201).json({ success: true, orderId });
  } catch (error) {
    next(error); // Pass errors to the error handler
  }
});

// Centralized error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Error:", err); // Log the error details
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// Start the server
const server = app.listen(3333, () => {
  console.log("running on port 3333");
});

// Graceful shutdown
const shutdown = (signal: string) => {
  console.log(`Received ${signal}. Shutting down gracefully...`);
  server.close(async () => {
    console.log("Closed all connections.");
    await db.close();
    process.exit(0);
  });

  setTimeout(() => {
    console.error("Forcing shutdown.");
    process.exit(1);
  }, 10000);
};

// Listen for termination signals
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
