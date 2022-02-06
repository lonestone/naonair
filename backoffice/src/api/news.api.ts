import axios from "axios";
import { settings } from "../settings";
import { CreateNewsDTO, UpdateNewsDTO } from "../types/dist/news.dto";

export const getNews = async () => {
  const res = await axios.get(settings.apiUrl + "/news");
  return res.data;
};

export const createNews = async (news: CreateNewsDTO) => {
  const res = await axios.post(settings.apiUrl + "/news", news);
  return res.data;
};

export const postNews = async (news: UpdateNewsDTO) => {
  const res = await await axios.patch(
    settings.apiUrl + "/news/" + news.id,
    news,
  );
  return res.data;
};

export const removeNews = async (id: string) => {
  const res = await axios.delete(settings.apiUrl + "/news/" + id);
  return res.data;
};
