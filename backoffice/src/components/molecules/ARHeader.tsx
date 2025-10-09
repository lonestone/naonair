import HomeIcon from "@mui/icons-material/Home";
import LogoutIcon from "@mui/icons-material/Logout";
import QrCodeIcon from "@mui/icons-material/QrCode";
import { SxProps } from "@mui/lab/node_modules/@mui/system";
import { AppBar, Box, Button, IconButton } from "@mui/material";
import { Theme } from "@mui/system";
import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ReactComponent as ARLogo } from "../../assets/logo-small.svg";
import useAuth from "../../contexts/auth.context";
import { ARRoutes } from "../../router/routes";

const logoStyle: SxProps<Theme> = {
  padding: "15px 18px",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
};

const ARHeader = () => {
  const { token, removeCurrentToken } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = useCallback(() => {
    removeCurrentToken?.();
  }, [removeCurrentToken]);

  const handleNavigation = (route: string) => {
    navigate(route);
  };

  return (
    <AppBar position="static" color="primary" sx={logoStyle}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <ARLogo style={{ width: "125px", height: "36px" }} />
        {token && (
          <Box sx={{ display: 'flex', ml: 3 }}>
            <Button
              color="inherit"
              startIcon={<HomeIcon />}
              onClick={() => handleNavigation(ARRoutes.Home)}
              variant={location.pathname === ARRoutes.Home ? "outlined" : "text"}
              sx={{ mr: 1, color: 'white', borderColor: 'white' }}
            >
              Actualités
            </Button>
            <Button
              color="inherit"
              startIcon={<QrCodeIcon />}
              onClick={() => handleNavigation(ARRoutes.QRCodes)}
              variant={location.pathname === ARRoutes.QRCodes ? "outlined" : "text"}
              sx={{ color: 'white', borderColor: 'white' }}
            >
              QR Codes
            </Button>
          </Box>
        )}
      </Box>
      {token && (
        <IconButton
          aria-details="Déconnexion"
          color="inherit"
          onClick={handleLogout}
          sx={{ width: 20, height: 20 }}
        >
          <LogoutIcon />
        </IconButton>
      )}
    </AppBar>
  );
};

export default ARHeader;
