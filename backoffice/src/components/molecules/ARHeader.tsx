import LogoutIcon from "@mui/icons-material/Logout";
import { SxProps } from "@mui/lab/node_modules/@mui/system";
import { AppBar, IconButton } from "@mui/material";
import { Theme } from "@mui/system";
import { useCallback } from "react";
import { ReactComponent as ARLogo } from "../../assets/logo.svg";
import useAuth from "../../contexts/auth.context";

const logoStyle: SxProps<Theme> = {
  padding: "15px 18px",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
};

const ARHeader = () => {
  const { removeCurrentToken } = useAuth();

  const handleLogout = useCallback(() => {
    removeCurrentToken?.();
  }, [removeCurrentToken]);

  return (
    <AppBar position="static" color="primary" sx={logoStyle}>
      <ARLogo style={{ width: "125px", height: "36px" }} />
      <IconButton
        aria-details="Déconnexion"
        color="inherit"
        onClick={handleLogout}
        sx={{ width: 20, height: 20 }}
      >
        <LogoutIcon />
      </IconButton>
    </AppBar>
  );
};

export default ARHeader;
