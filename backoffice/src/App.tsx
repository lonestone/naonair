import { Container } from "@mui/material";
import ARHeader from "./components/molecules/ARHeader";
import ARTitleBlock from "./components/molecules/ARTitleBlock";
import ARNewsLayout from "./components/organisms/ARNewsLayout";
import { NewsTemplate } from "./components/templates/NewsTemplate";

function App() {
  return (
    <>
      <ARHeader />
      <Container maxWidth="lg">
        <NewsTemplate />
      </Container>
    </>
  );
}

export default App;

/* <Typography variant="h2" color="primary.main">
Responsive h2
</Typography>
<ARButtonIcon label="Créer" icon={<Add />} backgroundColor="primary" />
<Typography variant="h2" color="primary.light">
Responsive h2
</Typography>
<Typography variant="h3" color="primary.main">
tewtx h2
</Typography>
<Typography variant="body1" color="primary.light">
tewtx h2
</Typography> */
