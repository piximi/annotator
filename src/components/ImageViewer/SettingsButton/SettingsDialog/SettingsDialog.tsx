import React from "react";
import {
  AppBar,
  Dialog,
  FormControlLabel,
  InputLabel,
  Select,
} from "@material-ui/core";
import DialogContent from "@material-ui/core/DialogContent";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";
import FormGroup from "@material-ui/core/FormGroup";
import Switch from "@material-ui/core/Switch";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import { LanguageType } from "../../../../types/LanguageType";
import { useDispatch, useSelector } from "react-redux";
import { applicationSlice } from "../../../../store";
import { languageSelector } from "../../../../store/selectors/languageSelector";
import { soundEnabledSelector } from "../../../../store/selectors/soundEnabledSelector";
import { useStyles } from "./SettingsDialog.css";
import Toolbar from "@material-ui/core/Toolbar";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";

type SettingsDialogProps = {
  onClose: () => void;
  open: boolean;
};

export const SettingsDialog = ({ onClose, open }: SettingsDialogProps) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const language = useSelector(languageSelector);
  const soundEnabled = useSelector(soundEnabledSelector);

  const onLanguageChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    dispatch(
      applicationSlice.actions.setLanguage({
        language: event.target.value as LanguageType,
      })
    );
  };

  const onSoundEffectsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(
      applicationSlice.actions.setSoundEnabled({
        soundEnabled: event.target.checked,
      })
    );
  };

  return (
    <Dialog fullScreen onClose={onClose} open={open}>
      <AppBar className={classes.appBar} color="inherit" position="fixed">
        <Toolbar>
          <Typography className={classes.title} variant="h6">
            Settings
          </Typography>

          <IconButton aria-label="close" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <div className={classes.toolbar} />

      <DialogContent className={classes.content}>
        <Grid container spacing={2}>
          <Grid item xs={3} />

          <Grid item xs={6}>
            <Grid container>
              <Grid item xs={12}>
                <Grid container item xs={4}>
                  <FormControl color="primary" fullWidth>
                    <InputLabel shrink id="settings-language">
                      Language
                    </InputLabel>

                    <Select
                      id="settings-language-label"
                      labelId="settings-language"
                      onChange={onLanguageChange}
                      value={language}
                    >
                      <MenuItem value={LanguageType.English}>English</MenuItem>
                      {/*<MenuItem value={LanguageType.Arabic}>Arabic<Arabic/MenuItem>*/}
                      <MenuItem value={LanguageType.Farsi}>Farsi</MenuItem>
                      {/*<MenuItem value={LanguageType.Finnish}>Finnish</MenuItem>*/}
                      <MenuItem value={LanguageType.French}>French</MenuItem>
                      {/*<MenuItem value={LanguageType.German}>German</MenuItem>*/}
                      {/*<MenuItem value={LanguageType.Hindi}>Hindi</MenuItem>*/}
                      {/*<MenuItem value={LanguageType.Hungarian}>*/}
                      {/*  Hungarian*/}
                      {/*</MenuItem>*/}
                      {/*<MenuItem value={LanguageType.Spanish}>Spanish</MenuItem>*/}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              <Grid item style={{ padding: "32px 0" }} xs={12}>
                <Divider />
              </Grid>

              <Grid item xs={12}>
                <FormControl component="fieldset">
                  <FormGroup aria-label="position" row>
                    <FormControlLabel
                      control={
                        <Switch
                          color="default"
                          checked={soundEnabled}
                          onChange={onSoundEffectsChange}
                          name="soundEnabled"
                        />
                      }
                      label="Sound effects"
                    />
                  </FormGroup>
                </FormControl>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};
