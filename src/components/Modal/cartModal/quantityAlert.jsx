import React from "react";
import { Modal, Typography, Box, Button } from "@mui/material";

const QuantityAlertModal = ({ open, handleClose }) => {
  const handleOKClick = () => {
    handleClose();
  };
  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" component="div" gutterBottom>
          Not enough products in stock to choose more
        </Typography>
        <Button onClick={handleOKClick} color="primary" variant="contained">
          OK
        </Button>
      </Box>
    </Modal>
  );
};

export default QuantityAlertModal;
