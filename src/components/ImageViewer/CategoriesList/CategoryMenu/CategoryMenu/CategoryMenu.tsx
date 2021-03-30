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

type CategoryMenuProps = {
  anchorElCategoryMenu: any;
  category: CategoryType;
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
  category,
  onCloseCategoryMenu,
  openCategoryMenu,
  onOpenDeleteCategoryDialog,
  onOpenEditCategoryDialog,
}: CategoryMenuProps) => {
  const onOpenDeleteCategoryDialogClick = (
    event: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    onOpenDeleteCategoryDialog();
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
          category={category}
          onCloseCategoryMenu={onCloseCategoryMenu}
        />

        <HideOrShowCategoryMenuItem
          category={category}
          onCloseCategoryMenu={onCloseCategoryMenu}
        />

        {category.id !== "00000000-0000-0000-0000-000000000000" && (
          <div>
            <Divider />

            <MenuItem onClick={onOpenEditCategoryDialogClick}>
              <Typography variant="inherit">{t("Edit category")}</Typography>
            </MenuItem>

            <MenuItem onClick={onOpenDeleteCategoryDialogClick}>
              <Typography variant="inherit">{t("Delete category")}</Typography>
            </MenuItem>
          </div>
        )}
      </MenuList>
    </Menu>
  );
};
