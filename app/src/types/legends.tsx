import {theme} from '../theme';

export interface LegendItem {
  label: string;
  color: string;
  labelColor: string;
}

export const legendItems: LegendItem[] = [
  {
    label: 'extrêm. mauvais',
    color: theme.colors.quality.purple,
    labelColor: '#FEF0FF',
  },
  {
    label: 'très mauvais',
    color: theme.colors.quality.darkRed,
    labelColor: '#FFEAF4',
  },
  {
    label: 'mauvais',
    color: theme.colors.quality.red,
    labelColor: '#FFEBEB',
  },
  {
    label: 'dégradé',
    color: theme.colors.quality.yellow,
    labelColor: '#8D8500',
  },
  {
    label: 'moyen',
    color: theme.colors.quality.green,
    labelColor: '#E9FAF5',
  },
  {
    label: 'bon',
    color: theme.colors.quality.cyan,
    labelColor: '#EEFFFE',
  },
];
