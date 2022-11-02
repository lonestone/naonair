import { SxProps } from "@mui/lab/node_modules/@mui/system";
import {
  Button,
  ButtonTypeMap,
  IconButton,
  Theme,
  Typography,
} from "@mui/material";
import { ButtonHTMLAttributes, ReactNode } from "react";
import theme from "../../theme";

interface ARButtonProps<T> extends ButtonHTMLAttributes<T> {
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
  type,
  disabled
}: ARButtonProps<ButtonTypeMap>) => {
  return (
    <>
      {label ? (
        <Button
          sx={style}
          variant="contained"
          color={backgroundColor}
          startIcon={icon}
          onClick={onClick}
          type={type}
          disabled={disabled}
        >
          <Typography variant="button">{label}</Typography>
        </Button>
      ) : (
        <IconButton
          sx={{ ...style, backgroundColor: "rgba(122, 88, 88, 0.1)" }}
          color={backgroundColor}
          onClick={onClick}
        >
          {icon}
        </IconButton>
      )}
    </>
  );
};

export default ARButtonIcon;
