import React from "react";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";
import { CategoryType } from "../../../../../types/CategoryType";
import { useTranslation } from "../../../../../hooks/useTranslation";
import { applicationSlice } from "../../../../../store";
import { useDispatch, useSelector } from "react-redux";
import {
  categoriesSelector,
  selectedCategorySelector,
} from "../../../../../store/selectors";

type HideOtherCategoriesMenuItemProps = {
  onCloseCategoryMenu: (
    event: React.MouseEvent<HTMLElement, MouseEvent>
  ) => void;
};

export const HideOtherCategoriesMenuItem = ({
  onCloseCategoryMenu,
}: HideOtherCategoriesMenuItemProps) => {
  const categories = useSelector(categoriesSelector);

  const category = useSelector(selectedCategorySelector);

  const dispatch = useDispatch();

  const onClick = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    for (let cat of categories) {
      if (category.id != cat.id) {
        dispatch(
          applicationSlice.actions.setCategoryVisibility({
            category: cat,
            visible: false,
          })
        );
      }
    }
    onCloseCategoryMenu(event);
  };

  const t = useTranslation();

  return (
    <MenuItem onClick={onClick}>
      <Typography variant="inherit">{t("Hide other categories")}</Typography>
    </MenuItem>
  );
};
