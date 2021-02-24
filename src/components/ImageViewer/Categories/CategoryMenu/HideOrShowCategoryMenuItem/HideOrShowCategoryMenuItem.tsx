import React from "react";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";
import { Category } from "../../../../../types/Category";

type HideOrShowCategoryMenuItemProps = {
  category: Category;
  onCloseCategoryMenu: (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>
  ) => void;
};

export const HideOrShowCategoryMenuItem = ({
  category,
  onCloseCategoryMenu,
}: HideOrShowCategoryMenuItemProps) => {
  const onClick = (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    onCloseCategoryMenu(event);

    const payload = { id: category.id, visible: !category.visible };

    // TODO: dispatch hide or show category action
  };

  return (
    <MenuItem onClick={onClick}>
      <Typography variant="inherit">
        {category.visible ? "Hide" : "Show"} category
      </Typography>
    </MenuItem>
  );
};
