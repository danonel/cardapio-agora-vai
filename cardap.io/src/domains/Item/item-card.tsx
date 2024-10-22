import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
} from "@mui/material";
import React from "react";
import { TItem } from "./item";
import { formatPriceToBRL, formatItemDisplayText } from "../Menu/utils";
import { useCart } from "../../providers/CartProvider";

export const ItemCard: React.FC<TItem> = (data) => {
  const { imageUrl, name, price } = data;
  const { addToCart } = useCart();
  const handleAddToCart = () => {
    addToCart(data);
  };
  return (
    <Card
      variant="outlined"
      sx={{ borderRadius: 3, display: "flex", marginBottom: 2 }}
    >
      <CardMedia
        component="img"
        height="100"
        image={imageUrl}
        alt={name}
        sx={{ objectFit: "cover", maxWidth: 130 }}
      />
      <CardContent>
        <Typography variant="h6" component="div" gutterBottom>
          {name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {formatItemDisplayText(data)}{" "}
        </Typography>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mt={2}
        >
          <Typography color="primary">{formatPriceToBRL(price)}</Typography>
          <Button onClick={handleAddToCart} variant="contained" color="primary">
            Add to Order
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};
