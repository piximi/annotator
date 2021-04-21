import { useEffect, useState } from "react";
import { applicationSlice } from "../../store/slices";
import { AnnotationModeType } from "../../types/AnnotationModeType";
import { useDispatch } from "react-redux";

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

export const useShiftPress = () => {
  const dispatch = useDispatch();

  const shiftPress = useKeyPress("Shift");
  useEffect(() => {
    if (!shiftPress) {
      dispatch(
        applicationSlice.actions.setSelectionMode({
          selectionMode: AnnotationModeType.New,
        })
      );
    } else {
      dispatch(
        applicationSlice.actions.setSelectionMode({
          selectionMode: AnnotationModeType.Add,
        })
      );
    }
  }, [shiftPress]);
};
