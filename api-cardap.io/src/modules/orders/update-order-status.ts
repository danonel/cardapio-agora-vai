import { CardapioDatabase, client } from "../../db";
import { EOrderStatus } from "./order";

export class UpdateOrderStatus {
  static async execute(orderId: number, status: EOrderStatus) {
    await client.updateOrderStatus(orderId, status);
  }
}
