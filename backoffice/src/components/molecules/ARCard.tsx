import { Delete, Edit, Today } from "@mui/icons-material";
import { Card, Link, SxProps, Typography } from "@mui/material";
import { Theme } from "@mui/system";
import theme from "../../theme";
import ARButtonIcon from "../atoms/ARButtonIcon";
import ARTitleIcon from "../atoms/ARTitleIcon";

const cardStyle: SxProps<Theme> = {
  border: 1,
  borderColor: "primary.100",
  maxWidth: 600,
  minHeight: 190,
  padding: "20px",
  boxShadow: "none",
};

interface Props {
  duration: string;
  mainText: string;
  linkText: string;
}

// Change to newsDetails
const ARCard = ({ duration, mainText, linkText }: Props) => {
  return (
    <>
      <Card sx={cardStyle}>
        <ARTitleIcon label="Titre de linfo" icon={<Today />} isNewsTitle />
        <div style={{ display: "grid", gap: theme.spacing(2) }}>
          <Typography variant="body1" color="primary.light">
            {duration}
          </Typography>
          <Typography variant="body1" color="primary">
            {mainText}
          </Typography>
          <Link
            variant="body1"
            color="primary"
            underline="always"
            sx={{ cursor: "pointer" }}
            onClick={() => {
              console.info("I'm a button.");
            }}
          >
            {linkText}
          </Link>
        </div>
      </Card>
      <div style={{ display: "flex", gap: 15 }}>
        <ARButtonIcon
          label="Modifier"
          icon={<Edit />}
          backgroundColor="primary"
        />
        <ARButtonIcon icon={<Delete />} backgroundColor="error" />
      </div>
    </>
  );
};

export default ARCard;
