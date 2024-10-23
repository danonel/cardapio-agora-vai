// Cart.tsx
import React, { useMemo } from "react";
import {
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  Drawer,
  Box,
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

  const cartQuantityAmount = useMemo(
    () => cart.reduce((acc, { quantity }) => acc + quantity, 0),
    [cart]
  );

  if (!tableId) return;

  const handleOrder = () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    const orderData: OrderData = {
      tableId: tableId,
      items: cart.map(({ item, quantity }) => ({
        id: item.id, // Assuming this is the correct field for the item ID
        quantity: quantity,
      })),
    };

    OrderService.registerOrder(orderData)
      .then(() => {
        alert("Order placed successfully!"); // Notify the user of success
        handleClearCart();
      })
      .catch((error) => {
        console.error("Error placing order:", error);
        alert("Failed to place order. Please try again."); // Notify the user of the error
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
        <Box sx={{ position: "relative" }}>
          🛒
          {cartQuantityAmount > 0 && (
            <Box
              sx={{
                position: "absolute",
                bottom: -2,
                left: 15,
                color: "red",
                fontSize: "12px",
              }}
            >
              {cartQuantityAmount}
            </Box>
          )}
        </Box>
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
