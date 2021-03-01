import Drawer from "@material-ui/core/Drawer";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import React from "react";
import { Category } from "../../../../types/Category";
import {
  createdCategoriesSelector,
  unknownCategroySelector,
} from "../../../../store/selectors";
import { useSelector } from "react-redux";
import { useStyles } from "./Categories.css";
import { CollapsibleList } from "../CollapsibleList";
import { CreateCategoryListItem } from "../CreateCategoryListItem";
import { CategoryListItemCheckbox } from "../CategoryListItemCheckbox";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import { CategoryMenu } from "../CategoryMenu";
import { DeleteCategoryDialog } from "../DeleteCategoryDialog";
import { EditCategoryDialog } from "../EditCategoryDialog";
import { useDialog, useMenu } from "../../../../hooks";

type CategoriesProps = {
  activeCategory: Category;
  onCategoryClick: (
    event: React.MouseEvent<HTMLDivElement>,
    category: Category
  ) => void;
};

export const Categories = ({
  activeCategory,
  onCategoryClick,
}: CategoriesProps) => {
  const classes = useStyles();

  const categories: Array<Category> = useSelector(createdCategoriesSelector);

  const unknownCategory: Category = useSelector(unknownCategroySelector);

  const {
    onClose: onCloseDeleteCategoryDialog,
    onOpen: onOpenDeleteCategoryDialog,
    open: openDeleteCategoryDialog,
  } = useDialog();

  const {
    onClose: onCloseEditCategoryDialog,
    onOpen: onOpenEditCategoryDialog,
    open: openEditCategoryDialog,
  } = useDialog();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const onCategoryMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const onCategoryMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Drawer
      anchor="left"
      className={classes.applicationDrawer}
      classes={{ paper: classes.applicationDrawerPaper }}
      open
      variant="persistent"
    >
      <div className={classes.applicationDrawerHeader} />

      <CollapsibleList primary="Categories">
        {categories.map((category: Category) => {
          return (
            <div key={category.id}>
              <ListItem
                button
                dense
                id={category.id}
                onClick={(event) => onCategoryClick(event, category)}
                selected={category.id === activeCategory.id}
              >
                <CategoryListItemCheckbox category={category} />

                <ListItemText
                  id={category.id}
                  primary={category.name}
                  primaryTypographyProps={{ noWrap: true }}
                />

                <ListItemSecondaryAction>
                  <IconButton edge="end" onClick={onCategoryMenuOpen}>
                    <MoreHorizIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>

              <CategoryMenu
                anchorElCategoryMenu={anchorEl}
                category={category}
                onCloseCategoryMenu={onCategoryMenuClose}
                onOpenCategoryMenu={onCategoryMenuOpen}
                onOpenDeleteCategoryDialog={onOpenDeleteCategoryDialog}
                onOpenEditCategoryDialog={onOpenEditCategoryDialog}
                openCategoryMenu={Boolean(anchorEl)}
              />

              <DeleteCategoryDialog
                category={category}
                onClose={onCloseDeleteCategoryDialog}
                open={openDeleteCategoryDialog}
              />

              <EditCategoryDialog
                category={category}
                onCloseDialog={onCloseEditCategoryDialog}
                openDialog={openEditCategoryDialog}
              />
            </div>
          );
        })}

        <ListItem
          button
          dense
          id={unknownCategory.id}
          onClick={(event) => onCategoryClick(event, unknownCategory)}
          selected={unknownCategory.id === activeCategory.id}
        >
          <CategoryListItemCheckbox category={unknownCategory} />

          <ListItemText
            id={unknownCategory.id}
            primary={unknownCategory.name}
            primaryTypographyProps={{ noWrap: true }}
          />
        </ListItem>

        <CreateCategoryListItem />
      </CollapsibleList>
    </Drawer>
  );
};
