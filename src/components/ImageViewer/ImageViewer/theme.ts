import { createMuiTheme } from "@material-ui/core/styles";

export const theme = createMuiTheme({
  overrides: {
    MuiDrawer: {
      paperAnchorDockedLeft: {
        borderRight: "1px solid rgba(16, 16, 16)",
      },
      paperAnchorDockedRight: {
        borderLeft: "1px solid rgba(16, 16, 16)",
      },
    },
    MuiListItemIcon: {
      root: {
        minWidth: 36,
      },
    },
    MuiListItem: {
      root: {
        "&$selected": {
          backgroundColor: "rgba(60, 61, 62)",
        },
      },
    },
    MuiSlider: {
      rail: {
        color: "rgba(73, 73, 73)",
      },
      thumb: {
        color: "rgba(201, 201, 201)",
      },
      track: {
        color: "rgba(159, 159, 159)",
      },
    },
  },
  palette: {
    background: {
      paper: "rgba(40, 40, 40)",
      default: "rgba(50, 50, 50)",
    },
    divider: "rgba(72, 72, 72)",
    text: {
      primary: "rgba(190, 190, 190)",
    },
    type: "dark",
  },
});
