import { DesktopDatePicker } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import {
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextareaAutosize,
  TextField,
} from "@mui/material";
import frLocale from "date-fns/locale/fr";
import { useState } from "react";
import { NewsType } from "../../types/news";

const ARInputs = () => {
  const [startDate, setstartDate] = useState<Date | null>(new Date());
  const [endDate, setendDate] = useState<Date | null>(new Date());
  const [newsType, setnewsType] = useState<string>(NewsType.None);

  const handleChange = (event: SelectChangeEvent<typeof newsType>) => {
    setnewsType(event.target.value);
  };

  return (
    <>
      <div>
        <InputLabel id="select-label">Type</InputLabel>
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
      </div>
      <div>
        <LocalizationProvider dateAdapter={AdapterDateFns} locale={frLocale}>
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
      </div>
      <div>
        <TextareaAutosize
          aria-label="Message (200 caractères maxi)"
          minRows={3}
          placeholder="Ceci est le début de votre message ..."
          style={{ width: 300 }}
        />
      </div>
      <div>
        <TextField label="Lien" color="primary" focused />
        <TextField label="Titre du lien" color="primary" focused />
      </div>
    </>
  );
};

export default ARInputs;
