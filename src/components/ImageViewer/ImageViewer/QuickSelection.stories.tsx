import React, { ComponentProps, useEffect, useRef } from "react";
import { Meta, Story } from "@storybook/react/types-6-0";
import { slic } from "../../../image";

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

      const data = context.getImageData(0, 0, 512, 512);

      console.info(data);
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
