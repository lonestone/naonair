import { theme } from '../theme';

export enum Forecasts {
  TODAY = 0,
  TOMORROW = 1,
}

export const ForecastColor = {
  XXBAD: theme.colors.quality.primary.purple,
  XBAD: theme.colors.quality.primary.darkRed,
  BAD: theme.colors.quality.primary.red,
  DEGRADED: theme.colors.quality.primary.yellow,
  MEDIUM: theme.colors.quality.primary.green,
  GOOD: theme.colors.quality.primary.cyan,
};

export type ForecastType = {
  color: string;
  hour: Date;
};
