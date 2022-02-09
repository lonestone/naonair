import { Alert, Snackbar } from "@mui/material";
import { useState } from "react";
import useSnackbar from "../../contexts/snackbar.context";

export interface ARSnackbarProps {
  open: boolean;
  message?: string;
  severity?: "success" | "error";
}

const ARSnackbarAlert = () => {
  const { snackbarProps, setSnackbarStatus } = useSnackbar();
  const handleClose = () => {
    setSnackbarStatus?.({ open: false });
  };

  return (
    <Snackbar
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      open={snackbarProps?.open}
      autoHideDuration={6000}
      onClose={handleClose}
    >
      <Alert
        variant="filled"
        onClose={handleClose}
        severity={snackbarProps?.severity}
        sx={{ width: "100%" }}
      >
        {snackbarProps?.message}
      </Alert>
    </Snackbar>
  );
};

export default ARSnackbarAlert;
