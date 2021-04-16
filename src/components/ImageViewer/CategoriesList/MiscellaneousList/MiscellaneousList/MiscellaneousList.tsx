import * as React from "react";
import { List } from "@material-ui/core";
import { SettingsListItem } from "../SettingsListItem";
import { SendFeedbackListItem } from "../SendFeedbackListItem";
import { HelpListItem } from "../HelpListItem";

export const MiscellaneousList = () => {
  return (
    <List dense>
      <SettingsListItem />

      <SendFeedbackListItem />

      <HelpListItem />
    </List>
  );
};
