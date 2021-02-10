import MenuItem from "@material-ui/core/MenuItem";
import React from "react";
import { Shape } from "../../../../../types/Shape";
import { setImageViewerImage } from "../../../../../store/slices";
import { useDispatch } from "react-redux";

type ComputerMenuItemProps = {
  onClose: () => void;
};

export const ComputerMenuItem = ({ onClose }: ComputerMenuItemProps) => {
  const dispatch = useDispatch();

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onClose();

    event.persist();

    if (event.currentTarget.files) {
      const blob = event.currentTarget.files[0];

      const reader = new FileReader();

      reader.onload = async (event: ProgressEvent<FileReader>) => {
        if (event.target) {
          const src = event.target.result;

          const image = new Image();

          image.onload = () => {
            const name = blob.name;

            const shape: Shape = {
              r: image.naturalHeight,
              c: image.naturalWidth,
              channels: 4,
            };

            dispatch(
              setImageViewerImage({
                image: {
                  id: "",
                  instances: [],
                  name: name,
                  shape: shape,
                  src: src as string,
                },
              })
            );
          };

          image.src = src as string;
        }
      };

      reader.readAsDataURL(blob);
    }
  };

  return (
    <MenuItem component="label" dense>
      Computer
      <input
        accept="image/*"
        hidden
        id="open-image"
        onChange={onChange}
        type="file"
      />
    </MenuItem>
  );
};
