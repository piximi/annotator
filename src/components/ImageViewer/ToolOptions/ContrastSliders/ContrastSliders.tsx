import List from "@material-ui/core/List";
import ListSubheader from "@material-ui/core/ListSubheader";
import { ListItem } from "@material-ui/core";
import ListItemText from "@material-ui/core/ListItemText";
import React, { useEffect } from "react";
import Slider from "@material-ui/core/Slider";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Checkbox from "@material-ui/core/Checkbox";
import { CheckboxCheckedIcon, CheckboxUncheckedIcon } from "../../../icons";
import { applicationSlice } from "../../../../store/slices";
import { useDispatch, useSelector } from "react-redux";
import { intensityRangeSelector } from "../../../../store/selectors/intensityRangeSelector";
import * as _ from "lodash";

export const ContrastSliders = () => {
  const dispatch = useDispatch();

  const intensityRange = useSelector(intensityRangeSelector);

  const [values, setValues] = React.useState<Array<Array<number>>>([
    [0, 255],
    [0, 255],
    [0, 255],
  ]);

  const handleChange = (
    idx: number,
    event: any,
    newValue: number | number[]
  ) => {
    const newValues = [...values];
    newValues[idx] = newValue as Array<number>;
    setValues(newValues);
  };

  const handleChangeCommitted = (
    idx: number,
    event: object,
    value: number | number[]
  ) => {
    console.info({ ...intensityRange, red: value as Array<number> });
    if (idx === 0)
      dispatch(
        applicationSlice.actions.setIntensityRange({
          intensityRange: { ...intensityRange, red: value as Array<number> },
        })
      );
    else if (idx === 1)
      dispatch(
        applicationSlice.actions.setIntensityRange({
          intensityRange: { ...intensityRange, green: value as Array<number> },
        })
      );
    else if (idx === 2)
      dispatch(
        applicationSlice.actions.setIntensityRange({
          intensityRange: { ...intensityRange, blue: value as Array<number> },
        })
      );
  };

  const [checked, setChecked] = React.useState([0, 1, 2]);

  const onChange = (index: number) => () => {
    const current = checked.indexOf(index);

    const updated = [...checked];

    if (current === -1) {
      updated.push(index);
    } else {
      updated.splice(current, 1);
    }

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
            onClick={onChange(0)}
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
          onChangeCommitted={(event, value: number | number[]) =>
            handleChangeCommitted(0, event, value)
          }
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
            onClick={onChange(1)}
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
          onChangeCommitted={(event, value: number | number[]) =>
            handleChangeCommitted(1, event, value)
          }
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
            onClick={onChange(2)}
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
          onChangeCommitted={(event, value: number | number[]) =>
            handleChangeCommitted(2, event, value)
          }
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
