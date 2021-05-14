import MenuItem from "@material-ui/core/MenuItem";
import React from "react";
import { ShapeType } from "../../../../../types/ShapeType";
import { setImage, setChannels, setOperation } from "../../../../../store";
import { useDispatch } from "react-redux";
import * as ImageJS from "image-js";
import { ChannelType } from "../../../../../types/ChannelType";
import { ToolType } from "../../../../../types/ToolType";

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
            channels: image.components,
            frames: 1,
            height: image.height,
            planes: 1,
            width: image.width,
          };

          let channels: Array<ChannelType> = []; //number of channels depends if image is greyscale or RGB
          for (let i = 0; i < image.components; i++) {
            channels.push({ visible: true, range: [0, 255] });
          }
          dispatch(setChannels({ channels }));

          dispatch(
            setImage({
              image: {
                id: "",
                annotations: [],
                name: name,
                shape: shape,
                originalSrc: image.toDataURL(),
                src: image.toDataURL(),
              },
            })
          );

          dispatch(setOperation({ operation: ToolType.RectangularAnnotation }));
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
