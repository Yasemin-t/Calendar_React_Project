import format from "date-fns/format";
import getDay from "date-fns/getDay";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import React, {useMemo, useState} from "react";
import {Calendar, dateFnsLocalizer} from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-datepicker/dist/react-datepicker.css";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import {Grid} from "@mui/material";
import {Container} from "@mui/system";
import {useForm, Controller} from "react-hook-form";
import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";

// DATEPİCKER
const locales = {
  "en-US": require("date-fns/locale/en-US"),
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// MODAL CSS
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

// yup
const SignupSchema = yup.object().shape({
  title: yup
    .string()
    .typeError("Lütfen tür ismi giriniz!")
    .required("Zorunlu alan!")
    .matches(
      /^([A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*)$/gi,
      "Lütfen harfleri kullanın"
    ),
  start: yup.string().required("Zorunlu alan!"),
  end: yup.string().required("Zorunlu alan!"),
});

const App = () => {
  const events = [
    {label: "Korku", value: 1},
    {label: "Gerilim", value: 2},
    {label: "Romantik Komedi", value: 3},
    {label: "Macera", value: 4},
    {label: "Aşk", value: 5},
  ];
  const [filmTur, setFilmTur] = useState("");
  const [vizyonaGiris, setVizyonaGiris] = useState("");
  const [vizyondanKalkis, setVizyondanKalkis] = useState("");
  const [modal, setModal] = useState([]);
  const handleSelectedEvent = (event) => {
    setFilmTur(event.title);
    setVizyonaGiris(event.start);
    setVizyondanKalkis(event.end);
    setModal(event.resource.eventType);
    console.log(modal);
    console.log(filmTur);
    handleOpen();
  };

  const [defaultvalues, setDefaultvalues] = useState({
    title: "",
    start: "",
    end: "",
    tur: [],
  });
  console.log(defaultvalues);

  // yup
  const {
    handleSubmit,
    control,
    formState: {errors},
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(SignupSchema),
    defaultValues: useMemo(() => {
      return defaultvalues;
    }, []),
  });

  const [allEvents, setAllEvents] = useState([]);
  const handleAddEvent = (data) => {
    console.log(data);

    // uyarı mesajı
    if (data.start > data.end) {
      alert("Bitiş tarihi başlangıç tarihinden erken olamaz");
    } else if (data.start <= data.end) {
      const event = {
        title: data.title,
        start: data.start,
        end: data.end,
        resource: {
          eventType: data.tur,
        },
      };
      setAllEvents([...allEvents, event]);
    }
  };
  // MODAL ONCLİCK
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [newEvent, setNewEvent] = useState("");

  return (
    <div>
      <Container item sx={12}>
        <form onSubmit={handleSubmit((data) => handleAddEvent(data))}>
          <Grid item xs={12}></Grid>
          <Grid item xs={3}>
            <Controller
              control={control}
              name="tur"
              render={({field: {onChange, onBlur, tur}}) => (
                <Autocomplete
                  options={events}
                  value={tur}
                  onBlur={onBlur}
                  onChange={(event, newEvents) => {
                    onChange(newEvents);
                  }}
                  multiple
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="standard"
                      label="Film türü seçiniz"
                      placeholder="Favorites"
                    />
                  )}
                />
              )}
            />
          </Grid>

          <Grid item sx={3}>
            <Controller
              control={control}
              name="title"
              render={({field: {onChange, onBlur, title}}) => (
                <TextField
                  fullWidth
                  type="text"
                  label="Film ismini girin"
                  placeholder="Film İsmi"
                  variant="outlined"
                  value={title}
                  onBlur={onBlur}
                  onChange={onChange}
                />
              )}
            />
            {errors.title && <p>{errors.title.message}</p>}
          </Grid>
          <Grid item sx={6}>
            <Controller
              control={control}
              name="start"
              render={({field: {onChange, start, ref}}) => (
                <TextField
                  type="date"
                  label="Başlangıç Tarihi:"
                  placeholder="Vizyona Giriş Tarihi: "
                  variant="outlined"
                  fullWidth
                  value={start}
                  InputLabelProps={{shrink: true}}
                  onChange={onChange}
                />
              )}
            />
            {errors.start && <p>{errors.start.message}</p>}
            <Grid item sx={6}>
              <Controller
                control={control}
                name="end"
                render={({field: {onChange, end, ref}}) => (
                  <TextField
                    type="date"
                    label="Bitiş Tarihi:"
                    placeholder="Vizyondan Klakış Tarihi: "
                    variant="outlined"
                    fullWidth
                    value={end}
                    InputLabelProps={{shrink: true}}
                    onChange={onChange}
                  />
                )}
              />
              {errors.end && <p>{errors.end.message}</p>}
            </Grid>
            <Grid item sx={1}>
              <Button
                color="secondary"
                stlye={{marginTop: "10px"}}
                onClick={handleAddEvent}
                type="submit"
                variant="contained"
              >
                Ekle
              </Button>
            </Grid>
          </Grid>
          <Grid item sx={12}>
            <Calendar
              localizer={localizer}
              events={allEvents}
              startAccessor="start"
              onSelectEvent={(event) => handleSelectedEvent(event)}
              popup
              endAccessor="end"
              style={{height: 500, margin: "50px"}}
            />
          </Grid>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Grid Container>
                <label>Film Türü : </label>
                <label>
                  {modal.map((m) => {
                    return m.label + " ";
                  })}
                </label>
              </Grid>
              <Grid Container>
                <label>Film İsmi: </label>
                <label>{filmTur}</label>
              </Grid>
              <Grid Container>
                <label>Vizyona Giriş Tarihi : </label>
                <label>{vizyonaGiris}</label>
              </Grid>
              <Grid Container>
                <label>Vizyondan Klakış Tarihi : </label>
                <label>{vizyondanKalkis}</label>
              </Grid>
            </Box>
          </Modal>
        </form>
      </Container>
    </div>
  );
};

export default App;
