import { Add } from "@mui/icons-material";
import { DesktopDatePicker } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import {
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  SxProps,
  TextareaAutosize,
  TextField,
  Theme,
} from "@mui/material";
import frLocale from "date-fns/locale/fr";
import { useState } from "react";
import theme from "../../theme";
import { NewsType } from "../../types/news";
import ARButtonIcon from "../atoms/ARButton";
import { ARTitleChip } from "../atoms/ARTitleChip";

const gridItem: SxProps<Theme> = {
  display: "grid",
  gap: theme.spacing(2),
  alignContent: "start",
};

const datesDiv: SxProps<Theme> = {
  display: "flex",
};

const ARInputs = () => {
  const [startDate, setstartDate] = useState<Date | null>(new Date());
  const [endDate, setendDate] = useState<Date | null>(new Date());
  const [newsType, setnewsType] = useState<string>(NewsType.None);

  const handleChange = (event: SelectChangeEvent<typeof newsType>) => {
    setnewsType(event.target.value);
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid item md={6} xs={12} sx={gridItem}>
          <>
            <ARTitleChip label={"Type"} chip={"1"} />
            <Select
              value={newsType}
              style={{ width: 300 }}
              labelId="select-label"
              onChange={handleChange}
            >
              {Object.values(NewsType).map((option, idx) => (
                <MenuItem key={idx} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </>
        </Grid>
        <Grid item md={6} xs={12} sx={gridItem}>
          <>
            <ARTitleChip label={"Période d'affichage"} chip={"2"} />

            <LocalizationProvider
              dateAdapter={AdapterDateFns}
              locale={frLocale}
              style={datesDiv}
            >
              <DesktopDatePicker
                label="Date de début"
                value={startDate}
                minDate={new Date()}
                onChange={(date) => {
                  setstartDate(date);
                }}
                renderInput={(params) => <TextField {...params} />}
              />
              <DesktopDatePicker
                label="Date de fin"
                value={endDate}
                minDate={startDate}
                onChange={(date) => {
                  setendDate(date);
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </>
        </Grid>
        <Grid item md={6} xs={12} sx={gridItem}>
          <ARTitleChip label={"Rédigez le message"} chip={"3"} />
          <TextareaAutosize
            aria-label="Message (200 caractères maxi)"
            minRows={3}
            placeholder="Ceci est le début de votre message ..."
            style={{ width: 300 }}
          />
        </Grid>

        <Grid item md={6} xs={12} sx={gridItem}>
          <ARTitleChip label={"Ajouter un lien (optionnel)"} chip={"4"} />
          <TextField label="Lien" color="primary" focused />
          <TextField label="Titre du lien" color="primary" focused />
        </Grid>
      </Grid>
      <ARButtonIcon
        label="Créer l'information"
        icon={<Add />}
        backgroundColor="primary"
        onClick={() => console.log("hello")}
      />
    </>
  );
};

export default ARInputs;
