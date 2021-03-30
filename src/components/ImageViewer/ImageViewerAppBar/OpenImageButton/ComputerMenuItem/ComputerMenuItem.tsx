import MenuItem from "@material-ui/core/MenuItem";
import React from "react";
import { ShapeType } from "../../../../../types/ShapeType";
import { setImage } from "../../../../../store";
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

          const shape: ShapeType = {
            channels: 4,
            frames: 1,
            height: image.height,
            planes: 1,
            width: image.width,
          };

          dispatch(
            setImage({
              image: {
                id: "",
                annotations: [],
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
        accept="image/*"
        hidden
        id="open-image"
        onChange={onChange}
        type="file"
      />
    </MenuItem>
  );
};
