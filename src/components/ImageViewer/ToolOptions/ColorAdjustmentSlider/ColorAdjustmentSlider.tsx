import List from "@material-ui/core/List";
import ListSubheader from "@material-ui/core/ListSubheader";
import { ListItem } from "@material-ui/core";
import ListItemText from "@material-ui/core/ListItemText";
import React, { useEffect, useState } from "react";
import Slider from "@material-ui/core/Slider";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Checkbox from "@material-ui/core/Checkbox";
import { CheckboxCheckedIcon, CheckboxUncheckedIcon } from "../../../icons";
import { applicationSlice } from "../../../../store/slices";
import { useDispatch, useSelector } from "react-redux";
import { channelsSelector } from "../../../../store/selectors/intensityRangeSelector";
import { ChannelType } from "../../../../types/ChannelType";
import * as _ from "lodash";

type ColorAdjustmentSlider = {
  updateDisplayedValues: (values: Array<Array<number>>) => void;
  displayedValues: Array<Array<number>>;
};
export const ColorAdjustmentSlider = ({
  displayedValues,
  updateDisplayedValues,
}: ColorAdjustmentSlider) => {
  const dispatch = useDispatch();

  const channels = useSelector(channelsSelector);

  const visibleChannelsIndices = channels
    .map((channel: ChannelType, idx) => channel.visible)
    .reduce((c: Array<number>, v, i) => (v ? c.concat(i) : c), []);

  const handleSliderChange = (
    idx: number,
    event: any,
    newValue: number | number[]
  ) => {
    const copiedValues = [...displayedValues].map((range: Array<number>) => {
      return [...range];
    });
    copiedValues[idx] = newValue as Array<number>;
    updateDisplayedValues(copiedValues);
    debouncedSliderChange();
  };

  const updateIntensityRanges = () => {
    const copiedValues = [...displayedValues].map((range: Array<number>) => {
      return [...range];
    });

    const updatedChannels = channels.map(
      (channel: ChannelType, index: number) => {
        return { ...channel, range: copiedValues[index] };
      }
    );

    dispatch(
      applicationSlice.actions.setChannels({
        channels: updatedChannels,
      })
    );
  };

  const debouncedSliderChange = _.debounce(() => {
    updateIntensityRanges();
  }, 20);

  const onCheckboxChanged = (index: number) => () => {
    const current = visibleChannelsIndices.indexOf(index);

    const updated = [...visibleChannelsIndices];

    const copiedChannels = [...channels];

    if (current === -1) {
      updated.push(index);
      copiedChannels[index] = { ...copiedChannels[index], visible: true };
    } else {
      updated.splice(current, 1);
      copiedChannels[index] = { ...copiedChannels[index], visible: false };
    }
    dispatch(
      applicationSlice.actions.setChannels({
        channels: copiedChannels,
      })
    );
  };

  return (
    <List
      component="nav"
      subheader={<ListSubheader component="div">Channels</ListSubheader>}
    >
      <ListItem dense>
        <ListItemIcon>
          <Checkbox
            onClick={onCheckboxChanged(0)}
            checked={visibleChannelsIndices.indexOf(0) !== -1}
            disableRipple
            edge="start"
            icon={<CheckboxUncheckedIcon />}
            checkedIcon={<CheckboxCheckedIcon />}
            tabIndex={-1}
          />
        </ListItemIcon>
        <ListItemText primary="Red" />
        <Slider
          disabled={!(visibleChannelsIndices.indexOf(0) !== -1)} //TODO style slider when disabled mode
          style={{ width: "60%" }}
          value={displayedValues[0]}
          max={255}
          onChange={(event, value: number | number[]) =>
            handleSliderChange(0, event, value)
          }
          valueLabelDisplay="auto"
          aria-labelledby="range-slider"
        />
      </ListItem>

      <ListItem dense>
        <ListItemIcon>
          <Checkbox
            onClick={onCheckboxChanged(1)}
            checked={visibleChannelsIndices.indexOf(1) !== -1}
            disableRipple
            edge="start"
            icon={<CheckboxUncheckedIcon />}
            checkedIcon={<CheckboxCheckedIcon />}
            tabIndex={-1}
          />
        </ListItemIcon>
        <ListItemText primary="Green" />
        <Slider
          disabled={!(visibleChannelsIndices.indexOf(1) !== -1)} //TODO style slider when disabled mode
          style={{ width: "60%" }}
          value={displayedValues[1]}
          max={255}
          onChange={(event, value: number | number[]) =>
            handleSliderChange(1, event, value)
          }
          valueLabelDisplay="auto"
          aria-labelledby="range-slider"
        />
      </ListItem>

      <ListItem dense>
        <ListItemIcon>
          <Checkbox
            onClick={onCheckboxChanged(2)}
            checked={visibleChannelsIndices.indexOf(2) !== -1}
            disableRipple
            edge="start"
            icon={<CheckboxUncheckedIcon />}
            checkedIcon={<CheckboxCheckedIcon />}
            tabIndex={-1}
          />
        </ListItemIcon>
        <ListItemText primary="Blue" />
        <Slider
          disabled={!(visibleChannelsIndices.indexOf(2) !== -1)} //TODO style slider when disabled mode
          style={{ width: "60%" }}
          value={displayedValues[2]}
          max={255}
          onChange={(event, value: number | number[]) =>
            handleSliderChange(2, event, value)
          }
          valueLabelDisplay="auto"
          aria-labelledby="range-slider"
        />
      </ListItem>
    </List>
  );
};
