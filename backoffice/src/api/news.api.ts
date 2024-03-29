import request from "../axios";
import { settings } from "../settings";
import { CreateNewsDTO, NewsDTO, UpdateNewsDTO } from "@aireal/dtos";
import { AxiosResponse } from "axios";

export const getNews = async () => {
  const res: AxiosResponse = await request.get(settings.apiUrl + "/news");
  return res.data;
};

export const getNewsByUUID = async (uuid: string) => {
  const res: AxiosResponse = await request.get<NewsDTO>(
    settings.apiUrl + `/news/${uuid}`,
  );
  return res.data;
};

export const createNews = async (news: CreateNewsDTO) => {
  const res: AxiosResponse = await request.post(
    settings.apiUrl + "/news",
    news,
  );
  return res.data;
};

export const updateNews = async (news: UpdateNewsDTO) => {
  const res: AxiosResponse = await await request.patch(
    settings.apiUrl + "/news/" + news.uuid,
    news,
  );
  return res.data;
};

export const removeNews = async (id: string) => {
  const res: AxiosResponse = await request.delete(
    settings.apiUrl + "/news/" + id,
  );
  return res.data;
};
