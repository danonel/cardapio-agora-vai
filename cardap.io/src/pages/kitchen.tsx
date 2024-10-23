import React, { useEffect, useState } from "react";
import {
  Button,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
  Paper,
} from "@mui/material";
import { OrderService, TOrderWithItems } from "../services/order";

const Kitchen: React.FC = () => {
  const [orders, setOrders] = useState<TOrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await OrderService.fetchOrdersByTableId("table1");
        setOrders(response);
      } catch {
        setError("Failed to fetch orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await OrderService.updateOrderStatus(orderId, newStatus);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch {
      setError("Failed to update order status.");
    }
  };

  if (loading) return <Typography>Loading orders...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" sx={{ marginBottom: 2 }}>
        Kitchen Orders
      </Typography>
      <List>
        {orders.map((order) => (
          <Paper key={order.id} elevation={3} sx={{ marginBottom: 2 }}>
            <ListItem
              sx={{ display: "flex", flexDirection: "column" }}
              secondaryAction={
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => updateOrderStatus(order.id, "preparing")}
                  >
                    Preparing
                  </Button>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => updateOrderStatus(order.id, "done")}
                  >
                    Done
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => updateOrderStatus(order.id, "canceled")}
                  >
                    Cancel
                  </Button>
                </Box>
              }
            >
              <ListItemText
                primary={`Table ${order.tableId}`}
                secondary={`Status: ${order.status}`}
              />
              <Divider sx={{ margin: "8px 0" }} />
              <Box sx={{ marginTop: 1 }}>
                <Typography variant="subtitle1">Order Items:</Typography>
                <List>
                  {order.items.map((item) => (
                    <ListItem key={item.id}>
                      <ListItemText
                        primary={item.name}
                        secondary={`Quantity: ${
                          item.quantity
                        }, Price: $${item.price.toFixed(2)}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </ListItem>
          </Paper>
        ))}
      </List>
    </Box>
  );
};

export default Kitchen;
