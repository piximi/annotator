import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  appBar: {
    borderBottom: "1px solid #3F3F3F",
    backgroundColor: "rgba(50, 50, 50)",
    boxShadow: "none",
    left: theme.spacing(32),
    position: "absolute",
    opacity: "50%",
  },
  content: {
    backgroundColor: theme.palette.background.default,
    width: "100%",
  },
  toolbar: {
    ...theme.mixins.toolbar,
  },
  parent: {
    cursor: "crosshair",
    width: "100%",
  },
}));
