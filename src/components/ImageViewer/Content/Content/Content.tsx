import React from "react";
import { Stage } from "../Stage";
import { imageSelector } from "../../../../store/selectors";
import { useSelector } from "react-redux";
import { useStyles } from "./Content.css";
import { Category } from "../../../../types/Category";

type ContentProps = {
  category: Category;
};

export const Content = ({ category }: ContentProps) => {
  const image = useSelector(imageSelector);

  const classes = useStyles();

  return (
    <main className={classes.content}>
      <div className={classes.toolbar} />

      <div className={classes.parent}>
        <Stage category={category} src={image!.src} />
      </div>
    </main>
  );
};
