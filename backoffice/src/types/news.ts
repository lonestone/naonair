export enum NewsType {
  None = "none",
  GoodPractice = "goodPractice",
  Announcement = "announcement",
  Info = "info",
  Event = "event",
  Warning = "warning",
}

export const convertNewsType = {
  none: "Actualité",
  goodPractice: "Bonne pratique",
  announcement: "Annonce",
  info: "Information",
  event: "Évenement",
  warning: "Avertissement",
};
