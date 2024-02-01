import { IconSource } from 'react-native-paper/lib/typescript/components/Icon';

export type LinkedScreen = 'Favorites' | 'Notifications';
export type ProfileItemType = {
  icon: IconSource;
  title: string;
  linkIcon?: IconSource;
  link?: LinkedScreen;
  url?: string;
};
