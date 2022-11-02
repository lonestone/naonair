import { NewsType } from "./types/news";

export const convertNewsType = (type: NewsType) => {
  switch (type) {
    case NewsType.None:
      return "Actualité";
    case NewsType.GoodPractice:
      return "Bonne pratique";
    case NewsType.Announcement:
      return "Annonce";
    case NewsType.Info:
      return "Information";
    case NewsType.Event:
      return "Évenement";
    case NewsType.Warning:
      return "Avertissement";
    default:
      return type;
  }
};
