import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { CheckCircle } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export default function SuccessPage() {
  const navigate = useNavigate();

  const navigateToCart = () => {
    navigate("/purchases");
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
      <CheckCircle style={{ color: "green", fontSize: 80 }} />
      <Typography variant="h5" color="textPrimary">
        Payment Successful !
      </Typography>
      <Typography variant="body1" color="textSecondary">
        You have successfully purchased the products.
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
        Go to Purchases
      </Button>
    </Box>
  );
}
