import React from "react";
import { InformationBox } from "../InformationBox";
import Divider from "@material-ui/core/Divider";
import { useTranslation } from "../../../../hooks/useTranslation";

export const HandToolOptions = () => {
  const t = useTranslation();

  return (
    <React.Fragment>
      <InformationBox description="…" name={t("Hand tool")} />

      <Divider />
    </React.Fragment>
  );
};
