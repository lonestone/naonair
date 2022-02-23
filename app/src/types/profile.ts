import { IconSource } from 'react-native-paper/lib/typescript/components/Icon';
import { StackParamList } from './routes';

export type ProfileItemType = {
  icon: IconSource;
  title: string;
  linkIcon?: IconSource;
  link?: keyof StackParamList;
  url?: string;
};
