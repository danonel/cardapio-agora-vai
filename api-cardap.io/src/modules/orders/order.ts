export enum EOrderStatus {
  NEW = "new",
  CANCELED = "canceled",
  PREPARING = "preparing",
  DONE = "done",
}

export type TOrder = {
  id: number;
  tableId: string;
  status: EOrderStatus;
  createdAt: Date;
};

export type TOrderItem = {
  id: string; // Item ID
  name: string; // Item name
  quantity: number; // Quantity ordered
  price: number; // Price of the item
};

export type TOrderWithItems = {
  id: string; // Order ID
  tableId: string; // Table ID
  status: string; // Order status (e.g., 'new', 'canceled', etc.)
  createdAt: string; // Creation timestamp
  items: TOrderItem[]; // Array of items associated with the order
};
