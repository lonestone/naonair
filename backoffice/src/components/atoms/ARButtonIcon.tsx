import { Button, IconButton, Typography } from "@mui/material";
import { ReactNode } from "react";

interface Props {
  label?: string;
  icon: ReactNode;
  backgroundColor?: "primary" | "error";
}

const ARButtonIcon = ({ label, icon, backgroundColor }: Props) => {
  return (
    <>
      {label ? (
        <Button
          variant="contained"
          color={backgroundColor}
          startIcon={icon}
          sx={{ borderRadius: "15px" }}
        >
          <Typography variant="button">{label}</Typography>
        </Button>
      ) : (
        <IconButton
          color={backgroundColor}
          sx={{
            borderRadius: "14px",
            backgroundColor: "rgba(255, 80, 80, 0.1)",
          }}
        >
          {icon}
        </IconButton>
      )}
    </>
  );
};

export default ARButtonIcon;
