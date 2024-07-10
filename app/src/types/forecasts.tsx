import { theme } from '@theme';

export enum Forecasts {
  TODAY = 0,
  TOMORROW = 1,
}

export const ForecastColor = {
  XXBAD: theme.colors.quality.main.purple,
  XBAD: theme.colors.quality.main.darkRed,
  BAD: theme.colors.quality.main.red,
  DEGRADED: theme.colors.quality.main.yellow,
  MEDIUM: theme.colors.quality.main.green,
  GOOD: theme.colors.quality.main.cyan,
};

export type ForecastType = {
  color: string;
  hour: Date;
};
