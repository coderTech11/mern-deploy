import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { Cancel } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export default function CancelPage() {
  const navigate = useNavigate();

  const navigateToCart = () => {
    navigate("/cart");
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      gap={2}
      style={{ marginTop: "150px" }}
    >
      <Cancel style={{ color: "red", fontSize: 80 }} />
      <Typography variant="h5" color="textPrimary">
        Payment Failed !
      </Typography>
      <Typography variant="body1" color="textSecondary">
        Your payment could not be processed. Please try again.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={navigateToCart}
        style={{
          borderRadius: 20,
          padding: "10px 20px",
          textTransform: "none",
        }}
      >
        Go to Cart
      </Button>
    </Box>
  );
}
