import * as React from "react";
import { OpenListItem } from "../OpenListItem";
import { SaveListItem } from "../SaveListItem";
import { List } from "@material-ui/core";

export const ApplicationList = () => {
  return (
    <List dense>
      <OpenListItem />

      <SaveListItem />
    </List>
  );
};
