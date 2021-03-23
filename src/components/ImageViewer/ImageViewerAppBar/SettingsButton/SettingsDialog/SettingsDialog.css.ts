import makeStyles from "@material-ui/core/styles/makeStyles";

export const useStyles = makeStyles((theme) => ({
  form: {
    maginLeft: "15px",
  },
  content: {
    flexGrow: 1,
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
}));
