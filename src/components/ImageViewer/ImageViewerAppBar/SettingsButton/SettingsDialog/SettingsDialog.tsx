import React from "react";
import { Dialog, Select } from "@material-ui/core";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import FormGroup from "@material-ui/core/FormGroup";
import Switch from "@material-ui/core/Switch";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import { Language } from "../../../../../types/Language";
import { useDispatch, useSelector } from "react-redux";
import { slice } from "../../../../../store";
import { languageSelector } from "../../../../../store/selectors/languageSelector";
import { soundEnabledSelector } from "../../../../../store/selectors/soundEnabledSelector";
import { useStyles } from "./SettingsDialog.css";

type SettingsDialogProps = {
  onClose: () => void;
  open: boolean;
};
export const SettingsDialog = ({ onClose, open }: SettingsDialogProps) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const language = useSelector(languageSelector);
  const soundEnabled = useSelector(soundEnabledSelector);

  const handleLanguageChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    dispatch(
      slice.actions.setLanguage({ language: event.target.value as Language })
    );
  };

  const handleSoundEnabledChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(
      slice.actions.setSoundEnabled({ soundEnabled: event.target.checked })
    );
  };

  return (
    <Dialog fullWidth={true} maxWidth={"md"} onClose={onClose} open={open}>
      <DialogTitle>Settings</DialogTitle>
      <DialogContent className={classes.content}>
        <Box className={classes.boxLayout}>
          <Box fontWeight={700}>
            {" "}
            <Typography className={classes.typography}>
              Language:{" "}
            </Typography>{" "}
          </Box>
          <form>
            <FormControl className={classes.form}>
              <Select
                autoFocus
                value={language}
                onChange={handleLanguageChange}
                inputProps={{
                  name: "language",
                  id: "language",
                }}
              >
                <MenuItem value={Language.English}>English</MenuItem>
                <MenuItem value={Language.Arabic}>Arabic</MenuItem>
                <MenuItem value={Language.Finnish}>Finnish</MenuItem>
                <MenuItem value={Language.French}>French</MenuItem>
                <MenuItem value={Language.German}>German</MenuItem>
                <MenuItem value={Language.Hindi}>Hindi</MenuItem>
                <MenuItem value={Language.Hungarian}>Hungarian</MenuItem>
                <MenuItem value={Language.Spanish}>Spanish</MenuItem>
              </Select>
            </FormControl>
          </form>
        </Box>

        <Divider />

        <Box className={classes.boxLayout}>
          <Box fontWeight={700}>
            {" "}
            <Typography className={classes.typography}>Sound: </Typography>{" "}
          </Box>
          <FormGroup>
            <Typography component="div">
              <Grid component="label" container alignItems="center" spacing={1}>
                <Grid item>Off</Grid>
                <Grid item>
                  <Switch
                    checked={soundEnabled}
                    onChange={handleSoundEnabledChange}
                    name="soundEnabled"
                  />
                </Grid>
                <Grid item>On</Grid>
              </Grid>
            </Typography>
          </FormGroup>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
