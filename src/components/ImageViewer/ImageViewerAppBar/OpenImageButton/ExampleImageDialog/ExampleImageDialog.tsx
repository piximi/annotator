import Dialog from "@material-ui/core/Dialog";
import React from "react";
import { Shape } from "../../../../../types/Shape";
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
      name: "example.png",
      description:
        "Fusce lectus lorem, lacinia eu libero eu, pellentesque semper dui. Nunc bibendum est eget lacus fermentum ullamcorper.",
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

    const shape: Shape = {
      r: 512,
      c: 512,
      channels: 4,
    };

    dispatch(
      setImage({
        image: {
          id: "",
          instances: [],
          name: name,
          shape: shape,
          src: data as string,
        },
      })
    );
  };

  return (
    <Dialog open={open}>
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
