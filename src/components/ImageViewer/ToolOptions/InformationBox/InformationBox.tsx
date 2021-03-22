import Box from "@material-ui/core/Box";
import React from "react";
import { Typography } from "@material-ui/core";

type InformationBoxProps = {
  description: string;
  name: string;
};

export const InformationBox = ({ description, name }: InformationBoxProps) => {
  return (
    <Box p={2}>
      <Typography variant="subtitle1">{name}</Typography>
    </Box>
  );
};
