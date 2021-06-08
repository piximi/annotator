import Divider from "@material-ui/core/Divider";
import React from "react";
import { InformationBox } from "../InformationBox";
import { useTranslation } from "../../../../hooks/useTranslation";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import SvgIcon from "@material-ui/core/SvgIcon";
import { ReactComponent as InvertSelectionIcon } from "../../../icons/InvertAnnotation.svg";
import ListItemText from "@material-ui/core/ListItemText";
import { applicationSlice, setSelectedAnnotation } from "../../../../store";
import { useDispatch, useSelector } from "react-redux";
import { selectedAnnotationsSelector } from "../../../../store/selectors/selectedAnnotationsSelector";
import { unselectedAnnotationsSelector } from "../../../../store/selectors/unselectedAnnotationsSelector";
import { CategoryType } from "../../../../types/CategoryType";
import { CollapsibleList } from "../../CategoriesList/CollapsibleList";
import { categoriesSelector } from "../../../../store/selectors";
import LabelIcon from "@material-ui/icons/Label";

export const PointerSelectionOptions = () => {
  const t = useTranslation();

  const dispatch = useDispatch();

  const selectedAnnotations = useSelector(selectedAnnotationsSelector);
  const unselectedAnnotations = useSelector(unselectedAnnotationsSelector);
  const categories = useSelector(categoriesSelector);

  const onSelectAll = () => {
    const allAnnotations = [...selectedAnnotations, ...unselectedAnnotations];
    dispatch(
      applicationSlice.actions.setSelectedAnnotations({
        selectedAnnotations: allAnnotations,
      })
    );
    dispatch(
      applicationSlice.actions.setSelectedAnnotation({
        selectedAnnotation: allAnnotations[0],
      })
    );
  };

  const onSelectNone = () => {
    dispatch(
      applicationSlice.actions.setSelectedAnnotations({
        selectedAnnotations: [],
      })
    );
  };

  const onSelectCategory = (
    event:
      | React.MouseEvent<HTMLLIElement>
      | React.MouseEvent<HTMLAnchorElement>
      | React.MouseEvent<HTMLDivElement>,
    category: CategoryType
  ) => {
    const allAnnotations = [...selectedAnnotations, ...unselectedAnnotations];
    const desiredAnnotations = allAnnotations.filter((annotation) => {
      return annotation.categoryId === category.id;
    });
    dispatch(
      applicationSlice.actions.setSelectedAnnotations({
        selectedAnnotations: desiredAnnotations,
      })
    );
    dispatch(
      applicationSlice.actions.setSelectedAnnotation({
        selectedAnnotation: desiredAnnotations[0],
      })
    );
  };

  return (
    <React.Fragment>
      <InformationBox description="…" name={t("Select annotations")} />

      <Divider />

      <List>
        <ListItem button onClick={onSelectAll} dense>
          <ListItemIcon>
            <SvgIcon>
              <InvertSelectionIcon />
            </SvgIcon>
          </ListItemIcon>

          <ListItemText primary={t("Select all")} />
        </ListItem>
        <ListItem button onClick={onSelectNone} dense>
          <ListItemIcon>
            <SvgIcon>
              <InvertSelectionIcon />
            </SvgIcon>
          </ListItemIcon>

          <ListItemText primary={t("Select none")} />
        </ListItem>
      </List>

      <Divider />
      <CollapsibleList closed dense primary={t("Select Category")}>
        {categories.map((category: CategoryType) => {
          return (
            <ListItem
              button
              id={category.id}
              onClick={(event) => onSelectCategory(event, category)}
            >
              <ListItemIcon>
                <LabelIcon style={{ color: category.color }} />
              </ListItemIcon>
              <ListItemText primary={category.name} />
            </ListItem>
          );
        })}
      </CollapsibleList>
    </React.Fragment>
  );
};
