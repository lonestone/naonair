import {
  Card,
  FormControl,
  SxProps,
  TextField,
  Typography,
} from "@mui/material";
import { Theme } from "@mui/system";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../api/login.api";
import useAuth from "../../contexts/auth.context";
import useSnackbar from "../../contexts/snackbar.context";
import ARButtonIcon from "../atoms/ARButton";

const cardStyle: SxProps<Theme> = {
  border: 1,
  borderColor: "primary.100",
  minWidth: 400,
  padding: "20px",
  boxShadow: "none",
};

const ARLoginLayout = () => {
  const [password, setPassword] = useState("");
  const { token, setCurrentToken } = useAuth();
  const navigate = useNavigate();
  const {setSnackbarStatus} = useSnackbar();

  const handleSubmit = async () => {
    try {
      const res = await login({ token: password });
      setCurrentToken?.(res.access_token);
    } catch (error) {
      if ((error as AxiosError)?.response?.status === 500) {
        setSnackbarStatus?.({
          open: true,
          message:
            "Une erreur serveur s'est produite, veuillez réessayer plus tard",
          severity: "error",
        });
      } else if ((error as AxiosError)?.response?.status === 401) {
        setSnackbarStatus?.({
          open: true,
          message:  "Mot de passe incorrect",
          severity: "error",
        });
      }
      else {
        setSnackbarStatus?.({
          open: true,
          message: (error as AxiosError)?.message,
          severity: "error",
        });
      }
    }
    
   
  };

  useEffect(() => {
    if (token) {
      navigate("/", { replace: true });
    }
  }, [token]);

  return (
    <Card sx={cardStyle}>
      <FormControl sx={{ display: "grid", gap: 2 }}>
        <Typography variant="h3" color="primary">
          Se connecter
        </Typography>
        <TextField
          label="Mot de passe "
          color="primary"
          focused
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <ARButtonIcon
          type="submit"
          label={"Valider"}
          backgroundColor="primary"
          onClick={handleSubmit}
        />
      </FormControl>
    </Card>
  );
};

export default ARLoginLayout;
