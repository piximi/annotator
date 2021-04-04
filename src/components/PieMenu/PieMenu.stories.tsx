import React, { ComponentProps } from "react";
import { Meta, Story } from "@storybook/react/types-6-0";
import { PieMenu } from "./PieMenu";

export default {
  component: PieMenu,
  title: "Components/ImageViewer/PieMenu",
} as Meta;

const Template: Story<ComponentProps<typeof PieMenu>> = (args) => (
  <PieMenu {...args} />
);

export const Default = Template.bind({});

Default.args = {
  example: true,
};
