import React from "react";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";
import { Category } from "../../../../../types/Category";
import { useTranslation } from "../../../../../hooks/useTranslation";

type HideOtherCategoriesMenuItemProps = {
  category: Category;
  onCloseCategoryMenu: (
    event: React.MouseEvent<HTMLElement, MouseEvent>
  ) => void;
};

export const HideOtherCategoriesMenuItem = ({
  category,
  onCloseCategoryMenu,
}: HideOtherCategoriesMenuItemProps) => {
  const onClick = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    onCloseCategoryMenu(event);

    // TODO: dispatch hide category action
  };

  const t = useTranslation();

  return (
    <MenuItem onClick={onClick}>
      <Typography variant="inherit">{t("Hide other categories")}</Typography>
    </MenuItem>
  );
};
