import { Grid, SxProps, Theme } from "@mui/material";
import { useState } from "react";
import { getNews } from "../../api/news.api";
import theme from "../../theme";
import { NewsCategory } from "./../../types/dist/news.dto";
import { NewsDTO } from "./../../types/dist/news.dto";
import ARTitleBlock from "../molecules/ARTitleBlock";
import ARNewsLayout from "../organisms/ARNewsLayout";

const gridItem: SxProps<Theme> = {
  display: "grid",
  gap: theme.spacing(3),
};

export const NewsTemplate = () => {
  const [newsList, setNews] = useState<NewsDTO[]>([]);

  const fetchNews = async () => {
    setNews(await getNews());
  };

  if (newsList.length === 0) {
    fetchNews();
  }

  return (
    <>
      <ARTitleBlock />
      <Grid container spacing={10}>
        <Grid item md={6} xs={12} sx={gridItem}>
          <ARNewsLayout
            title={"Information en cours"}
            subtitle={
              "C’est l’information active et visible par les utilisateurs sur l’application"
            }
            news={newsList.find((n) => n.category === NewsCategory.Current)}
          />
        </Grid>
        <Grid item md={6} xs={12} sx={gridItem}>
          <ARNewsLayout
            title={"Information planifiée"}
            subtitle={
              "Vous pouvez prévoir la prochaine information affichée aux utilisateurs"
            }
            news={newsList.find((n) => n.category === undefined)}
          />
        </Grid>
      </Grid>
    </>
  );
};
