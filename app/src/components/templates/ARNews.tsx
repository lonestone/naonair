import { NewsDTO, NewsType } from '@aireal/dtos/dist';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Caption, Headline, Modal, Paragraph } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getLast, markNewAsSeen } from '../../actions/news';
import { theme } from '../../theme';
import { convertNewsType, iconNewsType } from '../../utils/news';
import { ARButton, ARButtonSize } from '../atoms/ARButton';
import { ARLink } from '../atoms/ARLink';

type NewsDialogType = {};

const styles = StyleSheet.create({
  dialog: {
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 26,
    paddingBottom: 20,
    marginHorizontal: 30,

    backgroundColor: theme.colors.white,
    flexDirection: 'row',
    alignItems: 'flex-start',
    alignContent: 'flex-start',
    justifyContent: 'flex-start',
  },

  title: {
    fontWeight: '700',
    padding: 0,
    overflow: 'hidden',
    flex: 0,
    fontSize: 20,
    lineHeight: 24,
    color: theme.colors.blue[500],
    margin: 0,
  },
  container: {
    marginLeft: 13,
    flex: 1,
  },
  dates: {
    color: theme.colors.blue[300],
  },
  content: {
    margin: 0,
  },
  paragraph: {
    fontWeight: '400',
    fontSize: 14,
    color: theme.colors.blue[500],
  },
  link: {
    marginTop: 16,
    color: theme.colors.blue[500],
  },
});

export default ({}: NewsDialogType) => {
  const [news, setNews] = useState<NewsDTO | undefined>();

  const getLastNews = useCallback(async () => {
    const lastNews = await getLast();

    setNews(lastNews);
  }, [setNews]);

  useEffect(() => {
    getLastNews();
  }, [getLastNews]);

  const title = useMemo(() => {
    if (!news) {
      return '';
    }
    if (!news.title) {
      return convertNewsType[news.type] ?? NewsType.None;
    }
    return news.title;
  }, [news]);

  return (
    <Modal visible={!!news} dismissable onDismiss={() => {}}>
      <View style={styles.dialog}>
        {news && news?.type !== NewsType.None && (
          <Icon
            name={iconNewsType[news?.type || NewsType.None]}
            size={20}
            color={theme.colors.blue[500]}
            style={{ paddingTop: 3 }}
          />
        )}
        <View style={styles.container}>
          <Headline style={styles.title}>{title}</Headline>
          <View style={styles.content}>
            {news?.displayPeriod && (
              <Caption style={styles.dates}>
                Du {news?.startDate.toLocaleDateString('fr')} au{' '}
                {news?.endDate.toLocaleDateString('fr')}
              </Caption>
            )}
            <Paragraph style={styles.paragraph}>{news?.message}</Paragraph>
            <View style={styles.link}>
              {!!news && !!news.link && !!news.linkTitle && (
                <ARLink label={news.linkTitle!} url={news.link!} />
              )}
            </View>
            <ARButton
              label="C'est noté"
              styleContainer={{ alignSelf: 'flex-end', marginTop: 18 }}
              onPress={() => {
                news && markNewAsSeen(news);
                setNews(undefined);
              }}
              size={ARButtonSize.Small}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};
