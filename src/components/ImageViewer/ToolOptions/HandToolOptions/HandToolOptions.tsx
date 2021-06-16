import React from "react";
import { InformationBox } from "../InformationBox";
import Divider from "@material-ui/core/Divider";
import { useTranslation } from "../../../../hooks/useTranslation";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { useDispatch } from "react-redux";
import { applicationSlice } from "../../../../store/slices";
import { ResetButton } from "./ResetButton";

export const HandToolOptions = () => {
  const t = useTranslation();

  return (
    <React.Fragment>
      <InformationBox description="…" name={t("Hand tool")} />

      <Divider />

      <List dense>
        <ResetButton />
      </List>
    </React.Fragment>
  );
};
