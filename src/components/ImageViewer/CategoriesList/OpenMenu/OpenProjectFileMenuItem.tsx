import { useDispatch } from "react-redux";
import React from "react";
import { applicationSlice } from "../../../../store/slices";
import { MenuItem } from "@material-ui/core";
import ListItemText from "@material-ui/core/ListItemText";

type OpenAnnotationsMenuItemProps = {
  popupState: any;
};

export const OpenProjectFileMenuItem = ({
  popupState,
}: OpenAnnotationsMenuItemProps) => {
  const dispatch = useDispatch();

  const onOpenAnnotations = (
    event: React.ChangeEvent<HTMLInputElement>,
    onClose: () => void
  ) => {
    onClose();

    event.persist();

    if (event.currentTarget.files) {
      Array.from(event.currentTarget.files).forEach((file: any) => {
        const reader = new FileReader();

        reader.onload = async (event: ProgressEvent<FileReader>) => {
          if (event.target && event.target.result) {
            const annotations = JSON.parse(event.target.result as string);

            dispatch(
              applicationSlice.actions.openAnnotations({
                annotations: annotations,
              })
            );
          }
        };

        reader.readAsText(file);
      });
    }
  };

  return (
    <MenuItem component="label">
      <ListItemText primary="Open project file" />
      <input
        accept="application/json"
        hidden
        id="open-annotations"
        multiple
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          onOpenAnnotations(event, popupState.close)
        }
        type="file"
      />
    </MenuItem>
  );
};
