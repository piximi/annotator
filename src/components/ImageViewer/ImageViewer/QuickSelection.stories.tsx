import React, { ComponentProps, useEffect, useRef, useState } from "react";
import { Meta, Story } from "@storybook/react/types-6-0";
import { slic } from "../../../image";
import { SuperpixelArray } from "../../../types/SuperpixelArray";

type QuickSelectionProps = {
  src: string;
};

const QuickSelection = ({ src }: QuickSelectionProps) => {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!ref || !ref.current) return;

    const context = ref.current.getContext("2d");

    if (!context) return;

    const image = new Image();

    image.onload = () => {
      context.drawImage(image, 0, 0, 512, 512);

      const imageData = context.getImageData(0, 0, 512, 512);

      const { image: x, segmentation } = slic(imageData);

      let superpixels: SuperpixelArray = {};

      for (let index = 0; index < segmentation.length; index += 1) {
        const current = segmentation[index];

        if (!superpixels.hasOwnProperty(current)) {
          superpixels[current] = {
            count: 0,
            mask: {
              background: 0,
              foreground: 0,
            },
            mp: [0, 0, 0],
            role: {
              background: false,
              background_and_foreground: false,
              foreground: false,
              unknown: false,
            },
          };
        }

        superpixels[current].count += 1;
        superpixels[current].mp[0] += imageData.data[4 * index];
        superpixels[current].mp[1] += imageData.data[4 * index + 1];
        superpixels[current].mp[2] += imageData.data[4 * index + 2];
      }

      for (const superpixel in superpixels) {
        superpixels[superpixel].mp[0] /= superpixels[superpixel].count;
        superpixels[superpixel].mp[1] /= superpixels[superpixel].count;
        superpixels[superpixel].mp[2] /= superpixels[superpixel].count;
      }

      Object.values(superpixels).forEach((superpixel) => {
        if (
          superpixel.mask.foreground > 0 &&
          superpixel.mask.background === 0
        ) {
          superpixel.role.foreground = true;
        } else if (
          superpixel.mask.foreground === 0 &&
          superpixel.mask.background > 0
        ) {
          superpixel.role.background = true;
        } else if (
          superpixel.mask.foreground > 0 &&
          superpixel.mask.background > 0
        ) {
          superpixel.role.background_and_foreground = true;
        } else {
          superpixel.role.unknown = true;
        }
      });

      for (let index = 0; index < segmentation.length; index += 1) {
        if (superpixels[segmentation[index]].role.foreground) {
          imageData.data[4 * index] = imageData.data[4 * index];
          imageData.data[4 * index + 1] = imageData.data[4 * index + 1];
          imageData.data[4 * index + 2] = imageData.data[4 * index + 2];
          imageData.data[4 * index + 3] = 255;
        } else {
          imageData.data[4 * index + 3] = 0;
        }
      }

      let superpixel;
      for (let index = 0; index < segmentation.length; ++index) {
        superpixel = superpixels[segmentation[index]];
        imageData.data[4 * index + 3] = 255;

        if (segmentation[index] === segmentation[index + 1]) {
          imageData.data[4 * index] = superpixel.mp[0];
          imageData.data[4 * index + 1] = superpixel.mp[1];
          imageData.data[4 * index + 2] = superpixel.mp[2];
        } else {
          imageData.data[4 * index] = 0;
          imageData.data[4 * index + 1] = 0;
          imageData.data[4 * index + 2] = 0;
        }
      }

      const buffer = context.createImageData(512, 512);

      buffer.data.set(imageData.data);

      context.putImageData(buffer, 0, 0);
    };

    image.crossOrigin = "anonymous";

    image.src = src;
  }, [src]);

  return <canvas height={512} ref={ref} width={512} />;
};

export default {
  component: QuickSelection,
  title: "Components/ImageViewer/QuickSelection",
} as Meta;

const Template: Story<ComponentProps<typeof QuickSelection>> = (args) => (
  <QuickSelection {...args} />
);

export const Default = Template.bind({});

Default.args = {
  src: "https://picsum.photos/id/237/512/512",
};
