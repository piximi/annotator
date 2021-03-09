import React, { useRef } from "react";
import { Stage } from "../Stage";
import { imageSelector } from "../../../../store/selectors";
import { useSelector } from "react-redux";
import { useStyles } from "./Content.css";
import { Category } from "../../../../types/Category";
import { useBoundingClientRect } from "../../../../hooks/useBoundingClientRect";

type ContentProps = {
  category: Category;
};

export const Content = ({ category }: ContentProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const boundingClientRect = useBoundingClientRect(ref);

  const image = useSelector(imageSelector);

  const classes = useStyles();

  return (
    <main className={classes.content} ref={ref}>
      <div className={classes.toolbar} />

      <div className={classes.parent}>
        <Stage
          category={category}
          height={boundingClientRect?.height}
          src={image!.src}
          width={boundingClientRect?.width}
        />
      </div>
    </main>
  );
};
