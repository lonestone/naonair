import { AppBar } from "@mui/material";
import { ReactComponent as ARLogo } from "../../assets/logo.svg";

const ARHeader = () => {
  return (
    <AppBar position="static" color="primary" sx={{ padding: "15px 18px" }}>
      <ARLogo style={{ maxHeight: "36px" }} />
    </AppBar>
  );
};

export default ARHeader;
