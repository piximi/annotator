import { useEffect, useState } from "react";
import { applicationSlice } from "../../store/slices";
import { AnnotationModeType } from "../../types/AnnotationModeType";
import { useDispatch, useSelector } from "react-redux";
import { selectedAnnotationSelector } from "../../store/selectors/selectedAnnotationSelector";

export function useKeyPress(targetKey: string) {
  // State for keeping track of whether key is pressed
  const [keyPressed, setKeyPressed] = useState(false);

  // If pressed key is our target key then set to true
  function downHandler({ key }: { key: string }) {
    if (key === targetKey) {
      setKeyPressed(true);
    }
  }

  // If released key is our target key then set to false
  const upHandler = ({ key }: { key: string }) => {
    if (key === targetKey) {
      setKeyPressed(false);
    }
  };

  // Add event listeners
  useEffect(() => {
    window.addEventListener("keydown", downHandler);
    window.addEventListener("keyup", upHandler);
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("keyup", upHandler);
    };
  }, []); // Empty array ensures that effect is only run on mount and unmount

  return keyPressed;
}

export const useAltPress = () => {
  const dispatch = useDispatch();

  const selectedAnnotation = useSelector(selectedAnnotationSelector);

  const optionPress = useKeyPress("Alt"); //Option key on Mac keyboards
  useEffect(() => {
    if (!optionPress) {
      dispatch(
        applicationSlice.actions.setSelectionMode({
          selectionMode: AnnotationModeType.New,
        })
      );
    } else {
      if (!selectedAnnotation) return;
      dispatch(
        applicationSlice.actions.setSelectionMode({
          selectionMode: AnnotationModeType.Subtract,
        })
      );
    }
  }, [optionPress]);
};
