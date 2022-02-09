import axios from "axios";
import { settings } from "../settings";
import { AuthType } from "../types/auth";
import { AuthDTO } from "../types/dist/auth.dto";

export const login = async (token: AuthDTO) => {
  const res = await axios.post<AuthType>(settings.apiUrl + "/login", token);
  return res.data;
};
