import axios from "axios";
import { settings } from "../settings";
import { AuthDTO } from "../types/dist/auth.dto";

export const login = async (token: AuthDTO) => {
  const res = await axios.post<{access_token: string}>(settings.apiUrl + "/login", token);
  return res.data;
};
