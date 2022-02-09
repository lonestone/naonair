import { Add, Edit } from "@mui/icons-material";
import { DesktopDatePicker } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  MenuItem,
  Select,
  SxProps,
  TextareaAutosize,
  TextField,
  Theme,
  Typography,
} from "@mui/material";
import frLocale from "date-fns/locale/fr";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { createNews, updateNews } from "../../api/news.api";
import theme from "../../theme";
import {
  CreateNewsDTO,
  NewsDTO,
  UpdateNewsDTO,
} from "../../types/dist/news.dto";
import ARButtonIcon from "../atoms/ARButton";
import { ARTitleChip } from "../atoms/ARTitleChip";
import { ARSnackbarProps } from "../templates/NewsTemplate";
import { NewsType } from "./../../types/news";

const gridItem: SxProps<Theme> = {
  display: "grid",
  gap: theme.spacing(2),
  alignContent: "start",
};

const datesDiv: SxProps<Theme> = {
  display: "flex",
};

interface Props {
  news?: NewsDTO;
  setOpenModal: Dispatch<SetStateAction<boolean>>;
  fetchNews: () => Promise<void>;
  setSnackbarStatus: Dispatch<SetStateAction<ARSnackbarProps>>;
}

const ARInputs = ({
  news,
  setOpenModal,
  fetchNews,
  setSnackbarStatus,
}: Props) => {
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [displayPeriod, setDisplayPeriod] = useState(false);
  const [newsType, setNewsType] = useState<NewsType>(NewsType.None);
  const [message, setMessage] = useState("");
  const [link, setLink] = useState("");
  const [linkTitle, setLinkTitle] = useState("");
  const [error, setError] = useState("");

  const checkHtttps = (link: string) => {
    if (!link.includes("https://")) {
      link = "https://" + link;
    }
    setLink(link);
  };

  const fetchCurrentNews = () => {
    if (!news) return;
    setStartDate(news.startDate);
    news.endDate && setEndDate(news.endDate);
    setNewsType(news.type);
    setMessage(news.message);
    checkHtttps(news.link!);
    setLinkTitle(news.linkTitle!);
  };

  useEffect(() => {
    fetchCurrentNews();
  }, []);

  const handleChange = (event: { target: { value: string } }) => {
    setNewsType(event.target.value as NewsType);
  };

  const handleSubmitCreate = async () => {
    if (startDate === null) return;

    const news: CreateNewsDTO = {
      type: newsType,
      message,
      startDate,
      endDate,
      link,
      linkTitle,
      displayPeriod,
    };

    try {
      const response = await createNews(news);
      if (response.status === 500) {
        setError("Error 500");
      }
      await fetchNews();
      setOpenModal(false);
      setSnackbarStatus({
        open: true,
        message: "L'information a été créée",
        severity: "success",
      });
    } catch (error: any) {
      setSnackbarStatus({
        open: true,
        message: error.message,
        severity: "error",
      });
    }
  };

  const handleSubmitUpdate = async () => {
    if (startDate === null) return;

    if (news) {
      const updatedNews: UpdateNewsDTO = {
        uuid: news.uuid,
        type: newsType,
        message,
        startDate,
        endDate,
        link,
        linkTitle,
        displayPeriod,
      };
      try {
        const response = await updateNews(updatedNews);
        if (response.status === 500) {
          setError("Error 500");
        }
        await fetchNews();
        setOpenModal(false);
        setSnackbarStatus({
          open: true,
          message: "L'information a été modifiée",
          severity: "success",
        });
      } catch (error: any) {
        setSnackbarStatus({
          open: true,
          message: error.message,
          severity: "error",
        });
      }
    }
  };

  return (
    <FormControl>
      <Grid container spacing={5}>
        <Grid item md={6} xs={12} sx={gridItem}>
          <>
            <ARTitleChip label={"Type"} chip={"1"} />
            <Select
              required
              value={newsType}
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
                onChange={(date) => setStartDate(date)}
                renderInput={(params) => <TextField {...params} />}
              />
              <DesktopDatePicker
                label="Date de fin"
                value={endDate}
                minDate={startDate}
                onChange={(date) => setEndDate(date)}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
            <FormControlLabel
              control={
                <Checkbox
                  checked={displayPeriod}
                  onChange={() => setDisplayPeriod(!displayPeriod)}
                  inputProps={{ "aria-label": "controlled" }}
                />
              }
              label="Visible pour les utilisateurs"
            />
          </>
        </Grid>
        <Grid item md={6} xs={12} sx={gridItem}>
          <ARTitleChip label={"Rédigez le message"} chip={"3"} />
          <TextareaAutosize
            required
            aria-label="Message (200 caractères maxi)"
            minRows={3}
            value={message}
            placeholder="Ceci est le début de votre message ..."
            onChange={(e) => setMessage(e.target.value)}
          />
        </Grid>

        <Grid item md={6} xs={12} sx={gridItem}>
          <ARTitleChip label={"Ajouter un lien (optionnel)"} chip={"4"} />
          <TextField
            label="Lien"
            color="primary"
            focused
            type="url"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            onBlur={(e) => checkHtttps(e.target.value)}
          />
          <TextField
            label="Titre du lien"
            color="primary"
            focused
            value={linkTitle}
            onChange={(e) => setLinkTitle(e.target.value)}
          />
        </Grid>
        {error && (
          <Typography variant="body1" color="warning">
            {error}
          </Typography>
        )}
      </Grid>
      <div style={{ marginLeft: "auto" }}>
        {news ? (
          <ARButtonIcon
            type="submit"
            label={"Modifier"}
            icon={<Edit />}
            backgroundColor="primary"
            onClick={handleSubmitUpdate}
          />
        ) : (
          <ARButtonIcon
            type="submit"
            label={"Créer l'information"}
            icon={<Add />}
            backgroundColor="primary"
            onClick={handleSubmitCreate}
          />
        )}
      </div>
    </FormControl>
  );
};

export default ARInputs;
