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
                value={"english"}
                onChange={() => {}}
                inputProps={{
                  name: "language",
                  id: "language",
                }}
              >
                <MenuItem value="english">english</MenuItem>
                <MenuItem value="deutsch">deutsch</MenuItem>
                <MenuItem value="francais">francais</MenuItem>
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
