import React from "react";
import { Stage } from "../Stage";
import { imageViewerImageSelector } from "../../../../store/selectors";
import { useSelector } from "react-redux";
import { useStyles } from "./Content.css";

export const Content = () => {
  const image = useSelector(imageViewerImageSelector);

  const classes = useStyles();

  return (
    <main className={classes.content}>
      <div className={classes.toolbar} />

      <div className={classes.parent}>
        <Stage src={image!.src} />
      </div>
    </main>
  );
};
