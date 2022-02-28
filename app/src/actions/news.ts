import { NewsDTO } from '@aireal/dtos/dist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API } from '../config.json';

const URL_ENDPOINT = `${API.baseUrl}news`;

const getSeenNewsUuids = async (): Promise<string[]> => {
  const news = (await AsyncStorage.getItem('@seen_news'))?.split('|') ?? [];
  return news;
};

const setSeenNewsUuids = async (news: string[]) => {
  await AsyncStorage.setItem('@seen_news', news.join('|'));
};

export const markNewAsSeen = async (item: NewsDTO) => {
  const seens = await getSeenNewsUuids();
  await setSeenNewsUuids([...seens, item.uuid]);
};

export const removeNew = async (uuid: string) => {
  const news = await getSeenNewsUuids();

  await setSeenNewsUuids(news.filter(n => n !== uuid));
};

export const getLast = async (): Promise<NewsDTO | undefined> => {
  const response = await fetch(URL_ENDPOINT);
  const news: NewsDTO[] = await response.json();

  // USED TO DEBUG : It wipe every items inside AsyncStorage
  // await AsyncStorage.clear();

  const viewedNewsUuid: string[] = await getSeenNewsUuids();

  let unseens: NewsDTO[] = [];

  const now = new Date();

  for (let i = 0; i < news.length; i++) {
    const item = news[i];
    const endDate = new Date(item.endDate);
    const startDate = new Date(item.startDate);
    const seen = viewedNewsUuid.includes(item.uuid);

    console.info(viewedNewsUuid, item, seen);
    if (!seen && startDate < now && now < endDate) {
      unseens.push({ ...item, endDate, startDate });
    } else if (seen && now > endDate) {
      removeNew(item.uuid);
    }
  }
  return unseens.length > 0 ? unseens[0] : undefined;
};
