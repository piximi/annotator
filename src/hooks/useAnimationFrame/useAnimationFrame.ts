import { useRef, useLayoutEffect } from "react";

export const useAnimationFrame = (callback: (delay: number) => void) => {
  const callbackRef = useRef(callback);

  const frameRef = useRef<number>(0);
  const timerRef = useRef<number>(0);

  useLayoutEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useLayoutEffect(() => {
    const loop = (time: number) => {
      frameRef.current = requestAnimationFrame(loop);

      let delta = 0;

      if (timerRef.current !== undefined && timerRef.current !== null) {
        delta = time - timerRef.current;
      }

      const callback = callbackRef.current;

      callback(delta / 1000);

      timerRef.current = time;
    };

    frameRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frameRef.current);
    };
  }, []);
};
