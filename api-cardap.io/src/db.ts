import knex, { Knex } from "knex";
import sqlite3 from "sqlite3";
import { Table } from "./table";
import { TItem } from "./item";
import { EOrderStatus, TOrder, TOrderWithItems } from "./modules/orders/order";

sqlite3.verbose();

const dbConfig = {
  client: "sqlite3",
  connection: {
    filename: "cardapio.db",
  },
  useNullAsDefault: true,
};

const db = knex(dbConfig);

export class CardapioDatabase {
  private static instance: CardapioDatabase | null = null;
  private client: knex.Knex;

  private constructor() {
    this.client = db;
  }

  async close() {
    await this.client.destroy();
  }

  async updateTableMembers(tableId: string, members: string[]): Promise<void> {
    const existingTable = await this.client("tables")
      .where({ id: tableId })
      .first();
    if (!existingTable) {
      throw new Error("Table not found");
    }

    await this.client("tables")
      .where({ id: tableId })
      .update({ members: JSON.stringify(members) });
  }

  static getInstance(): CardapioDatabase {
    if (!CardapioDatabase.instance) {
      CardapioDatabase.instance = new CardapioDatabase();
    }
    return CardapioDatabase.instance;
  }

  async getAllTables(): Promise<Table[]> {
    const rows = await this.client("tables").select("*");

    return rows.map((row): Table => {
      const parsedMembers = JSON.parse(row.members) as string[];
      return {
        id: row.id,
        members: parsedMembers,
      };
    });
  }

  async getAllItems(): Promise<TItem[]> {
    const rows = await this.client("items").select("*");

    return rows.map(
      (row): TItem => ({
        id: row.id,
        name: row.name,
        description: row.description,
        imageUrl: row.imageUrl,
        price: row.price,
        category: row.category,
      })
    );
  }

  async createOrder(
    tableId: string,
    items: { id: string; quantity: number }[]
  ): Promise<number> {
    const trx = await this.client.transaction();

    try {
      const [orderId] = await trx("orders")
        .insert({ table_id: tableId })
        .returning("id");

      const orderItems = items.map((item) => {
        if (!item.id || !item.quantity) {
          throw new Error(`Invalid item data: ${JSON.stringify(item)}`);
        }
        return {
          order_id: orderId,
          item_id: item.id,
          quantity: item.quantity,
        };
      });

      await trx("order_items").insert(orderItems);
      await trx.commit();

      return orderId;
    } catch (error) {
      await trx.rollback();
      throw error;
    }
  }

  async getOrdersByTableId(tableId: string): Promise<TOrderWithItems[]> {
    const orders = await this.client("orders")
      .where({ table_id: tableId })
      .select("*");

    if (!orders) {
      return [];
    }

    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const items = await this.client("order_items")
          .where({ order_id: order.id })
          .join("items", "order_items.item_id", "=", "items.id")
          .select(
            "items.id",
            "items.name",
            "order_items.quantity",
            "items.price"
          );

        return {
          id: order.id,
          tableId: order.table_id,
          status: order.status,
          createdAt: order.created_at,
          items, // Include items related to this order
        };
      })
    );

    return ordersWithItems;
  }

  async updateOrderStatus(
    orderId: number,
    newStatus: EOrderStatus
  ): Promise<void> {
    const validStatuses = Object.values(EOrderStatus);
    if (!validStatuses.includes(newStatus)) {
      throw new Error(
        `Invalid status: ${newStatus}. Valid statuses are: ${validStatuses.join(
          ", "
        )}`
      );
    }

    const updatedRows = await this.client("orders")
      .where({ id: orderId })
      .update({ status: newStatus });

    if (updatedRows === 0) {
      throw new Error("Order not found or no change made");
    }
  }
}

export const client = CardapioDatabase.getInstance();
