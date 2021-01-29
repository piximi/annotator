import React from "react";
import { useSelector } from "react-redux";
import { useStyles } from "./Content.css";
import { imageViewerImageSelector } from "../../store/selectors";
import { Stage } from "./Stage";

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
