import React from "react";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Checkbox from "@material-ui/core/Checkbox";
import LabelIcon from "@material-ui/icons/Label";
import LabelOutlinedIcon from "@material-ui/icons/LabelOutlined";
import { Category } from "../../../../types/Category";
import { useDispatch } from "react-redux";
import { slice } from "../../../../store";

type CategoryListItemCheckboxProps = {
  category: Category;
};

export const CategoryListItemCheckbox = ({
  category,
}: CategoryListItemCheckboxProps) => {
  const dispatch = useDispatch();

  const onCheckboxClick = () => {
    dispatch(
      slice.actions.setCategoryVisibility({
        category: category,
        visible: !category.visible,
      })
    );
  };

  return (
    <ListItemIcon>
      <Checkbox
        checked={category.visible}
        checkedIcon={<LabelIcon style={{ color: category.color }} />}
        disableRipple
        edge="start"
        icon={<LabelOutlinedIcon style={{ color: category.color }} />}
        onClick={onCheckboxClick}
        tabIndex={-1}
      />
    </ListItemIcon>
  );
};
