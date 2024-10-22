import { AxiosResponse } from "axios";
import api from "./core-api";

interface OrderItem {
  item: {
    id: string;
    name: string;
    price: number; // Assuming these fields exist; modify as needed
  };
  quantity: number;
}

export interface OrderData {
  tableId: string;
  items: OrderItem[];
}

export class OrderService {
  static async registerOrder(
    data: OrderData
  ): Promise<AxiosResponse<{ success: boolean; message?: string }>> {
    return await api.post("/orders", data);
  }
}
