import React from "react";
import Menu from "@material-ui/core/Menu";
import MenuList from "@material-ui/core/MenuList";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";
import { useDispatch, useSelector } from "react-redux";
import { applicationSlice } from "../../../../store";
import { useTranslation } from "../../../../hooks/useTranslation";
import { activeImageIdSelector } from "../../../../store/selectors/activeImageIdSelector";
import {
  saveAnnotationsAsInstanceSegmentationMasks,
  saveAnnotationsAsLabelMatrix,
  saveAnnotationsAsSemanticSegmentationMasks,
} from "../../../../image/imageHelper";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import { categoriesSelector } from "../../../../store/selectors";
import { imagesSelector } from "../../../../store/selectors/imagesSelector";
import { ImageType } from "../../../../types/ImageType";
import { Divider } from "@material-ui/core";

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
  const currentImageId = useSelector(activeImageIdSelector);
  const categories = useSelector(categoriesSelector);
  const images = useSelector(imagesSelector);

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

  const onExportInstanceMasks = (
    event: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    setAnchorEl(null);
    onCloseImageMenu(event);

    let zip = new JSZip();

    const activeImage = images.find((image: ImageType) => {
      return image.id === currentImageId;
    });

    if (!activeImage) return;

    saveAnnotationsAsInstanceSegmentationMasks([activeImage], categories, zip);
  };

  const onExportLabels = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    setAnchorEl(null);
    onCloseImageMenu(event);

    let zip = new JSZip();

    const activeImage = images.find((image: ImageType) => {
      return image.id === currentImageId;
    });

    if (!activeImage) return;

    Promise.all(
      saveAnnotationsAsLabelMatrix([activeImage], categories, zip)
    ).then(() => {
      zip.generateAsync({ type: "blob" }).then((blob) => {
        saveAs(blob, "labels.zip");
      });
    });
  };

  const onExportSemanticMasks = (
    event: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    setAnchorEl(null);
    onCloseImageMenu(event);

    let zip = new JSZip();

    const activeImage = images.find((image: ImageType) => {
      return image.id === currentImageId;
    });

    if (!activeImage) return;

    saveAnnotationsAsSemanticSegmentationMasks([activeImage], categories, zip);
  };

  const t = useTranslation();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLLIElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

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
          <MenuItem onClick={handleClick}>Export annotations as</MenuItem>
          <Menu
            id="save-annotations-as-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuList dense variant="menu">
              <div>
                <MenuItem onClick={onExportInstanceMasks}>
                  <Typography variant="inherit">
                    {t("Instance segmentation masks")}
                  </Typography>
                </MenuItem>
                <MenuItem onClick={onExportSemanticMasks}>
                  <Typography variant="inherit">
                    {t("Semantic segmentation masks")}
                  </Typography>
                </MenuItem>
                <MenuItem onClick={onExportLabels}>
                  <Typography variant="inherit">
                    {t("Label matrices")}
                  </Typography>
                </MenuItem>
              </div>
            </MenuList>
          </Menu>
          <Divider />
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
