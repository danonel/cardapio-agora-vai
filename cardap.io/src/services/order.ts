import { AxiosResponse } from "axios";
import api from "./core-api";

export interface OrderItem {
  id: string; // Item ID
  name: string; // Item name
  price: number; // Item price
  quantity: number; // Quantity ordered
}

export interface Order {
  id: string; // Order ID as a string
  tableId: string; // Table ID
  items: OrderItem[]; // List of items in the order
  status: string; // Order status (e.g., 'new', 'preparing', etc.)
}

export interface OrderData {
  tableId: string; // Table ID for the order
  items: { id: string; quantity: number }[]; // Items with ID and quantity
}

// types/order.ts

export interface TOrderItem {
  id: string; // Assuming this is the item ID
  name: string;
  price: number; // Assuming this is the item's price
  quantity: number; // Quantity ordered
}

export interface TOrderWithItems {
  id: string; // Order ID
  tableId: string; // ID of the table
  status: string; // e.g., 'new', 'preparing', etc.
  createdAt: string; // Order creation timestamp
  items: TOrderItem[]; // List of items associated with the order
}

export class OrderService {
  static async registerOrder(
    data: OrderData
  ): Promise<AxiosResponse<{ success: boolean; message?: string }>> {
    return await api.post("/orders", data);
  }

  static async fetchOrdersByTableId(
    tableId: string
  ): Promise<TOrderWithItems[]> {
    const response = await api.get<TOrderWithItems[]>(`/orders/${tableId}`);
    return response.data;
  }

  static async updateOrderStatus(
    orderId: string, // Change to string if orderId is a string
    newStatus: string
  ): Promise<void> {
    await api.post(`/orders/${orderId}/status`, { status: newStatus });
  }
}
