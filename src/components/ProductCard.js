import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import React, {useState}from "react";
import "./ProductCard.css";

const ProductCard = ({ product, handleAddToCart }) => {
  return (
    <Card className="card">
      <CardMedia
        component="img"
        image={product.image}
        alt={product.name}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {product.name}
        </Typography>
        <Typography variant="h6" color="black" style={{ fontWeight: 'bold'}}>
          ${product.cost}
        </Typography>
      <Rating name="read-only" defaultValue={product.rating} precision={0.5} readOnly />
      </CardContent>
      <CardActions  className="card-action">
      <Button
        fullWidth
          className="card-button"
          variant="contained"
          size="large"
          startIcon={<AddShoppingCartOutlined />}
          onClick={handleAddToCart}
        >
         ADD TO CART
       </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
