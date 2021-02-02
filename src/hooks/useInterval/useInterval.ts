import { useEffect, useRef } from "react";

export const useInterval = (
  callback: () => void,
  delay: number | null | false,
  immediate?: boolean
) => {
  const callbackRef = useRef(() => {});

  useEffect(() => {
    callbackRef.current = callback;
  });

  useEffect(() => {
    if (!immediate) return;

    if (delay === null || delay === false) return;

    callbackRef.current();
  }, [delay, immediate]);

  useEffect(() => {
    if (delay === null || delay === false) return undefined;

    const tick = () => callbackRef.current;

    const intervalId = setInterval(tick, delay);

    return () => clearInterval(intervalId);
  }, [delay]);
};
