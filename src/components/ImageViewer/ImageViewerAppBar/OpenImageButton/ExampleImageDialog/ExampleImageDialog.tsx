import Dialog from "@material-ui/core/Dialog";
import React from "react";
import { ShapeType } from "../../../../../types/ShapeType";
import { setImage } from "../../../../../store";
import { useDispatch } from "react-redux";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import malaria from "../../../../../images/malaria.png";

type ExampleImageDialogProps = {
  onClose: () => void;
  open: boolean;
};

export const ExampleImageDialog = ({
  onClose,
  open,
}: ExampleImageDialogProps) => {
  const dispatch = useDispatch();

  const examples = [
    {
      name: "malaria.png",
      description:
        "Blood cells infected by malaria and stained with Giemsa reagent. Image from the Broad Bioimage Benchmark Collection, image set BBBC041v1.",
      data: malaria,
    },
  ];

  const onClick = ({
    data,
    description,
    name,
  }: {
    data: any;
    description: string;
    name: string;
  }) => {
    onClose();

    const shape: ShapeType = {
      channels: 3,
      frames: 1,
      height: 1200,
      planes: 1,
      width: 1600,
    };

    dispatch(
      setImage({
        image: {
          id: "",
          annotations: [],
          name: name,
          shape: shape,
          src: data as string,
        },
      })
    );
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <List component="div" role="list">
        {examples.map((example, index) => {
          return (
            <ListItem
              button
              divider
              key={index}
              role="listitem"
              onClick={() => onClick(example)}
            >
              <ListItemText
                primary={example.name}
                secondary={example.description}
              />
            </ListItem>
          );
        })}
      </List>
    </Dialog>
  );
};
