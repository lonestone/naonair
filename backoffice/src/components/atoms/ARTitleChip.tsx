import { Chip, Typography } from "@mui/material";
import { CSSProperties } from "react";
import theme from "../../theme";

const rootStyle = {
  display: "flex",
  alignItems: "baseline",
  gap: theme.spacing(1),
  marginBottom: theme.spacing(1),
};

const chipStyle: CSSProperties = {
  backgroundColor: theme.palette.primary.main,
  color: "white",
};

interface ARTitleChipProps {
  label: string;
  chip: string;
}

export const ARTitleChip = ({ label, chip }: ARTitleChipProps) => {
  return (
    <div style={rootStyle}>
      <Chip style={chipStyle} label={chip} />
      <Typography variant="h4" color="primary">
        {label}
      </Typography>
    </div>
  );
};
