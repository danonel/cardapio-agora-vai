import express, { Request, Response, NextFunction } from "express";
import { client } from "./db";
import cors from "cors";
import { router as tableRouter } from "./modules/table/table-routes";
import { router as orderRouter } from "./modules/orders/order-routes";

const app = express();
app.use(
  cors({
    allowedHeaders: "*",
  })
);
app.use(express.json());
app.use(tableRouter);
app.use(orderRouter);

app.get("/menu/items", async (_, res, next) => {
  try {
    const items = await client.getAllItems();
    res.json(items);
  } catch (error) {
    next(error);
  }
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

const server = app.listen(3333, () => {
  console.log("running on port 3333");
});

const shutdown = (signal: string) => {
  console.log(`Received ${signal}. Shutting down gracefully...`);
  server.close(async () => {
    console.log("Closed all connections.");
    await client.close();
    process.exit(0);
  });

  setTimeout(() => {
    console.error("Forcing shutdown.");
    process.exit(1);
  }, 10000);
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
