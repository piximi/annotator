import React from "react";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";
import { CategoryType } from "../../../../../types/CategoryType";
import { useTranslation } from "../../../../../hooks/useTranslation";

type HideOrShowCategoryMenuItemProps = {
  category: CategoryType;
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

  const t = useTranslation();

  const translatedHide = t("Hide category");
  const translatedShow = t("Show category");

  return (
    <MenuItem onClick={onClick}>
      <Typography variant="inherit">
        {category.visible ? translatedHide : translatedShow}
      </Typography>
    </MenuItem>
  );
};
