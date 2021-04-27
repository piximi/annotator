import { makeStyles } from "@material-ui/core/styles";

const operationsWidth = 56;

export const useStyles = makeStyles((theme) => ({
  card: {
    width: 300,
  },
  cardContent: {
    width: "200px",
  },
  cardMedia: {
    height: 170,
  },
  drawer: {
    flexShrink: 0,
    whiteSpace: "nowrap",
    width: operationsWidth,
  },
  paper: {
    width: operationsWidth,
  },
  toolbar: {
    alignItems: "center",
    display: "flex",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
  },
  tooltip: {
    backgroundColor: "transparent",
    maxWidth: "none",
  },
}));
