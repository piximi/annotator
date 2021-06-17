import React from "react";
import Menu from "@material-ui/core/Menu";
import MenuList from "@material-ui/core/MenuList";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";
import { useDispatch, useSelector } from "react-redux";
import { applicationSlice, setImages } from "../../../../store";
import { useTranslation } from "../../../../hooks/useTranslation";
import { activeImageIdSelector } from "../../../../store/selectors/activeImageIdSelector";
import {
  saveAnnotationsAsMasks,
  saveAnnotationsAsMatrix,
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

  const onExportAnnotations = (
    event: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    let zip = new JSZip();

    const activeImage = images.find((image: ImageType) => {
      return image.id === currentImageId;
    });

    if (!activeImage) return;

    Promise.all(saveAnnotationsAsMasks([activeImage], categories, zip)).then(
      () => {
        zip.generateAsync({ type: "blob" }).then((blob) => {
          saveAs(blob, "annotations.zip");
        });
      }
    );
  };

  const onExportLabels = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    let zip = new JSZip();

    const activeImage = images.find((image: ImageType) => {
      return image.id === currentImageId;
    });

    if (!activeImage) return;

    Promise.all(saveAnnotationsAsMatrix([activeImage], categories, zip)).then(
      () => {
        zip.generateAsync({ type: "blob" }).then((blob) => {
          saveAs(blob, "labels.zip");
        });
      }
    );
  };

  const onExportBinaryImage = (
    event: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    let zip = new JSZip();

    const activeImage = images.find((image: ImageType) => {
      return image.id === currentImageId;
    });

    if (!activeImage) return;

    Promise.all(
      saveAnnotationsAsMatrix([activeImage], categories, zip, true)
    ).then(() => {
      zip.generateAsync({ type: "blob" }).then((blob) => {
        saveAs(blob, "labels.zip");
      });
    });
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
          <MenuItem onClick={onExportAnnotations}>
            <Typography variant="inherit">{t("Export annotations")}</Typography>
          </MenuItem>
          <MenuItem onClick={onExportLabels}>
            <Typography variant="inherit">
              {t("Export label matrices")}
            </Typography>
          </MenuItem>
          <MenuItem onClick={onExportBinaryImage}>
            <Typography variant="inherit">
              {t("Export binary images")}
            </Typography>
          </MenuItem>
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
