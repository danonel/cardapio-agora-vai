import { client } from "../../db";

export class OrderByTableId {
  static async execute(tableId: string) {
    return await client.getOrdersByTableId(tableId);
  }
}
