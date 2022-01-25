import { Card } from "@mui/material";
import ARTitleIcon from "../atoms/ARTitleIcon";

const ARCard = () => {
  return (
    <Card
      sx={{ borderColor: "primary.100", maxWidth: "600px", padding: "20px" }}
    >
      <ARTitleIcon label="Titre" />
    </Card>
  );
};

export default ARCard;
