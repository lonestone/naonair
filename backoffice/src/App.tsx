import { Container } from "@mui/material";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import ARHeader from "./components/molecules/ARHeader";
import LoginTemplate from "./components/templates/LoginTemplate";
import { NewsTemplate } from "./components/templates/NewsTemplate";
import useAuth, { AuthProvider } from "./contexts";

function App() {
  return (
    <>
      <AuthProvider>
        <ARHeader />
        <Container maxWidth="lg">
          <Routes>
            <Route element={<Layout />} path="/login">
              <Route path="/login" element={<LoginTemplate />} />
            </Route>
            <Route element={<PrivateLayout />} path="/">
              <Route path="/" element={<NewsTemplate />} />
            </Route>
          </Routes>
        </Container>
      </AuthProvider>
    </>
  );
}

export default App;

function Layout() {
  return (
    <>
      <Outlet />
    </>
  );
}

function PrivateLayout() {
  const { token } = useAuth();
  return token ? <Outlet /> : <Navigate to="/login" />;
}
