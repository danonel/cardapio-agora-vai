import { client } from "../../db";

export class CreateOrder {
  static async execute(
    tableId: string,
    items: { id: string; quantity: number }[]
  ): Promise<number> {
    // Perform any additional validation if needed
    if (
      !tableId ||
      !Array.isArray(items) ||
      items.some((item) => !item.id || !item.quantity)
    ) {
      throw new Error("Invalid order data.");
    }

    return await client.createOrder(tableId, items);
  }
}
