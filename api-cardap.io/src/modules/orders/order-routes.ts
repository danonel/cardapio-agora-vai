// Update order status

import { Router } from "express";
import { UpdateOrderStatus } from "./update-order-status";
import { EOrderStatus } from "./order";
import { OrderByTableId } from "./order-by-tableid";
import { client } from "../../db";
import { CreateOrder } from "./create-order";

export const router = Router();

router.get("/orders/:tableId", async (req, res, next) => {
  const { tableId } = req.params;

  try {
    const orders = await OrderByTableId.execute(tableId);
    res.json(orders);
  } catch (error) {
    next(error);
  }
});

router.post("/orders/:orderId/status", async (req, res, next) => {
  const { orderId } = req.params;
  const { status } = req.body;

  if (!status) {
    res.status(400).json({
      message: "Status is required",
    });
    return;
  }

  if (!Object.values(EOrderStatus).includes(status)) {
    res.status(400).json({
      message: `Invalid status: ${status}. Valid statuses are: ${Object.values(
        EOrderStatus
      ).join(", ")}`,
    });
    return;
  }
  try {
    const updateOrderStatus = UpdateOrderStatus.execute;
    await updateOrderStatus(Number(orderId), status);
    res.status(200).json({ message: "Order status updated successfully" });
  } catch (error) {
    next(error);
  }
});

router.post("/orders", async (req, res, next) => {
  const { tableId, items } = req.body;
  const createOrder = CreateOrder.execute;

  try {
    if (
      !tableId ||
      !Array.isArray(items) ||
      items.some((item) => !item.id || !item.quantity)
    ) {
      res.status(400).json({ success: false, message: "Invalid order data." });
    }

    const orderId = await createOrder(tableId, items);
    res.status(201).json({ success: true, orderId });
  } catch (error) {
    next(error);
  }
});
