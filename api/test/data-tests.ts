import { NewsType } from '@aireal/dtos/dist';

export const mockNewsToCreate = {
  type: NewsType.GoodPractice,
  message: 'Hello message',
  startDate: new Date('2023-01-25T00:00:00.000Z'),
  endDate: new Date('2023-10-06T00:00:00.000Z'),
  link: 'https://coucou.com',
  linkTitle: 'Beautiful title',
  displayPeriod: true,
};

export const createNewsDTO = {
  type: 'event',
  message: 'Hello create',
  startDate: new Date().toISOString(),
  endDate: new Date().toISOString(),
  link: 'https://coucou.com',
  linkTitle: 'Create title',
  displayPeriod: false,
};

export const updateNewsDTO = {
  type: 'warning',
  message: 'Hello create',
  startDate: '2023-01-25T00:00:00.000Z',
  endDate: '2026-10-06T00:00:00.000Z',
  link: 'https://coucou.com',
  linkTitle: 'Create title',
  displayPeriod: false,
};

export const wrongDTO = {
  type: 'qsdqsd',
  message: 'Hello create',
  startDate: 'qsdqsdqsdqsd', // wrong date
  endDate: '2023-10-06T00:00:00.000Z',
  link: 'https://coucou.com',
  linkTitle: 'Create title',
  displayPeriod: false,
};
