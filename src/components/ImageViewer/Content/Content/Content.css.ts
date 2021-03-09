import { makeStyles } from "@material-ui/core/styles";

const toolOptionsDrawerWidth = 240;

export const useStyles = makeStyles((theme) => ({
  content: {
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
    // width: `calc(100% - ${toolOptionsDrawerWidth}px)`
  },
}));
