import React, { useRef } from "react";
import { Stage } from "../Stage";
import { imageSelector } from "../../../../store/selectors";
import { useSelector } from "react-redux";
import { useStyles } from "./Content.css";
import { Category } from "../../../../types/Category";
import { useBoundingClientRect } from "../../../../hooks/useBoundingClientRect";
import { NativeTypes } from "react-dnd-html5-backend";
import { useDrop, DropTargetMonitor } from "react-dnd";

type ContentProps = {
  category: Category;
  onDrop: (item: { files: any[] }) => void;
};

export const Content = ({ category, onDrop }: ContentProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const boundingClientRect = useBoundingClientRect(ref);

  const image = useSelector(imageSelector);

  const classes = useStyles();

  const [{ canDrop, isOver }, drop] = useDrop(
    () => ({
      accept: [NativeTypes.FILE],
      drop(item: { files: any[] }) {
        if (onDrop) {
          onDrop(item);
        }
      },
      collect: (monitor: DropTargetMonitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    []
  );

  return (
    <main className={classes.content} ref={ref}>
      <div ref={drop}>
        <div className={classes.toolbar} />

        <div className={classes.parent}>
          <Stage
            category={category}
            height={boundingClientRect?.height}
            src={image!.src}
            width={boundingClientRect?.width}
          />
        </div>
      </div>
    </main>
  );
};
