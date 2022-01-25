import { Add, Delete, Edit } from "@mui/icons-material";
import { Typography } from "@mui/material";
import ARButtonIcon from "./components/atoms/ARButtonIcon";
import ARCard from "./components/molecules/ARCard";
import ARHeader from "./components/molecules/ARHeader";

function App() {
  return (
    <div>
      <ARHeader />
      <ARCard />
      <ARButtonIcon label="Créer" icon={<Add />} backgroundColor="primary" />
      <ARButtonIcon icon={<Delete />} backgroundColor="error" />
      <ARButtonIcon
        label="Modifier"
        icon={<Edit />}
        backgroundColor="primary"
      />
      <Typography variant="h1" color="primary.main">
        Responsive h1
      </Typography>
      <Typography variant="h2" color="primary.main">
        Responsive h2
      </Typography>
      <Typography variant="h2" color="primary.light">
        Responsive h2
      </Typography>
      <Typography variant="h3" color="primary.main">
        tewtx h2
      </Typography>
      <Typography variant="body1" color="primary.light">
        tewtx h2
      </Typography>
    </div>
  );
}

export default App;
