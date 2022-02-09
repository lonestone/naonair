import { Alert, Grid, Snackbar, SxProps, Theme } from "@mui/material";
import { useEffect, useState } from "react";
import { getNews } from "../../api/news.api";
import theme from "../../theme";
import { NewsCategory, NewsDTO } from "../../types/dist/news.dto.ts";
import ARTitleBlock from "../molecules/ARTitleBlock";
import ARNewsLayout from "../organisms/ARNewsLayout";

const gridItem: SxProps<Theme> = {
  display: "grid",
  gap: theme.spacing(3),
};

export interface ARSnackbarProps {
  open: boolean;
  message?: string;
  severity?: "success" | "error";
}

export const NewsTemplate = () => {
  const [newsList, setNewsList] = useState<NewsDTO[]>([]);
  const [snackbarStatus, setSnackbarStatus] = useState<ARSnackbarProps>({
    open: false,
  });

  const handleClose = () => {
    setSnackbarStatus({ open: false });
  };

  const fetchNews = async () => {
    setNewsList(await getNews());
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        open={snackbarStatus.open}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert
          variant="filled"
          onClose={handleClose}
          severity={snackbarStatus.severity}
          sx={{ width: "100%" }}
        >
          {snackbarStatus.message}
        </Alert>
      </Snackbar>
      <ARTitleBlock />
      <Grid container spacing={10}>
        <Grid item md={6} xs={12} sx={gridItem}>
          <ARNewsLayout
            title={"Information en cours"}
            subtitle={
              "C’est l’information active et visible par les utilisateurs sur l’application"
            }
            news={newsList.find((n) => n.category === NewsCategory.Current)}
            fetchNews={fetchNews}
            setSnackbarStatus={setSnackbarStatus}
          />
        </Grid>
        <Grid item md={6} xs={12} sx={gridItem}>
          <ARNewsLayout
            title={"Information planifiée"}
            subtitle={
              "Vous pouvez prévoir la prochaine information affichée aux utilisateurs"
            }
            news={newsList.find((n) => n.category === NewsCategory.Planified)}
            fetchNews={fetchNews}
            setSnackbarStatus={setSnackbarStatus}
          />
        </Grid>
      </Grid>
    </>
  );
};
