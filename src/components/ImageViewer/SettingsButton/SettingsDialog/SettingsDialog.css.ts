import makeStyles from "@material-ui/core/styles/makeStyles";

export const useStyles = makeStyles((theme) => ({
  form: {
    maginLeft: "15px",
  },
  content: {
    marginTop: theme.spacing(2),
  },
  boxLayout: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    margin: "20px",
  },
  typography: {
    fontWeight: "inherit",
    marginRight: "15px",
    width: "100px",
    textAlign: "right",
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  appBar: {
    flexGrow: 1,
  },
  toolbar: {
    ...theme.mixins.toolbar,
  },
}));
