import { makeStyles } from "@material-ui/core/styles";

const settingsWidth = 240;

export const useStyles = makeStyles((theme) => ({
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
    width: "100%",
  },
  stage: {
    margin: "8px",
  },
  toolbar: {
    ...theme.mixins.toolbar,
  },
  parent: {
    cursor: "crosshair",
    width: `calc(100% - ${settingsWidth}px - ${theme.spacing(3)}px)`,
  },
}));
