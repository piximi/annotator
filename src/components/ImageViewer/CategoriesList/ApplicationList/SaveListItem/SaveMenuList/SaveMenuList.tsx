import * as React from "react";
import * as MaterialUI from "@material-ui/core";

type Props = {
  anchorEl: any;
  onClose: () => void;
  open: boolean;
};

export const SaveMenuList = (props: Props) => {
  const { anchorEl, onClose, open } = props;

  const anchorPosition = {
    top: open ? anchorEl.getBoundingClientRect().bottom - 3 : 0,
    left: open ? anchorEl.getBoundingClientRect().left + 14 : 0,
  };

  return (
    <React.Fragment>
      <MaterialUI.Popover
        anchorPosition={anchorPosition}
        anchorReference="anchorPosition"
        onClose={onClose}
        open={open}
      >
        <MaterialUI.Paper>
          <MaterialUI.MenuList dense>
            <MaterialUI.MenuItem>
              <MaterialUI.ListItemText primary="Save classifier" />
            </MaterialUI.MenuItem>

            <MaterialUI.Divider />

            <MaterialUI.MenuItem>
              <MaterialUI.ListItemText primary="Save annotations and predictions" />
            </MaterialUI.MenuItem>

            <MaterialUI.MenuItem>
              <MaterialUI.ListItemText primary="Save weights" />
            </MaterialUI.MenuItem>
          </MaterialUI.MenuList>
        </MaterialUI.Paper>
      </MaterialUI.Popover>
    </React.Fragment>
  );
};
