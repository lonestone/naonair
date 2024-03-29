import { Icon, Typography } from "@mui/material";
import { CSSProperties, ReactNode } from "react";
import theme from "../../theme";

const iconStyle: CSSProperties = {
  backgroundColor: "#F1F0F9",
  borderRadius: "20px",
  height: "40px",
  width: "40px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

interface Props {
  label: string;
  icon?: ReactNode;
  isNewsTitle?: boolean;
  subtitle?: string;
  marginBottom?: string;
}

const ARTitleIcon = ({
  label,
  icon,
  isNewsTitle,
  subtitle,
  marginBottom,
}: Props) => {
  return (
    <div
      style={{
        display: "flex",
        gap: theme.spacing(2),
        marginBottom,
      }}
    >
      <Icon color="primary" style={!isNewsTitle ? iconStyle : undefined}>
        {icon}
      </Icon>
      <div>
        <Typography variant="h3" color="primary">
          {label}
        </Typography>
        <Typography variant="body1" color="primary.light">
          {subtitle}
        </Typography>
      </div>
    </div>
  );
};

export default ARTitleIcon;
