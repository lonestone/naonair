import {theme} from '../theme';

export enum Forecasts {
  TODAY = 0,
  TOMORROW = 1,
}

export const ForecastColor = {
  XXBAD: theme.colors.quality.purple,
  XBAD: theme.colors.quality.darkRed,
  BAD: theme.colors.quality.red,
  DEGRADED: theme.colors.quality.yellow,
  MEDIUM: theme.colors.quality.green,
  GOOD: theme.colors.quality.cyan,
};

export type ForecastType = {
  color: string;
  hour: string;
};
