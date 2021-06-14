import React from "react";
import Menu from "@material-ui/core/Menu";
import MenuList from "@material-ui/core/MenuList";
import Divider from "@material-ui/core/Divider";
import { CategoryType } from "../../../../../types/CategoryType";
import { HideOrShowCategoryMenuItem } from "../HideOrShowCategoryMenuItem";
import { HideOtherCategoriesMenuItem } from "../HideOtherCategoriesMenuItem";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";
import { useTranslation } from "../../../../../hooks/useTranslation";
import { useDispatch, useSelector } from "react-redux";
import { imagesSelector } from "../../../../../store/selectors/imagesSelector";
import { applicationSlice } from "../../../../../store/slices";
import { selectedCategorySelector } from "../../../../../store/selectors";

type CategoryMenuProps = {
  anchorElCategoryMenu: any;
  onCloseCategoryMenu: (
    event: React.MouseEvent<HTMLElement, MouseEvent>
  ) => void;
  onOpenCategoryMenu: (event: React.MouseEvent<HTMLButtonElement>) => void;
  openCategoryMenu: boolean;
  onOpenDeleteCategoryDialog: () => void;
  onOpenEditCategoryDialog: () => void;
};

export const CategoryMenu = ({
  anchorElCategoryMenu,
  onCloseCategoryMenu,
  openCategoryMenu,
  onOpenDeleteCategoryDialog,
  onOpenEditCategoryDialog,
}: CategoryMenuProps) => {
  const images = useSelector(imagesSelector);

  const dispatch = useDispatch();

  const category = useSelector(selectedCategorySelector);

  const onOpenDeleteCategoryDialogClick = (
    event: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    //cycle through the annotations to determine if annotations of that category exist
    // show a warning dialog box is they do exist
    let existAnnotations = false;
    for (let i = 0; i < images.length; i++) {
      if (!existAnnotations) {
        for (let j = 0; j < images[i].annotations.length; j++) {
          if (images[i].annotations[j].categoryId === category.id) {
            existAnnotations = true;
          }
        }
      }
    }
    if (existAnnotations) {
      onOpenDeleteCategoryDialog();
    } //warn user that these annotations will be relabeled as unknown
    else {
      dispatch(
        applicationSlice.actions.setSelectedCategory({
          selectedCategory: "00000000-0000-0000-0000-000000000000",
        })
      );

      dispatch(applicationSlice.actions.deleteCategory({ category: category }));
    }
    onCloseCategoryMenu(event);
  };

  const onOpenEditCategoryDialogClick = (
    event: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    onOpenEditCategoryDialog();
    onCloseCategoryMenu(event);
  };

  const t = useTranslation();

  return (
    <Menu
      anchorEl={anchorElCategoryMenu}
      anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
      getContentAnchorEl={null}
      onClose={onCloseCategoryMenu}
      open={openCategoryMenu}
      transformOrigin={{ horizontal: "center", vertical: "top" }}
    >
      <MenuList dense variant="menu">
        <HideOtherCategoriesMenuItem
          onCloseCategoryMenu={onCloseCategoryMenu}
        />

        <HideOrShowCategoryMenuItem
          category={category}
          onCloseCategoryMenu={onCloseCategoryMenu}
        />

        <div>
          <Divider />

          <MenuItem onClick={onOpenEditCategoryDialogClick}>
            <Typography variant="inherit">{t("Edit category")}</Typography>
          </MenuItem>
        </div>

        {category.id !== "00000000-0000-0000-0000-000000000000" && (
          <MenuItem onClick={onOpenDeleteCategoryDialogClick}>
            <Typography variant="inherit">{t("Delete category")}</Typography>
          </MenuItem>
        )}
      </MenuList>
    </Menu>
  );
};
