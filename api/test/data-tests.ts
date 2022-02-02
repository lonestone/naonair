export const newsDTO = {
  type: 'none',
  message: 'Hello message',
  startDate: '2023-01-25',
  endDate: '2023-10-06',
  link: 'https://coucou.com',
  linkTitle: 'Beautiful title',
  displayPeriod: true,
};

export const createNewsDTO = {
  type: 'event',
  message: 'Hello create',
  startDate: '2040-01-25',
  endDate: '2040-10-06',
  link: 'https://coucou.com',
  linkTitle: 'Create title',
  displayPeriod: false,
};

export const updateNewsDTO = {
  type: 'warning',
  message: 'Hello create',
  startDate: '2023-01-25',
  endDate: '2026-10-06',
  link: 'https://coucou.com',
  linkTitle: 'Create title',
  displayPeriod: false,
};

export const wrongDTO = {
  type: 'qsdqsd',
  message: 'Hello create',
  startDate: 'qsdqsdqsdqsd', // wrong date
  endDate: '2023-10-06',
  link: 'https://coucou.com',
  linkTitle: 'Create title',
  displayPeriod: false,
};
