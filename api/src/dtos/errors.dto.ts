export enum HttpErrors {
  EXISTING_CURRENT_NEWS = 'Already existing a current news',
  NEWS_CANNOT_START_IN_PAST = 'News cannot start in the past',
  NEWS_CANNOT_FINISH_IN_PAST = 'News cannot finish in the past',
  NEWS_CANNOT_START_BEFORE_END_OF_CURRENT = 'News cannot start before current news finish',
  ONLY_ONE_CURRENT_NEWS_AUTHORIZED = 'Only one current news is authorized',
  ONLY_ONE_PLANNED_NEWS_AUTHORIZED = 'Only one planned news is authorized',
  NEWS_NOT_FOUND = 'News not found',
}
