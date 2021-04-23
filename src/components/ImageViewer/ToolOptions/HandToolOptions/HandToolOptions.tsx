import React from "react";
import { InformationBox } from "../InformationBox";
import Divider from "@material-ui/core/Divider";
import { useTranslation } from "../../../../hooks/useTranslation";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { useDispatch } from "react-redux";
import { applicationSlice } from "../../../../store/slices";

export const HandToolOptions = () => {
  const t = useTranslation();

  const dispatch = useDispatch();

  const onResetClick = () => {
    dispatch(
      applicationSlice.actions.setStagePosition({
        stagePosition: { x: 0, y: 0 },
      })
    );
  };

  return (
    <React.Fragment>
      <InformationBox description="…" name={t("Hand tool")} />

      <Divider />

      <List dense>
        <ListItem button onClick={onResetClick}>
          <ListItemText>{t("Reset position")}</ListItemText>
        </ListItem>
      </List>
    </React.Fragment>
  );
};
