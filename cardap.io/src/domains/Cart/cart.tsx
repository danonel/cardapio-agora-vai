// Cart.tsx
import React from "react";
import {
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  Drawer,
} from "@mui/material";
import { useCart } from "../../providers/CartProvider";
import {
  Delete as DeleteIcon,
  Close as CloseIcon,
  Remove as RemoveIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { TItem } from "../Item/item";
import { OrderData, OrderService } from "../../services/order";
import { Button } from "@mui/base";

export const Cart: React.FC = () => {
  const {
    cart,
    removeFromCart,
    decreaseQuantity,
    addToCart,
    toggleCart,
    isOpen,
  } = useCart();

  const tableId = sessionStorage.getItem("tableId");
  if (!tableId) return;

  const handleOrder = () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    const orderData: OrderData = {
      tableId: tableId,
      items: cart.map(({ item, quantity }) => ({
        id: item.id,
        quantity: quantity,
        item: item,
      })),
    };

    OrderService.registerOrder(orderData)
      .then(() => {
        handleClearCart();
      })
      .catch((error) => {
        console.error("Error placing order:", error);
      });
  };

  const handleRemoveFromCart = (itemId: string) => {
    removeFromCart(itemId);
  };

  const handleRemoveOne = (itemId: string) => {
    decreaseQuantity(itemId);
  };

  const handleAddOne = (item: TItem) => {
    addToCart(item);
  };

  const handleClearCart = () => {
    cart.forEach(({ item }) => removeFromCart(item.id));
  };

  return (
    <>
      <IconButton onClick={toggleCart}>
        <span role="img" aria-label="cart">
          🛒
        </span>
      </IconButton>
      <Drawer anchor="right" open={isOpen} onClose={toggleCart}>
        <div
          style={{
            padding: "16px",
            width: "300px",
            height: "100%",
          }}
        >
          <IconButton onClick={toggleCart}>
            <CloseIcon />
          </IconButton>
          {cart.length === 0 ? (
            <Typography>No items in the cart</Typography>
          ) : (
            <List>
              {cart.map(({ item, quantity }) => (
                <ListItem key={item.id}>
                  <ListItemText
                    primary={item.name}
                    secondary={`$${item.price.toFixed(2)} x ${quantity}`}
                  />
                  <IconButton onClick={() => handleRemoveOne(item.id)}>
                    <RemoveIcon />
                  </IconButton>
                  <IconButton onClick={() => handleAddOne(item)}>
                    <AddIcon />
                  </IconButton>
                  <IconButton onClick={() => handleRemoveFromCart(item.id)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItem>
              ))}

              <Button
                type="button"
                color="primary"
                onClick={handleOrder}
                style={{ marginTop: 2 }}
              >
                Place Order
              </Button>
              <IconButton
                onClick={handleClearCart}
                style={{
                  marginTop: "16px",
                  backgroundColor: "red",
                  color: "white",
                  width: "100%",
                  borderRadius: "0",
                }}
              >
                <DeleteIcon />
                Clear Cart
              </IconButton>
            </List>
          )}
        </div>
      </Drawer>
    </>
  );
};
