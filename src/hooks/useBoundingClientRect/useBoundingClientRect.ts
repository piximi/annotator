import useResizeObserver from "@react-hook/resize-observer";
import React, { useEffect, useLayoutEffect } from "react";
import { setBoundingClientRect } from "../../store/slices";
import { useDispatch, useSelector } from "react-redux";
import { boundingClientRectSelector } from "../../store/selectors";

export const useBoundingClientRect = (target: React.RefObject<HTMLElement>) => {
  const dispatch = useDispatch();

  const boundingClientRect = useSelector(boundingClientRectSelector);

  useLayoutEffect(() => {
    if (!target || !target.current) return;

    dispatch(
      setBoundingClientRect({
        boundingClientRect: target.current.getBoundingClientRect(),
      })
    );
  }, [dispatch, target]);

  useResizeObserver(target, (entry: ResizeObserverEntry) => {
    dispatch(
      setBoundingClientRect({
        boundingClientRect: entry.contentRect as DOMRect,
      })
    );
  });

  useEffect(() => {
    if (!boundingClientRect) return;
    dispatch(setBoundingClientRect({ boundingClientRect: boundingClientRect }));
  }, [boundingClientRect, dispatch]);
};
