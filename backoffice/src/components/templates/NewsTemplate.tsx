import { NewsDTO } from "@aireal/dtos";
import { Grid, SxProps, Theme } from "@mui/material";
import { useEffect, useState } from "react";
import { getNews } from "../../api/news.api";
import theme from "../../theme";
import ARTitleBlock from "../molecules/ARTitleBlock";
import ARNewsLayout from "../organisms/ARNewsLayout";

const gridItem: SxProps<Theme> = {
  display: "grid",
  gap: theme.spacing(3),
};

export const NewsTemplate = () => {
  const [newsList, setNewsList] = useState<NewsDTO[]>([]);

  const fetchNews = async () => {
    setNewsList(await getNews());
  };

  useEffect(() => {
    fetchNews();
  }, []);

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
            news={newsList.find((n) => n.isCurrent)}
            fetchNews={fetchNews}
          />
        </Grid>
        <Grid item md={6} xs={12} sx={gridItem}>
          <ARNewsLayout
            title={"Information planifiée"}
            subtitle={
              "Vous pouvez prévoir la prochaine information affichée aux utilisateurs"
            }
            news={newsList.find((n) => !n.isCurrent)}
            fetchNews={fetchNews}
          />
        </Grid>
      </Grid>
    </>
  );
};
