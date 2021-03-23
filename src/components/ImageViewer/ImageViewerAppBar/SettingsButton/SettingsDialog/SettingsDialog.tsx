import React from "react";
import { Dialog, Select } from "@material-ui/core";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import makeStyles from "@material-ui/core/styles/makeStyles";
import FormGroup from "@material-ui/core/FormGroup";
import Switch from "@material-ui/core/Switch";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import { Language } from "../../../../../types/Language";
import { setAddon } from "@storybook/react";
import { useDispatch } from "react-redux";
import { slice } from "../../../../../store/slices";

const useStyles = makeStyles((theme) => ({
  form: {
    maginLeft: "15px",
  },
  root: {
    flexGrow: 1,
  },
  rowLayout: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    margin: "20px",
  },
  boldTypography: {
    fontWeight: "inherit",
    marginRight: "15px",
    width: "100px",
    textAlign: "right",
  },
}));

type SettingsDialogProps = {
  onClose: () => void;
  open: boolean;
};
export const SettingsDialog = ({ onClose, open }: SettingsDialogProps) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const handleLanguageChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    dispatch(
      slice.actions.setLanguage({ language: event.target.value as Language })
    );
  };

  return (
    <Dialog fullWidth={true} maxWidth={"md"} onClose={onClose} open={open}>
      <DialogTitle>Settings</DialogTitle>
      <DialogContent className={classes.root}>
        <Box className={classes.rowLayout}>
          <Box fontWeight={700}>
            {" "}
            <Typography className={classes.boldTypography}>
              Language:{" "}
            </Typography>{" "}
          </Box>
          <form>
            <FormControl className={classes.form}>
              <Select
                autoFocus
                value={Language.English}
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

        <Box className={classes.rowLayout}>
          <Box fontWeight={700}>
            {" "}
            <Typography className={classes.boldTypography}>
              Sound:{" "}
            </Typography>{" "}
          </Box>
          <FormGroup>
            <Typography component="div">
              <Grid component="label" container alignItems="center" spacing={1}>
                <Grid item>Off</Grid>
                <Grid item>
                  <Switch checked={false} onChange={() => {}} name="checkedC" />
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
