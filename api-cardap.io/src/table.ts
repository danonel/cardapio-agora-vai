import { randomUUID } from "crypto";

export class Table {
  id: string;
  members: string[];

  constructor() {
    this.id = randomUUID();
    this.members = [];
  }
}
