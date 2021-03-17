import MenuItem from "@material-ui/core/MenuItem";
import React from "react";
import { Shape } from "../../../../../types/Shape";
import { setImage } from "../../../../../store/slices";
import { useDispatch } from "react-redux";
import * as ImageJS from "image-js";

type ComputerMenuItemProps = {
  onClose: () => void;
};

export const ComputerMenuItem = ({ onClose }: ComputerMenuItemProps) => {
  const dispatch = useDispatch();

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onClose();

    event.persist();

    if (event.currentTarget.files) {
      const file = event.currentTarget.files[0];

      const reader = new FileReader();

      reader.onload = async (event: ProgressEvent<FileReader>) => {
        if (event.target) {
          const src = event.target.result;

          const image = new Image();

          image.onload = () => {};

          image.src = src as string;
        }
      };

      file.arrayBuffer().then((buffer) => {
        ImageJS.Image.load(buffer).then((image) => {
          const name = file.name;

          const shape: Shape = {
            r: image.height,
            c: image.width,
            channels: 4,
          };

          dispatch(
            setImage({
              image: {
                id: "",
                instances: [],
                name: name,
                shape: shape,
                src: image.toDataURL(),
              },
            })
          );
        });
      });

      reader.readAsDataURL(file);
    }
  };

  return (
    <MenuItem component="label" dense>
      Computer
      <input
        accept="image/tiff, image/png"
        hidden
        id="open-image"
        onChange={onChange}
        type="file"
      />
    </MenuItem>
  );
};
