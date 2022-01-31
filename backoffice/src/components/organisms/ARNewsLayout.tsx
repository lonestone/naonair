import { InfoSharp } from "@mui/icons-material";
import { Grid, SxProps } from "@mui/material";
import { Theme } from "@mui/system";
import { useState, useEffect } from "react";
import request from "../../axios";
import theme from "../../theme";
import ARTitleIcon from "../atoms/ARTitleIcon";
import ARCard from "../molecules/ARCard";

const gridItem: SxProps<Theme> = {
  display: "grid",
  gap: theme.spacing(3),
};

const ARNewsLayout = () => {
  const [news, setNews] = useState();

  useEffect(() => {
    request.get(`/news`).then((res) => {
      const result = res.data;
      setNews(result);
    });
  }, []);

  return (
    <Grid container spacing={10}>
      <Grid item md={6} xs={12} sx={gridItem}>
        <ARTitleIcon
          label="Information en cours"
          icon={<InfoSharp />}
          subtitle="C’est l’information active et visible par les utilisateurs sur l’application"
        />
        <ARCard
          duration="Du 19/10/2022 au 21/10/2022"
          mainText="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam."
          linkText="Lien"
        />
      </Grid>
      <Grid item md={6} xs={12} sx={gridItem}>
        <ARTitleIcon
          label="Information planifiée"
          icon={<InfoSharp />}
          subtitle="Vous pouvez prévoir la prochaine information affichée aux utilisateurs"
        />
        <ARCard
          duration="Du 29/10/2022 au 01/11/2022"
          mainText="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam."
          linkText="Lien"
        />
      </Grid>
    </Grid>
  );
};

export default ARNewsLayout;
