import List from "@material-ui/core/List";
import ListSubheader from "@material-ui/core/ListSubheader";
import { ListItem } from "@material-ui/core";
import ListItemText from "@material-ui/core/ListItemText";
import React from "react";
import Slider from "@material-ui/core/Slider";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Checkbox from "@material-ui/core/Checkbox";
import { CheckboxCheckedIcon, CheckboxUncheckedIcon } from "../../../icons";
import { applicationSlice } from "../../../../store/slices";
import { useDispatch, useSelector } from "react-redux";
import { channelsSelector } from "../../../../store/selectors/intensityRangeSelector";
import { ChannelType } from "../../../../types/ChannelType";

type IntensitySliderProps = {
  values: Array<Array<number>>;
  updateValues: (values: Array<Array<number>>) => void;
};

export const IntensitySlider = ({
  values,
  updateValues,
}: IntensitySliderProps) => {
  const dispatch = useDispatch();

  const channels = useSelector(channelsSelector);

  const [checked, setChecked] = React.useState([0, 1, 2]);

  const handleChange = (
    idx: number,
    event: any,
    newValue: number | number[]
  ) => {
    const newValues = [...values];
    newValues[idx] = newValue as Array<number>;
    updateValues(newValues);
  };

  const handleChangeCommitted = () => {
    const copiedValues = [...values].map((range: Array<number>) => {
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

  const onCheckboxChanged = (index: number) => () => {
    const current = checked.indexOf(index);

    const updated = [...checked];

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

    setChecked(updated);
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
            checked={checked.indexOf(0) !== -1}
            disableRipple
            edge="start"
            icon={<CheckboxUncheckedIcon />}
            checkedIcon={<CheckboxCheckedIcon />}
            tabIndex={-1}
          />
        </ListItemIcon>
        <ListItemText primary="Red" />
        <Slider
          disabled={!(checked.indexOf(0) !== -1)} //TODO style slider when disabled mode
          style={{ width: "60%" }}
          value={values[0]}
          max={255}
          onChangeCommitted={handleChangeCommitted}
          onChange={(event, value: number | number[]) =>
            handleChange(0, event, value)
          }
          valueLabelDisplay="auto"
          aria-labelledby="range-slider"
        />
      </ListItem>

      <ListItem dense>
        <ListItemIcon>
          <Checkbox
            onClick={onCheckboxChanged(1)}
            checked={checked.indexOf(1) !== -1}
            disableRipple
            edge="start"
            icon={<CheckboxUncheckedIcon />}
            checkedIcon={<CheckboxCheckedIcon />}
            tabIndex={-1}
          />
        </ListItemIcon>
        <ListItemText primary="Green" />
        <Slider
          disabled={!(checked.indexOf(1) !== -1)} //TODO style slider when disabled mode
          style={{ width: "60%" }}
          value={values[1]}
          max={255}
          onChangeCommitted={handleChangeCommitted}
          onChange={(event, value: number | number[]) =>
            handleChange(1, event, value)
          }
          valueLabelDisplay="auto"
          aria-labelledby="range-slider"
        />
      </ListItem>

      <ListItem dense>
        <ListItemIcon>
          <Checkbox
            onClick={onCheckboxChanged(2)}
            checked={checked.indexOf(2) !== -1}
            disableRipple
            edge="start"
            icon={<CheckboxUncheckedIcon />}
            checkedIcon={<CheckboxCheckedIcon />}
            tabIndex={-1}
          />
        </ListItemIcon>
        <ListItemText primary="Blue" />
        <Slider
          disabled={!(checked.indexOf(2) !== -1)} //TODO style slider when disabled mode
          style={{ width: "60%" }}
          value={values[2]}
          max={255}
          onChangeCommitted={handleChangeCommitted}
          onChange={(event, value: number | number[]) =>
            handleChange(2, event, value)
          }
          valueLabelDisplay="auto"
          aria-labelledby="range-slider"
        />
      </ListItem>
    </List>
  );
};
