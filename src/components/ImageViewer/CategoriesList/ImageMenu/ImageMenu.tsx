import React from "react";
import Menu from "@material-ui/core/Menu";
import MenuList from "@material-ui/core/MenuList";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";
import { useDispatch, useSelector } from "react-redux";
import { applicationSlice, setImages } from "../../../../store";
import { useTranslation } from "../../../../hooks/useTranslation";
import { activeImageId } from "../../../../store/selectors/activeImageId";

type ImageMenuProps = {
  anchorElImageMenu: any;
  onCloseImageMenu: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  openImageMenu: boolean;
};

export const ImageMenu = ({
  anchorElImageMenu,
  onCloseImageMenu,
  openImageMenu,
}: ImageMenuProps) => {
  const dispatch = useDispatch();
  const currentImageId = useSelector(activeImageId);

  const onClearAnnotationsClick = (
    event: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    if (!currentImageId) return;
    dispatch(
      applicationSlice.actions.deleteImageInstances({ imageId: currentImageId })
    );
    onCloseImageMenu(event);
  };

  const onDeleteImage = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    if (!currentImageId) return;
    dispatch(applicationSlice.actions.deleteImage({ id: currentImageId }));
    onCloseImageMenu(event);
  };

  const t = useTranslation();

  return (
    <Menu
      anchorEl={anchorElImageMenu}
      anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
      getContentAnchorEl={null}
      onClose={onCloseImageMenu}
      open={openImageMenu}
      transformOrigin={{ horizontal: "center", vertical: "top" }}
    >
      <MenuList dense variant="menu">
        <div>
          <MenuItem onClick={onClearAnnotationsClick}>
            <Typography variant="inherit">{t("Clear Annotations")}</Typography>
          </MenuItem>

          <MenuItem onClick={onDeleteImage}>
            <Typography variant="inherit">{t("Delete Image")}</Typography>
          </MenuItem>
        </div>
      </MenuList>
    </Menu>
  );
};
