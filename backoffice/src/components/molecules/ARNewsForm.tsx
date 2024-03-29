import { CreateNewsDTO, NewsDTO, UpdateNewsDTO } from "@aireal/dtos";
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
  SelectChangeEvent,
  SxProps,
  TextField,
  Theme,
} from "@mui/material";
import { AxiosError } from "axios";
import frLocale from "date-fns/locale/fr";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { createNews, updateNews } from "../../api/news.api";
import useSnackbar from "../../contexts/snackbar.context";
import theme from "../../theme";
import { NewsType } from "../../types/news";
import { convertNewsType } from "../../utils";
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

interface Props {
  news?: NewsDTO;
  setOpenModal: Dispatch<SetStateAction<boolean>>;
  fetchNews: () => Promise<void>;
}

const ARNewsForm = ({ news, setOpenModal, fetchNews }: Props) => {
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [displayPeriod, setDisplayPeriod] = useState(true);
  const [newsType, setNewsType] = useState<NewsType>(NewsType.None);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [link, setLink] = useState("");
  const [linkTitle, setLinkTitle] = useState("");

  const { setSnackbarStatus } = useSnackbar();

  const checkHttps = (link: string) => {
    if (!link.includes("https://")) {
      link = "https://" + link;
    }
    setLink(link);
  };

  const fetchCurrentNews = () => {
    if (!news) return;
    setStartDate(news.startDate);
    news.endDate && setEndDate(news.endDate);
    setNewsType(news.type as NewsType);
    setTitle(news.title!);
    setMessage(news.message);
    checkHttps(news.link!);
    setLinkTitle(news.linkTitle!);
    setDisplayPeriod(news.displayPeriod);
  };

  useEffect(() => {
    fetchCurrentNews();
  }, []);

  const handleChange = (event: SelectChangeEvent<NewsType>) => {
    setNewsType(event.target.value as NewsType);
  };

  const handleSubmitCreate = async () => {
    //handling type from MUI component
    if (startDate === null) return;

    const news: CreateNewsDTO = {
      type: newsType,
      title,
      message,
      startDate,
      endDate,
      link,
      linkTitle,
      displayPeriod,
    };

    try {
      const res = await createNews(news);
      if (res.statusCode >= 400) {
        setSnackbarStatus?.({
          open: true,
          message: res.message,
          severity: "error",
        });
        return;
      }
      await fetchNews();
      setOpenModal(false);
      setSnackbarStatus?.({
        open: true,
        message: "L'information a été créée",
        severity: "success",
      });
    } catch (error) {
      setSnackbarStatus?.({
        open: true,
        message: (error as AxiosError)?.message,
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
        title,
        message,
        startDate,
        endDate,
        link,
        linkTitle,
        displayPeriod,
      };
      try {
        const res = await updateNews(updatedNews);
        if (res.statusCode >= 400) {
          setSnackbarStatus?.({
            open: true,
            message: res.message,
            severity: "error",
          });
          return;
        }
        await fetchNews();
        setOpenModal(false);
        setSnackbarStatus?.({
          open: true,
          message: "L'information a été modifiée",
          severity: "success",
        });
      } catch (error: any) {
        setSnackbarStatus?.({
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
            <ARTitleChip label={"Type et titre"} chip={"1"} />
            <Select
              required
              value={newsType}
              labelId="select-label"
              onChange={handleChange}
            >
              {Object.values(NewsType).map((option, idx) => (
                <MenuItem key={idx} value={option}>
                  {convertNewsType(option as NewsType)}
                </MenuItem>
              ))}
            </Select>
            <TextField
              label="Titre"
              color="primary"
              focused
              value={title}
              inputProps={{ maxLength: 25 }}
              onChange={(e) => setTitle(e.target.value)}
            />
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
                onChange={(date) => (date ? setStartDate(date) : null)}
                renderInput={(params) => <TextField {...params} />}
              />
              <DesktopDatePicker
                label="Date de fin"
                value={endDate}
                minDate={startDate}
                onChange={(date) => (date ? setEndDate(date) : null)}
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
          <TextField
            label="Message (200 caractères maxi)"
            color="primary"
            focused
            placeholder="Ceci est le début de votre message ..."
            value={message}
            minRows={3}
            multiline
            inputProps={{ maxLength: 200 }}
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
            required={!linkTitle ? false : true}
            onChange={(e) => setLink(e.target.value)}
            onFocus={(e) => checkHttps(e.target.value)}
          />
          <TextField
            label="Titre du lien"
            color="primary"
            focused
            required={!link ? false : true}
            value={linkTitle}
            inputProps={{ maxLength: 20 }}
            onChange={(e) => setLinkTitle(e.target.value)}
          />
        </Grid>
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
            disabled={!((!link && !linkTitle) || (linkTitle && link))}
            backgroundColor="primary"
            onClick={handleSubmitCreate}
          />
        )}
      </div>
    </FormControl>
  );
};

export default ARNewsForm;
