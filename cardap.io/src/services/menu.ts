import { AxiosResponse } from "axios";
import api from "./core-api";
import { TItem } from "../domains/Item/item";

export class Menu {
  static async getAllItems(): Promise<AxiosResponse<TItem[]>> {
    return await api.get("menu/items");
  }
}
