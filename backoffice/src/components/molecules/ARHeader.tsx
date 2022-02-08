import LogoutIcon from "@mui/icons-material/Logout";
import { AppBar, IconButton } from "@mui/material";
import { useCallback } from "react";
import { ReactComponent as ARLogo } from "../../assets/logo.svg";
import useAuth from "../../contexts";

const ARHeader = () => {
  const { removeCurrentToken } = useAuth();

  const handleLogout = useCallback(() => {
    removeCurrentToken?.();
  }, [removeCurrentToken]);

  return (
    <AppBar
      position="static"
      color="primary"
      sx={{
        padding: "15px 18px",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
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
