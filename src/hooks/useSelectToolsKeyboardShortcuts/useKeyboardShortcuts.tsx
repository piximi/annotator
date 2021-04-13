import { useSelector } from "react-redux";
import { annotatingSelector } from "../../store/selectors";
import { useEffect } from "react";

export const useKeyboardShortcuts = () => {
  const annotating = useSelector(annotatingSelector);

  useEffect(() => {
    if (!annotating) return;
  }, [annotating]);
};
