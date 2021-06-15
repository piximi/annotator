import React from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import MailIcon from "@material-ui/icons/Mail";
import CloseIcon from "@material-ui/icons/Close";

import { CollapsibleHelpContent } from "./CollapsibleHelpContent";
import { DialogContent, IconButton } from "@material-ui/core";
import { HelpWindowToolTitle } from "../HelpDialog/HelpWindowToolTitle";
import { ColorAdjustmentIcon, HandIcon, ZoomIcon } from "../../../icons";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: "auto",
  },
});

export default function HelpDrawer() {
  const useStyles = makeStyles((theme) => ({
    drawer: {
      width: "300px",
      flexShrink: 0,
    },
    drawerPaper: {
      width: "300px",
    },
  }));

  const classes = useStyles();

  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer = (anchor: string, open: boolean) => (
    event: React.KeyboardEvent | React.MouseEvent
  ) => {
    if (
      event.type === "keydown" &&
      ((event as React.KeyboardEvent).key === "Tab" ||
        (event as React.KeyboardEvent).key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  // const list = (anchor: string) => (
  //   <div
  //     className={clsx(classes.list, {
  //       [classes.fullList]: anchor === "top" || anchor === "bottom",
  //     })}
  //     role="presentation"
  //     onClick={toggleDrawer(anchor, false)}
  //     onKeyDown={toggleDrawer(anchor, false)}
  //   >
  //     <List>
  //       {["Inbox", "Starred", "Send email", "Drafts"].map((text, index) => (
  //         <ListItem button key={text}>
  //           <ListItemIcon>
  //             {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
  //           </ListItemIcon>
  //           <ListItemText primary={text} />
  //         </ListItem>
  //       ))}
  //     </List>
  //     <Divider />
  //     <List>
  //       {["All mail", "Trash", "Spam"].map((text, index) => (
  //         <ListItem button key={text}>
  //           <ListItemIcon>
  //             {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
  //           </ListItemIcon>
  //           <ListItemText primary={text} />
  //         </ListItem>
  //       ))}
  //     </List>
  //   </div>
  // );

  return (
    <div>
      {
        <React.Fragment key={"left"}>
          <Button onClick={toggleDrawer("left", true)}>{"left"}</Button>
          <Drawer
            variant={"persistent"}
            anchor={"left"}
            className={classes.drawer}
            classes={{
              paper: classes.drawerPaper,
            }}
            open={state["left"]}
            onClose={toggleDrawer("left", false)}
          >
            <IconButton onClick={toggleDrawer("left", false)}>
              <CloseIcon />
            </IconButton>
            <CollapsibleHelpContent
              primary={"test text"}
              closed={false}
              dense={true}
            >
              <br />
              <HelpWindowToolTitle toolName={"Hand tool"} letter={"H"}>
                <HandIcon />
              </HelpWindowToolTitle>
              <Typography>
                Select the Hand tool. Hold and drag to pan the image in the
                canvas. Click on "Reset position" to center the image back onto
                the canvas.
              </Typography>
              <br />
              <HelpWindowToolTitle toolName={"Zoom tool"} letter={"Z"}>
                <ZoomIcon />
              </HelpWindowToolTitle>
              <Typography>
                Select the Zoom tool. Use the zoom slider or your mouse wheel to
                zoom in or out of the image.
              </Typography>
              <br />
              <Typography>
                To zoom in a particular region of the image, first unselect
                "Auto-center" and then use your mouse to select the rectangular
                region in which you would like to zoom in. Release the mouse to
                zoom in the selected region.
              </Typography>
              <br />
              <HelpWindowToolTitle
                toolName={"Intensity adjustment"}
                letter={"I"}
              >
                <ColorAdjustmentIcon />
              </HelpWindowToolTitle>
              <Typography>
                Select the Intensity adjustment tool. Filter each color channel
                by setting new minimum and maximum for each color channel.
                Untoggle a channel box to disable the channel. Click on "Reset"
                to reset the intensities to their original values.
              </Typography>
              <br />
            </CollapsibleHelpContent>
          </Drawer>
        </React.Fragment>
      }
    </div>
  );
}
