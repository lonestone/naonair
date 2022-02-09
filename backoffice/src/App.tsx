import { Container } from "@mui/material";
import { Route, Routes } from "react-router-dom";
import ARHeader from "./components/molecules/ARHeader";
import ARSnackbarAlert from "./components/molecules/ARSnackbarAlert";
import LoginTemplate from "./components/templates/LoginTemplate";
import { NewsTemplate } from "./components/templates/NewsTemplate";
import { AuthProvider } from "./contexts/auth.context";
import { SnackbarProvider } from "./contexts/snackbar.context";
import Layout from "./router/layout/Layout";
import PrivateLayout from "./router/layout/PrivateLayout";
import { ARRoutes } from "./router/routes";

function App() {
  return (
    <AuthProvider>
      <SnackbarProvider>
        <ARHeader />
        <Container maxWidth="lg">
          <ARSnackbarAlert />
          <Routes>
            <Route element={<Layout />} path={ARRoutes.Login}>
              <Route path={ARRoutes.Login} element={<LoginTemplate />} />
            </Route>
            <Route element={<PrivateLayout />} path={ARRoutes.Home}>
              <Route path={ARRoutes.Home} element={<NewsTemplate />} />
            </Route>
          </Routes>
        </Container>
      </SnackbarProvider>
    </AuthProvider>
  );
}

export default App;
