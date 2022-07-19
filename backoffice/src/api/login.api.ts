import axios from "axios";
import { settings } from "../settings";
import { AuthType } from "../types/auth";
import { AuthDTO } from "@aireal/dtos";
import request from "../axios";

export const login = async (token: AuthDTO) => {
  const res = await axios.post<AuthType>(settings.apiUrl + "/login", token);
  return res.data;
};

export const checkToken = async (): Promise<boolean> => {
  const res = await request.get<boolean>(settings.apiUrl + "/checkToken");
  return res.data;
};
