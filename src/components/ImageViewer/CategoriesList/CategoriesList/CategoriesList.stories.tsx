import React, { ComponentProps } from "react";
import { Meta, Story } from "@storybook/react/types-6-0";
import { Image } from "../../../../types/Image";
import { ImageViewer } from "../../ImageViewer";
import src from "../../../../images/cell-painting.png";

export default {
  component: ImageViewer,
  title: "Components/ImageViewer/CategoriesList",
} as Meta;

const Template: Story<ComponentProps<typeof ImageViewer>> = (args) => (
  <ImageViewer {...args} />
);

export const Default = Template.bind({});

const image: Image = {
  id: "",
  instances: [],
  name: "foo.png",
  shape: { c: 512, channels: 3, r: 512 },
  src: src,
};

Default.args = {
  image: image,
};
