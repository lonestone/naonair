export type NewsDTO = {
  uuid: string;
  type: NewsType;
  message: string;
  startDate: Date;
  endDate?: Date;
  link?: string;
  linkTitle?: string;
  displayPeriod: boolean;
};

export type CreateNewsDTO = {
  type: NewsType;
  message: string;
  startDate: Date;
  endDate?: Date;
  link?: string;
  linkTitle?: string;
  displayPeriod: boolean;
};

export enum NewsType {
  None = 'none',
  GoodPractice = 'goodPractice',
  Announcement = 'announcement',
  Info = 'info',
  Event = 'event',
  Warning = 'warning',
}
