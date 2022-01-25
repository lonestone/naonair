import { Today } from "@mui/icons-material";
import { Icon, Typography } from "@mui/material";

interface Props {
  label: string;
}

const ARTitleIcon = ({ label }: Props) => {
  return (
    <div style={{ display: "flex", gap: "15px" }}>
      <Icon color="primary">
        <Today />
      </Icon>
      <Typography variant="h2" color="primary">
        {label}
      </Typography>
    </div>
  );
};

export default ARTitleIcon;
