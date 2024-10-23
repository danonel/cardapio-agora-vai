import { CardapioDatabase, client } from "../../db";

export class GetTables {
  static async execute() {
    const tables = await client.getAllTables();
    return tables;
  }
}
