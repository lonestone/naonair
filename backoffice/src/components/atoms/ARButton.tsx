import { SxProps } from "@mui/lab/node_modules/@mui/system";
import { Button, IconButton, Theme, Typography } from "@mui/material";
import { ReactNode } from "react";
import theme from "../../theme";

interface ARButtonProps {
  label?: string;
  icon?: ReactNode;
  backgroundColor?: "primary" | "error";
  onClick: () => void;
}

const style: SxProps<Theme> = {
  padding: theme.spacing(2),
  borderRadius: "24px",
  marginTop: theme.spacing(2),
};

const ARButtonIcon = ({
  label,
  icon,
  backgroundColor,
  onClick,
}: ARButtonProps) => {
  return (
    <>
      {label ? (
        <Button
          sx={style}
          variant="contained"
          color={backgroundColor}
          startIcon={icon}
          onClick={onClick}
        >
          <Typography variant="button">{label}</Typography>
        </Button>
      ) : (
        <IconButton
          sx={{ ...style, backgroundColor: "rgba(122, 88, 88, 0.1)" }}
          color={backgroundColor}
        >
          {icon}
        </IconButton>
      )}
    </>
  );
};

export default ARButtonIcon;
