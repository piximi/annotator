import useResizeObserver from "@react-hook/resize-observer";
import React, { useLayoutEffect, useState } from "react";

export const useBoundingClientRect = (target: React.RefObject<HTMLElement>) => {
  const [boundingClientRect, setBoundingClientRect] = useState<DOMRect>();

  useLayoutEffect(() => {
    if (!target || !target.current) return;

    setBoundingClientRect(target.current.getBoundingClientRect());
  }, [target]);

  useResizeObserver(target, (entry: ResizeObserverEntry) => {
    setBoundingClientRect(entry.contentRect as DOMRect);
  });

  return boundingClientRect;
};
