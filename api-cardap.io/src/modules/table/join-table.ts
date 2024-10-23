import { client } from "../../db";

export class JoinTable {
  static async execute(members: string[], tableId: string) {
    if (!members || !Array.isArray(members)) {
      throw new Error("Invalid members data");
    }

    await client.updateTableMembers(tableId, members);
  }
}
