import React, {
  ChangeEvent,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { InformationBox } from "../InformationBox";
import Divider from "@material-ui/core/Divider";
import { useTranslation } from "../../../../hooks/useTranslation";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { useDispatch, useSelector } from "react-redux";
import { applicationSlice } from "../../../../store/slices";
import { imageOriginalSrcSelector } from "../../../../store/selectors";
import * as ImageJS from "image-js";
import { IntensityRescalingSlider } from "../IntensityRescalingSlider/IntensityRescalingSlider";
import { channelsSelector } from "../../../../store/selectors/intensityRangeSelector";
import { ChannelType } from "../../../../types/ChannelType";

export const ColorAdjustmentOptions = () => {
  const t = useTranslation();

  const dispatch = useDispatch();

  const firstUpdate = useRef(true);

  const originalSrc = useSelector(imageOriginalSrcSelector);

  const channels = useSelector(channelsSelector);

  const [prevChannels, setPrevChannels] = useState<Array<ChannelType>>([]); //used to keep track of which channel was changed

  const [channelData, setChannelData] = useState<Array<Array<number>>>([]);

  const [image, setImage] = useState<ImageJS.Image>();

  const [currentImageData, setCurrentImageData] = useState<Array<number>>([]);

  useEffect(() => {
    if (!originalSrc) return;

    ImageJS.Image.load(originalSrc).then((image) => {
      setImage(image);

      const delta = image.alpha ? image.components + 1 : image.components;

      const newChannelData: Array<Array<number>> = [];

      for (let i = 0; i < channels.length; i++) {
        const currentChannel = getChannel(i, Array.from(image.data), delta);
        newChannelData.push(currentChannel);
      }

      setChannelData(newChannelData);

      setPrevChannels(channels);

      setCurrentImageData(Array.from(image.data));
    });
  }, [originalSrc]);

  useLayoutEffect(() => {
    //layout effect is used to prevent unnecessary rerendering on first render
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }

    const changedChannel = changedChannelIndex();

    if (changedChannel === undefined || changedChannel === -1) return;

    mapIntensities(changedChannel);

    setPrevChannels(channels);
  }, [channels, originalSrc]);

  /*
   * Find out the channel index that was changed by the slider to avoid rescaling al channels
   * */
  const changedChannelIndex = () => {
    const visibles = channels.map((channel: ChannelType) => channel.visible);
    const ranges = channels.map((channel: ChannelType) => channel.range);
    const changedChannels = prevChannels.map(
      (prevChannel: ChannelType, idx: number) => {
        if (
          prevChannel.range[0] !== ranges[idx][0] ||
          prevChannel.range[1] !== ranges[idx][1] ||
          prevChannel.visible !== visibles[idx]
        ) {
          return idx;
        } else return -1;
      }
    );

    return changedChannels.find((index: number) => {
      return index !== -1;
    });
  };

  const scaleIntensity = (range: Array<number>, pixel: number) => {
    if (pixel < range[0]) return 0;
    return 255 * ((pixel - range[0]) / (range[1] - range[0]));
  };

  const setChannel = (
    channelIdx: number,
    updatedChannel: Array<number>,
    delta: number
  ) => {
    let j = channelIdx;
    let newData: Array<number> = currentImageData;
    for (let i = 0; i < updatedChannel.length; i++) {
      newData[j] = updatedChannel[i];
      j += delta;
    }
    setCurrentImageData(newData);
  };

  const getChannel = (
    channelIdx: number,
    data: Array<number>,
    delta: number
  ) => {
    let channelData: Array<number> = [];
    let j = 0;
    for (let i = channelIdx; i < data.length; i += delta) {
      channelData[j] = data[i];
      j += 1;
    }
    return channelData;
  };

  const updateChannel = (channel: ChannelType, channelData: Array<number>) => {
    if (!channel.visible) return Array(channelData.length).fill(0);
    return channelData.map((pixel: number) => {
      return scaleIntensity(channel.range, pixel);
    });
  };

  const mapIntensities = (channelIndex: number) => {
    if (!image) return;

    const delta = image.alpha ? image.components + 1 : image.components;

    const updatedChannel = updateChannel(
      channels[channelIndex],
      channelData[channelIndex]
    );
    setChannel(channelIndex, updatedChannel, delta);

    const newImage = new ImageJS.Image(
      image.width,
      image.height,
      currentImageData,
      {
        components: image.components,
        alpha: image.alpha,
      }
    );

    dispatch(
      applicationSlice.actions.setImageSrc({
        src: newImage.toDataURL("image-png", { useCanvas: true }),
      })
    );
  };

  const [values, setValues] = React.useState<Array<Array<number>>>([
    [0, 255],
    [0, 255],
    [0, 255],
  ]);

  const [checked, setChecked] = React.useState([0, 1, 2]);

  const updateValues = (values: Array<Array<number>>) => {
    setValues(values);
  };

  const updateChecked = (checked: Array<number>) => {
    setChecked(checked);
  };

  const onResetChannelsClick = () => {
    dispatch(
      applicationSlice.actions.setChannels({
        channels: [
          {
            range: [0, 255],
            visible: true,
          },
          {
            range: [0, 255],
            visible: true,
          },
          {
            range: [0, 255],
            visible: true,
          },
        ],
      })
    );
    setValues([
      [0, 255],
      [0, 255],
      [0, 255],
    ]); //reflect change in the slider values
    setChecked([0, 1, 2]);
  };

  return (
    <React.Fragment>
      <InformationBox description="…" name={t("Color adjustment tool")} />

      <Divider />

      <IntensityRescalingSlider
        intensityRanges={values}
        updateIntensityRanges={updateValues}
      />

      <List dense>
        <ListItem button onClick={onResetChannelsClick}>
          <ListItemText>{t("Reset")}</ListItemText>
        </ListItem>
      </List>
    </React.Fragment>
  );
};
