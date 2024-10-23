import { AxiosResponse } from "axios";
import api from "./core-api";

interface Table {
  id: string;
  members: string[];
}

export class Tables {
  static async getAllTables(): Promise<AxiosResponse<{ tables: Table[] }>> {
    return await api.get("/tables");
  }

  static async updateTableMembers(
    tableId: string,
    members: string[]
  ): Promise<AxiosResponse<{ message: string }>> {
    return await api.post(`/tables/${tableId}/members`, { members });
  }
}
