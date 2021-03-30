import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Radio from "@material-ui/core/Radio";
import React from "react";
import RadioGroup from "@material-ui/core/RadioGroup";
import { useDispatch, useSelector } from "react-redux";
import { selectionModeSelector } from "../../../../../store/selectors";
import { applicationSlice } from "../../../../../store";
import { SelectionMode } from "../../../../../types/SelectionMode";
import ListSubheader from "@material-ui/core/ListSubheader";
import { NewTooltip } from "../NewTooltip";
import { AddTooltip } from "../AddTooltip";
import { SubtractTooltip } from "../SubtractTooltip";
import { IntersectionTooltip } from "../IntersectionTooltip";
import { RadioCheckedIcon, RadioUncheckedIcon } from "../../../../icons";
import { useTranslation } from "../../../../../hooks/useTranslation";

export const AnnotationMode = () => {
  const dispatch = useDispatch();

  const annotationMode = useSelector(selectionModeSelector);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const payload = {
      selectionMode: parseInt((event.target as HTMLInputElement).value),
    };
    dispatch(applicationSlice.actions.setSelectionMode(payload));
  };

  const onClickLabel = (event: any, mode: SelectionMode) => {
    const payload = {
      selectionMode: mode,
    };
    dispatch(applicationSlice.actions.setSelectionMode(payload));
  };

  const t = useTranslation();

  return (
    <RadioGroup
      aria-label="annotation mode"
      name="annotation-mode"
      onChange={onChange}
      value={annotationMode}
    >
      <List
        component="nav"
        subheader={
          <ListSubheader component="div">{t("Annotation mode")}</ListSubheader>
        }
      >
        <NewTooltip>
          <ListItem
            button
            dense
            onClick={(event) => onClickLabel(event, SelectionMode.New)}
          >
            <ListItemIcon>
              <Radio
                disableRipple
                edge="start"
                icon={<RadioUncheckedIcon />}
                checkedIcon={<RadioCheckedIcon />}
                tabIndex={-1}
                value={SelectionMode.New}
              />
            </ListItemIcon>

            <ListItemText primary={t("New annotation")} />
          </ListItem>
        </NewTooltip>

        <AddTooltip>
          <ListItem
            button
            dense
            onClick={(event) => onClickLabel(event, SelectionMode.Add)}
          >
            <ListItemIcon>
              <Radio
                disableRipple
                edge="start"
                icon={<RadioUncheckedIcon />}
                checkedIcon={<RadioCheckedIcon />}
                tabIndex={-1}
                value={SelectionMode.Add}
              />
            </ListItemIcon>

            <ListItemText primary={t("Add area")} />
          </ListItem>
        </AddTooltip>

        <SubtractTooltip>
          <ListItem
            button
            dense
            onClick={(event) => onClickLabel(event, SelectionMode.Subtract)}
          >
            <ListItemIcon>
              <Radio
                disableRipple
                edge="start"
                icon={<RadioUncheckedIcon />}
                checkedIcon={<RadioCheckedIcon />}
                tabIndex={-1}
                value={SelectionMode.Subtract}
              />
            </ListItemIcon>

            <ListItemText primary={t("Subtract area")} />
          </ListItem>
        </SubtractTooltip>

        <IntersectionTooltip>
          <ListItem
            button
            dense
            onClick={(event) => onClickLabel(event, SelectionMode.Intersect)}
          >
            <ListItemIcon>
              <Radio
                disableRipple
                edge="start"
                icon={<RadioUncheckedIcon />}
                checkedIcon={<RadioCheckedIcon />}
                tabIndex={-1}
                value={SelectionMode.Intersect}
              />
            </ListItemIcon>

            <ListItemText primary={t("Intersection")} />
          </ListItem>
        </IntersectionTooltip>
      </List>
    </RadioGroup>
  );
};
