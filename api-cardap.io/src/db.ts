import knex, { Knex } from "knex";
import sqlite3, { Database, OPEN_CREATE, OPEN_READONLY } from "sqlite3";
import { Table } from "./table";
import { TItem } from "./item";

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
}
