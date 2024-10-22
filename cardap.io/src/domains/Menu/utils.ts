import { TItem } from "../Item/item";

export const formatPriceToBRL = (price: number): string => {
  return `R$ ${price.toFixed(2).replace(".", ",")}`;
};

export const formatItemDisplayText = (item: TItem): string => {
  const { description, price, category } = item;
  return `${description} - ${formatPriceToBRL(price)} (${category})`;
};
