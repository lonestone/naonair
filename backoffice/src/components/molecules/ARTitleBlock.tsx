import { Typography } from "@mui/material";
import theme from "../../theme";

const ARTitleBlock = () => {
  return (
    <div style={{ margin: theme.spacing(10, 0, 8) }}>
      <Typography variant="h1" color="primary.main">
        Gestion des informations
      </Typography>
      <Typography variant="body1" color="primary.main">
        Vous pouvez grâce à cette interface gérer les informations publiées sur
        l’application
      </Typography>
    </div>
  );
};

export default ARTitleBlock;
