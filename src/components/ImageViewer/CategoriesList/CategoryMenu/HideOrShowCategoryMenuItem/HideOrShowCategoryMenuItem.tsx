import React from "react";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";
import { CategoryType } from "../../../../../types/CategoryType";
import { useTranslation } from "../../../../../hooks/useTranslation";
import { useDispatch, useSelector } from "react-redux";
import { applicationSlice } from "../../../../../store";
import { selectedCategroySelector } from "../../../../../store/selectors";

type HideOrShowCategoryMenuItemProps = {
  category: CategoryType;
  onCloseCategoryMenu: (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>
  ) => void;
};

export const HideOrShowCategoryMenuItem = ({
  onCloseCategoryMenu,
}: HideOrShowCategoryMenuItemProps) => {
  const dispatch = useDispatch();

  const category = useSelector(selectedCategroySelector);

  const onClick = (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    dispatch(
      applicationSlice.actions.setCategoryVisibility({
        category: category,
        visible: !category.visible,
      })
    );

    onCloseCategoryMenu(event);
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
